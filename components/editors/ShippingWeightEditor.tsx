// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useMergeStyles,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Label,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    // react components:
    type NumberEditorProps,
    NumberEditor,
}                           from '@heymarco/number-editor'
import {
    // react components:
    type NumberUpDownEditorProps,
    NumberUpDownEditor,
}                           from '@heymarco/number-updown-editor'



// react components:
export interface ShippingWeightEditorProps<out TElement extends Element = HTMLDivElement, TValue extends number|null = number|null, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        NumberUpDownEditorProps<TElement, TValue, TChangeEvent>
{
}
const ShippingWeightEditor = <TElement extends Element = HTMLDivElement, TValue extends number|null = number|null, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: ShippingWeightEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        numberEditorComponent = (<NumberEditor<Element, TValue, TChangeEvent> /> as React.ReactElement<NumberEditorProps<Element, TValue, TChangeEvent>>),
        
        
        
        // other props:
        ...restShippingWeightEditorProps
    } = props;
    
    
    
    // styles:
    const inputStyleInternal = useMemo<React.CSSProperties>(() => ({
        textAlign: 'end',
    }), []);
    const mergedInputStyle   = useMergeStyles(
        // values:
        inputStyleInternal,
        
        
        
        // preserves the original `style` from `numberEditorComponent` (can overwrite the `inputStyleInternal`):
        numberEditorComponent.props.style,
    );
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Shipping Weight',
        
        
        
        // validations:
        required                 = false,
        min                      = 0,
        max                      = 99,
        step                     = 0.01,
        
        
        
        // children:
        childrenAfterInput       = <Label className='solid'>Kg</Label>,
        
        
        // other props:
        ...restNumberUpDownEditorProps
    } = restShippingWeightEditorProps satisfies NoForeignProps<typeof restShippingWeightEditorProps, NumberUpDownEditorProps<TElement, TValue, TChangeEvent>>;
    
    
    
    // jsx:
    return (
        <NumberUpDownEditor<TElement, TValue, TChangeEvent>
            // other props:
            {...restNumberUpDownEditorProps}
            
            
            
            // accessibilities:
            aria-label={ariaLabel}
            
            
            
            // validations:
            required={required}
            min={min}
            max={max}
            step={step}
            
            
            
            // components:
            numberEditorComponent={React.cloneElement<NumberEditorProps<Element, TValue, TChangeEvent>>(numberEditorComponent,
                // props:
                {
                    // styles:
                    style : mergedInputStyle,
                },
            )}
            
            
            
            // children:
            childrenAfterInput={childrenAfterInput}
        />
    );
};
export {
    ShippingWeightEditor,            // named export for readibility
    ShippingWeightEditor as default, // default export to support React.lazy
}
