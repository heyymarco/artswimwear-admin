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
    useMergeEvents,
    
    
    
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
export interface OverlayGroupProps
    extends
        // bases:
        React.HTMLAttributes<HTMLElement>
{
    // positions:
    itemIndex              : number
    
    
    
    // actions:
    deleteButtonTitle     ?: string
    onActionDelete        ?: (args: { itemIndex: number }) => Promise<void>
    
    
    
    // components:
    deleteButtonComponent ?: React.ReactComponentElement<any, ButtonProps>
    
    
    
    // children:
    children               : React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
}
const OverlayGroup = (props: OverlayGroupProps): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        itemIndex,
        
        
        
        // actions:
        deleteButtonTitle = 'delete',
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
    const deleteButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async () => {
        // conditions:
        if (!isEnabled) return;      // this component is disabled => ignore
        if (!onActionDelete) return; // the delete handler is not configured => ignore
        
        
        
        setIsEnabled(isEnabled /* instant update without waiting for (slow|delayed) re-render */ = false);
        try {
            await onActionDelete({
                itemIndex : itemIndex,
            });
        }
        catch {
            // ignore any error
        }
        finally {
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            setIsEnabled(isEnabled /* instant update without waiting for (slow|delayed) re-render */ = true);
        } // try
    });
    const deleteButtonHandleClick         = useMergeEvents(
        // preserves the original `onClick` from `deleteButtonComponent`:
        deleteButtonComponent.props.onClick,
        
        
        
        // actions:
        deleteButtonHandleClickInternal,
    );
    
    
    
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
                className='overlayGroupInner'
            >
                <AccessibilityProvider enabled={isEnabled}>
                    {children}
                    
                    {/* <DeleteButton> */}
                    {React.cloneElement<ButtonProps>(deleteButtonComponent,
                        // props:
                        {
                            // classes:
                            className : deleteButtonComponent.props.className ?? 'deleteButton',
                            
                            
                            
                            // accessibilities:
                            title     : deleteButtonComponent.props.title ?? deleteButtonTitle,
                            
                            
                            
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
    OverlayGroup,
    OverlayGroup as default,
}
