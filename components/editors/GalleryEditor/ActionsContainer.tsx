// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    ButtonProps,
    
    ButtonIcon,
}                           from '@reusable-ui/components'



// react components:
export interface ActionsContainerProps
    extends
        // bases:
        React.HTMLAttributes<HTMLElement>
{
    // positions:
    itemIndex              : number
    
    
    
    // actions:
    actionDelete          ?: string
    onActionDelete        ?: (itemIndex: number) => void
    
    
    
    // components:
    deleteButtonComponent ?: React.ReactComponentElement<any, ButtonProps>
    
    
    
    // children:
    children               : React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
}
const ActionsContainer = (props: ActionsContainerProps): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        itemIndex,
        
        
        
        // actions:
        actionDelete = 'delete',
        onActionDelete,
        
        
        
        // components:
        children,
        deleteButtonComponent = (<ButtonIcon icon='clear' size='md' theme='danger' buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
    ...restDivProps} = props;
    
    
    
    React.Children.only(children);
    
    
    
    // handlers:
    const deleteButtonHandleClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        onActionDelete?.(itemIndex);
    });
    
    
    
    // jsx:
    return (
        <div
            // other props:
            {...restDivProps}
        >
            <div
                // classes:
                className='actionsPanel'
            >
                {children}
                {React.cloneElement(deleteButtonComponent,
                    // props:
                    {
                        // classes:
                        className : 'actionDelete',
                        
                        
                        
                        // accessibilities:
                        title     : actionDelete,
                        
                        
                        
                        // handlers:
                        onClick   : deleteButtonHandleClick,
                    },
                )}
            </div>
        </div>
    )
    /* <Children> */
};
export {
    ActionsContainer,
    ActionsContainer as default,
}
