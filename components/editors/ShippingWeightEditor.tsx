// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeStyles,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Label,
    
    InputProps,
    Input,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // react components:
    QuantityEditorProps,
    QuantityEditor,
}                           from '@/components/editors/QuantityEditor'



// react components:
export interface ShippingWeightEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        QuantityEditorProps<TElement>
{
}
const ShippingWeightEditor = <TElement extends Element = HTMLSpanElement>(props: ShippingWeightEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        inputComponent = (<Input<TElement> /> as React.ReactComponentElement<any, InputProps<TElement>>),
    ...restQuantityEditorProps} = props;
    
    
    
    // styles:
    const inputStyleInternal = useMemo<React.CSSProperties>(() => ({
        textAlign: 'end',
    }), []);
    const mergedInputStyle   = useMergeStyles(
        // values:
        inputStyleInternal,
        
        
        
        // preserves the original `style` from `inputComponent` (can overwrite the `inputStyleInternal`):
        inputComponent.props.style,
    );
    
    
    
    // jsx:
    return (
        <QuantityEditor<TElement>
            // other props:
            {...restQuantityEditorProps}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Shipping Weight'}
            
            
            
            // validations:
            required={props.required ?? false}
            step={props.step ?? 0.01}
            
            
            
            // components:
            inputComponent={React.cloneElement<InputProps<TElement>>(inputComponent,
                // props:
                {
                    // styles:
                    style : mergedInputStyle,
                },
            )}
            
            
            
            // children:
            childrenAfterInput={props.childrenAfterInput ?? <Label className='solid'>Kg</Label>}
        />
    );
};
export {
    ShippingWeightEditor,
    ShippingWeightEditor as default,
}
