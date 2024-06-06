// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import {
    createEntityAdapter
}                           from '@reduxjs/toolkit'

// models:
import {
    type SendEmailData,
    
    
    
    orderAndDataSelectAndExtra,
    defaultPreferenceDetail,
}                           from '@/models'
import type {
    Prisma,
    
    Customer,
    Guest,
    PaymentConfirmation,
    ShippingTracking,
    
    AdminPreference,
}                           from '@prisma/client'

// apis:
import type {
    CountryPreview,
}                           from '@/app/api/(protected)/countries/route'

// templates:
import {
    // react components:
    BusinessContextProviderProps,
    BusinessContextProvider,
}                           from '@/components/Checkout/templates/businessDataContext'
import {
    // types:
    OrderAndData,
    
    
    
    // react components:
    OrderDataContextProviderProps,
    OrderDataContextProvider,
}                           from '@/components/Checkout/templates/orderDataContext'
import {
    // react components:
    PaymentContextProviderProps,
    PaymentContextProvider,
}                           from '@/components/Checkout/templates/paymentDataContext'
import {
    // react components:
    ShippingContextProviderProps,
    ShippingContextProvider,
}                           from '@/components/Checkout/templates/shippingDataContext'
import {
    // types:
    AdminData,
    
    
    
    // react components:
    AdminDataContextProviderProps,
    AdminDataContextProvider,
}                           from '@/components/Checkout/templates/adminDataContext'

// ORMs:
import {
    prisma,
}                           from '@/libs/prisma.server'

// utilities:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'
import {
    getMatchingShipping,
}                           from '@/libs/shippings'
import {
    downloadImageAsBase64,
}                           from '@/libs/images'

// configs:
import type {
    EmailConfig,
}                           from '@/components/Checkout/types'
import {
    checkoutConfigServer,
}                           from '@/checkout.config.server'



export interface OrderAndDataAndExtra extends OrderAndData {
    paymentConfirmation : Pick<PaymentConfirmation, 'token'|'rejectionReason'>|null
    shippingTracking    : Pick<ShippingTracking, 'token'|'shippingNumber'>|null
}
const getOrderAndData = async (prismaTransaction: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], orderId : string): Promise<OrderAndDataAndExtra|null> => {
    const newOrder = await prismaTransaction.order.findUnique({
        where  : {
            orderId : orderId,
        },
        select : orderAndDataSelectAndExtra,
    });
    if (!newOrder) return null;
    const {
        items,
        
        customer,
        guest,
    ...restNewOrderData} = newOrder;
    const shippingAddressData  = newOrder.shippingAddress;
    const shippingProviderData = newOrder.shippingProvider;
    return {
        ...restNewOrderData,
        items: items.map((item) => ({
            ...item,
            product : !!item.product ? {
                name          : item.product.name,
                image         : item.product.images?.[0] ?? null,
                imageBase64   : undefined,
                imageId       : undefined,
                
                // relations:
                variantGroups : item.product.variantGroups.map(({variants}) => variants),
            } : null,
        })),
        shippingProvider : (
            (shippingAddressData && shippingProviderData)
            ? getMatchingShipping(shippingProviderData, { city: shippingAddressData.city, zone: shippingAddressData.zone, country: shippingAddressData.country })
            : null
        ),
        customerOrGuest : (
            !!customer
            ? (() => {
                const {customerPreference: preference, ...customerData} = customer;
                return {
                    ...customerData,
                    preference,
                };
            })()
            : (
                !!guest
                ? (() => {
                    const {guestPreference: preference, ...guestData} = guest;
                    return {
                        ...guestData,
                        preference,
                    };
                })()
                : null
            )
        ),
    } satisfies OrderAndDataAndExtra;
};



export interface SendConfirmationEmailOptions {
    admin ?: AdminData
}
export const sendConfirmationEmail = async (orderId: string, emailConfig: EmailConfig, options?: SendConfirmationEmailOptions): Promise<boolean|null> => {
    // options:
    const {
        admin,
    } = options ?? {};
    
    
    
    const [newOrder, countryList] = await prisma.$transaction(async (prismaTransaction) => {
        return await Promise.all([
            getOrderAndData(prismaTransaction, orderId),
            (async () => {
                const allCountries = await prismaTransaction.country.findMany({
                    select : {
                        name    : true,
                        
                        code    : true,
                    },
                    // enabled: true
                });
                const countryListAdapter = createEntityAdapter<CountryPreview>({
                    selectId : (countryEntry) => countryEntry.code,
                });
                const countryList = countryListAdapter.addMany(
                    countryListAdapter.getInitialState(),
                    allCountries
                );
                return countryList;
            })(),
        ]);
    });
    if (!newOrder) return null;
    const {
        // extra data:
        paymentConfirmation,
        shippingTracking,
        
        
        
        ...orderAndData
    } = newOrder;
    if (!orderAndData.customerOrGuest) return null;
    
    
    
    const emailTo = admin?.email ?? orderAndData.customerOrGuest.email;
    if (!emailTo) return null;
    
    
    
    //#region download image url to base64
    const newOrderItems = newOrder.items;
    const imageUrls     = newOrderItems.map((item) => item.product?.image);
    const imageBase64s  = await Promise.all(
        imageUrls.map(async (imageUrl): Promise<string|undefined> => {
            if (!imageUrl) return undefined;
            const resolvedImageUrl = resolveMediaUrl(imageUrl);
            if (!resolvedImageUrl) return undefined;
            try {
                return await downloadImageAsBase64(resolvedImageUrl, 64);
            }
            catch (error: any) { // silently ignore the error and resulting as undefined:
                console.log('ERROR DOWNLOADING IMAGE: ', error);
                return undefined;
            } // if
        })
    );
    console.log('downloaded images: ', imageBase64s);
    imageBase64s.forEach((imageBase64, index) => {
        if (!imageBase64) return;
        const itemProduct = newOrderItems[index].product;
        if (!itemProduct) return;
        itemProduct.imageBase64 = imageBase64;
        itemProduct.imageId     = `i${index}`;
    });
    //#endregion download image url to base64
    
    
    
    try {
        const {
            business,
            payment,
            shipping,
        } = checkoutConfigServer;
        
        
        
        const { renderToStaticMarkup } = await import('react-dom/server');
        const businessContextProviderProps  : BusinessContextProviderProps = {
            // data:
            model : business,
        };
        const adminDataContextProviderProps : AdminDataContextProviderProps = {
            admin: admin ?? {
                name  : '',
                email : '',
            },
        };
        const orderDataContextProviderProps : OrderDataContextProviderProps = {
            // data:
            order                : orderAndData,
            customerOrGuest      : orderAndData.customerOrGuest,
            paymentConfirmation  : paymentConfirmation,
            isPaid               : true,
            shippingTracking     : shippingTracking,
            
            
            
            // relation data:
            countryList          : countryList,
        };
        const paymentContextProviderProps   : PaymentContextProviderProps = {
            // data:
            model : payment,
        };
        const shippingContextProviderProps  : ShippingContextProviderProps = {
            // data:
            model : shipping,
        };
        
        
        
        await fetch(`${process.env.APP_URL ?? ''}/api/send-email`, {
            method  : 'POST',
            headers : {
                'X-Secret' : process.env.APP_SECRET ?? '',
            },
            body    : JSON.stringify({
                host        : emailConfig.host,
                port        : emailConfig.port,
                secure      : emailConfig.secure,
                user        : emailConfig.username,
                pass        : emailConfig.password,
                
                from        : emailConfig.from,
                to          : emailTo,
                subject     : renderToStaticMarkup(
                    <BusinessContextProvider {...businessContextProviderProps}>
                        <AdminDataContextProvider {...adminDataContextProviderProps}>
                            <OrderDataContextProvider {...orderDataContextProviderProps}>
                                <PaymentContextProvider {...paymentContextProviderProps}>
                                    <ShippingContextProvider {...shippingContextProviderProps}>
                                        {emailConfig.subject}
                                    </ShippingContextProvider>
                                </PaymentContextProvider>
                            </OrderDataContextProvider>
                        </AdminDataContextProvider>
                    </BusinessContextProvider>
                ).replace(/[\r\n\t]+/g, ' ').trim(),
                html        : renderToStaticMarkup(
                    <BusinessContextProvider {...businessContextProviderProps}>
                        <AdminDataContextProvider {...adminDataContextProviderProps}>
                            <OrderDataContextProvider {...orderDataContextProviderProps}>
                                <PaymentContextProvider {...paymentContextProviderProps}>
                                    <ShippingContextProvider {...shippingContextProviderProps}>
                                        {emailConfig.message}
                                    </ShippingContextProvider>
                                </PaymentContextProvider>
                            </OrderDataContextProvider>
                        </AdminDataContextProvider>
                    </BusinessContextProvider>
                ),
                attachments : (
                    newOrderItems
                    .filter(({product}) => !!product && !!product.imageBase64 && !!product.imageId)
                    .map(({product}) => ({
                        path : product?.imageBase64,
                        cid  : product?.imageId,
                    }))
                ),
            } satisfies SendEmailData),
        });
        
        
        
        return true; // succeeded
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // ignore send email error
        
        
        
        return false; // failed
    } // try
};

export type NotificationType = keyof Pick<AdminPreference,
    // data:
    |'emailOrderNewPending'
    |'emailOrderNewPaid'
    |'emailOrderCanceled'
    |'emailOrderExpired'
    |'emailOrderRejected'
    |'emailOrderShipping'
    |'emailOrderCompleted'
>
export interface BroadcastNotificationEmailOptions {
    notificationType : NotificationType
}
export const broadcastNotificationEmail = async (orderId: string, emailConfig: EmailConfig, options: BroadcastNotificationEmailOptions): Promise<number|false|null> => {
    // options:
    const {
        notificationType
    } = options;
    
    
    
    const subscribedAdmins : AdminData[] = (
        (await prisma.admin.findMany({
            select : {
                // data:
                name  : true,
                email : true,
                
                
                
                // relations:
                adminPreference : {
                    select : {
                        [notificationType] : true,
                    },
                },
            },
        }))
        .filter(({adminPreference}) =>
            (adminPreference?.[notificationType] ?? defaultPreferenceDetail[notificationType]) === true
        )
    );
    const sentResults = (
        (await Promise.allSettled(
            subscribedAdmins
            .map((subscribedAdmin) =>
                sendConfirmationEmail(orderId, emailConfig, {
                    admin : subscribedAdmin,
                })
            )
        ))
        .filter((sentResult): sentResult is Exclude<typeof sentResult, PromiseRejectedResult> => (sentResult.status !== 'rejected'))
    );
    
    
    
    if (sentResults.length && sentResults.every(({value}) => (value === null)) ) return null;
    if (sentResults.length && sentResults.every(({value}) => (value === false))) return false;
    return sentResults.filter(({value}) => (value === true)).length;
};
