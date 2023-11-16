// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import * as styles          from '@/components/Checkout/templates/styles'

// internals:
import {
    // hooks:
    useOrderDataContext,
}                           from './orderDataContext'



// react components:

const BillingAddress = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                billingAddress : address,
            },
        },
        
        
        
        // relation data:
        countryList,
    } = useOrderDataContext();
    
    
    
    // jsx:
    if (!address) return null;
    const {
        // billing data:
        firstName : billingFirstName,
        lastName  : billingLastName,
        
        phone     : billingPhone,
        
        address   : billingAddress,
        city      : billingCity,
        zone      : billingZone,
        zip       : billingZip,
        country   : billingCountry,
    } = address;
    return (
        <>
            <p style={styles.paragraphFirst}>
                {billingFirstName} {billingLastName} ({billingPhone})
            </p>
            
            <p style={styles.paragraphLast}>
                {`${billingAddress}, ${billingCity}, ${billingZone} (${billingZip}), ${countryList?.entities?.[billingCountry ?? '']?.name}`}
            </p>
        </>
    );
};
const PaymentMethod = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        order : {
            payment : {
                // payment data:
                type       : paymentType,
                brand      : paymentBrand,
                identifier : paymentIdentifier,
            },
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <>
            <p
                // styles:
                style={{
                    // layouts:
                    ...styles.paragraphBase,
                    display   : 'flex',
                    
                    
                    
                    // spacings:
                    columnGap : '0.5em',
                }}
            >
                {
                    !!paymentBrand
                    ? <>{paymentBrand.toUpperCase()}</>
                    : (paymentType?.toUpperCase() ?? paymentType)
                }
                
                {!!paymentIdentifier && <span style={styles.textSmall}>
                    ({paymentIdentifier})
                </span>}
            </p>
        </>
    );
};


export interface PaymentInfoProps {
    // styles:
    style    ?: React.CSSProperties
    
    
    
    // accessibilities:
    title    ?: React.ReactNode
    readOnly ?: boolean
}
const PaymentInfo = (props: PaymentInfoProps): React.ReactNode => {
    // rest props:
    const {
        // styles:
        style,
        
        
        
        // accessibilities:
        title,
    } = props;
    
    
    
    // contexts:
    const {
        // data:
        order : {
            payment : {
                billingAddress : address,
            },
        },
    } = useOrderDataContext();
    
    
    
    // jsx:
    return (
        <table
            // styles:
            style={{
                ...styles.tableInfo,
                ...style,
            }}
        >
            {!!title && <thead>
                <tr>
                    <th colSpan={2} style={styles.tableTitleCenter}>
                        {title}
                    </th>
                </tr>
            </thead>}
            
            <tbody>
                <tr>
                    <th
                        // styles:
                        style={{
                            // layouts:
                            ...(title   ? null                    : styles.borderTopSide        ),
                            ...(title   ? null                    : styles.tableTitleSideFirst  ),
                            ...(address ? styles.tableTitleSide   : styles.tableTitleSideLast   ),
                        }}
                    >
                        Payment Method
                    </th>
                    <td
                        // styles:
                        style={{
                            // layouts:
                            ...(title   ? null                    : styles.borderTopSide        ),
                            ...(title   ? null                    : styles.tableContentSideFirst),
                            ...(address ? styles.tableContentSide : styles.tableContentSideLast ),
                        }}
                    >
                        <PaymentMethod />
                    </td>
                </tr>
                
                {!!address && <tr>
                    <th style={styles.tableTitleSideLast}>
                        Billing Address
                    </th>
                    <td style={styles.tableContentSideLast}>
                        <BillingAddress />
                    </td>
                </tr>}
            </tbody>
        </table>
    );
};

export const Payment = {
    BillingAddress : BillingAddress,
    Method         : PaymentMethod,
    Info           : PaymentInfo,
};
