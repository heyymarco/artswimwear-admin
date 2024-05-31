// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import {
    createEntityAdapter
}                           from '@reduxjs/toolkit'

// webs:
import {
    default as nodemailer,
}                           from 'nodemailer'

// models:
import type {
    Prisma,
    
    Customer,
    Guest,
    PaymentConfirmation,
    ShippingTracking,
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



const orderAndDataSelectAndExtra = {
    // records:
    id                : true,
    createdAt         : true,
    updatedAt         : true,
    
    // data:
    orderId           : true,
    paymentId         : true,
    
    orderStatus       : true,
    orderTrouble      : true,
    cancelationReason : true,
    
    preferredCurrency : true,
    
    shippingAddress   : true,
    shippingCost      : true,
    
    payment           : true,
    
    // relations:
    items : {
        select : {
            // data:
            price          : true,
            shippingWeight : true,
            quantity       : true,
            
            // relations:
            product        : {
                select : {
                    name   : true,
                    images : true,
                    
                    // relations:
                    variantGroups : {
                        select : {
                            variants : {
                                // always allow to access DRAFT variants when the customer is already ordered:
                                // where    : {
                                //     visibility : { not: 'DRAFT' } // allows access to Variant with visibility: 'PUBLISHED' but NOT 'DRAFT'
                                // },
                                select : {
                                    id   : true,
                                    
                                    name : true,
                                },
                                orderBy : {
                                    sort : 'asc',
                                },
                            },
                        },
                        orderBy : {
                            sort : 'asc',
                        },
                    },
                },
            },
            variantIds     : true,
        },
    },
    
    customerId         : true,
    customer           : {
        select : {
            name  : true,
            email : true,
            customerPreference : {
                select : {
                    marketingOpt : true,
                    timezone     : true,
                },
            },
        },
    },
    
    guestId            : true,
    guest              : {
        select : {
            name  : true,
            email : true,
            guestPreference : {
                select : {
                    marketingOpt : true,
                    timezone     : true,
                },
            },
        },
    },
    
    shippingProviderId : true,
    shippingProvider   : {
        select : {
            name            : true, // optional for displaying email report
            
            weightStep      : true, // required for calculating `getMatchingShipping()`
            
            estimate        : true, // optional for displaying email report
            shippingRates   : true, // required for calculating `getMatchingShipping()`
            
            useSpecificArea : true, // required for calculating `getMatchingShipping()`
            countries       : true, // required for calculating `getMatchingShipping()`
        },
    },
    
    
    
    // extra data:
    paymentConfirmation : {
        select : {
            token           : true,
            rejectionReason : true,
        },
    },
    shippingTracking : {
        select : {
            token          : true,
            shippingNumber : true,
        },
    },
} satisfies Prisma.OrderSelect;
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
export const sendConfirmationEmail = async (orderId: string, emailConfig: EmailConfig): Promise<void> => {
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
    if (!newOrder) return;
    const {
        // extra data:
        paymentConfirmation,
        shippingTracking,
        
        
        
        ...orderAndData
    } = newOrder;
    if (!orderAndData.customerOrGuest) return;
    
    
    
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
        const paymentContextProviderProps  : PaymentContextProviderProps = {
            // data:
            model : payment,
        };
        const shippingContextProviderProps  : ShippingContextProviderProps = {
            // data:
            model : shipping,
        };
        
        
        
        const transporter = nodemailer.createTransport({
            host     : emailConfig.host,
            port     : emailConfig.port,
            secure   : emailConfig.secure,
            auth     : {
                user : emailConfig.username,
                pass : emailConfig.password,
            },
        });
        try {
            console.log('sending email...');
            await transporter.sendMail({
                from        : emailConfig.from,
                to          : orderAndData.customerOrGuest.email,
                subject     : renderToStaticMarkup(
                    <BusinessContextProvider {...businessContextProviderProps}>
                        <OrderDataContextProvider {...orderDataContextProviderProps}>
                            <PaymentContextProvider {...paymentContextProviderProps}>
                                <ShippingContextProvider {...shippingContextProviderProps}>
                                    {emailConfig.subject}
                                </ShippingContextProvider>
                            </PaymentContextProvider>
                        </OrderDataContextProvider>
                    </BusinessContextProvider>
                ).replace(/[\r\n\t]+/g, ' ').trim(),
                html        : renderToStaticMarkup(
                    <BusinessContextProvider {...businessContextProviderProps}>
                        <OrderDataContextProvider {...orderDataContextProviderProps}>
                            <PaymentContextProvider {...paymentContextProviderProps}>
                                <ShippingContextProvider {...shippingContextProviderProps}>
                                    {emailConfig.message}
                                </ShippingContextProvider>
                            </PaymentContextProvider>
                        </OrderDataContextProvider>
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
            });
            console.log('email sent.');
        }
        finally {
            transporter.close();
        } // try
    }
    catch (error: any) {
        console.log('ERROR: ', error);
        // ignore send email error
    } // try
};
