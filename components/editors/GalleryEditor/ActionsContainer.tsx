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
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a capability of UI to be disabled:
    useDisableable,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui core:
import {
    // react helper hooks:
    useMountedFlag,
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
    onActionDelete        ?: (itemIndex: number) => Promise<void>
    
    
    
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
    
    
    
    // states:
    let   [isEnabled, setIsEnabled] = useState<boolean>(true);
    const disableableState = useDisableable<HTMLDivElement>({
        enabled : isEnabled,
    });
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const deleteButtonHandleClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async () => {
        // conditions:
        if (!isEnabled) return;      // this component is disabled => ignore
        if (!onActionDelete) return; // the delete handler is not configured => ignore
        
        
        
        setIsEnabled(isEnabled /* instant update without waiting for (slow|delayed) re-render */ = false);
        try {
            await onActionDelete(itemIndex);
        }
        catch {
            // ignore any error
        }
        finally {
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setIsEnabled(isEnabled /* instant update without waiting for (slow|delayed) re-render */ = true);
        } // try
    });
    
    
    
    // jsx:
    return (
        <div
            // other props:
            {...restDivProps}
            
            
            
            // classes:
            className={`${props.className} ${disableableState.class || ''}`}
            
            
            
            // handlers:
            onAnimationStart = {disableableState.handleAnimationStart}
            onAnimationEnd   = {disableableState.handleAnimationEnd  }
        >
            <div
                // classes:
                className='actionsPanel'
            >
                <AccessibilityProvider enabled={isEnabled}>
                    {children}
                    {React.cloneElement<ButtonProps>(deleteButtonComponent,
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
                </AccessibilityProvider>
            </div>
        </div>
    )
    /* <Children> */
};
export {
    ActionsContainer,
    ActionsContainer as default,
}
