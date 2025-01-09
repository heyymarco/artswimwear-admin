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
    
    Input,
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
export interface ShippingWeightEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        NumberUpDownEditorProps<TElement>
{
}
const ShippingWeightEditor = <TElement extends Element = HTMLSpanElement>(props: ShippingWeightEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        numberEditorComponent = (<NumberEditor<TElement, React.ChangeEvent<HTMLInputElement>, number|null> /> as React.ReactComponentElement<any, NumberEditorProps<TElement, React.ChangeEvent<HTMLInputElement>, number|null>>),
    ...restNumberUpDownEditorProps} = props;
    
    
    
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
    
    
    
    // jsx:
    return (
        <NumberUpDownEditor<TElement>
            // other props:
            {...restNumberUpDownEditorProps}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Shipping Weight'}
            
            
            
            // validations:
            required={props.required ?? false}
            min={props.min ?? 0}
            max={props.max ?? 99}
            step={props.step ?? 0.01}
            
            
            
            // components:
            numberEditorComponent={React.cloneElement<NumberEditorProps<TElement, React.ChangeEvent<HTMLInputElement>, number|null>>(numberEditorComponent,
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
