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
    useMountedFlag,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
    
    
    
    // a capability of UI to be disabled:
    useDisableable,
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
        React.HTMLAttributes<TElement>
{
    // positions:
    itemIndex                    : number
    
    
    
    // actions:
    deletingImageTitle          ?: React.ReactNode
    
    deleteButtonTitle           ?: string
    onDeleteImage               ?: (args: { itemIndex: number }) => Promise<void>
    
    
    
    // components:
    /**
     * Required.  
     *   
     * The underlying `<Element>` to be actionable.
     */
    elementComponent             : React.ReactComponentElement<any, React.HTMLAttributes<TElement>>
    
    deletingImageTitleComponent ?: React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>|null
    
    busyComponent               ?: React.ReactComponentElement<any, GenericProps<Element>>
    deleteButtonComponent       ?: React.ReactComponentElement<any, ButtonProps>
}
const ElementWithActions = <TElement extends Element = HTMLElement>(props: ElementWithActionsProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // positions:
        itemIndex,
        
        
        
        // actions:
        deletingImageTitle          = 'Deleting...',
        
        deleteButtonTitle           = 'delete',
        onDeleteImage,
        
        
        
        // components:
        elementComponent,
        
        deletingImageTitleComponent = (<h1                                                                  /> as React.ReactComponentElement<any, Pick<React.HTMLAttributes<Element>, 'className'>>),
        
        busyComponent               = (<Busy                    size='lg'                                   /> as React.ReactComponentElement<any, GenericProps<Element>>),
        deleteButtonComponent       = (<ButtonIcon icon='clear' size='md' theme='danger' buttonStyle='link' /> as React.ReactComponentElement<any, ButtonProps>),
    ...restElementProps} = props;
    
    
    
    // states:
    let   [isBusy, setIsBusy] = useState<boolean>(false);
    const disableableState    = useDisableable<TElement>({
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
            {React.cloneElement<React.HTMLAttributes<TElement>>(elementComponent,
                // props:
                {
                    // other props:
                    ...restElementProps,
                    ...elementComponent.props, // overwrites restElementProps (if any conflics)
                    
                    
                    
                    // classes:
                    className        : `${elementComponent.props.className ?? ''} ${disableableState.class ?? ''}`,
                    
                    
                    
                    // :disabled | [aria-disabled]
                    ...disableableState.props,
                    
                    
                    
                    // handlers:
                    onAnimationStart : handleAnimationStart,
                    onAnimationEnd   : handleAnimationEnd,
                },
            )}
            
            {/* <DeletingImageTitle> + <Busy> */}
            {isBusy && <>
                {/* <DeletingImageTitle> */}
                {!!deletingImageTitleComponent && React.cloneElement<React.HTMLAttributes<HTMLElement>>(deletingImageTitleComponent,
                    // props:
                    {
                        // classes:
                        className : deletingImageTitleComponent.props.className ?? 'deletingImageTitle',
                    },
                    
                    
                    
                    // children:
                    deletingImageTitle,
                )}
                
                {/* <Busy> */}
                {React.cloneElement<GenericProps<Element>>(busyComponent,
                    // props:
                    {
                        // classes:
                        className : busyComponent.props.className ?? 'busy',
                    },
                )}
            </>}
            
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
    );
};
export {
    ElementWithActions,
    ElementWithActions as default,
}
