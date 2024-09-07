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

// heymarco components:
import {
    RadioDecorator,
}                           from '@heymarco/radio-decorator'

// models:
import {
    type OrderDetail,
    
    orderStatusValues,
    orderStatusText,
    orderStatusIcon,
    orderStatusNext,
}                           from '@/models'
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
    model              : OrderDetail|null
    
    
    
    // handlers:
    onPrint           ?: () => void
    
    onChangeOnTheWay  ?: () => void
    onChangeCompleted ?: () => void
    onChangeNext      ?: (newOrderStatus: OrderStatus) => void|Promise<void>
}
const OrderStatusButton = (props: OrderStatusButtonProps): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        
        
        
        // data:
        model,
        
        
        
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // states:
        assertiveFocusable,
        
        
        
        // handlers:
        onPrint,
        
        onChangeOnTheWay,
        onChangeCompleted,
        onChangeNext,
        
        
        
        // children:
        children,
    ...restButtonIconProps} = props;
    const orderStatus = model?.orderStatus ?? 'NEW_ORDER';
    const payment     = model?.payment;
    
    const isCanceled          = (orderStatus === 'CANCELED');
    const isExpired           = (orderStatus === 'EXPIRED');
    const isCanceledOrExpired = isCanceled || isExpired;
    const isPaid              = !isCanceledOrExpired && (!!payment && (payment.type !== 'MANUAL'));
    
    
    
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
    const handleChangeStatus   = useEvent(async (newOrderStatus: OrderStatus): Promise<boolean> => {
        // conditions:
        if (orderStatus === newOrderStatus) return false;
        
        // show warning message if increasing_status of UNPAID order (no warning if decrease_status):
        if (!isPaid && (orderStatus === 'NEW_ORDER') && (newOrderStatus !== 'NEW_ORDER')) {
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
        
        
        
        switch(newOrderStatus) {
            case 'ON_THE_WAY':
                onChangeOnTheWay?.();
                return true;
            case 'COMPLETED':
                onChangeCompleted?.();
                return true;
        } // switch
        
        
        
        setIsBusy(true);
        try {
            try {
                await onChangeNext?.(newOrderStatus);
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
    const handleNextStatus     = useEvent(async () => {
        if (!(await handleChangeStatus(orderStatusNext(orderStatus)))) return;
        if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        
        
        
        if (orderStatus === 'NEW_ORDER') onPrint?.();
    });
    
    
    
    // jsx:
    const canChangeStatus : boolean = (
        !isCanceledOrExpired          // not CANCELED|EXPIRED orders
        &&
        (orderStatus !== 'COMPLETED') // not COMPLETED        orders
    );
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
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // appearances:
                icon={isBusy ? 'busy' : orderStatusIcon(orderStatusNext(orderStatus))}
                
                
                
                // states:
                enabled={canChangeStatus}
                assertiveFocusable={assertiveFocusable}
                
                
                
                // handlers:
                onClick={handleNextStatus}
            >
                {children ?? <>
                    {(orderStatus === 'NEW_ORDER') && <>Print and </>}
                    {canChangeStatus               && <>Mark as {orderStatusText(orderStatusNext(orderStatus))}</>}
                    {!canChangeStatus              && <>Order {orderStatusText(orderStatus)}</>}
                </>}
            </ButtonIcon>
            {!isCanceledOrExpired && <DropdownListButton
                // variants:
                theme='secondary'
                
                
                
                // classes:
                className='solid'
                
                
                
                // floatable:
                floatingPlacement='bottom-end'
                
                
                
                // components:
                listComponent={<List theme='primary' />}
            >
                {orderStatusValues.filter((orderStatusValue) => !['CANCELED', 'EXPIRED'].includes(orderStatusValue)).map((orderStatusOption, listItemIndex) =>
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
            </DropdownListButton>}
        </Group>
    );
};
export {
    OrderStatusButton,
    OrderStatusButton as default,
}
