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
    useMergeClasses,
    
    
    
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
    // base-components:
    GenericProps,
    
    
    
    // simple-components:
    ButtonProps,
    ButtonIcon,
}                           from '@reusable-ui/components'



// react components:
export interface ElementWithActionsProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        GenericProps<TElement>
{
    // positions:
    itemIndex              : number
    
    
    
    // actions:
    deleteButtonTitle     ?: string
    onDeleteImage         ?: (args: { itemIndex: number }) => Promise<void>
    
    
    
    // components:
    /**
     * Required.  
     *   
     * The underlying `<Element>` to be actionable.
     */
    elementComponent       : React.ReactComponentElement<any, GenericProps<TElement>>
    deleteButtonComponent ?: React.ReactComponentElement<any, ButtonProps>
}
const ElementWithActions = <TElement extends Element = HTMLElement>(props: ElementWithActionsProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        itemIndex,
        
        
        
        // actions:
        deleteButtonTitle = 'delete',
        onDeleteImage,
        
        
        
        // components:
        elementComponent,
        deleteButtonComponent = (<ButtonIcon icon='clear' size='md' theme='danger' buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
    ...restGenericProps} = props;
    
    
    
    // states:
    let   [isEnabled, setIsEnabled] = useState<boolean>(true);
    const disableableState          = useDisableable<TElement>({
        enabled : isEnabled,
    });
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const deleteButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async () => {
        // conditions:
        if (!isEnabled)     return; // this component is disabled => ignore
        if (!onDeleteImage) return; // the delete handler is not configured => ignore
        
        
        
        setIsEnabled(isEnabled /* instant update without waiting for (slow|delayed) re-render */ = false);
        try {
            await onDeleteImage({
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
    
    
    
    // classes:
    const stateClasses = useMergeClasses(
        // preserves the original `stateClasses` from `elementComponent`:
        elementComponent.props.stateClasses,
        
        
        
        // preserves the original `stateClasses` from `props`:
        props.stateClasses,
        
        
        
        // states:
        disableableState.class,
    );
    
    
    
    // handlers:
    const handleAnimationStart = useMergeEvents(
        // preserves the original `onAnimationStart` from `elementComponent`:
        elementComponent.props.onAnimationStart,
        
        
        
        // preserves the original `onAnimationStart` from `props`:
        props.onAnimationStart,
        
        
        
        // states:
        disableableState.handleAnimationStart,
    );
    const handleAnimationEnd   = useMergeEvents(
        // preserves the original `onAnimationEnd` from `elementComponent`:
        elementComponent.props.onAnimationEnd,
        
        
        
        // preserves the original `onAnimationEnd` from `props`:
        props.onAnimationEnd,
        
        
        
        // states:
        disableableState.handleAnimationEnd,
    );
    
    
    
    // jsx:
    return (
        <AccessibilityProvider enabled={isEnabled}>
            {/* <Element> */}
            {React.cloneElement<GenericProps<TElement>>(elementComponent,
                // props:
                {
                    // other props:
                    ...restGenericProps,
                    ...elementComponent.props, // overwrites restGenericProps (if any conflics)
                    
                    
                    
                    // classes:
                    stateClasses     : stateClasses,
                    
                    
                    
                    // handlers:
                    onAnimationStart : handleAnimationStart,
                    onAnimationEnd   : handleAnimationEnd,
                },
                
                
                
                // children:
                /* <Children> */
                elementComponent.props.children,
                
                /* <DeleteButton> */
                React.cloneElement<ButtonProps>(deleteButtonComponent,
                    // props:
                    {
                        // classes:
                        className : deleteButtonComponent.props.className ?? 'deleteButton',
                        
                        
                        
                        // accessibilities:
                        title     : deleteButtonComponent.props.title ?? deleteButtonTitle,
                        
                        
                        
                        // handlers:
                        onClick   : deleteButtonHandleClick,
                    },
                )
            )}
        </AccessibilityProvider>
    );
};
export {
    ElementWithActions,
    ElementWithActions as default,
}
