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
    
    
    
    // status-components:
    Busy,
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
    busyComponent         ?: React.ReactComponentElement<any, GenericProps<Element>>
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
        busyComponent         = (<Busy                    size='lg'                                   /> as React.ReactComponentElement<any, GenericProps<Element>>),
    ...restGenericProps} = props;
    
    
    
    // states:
    let  [isBusy, setIsBusy] = useState<boolean>(false);
    const disableableState   = useDisableable<TElement>({
        enabled : !isBusy,
    });
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const deleteButtonHandleClickInternal = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async () => {
        // conditions:
        if (isBusy)         return; // this component is busy => ignore
        if (!onDeleteImage) return; // the delete handler is not configured => ignore
        
        
        
        setIsBusy(isBusy /* instant update without waiting for (slow|delayed) re-render */ = true);
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
            setIsBusy(isBusy /* instant update without waiting for (slow|delayed) re-render */ = false);
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
        <AccessibilityProvider enabled={!isBusy}>
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
                ),
                
                /* <Busy> */
                (isBusy && React.cloneElement<GenericProps<Element>>(busyComponent,
                    // props:
                    {
                        // classes:
                        className : busyComponent.props.className ?? 'busy',
                    },
                )),
            )}
        </AccessibilityProvider>
    );
};
export {
    ElementWithActions,
    ElementWithActions as default,
}
