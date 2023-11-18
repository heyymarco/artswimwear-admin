'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    ButtonIconProps,
    ButtonIcon,
    
    
    
    // layout-components:
    ListItem,
    List,
    
    
    
    // menu-components:
    DropdownListButton,
    
    
    
    // composite-components:
    GroupProps,
    Group,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    orderStatusValues,
    orderStatusTheme,
    orderStatusText,
    orderStatusIcon,
    orderStatusNext,
    orderStatusTextNext,
}                           from '@/components/OrderStatusBadge'
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'

// stores:
import type {
    // types:
    OrderDetail,
}                           from '@/store/features/api/apiSlice'

// models:
import type {
    OrderStatus,
}                           from '@prisma/client'



// react components:
export interface OrderStatusButtonProps
    extends
        // bases:
        Omit<ButtonIconProps,
            // variants:
            |'size' // the Group doesn't support size of: 'xs' & 'xl'
            
            // handlers:
            |'onChange'
        >,
        Pick<GroupProps,
            // variants:
            |'size' // use standard sizes: 'sm', 'md', 'lg'
        >
{
    // data:
    model        : OrderDetail|null
    
    
    
    // handlers:
    onPrint     ?: () => void
    onChange    ?: (newOrderStatus: OrderStatus) => void|Promise<void>
}
const OrderStatusButton = (props: OrderStatusButtonProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        model,
        
        
        
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // handlers:
        onPrint,
        onChange,
        
        
        
        // children:
        children,
    ...restButtonIconProps} = props;
    const orderStatus           = model?.orderStatus ?? 'NEW_ORDER';
    const paymentType           = model?.payment.type;
    const paymentTypeUppercased = paymentType?.toUpperCase();
    const isPaid                = !!paymentTypeUppercased && (paymentTypeUppercased !== 'MANUAL');
    
    
    
    // states:
    const [isBusy, setIsBusy] = useState<boolean>(false);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessage,
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleChangeStatus = useEvent(async (newOrderStatus: OrderStatus): Promise<boolean> => {
        // conditions:
        if (orderStatus === newOrderStatus) return false;
        
        // show warning message if increase_status of unpaid order (no warning if decrease_status):
        if ((orderStatus === 'NEW_ORDER') && (newOrderStatus !== 'NEW_ORDER') && !isPaid) {
            if ((await showMessage<'yes'|'no'>({
                theme   : 'warning',
                title   : <h1>Process Unpaid Order</h1>,
                message : <>
                    <p>
                        This order <strong>has not been paid for</strong> by the customer.
                    </p>
                    <p>
                        Are you sure to process this order?
                    </p>
                </>,
                options : {
                    yes  : <ButtonIcon icon='check'          theme='primary'>Yes</ButtonIcon>,
                    no   : <ButtonIcon icon='not_interested' theme='secondary' autoFocus={true}>No</ButtonIcon>,
                },
            })) !== 'yes') return false;
        } // if
        
        
        
        setIsBusy(true);
        try {
            try {
                await onChange?.(newOrderStatus);
                return true; // succeeded
            }
            catch (fetchError: any) {
                showMessageFetchError(fetchError);
                return false; // failed
            } // try
        }
        finally {
            setIsBusy(false);
        } // try
    });
    const handleNextStatus   = useEvent(async () => {
        if (!(await handleChangeStatus(orderStatusNext(orderStatus)))) return;
        if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        
        
        
        if (orderStatus === 'NEW_ORDER') onPrint?.();
    });
    
    
    
    // jsx:
    return (
        <Group
            // variants:
            size={size}
            theme={theme}
            gradient={gradient}
            outlined={outlined}
            mild={mild}
            
            
            
            // states:
            enabled={!isBusy}
        >
            <ButtonIcon
                // other props:
                {...restButtonIconProps}
                
                
                
                // appearances:
                icon={isBusy ? 'busy' : orderStatusIcon(orderStatusNext(orderStatus))}
                
                
                
                // states:
                enabled={(orderStatus !== 'COMPLETED')}
                
                
                
                // handlers:
                onClick={handleNextStatus}
            >
                {children ?? <>
                    {(orderStatus === 'NEW_ORDER') && <>Print and </>}
                    {(orderStatus !== 'COMPLETED') && <>Mark as {orderStatusTextNext(orderStatus)}</>}
                    {(orderStatus === 'COMPLETED') && <>Order Completed</>}
                </>}
            </ButtonIcon>
            <DropdownListButton
                // variants:
                theme='secondary'
                
                
                
                // classes:
                className='solid'
                
                
                
                // floatable:
                floatingPlacement='bottom-end'
                
                
                
                // components:
                listComponent={<List theme='primary' />}
            >
                {orderStatusValues.map((orderStatusOption, listItemIndex) =>
                    <ListItem
                        // identifiers:
                        key={listItemIndex}
                        
                        
                        
                        // behaviors:
                        actionCtrl={(orderStatusOption !== orderStatus)}
                        
                        
                        
                        // states:
                        active={(orderStatusOption === orderStatus)}
                        
                        
                        
                        // handlers:
                        onClick={() => {
                            handleChangeStatus(orderStatusOption);
                        }}
                    >
                        <RadioDecorator />&nbsp;&nbsp;<Icon icon={orderStatusIcon(orderStatusOption)} />&nbsp;Mark as {orderStatusText(orderStatusOption)}
                    </ListItem>
                )}
            </DropdownListButton>
        </Group>
    );
};
export {
    OrderStatusButton,
    OrderStatusButton as default,
}
