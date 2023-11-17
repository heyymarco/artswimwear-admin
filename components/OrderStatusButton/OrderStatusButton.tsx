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
    ButtonIconProps,
    ButtonIcon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
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
    orderStatusText,
    orderStatusNext,
    orderStatusTextNext,
}                           from '@/components/OrderStatusBadge'

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
    orderStatus  : OrderStatus
    
    
    
    // handlers:
    onPrint     ?: () => void
    onChange    ?: (newOrderStatus: OrderStatus) => void|Promise<void>
}
const OrderStatusButton = (props: OrderStatusButtonProps): JSX.Element|null => {
    // rest props:
    const {
        // data:
        orderStatus,
        
        
        
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
    
    
    
    // states:
    const [isBusy, setIsBusy] = useState<boolean>(false);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // dialogs:
    const {
        showMessageFetchError,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleChangeStatus = useEvent(async (newOrderStatus: OrderStatus): Promise<boolean> => {
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
    const handleNextStatus = useEvent(async () => {
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
                icon={isBusy ? 'busy' : 'print'}
                
                
                
                // handlers:
                onClick={handleNextStatus}
            >
                {children ?? <>
                    {(orderStatus === 'NEW_ORDER') && <>Print and </>}Mark as {orderStatusTextNext(orderStatus)}
                </>}
            </ButtonIcon>
            <DropdownListButton
                // variants:
                theme='secondary'
                
                
                
                // classes:
                className='solid'
                
                
                
                // floatable:
                floatingPlacement='bottom-end'
            >
                {orderStatusValues.map((orderStatusValue, listItemIndex) =>
                    <ListItem
                        // identifiers:
                        key={listItemIndex}
                        
                        
                        
                        // handlers:
                        onClick={() => {
                            handleChangeStatus(orderStatusValue);
                        }}
                    >
                        Mark as {orderStatusText(orderStatusValue)}
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
