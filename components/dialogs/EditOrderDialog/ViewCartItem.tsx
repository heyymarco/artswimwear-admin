'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// redux:
import type {
    EntityState
}                           from '@reduxjs/toolkit'

// reusable-ui components:
import {
    // layout-components:
    ListItemProps,
    ListItem,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// stores:
import type {
    // types:
    ProductPreview,
}                           from '@/store/features/api/apiSlice'

// utilities:
import {
    formatCurrency,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// internals:
import {
    useEditOrderDialogStyleSheet,
}                           from './styles/loader'



// react components:
export interface EditCartItemProps
    extends
        // bases:
        Omit<ListItemProps,
            // values:
            |'onChange' // already taken over
        >
{
    // data:
    unitPrice   : number
    quantity    : number
    
    
    
    // relation data:
    productId   : string|null
    productList : EntityState<ProductPreview>|undefined
}
const ViewCartItem = (props: EditCartItemProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditOrderDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        unitPrice,
        quantity,
        
        
        
        // relation data:
        productId,
        productList,
    ...restListItemProps} = props;
    
    
    
    // fn props:
    const product          = productId ? productList?.entities?.[productId] : undefined;
    const isProductDeleted = !product; // the relation data is available but there is no specified productId in productList => it's a deleted product
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // variants:
            theme={isProductDeleted ? 'danger' : undefined}
            mild={isProductDeleted ? false : undefined}
            
            
            
            // classes:
            className={styleSheet.viewCartItem}
            
            
            
            // accessibilities:
            enabled={!isProductDeleted}
        >
            <h3
                // classes:
                className='title h6'
            >
                {
                    !isProductDeleted
                    ? (product?.name ?? <em>Unknown Product</em>)
                    : <em>Deleted Product</em>
                }
            </h3>
            
            <Image
                // appearances:
                alt={product?.name ?? ''}
                src={resolveMediaUrl(product?.image)}
                sizes='64px'
                
                
                
                // classes:
                className='prodImg'
            />
            
            <p className='unitPrice'>
                    <span className='label txt-sec'>
                        @
                    </span>
                    <span className='value txt-sec'>
                        {formatCurrency(unitPrice)}
                    </span>
            </p>
            
            <p className='quantity'>
                <span className='label txt-sec'>
                    Qty
                </span>
                <span className='value number'>
                    x{quantity}
                </span>
            </p>
            
            <p className='subPrice currencyBlock'>
                {isProductDeleted && <>This product was deleted</>}
                
                {!isProductDeleted && <span className='currency'>
                    {formatCurrency(unitPrice * quantity)}
                </span>}
            </p>
        </ListItem>
    );
};
export {
    ViewCartItem,
    ViewCartItem as default,
};
