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

// heymarco components:
import {
    // react components:
    QuantityInputProps,
    QuantityInput,
}                           from '@heymarco/quantity-input'

// heymarco components:
import {
    // react components:
    type NumberEditorProps,
}                           from '@heymarco/number-editor'



// react components:
export interface QuantityEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        NumberEditorProps<TElement>,
        Omit<QuantityInputProps<TElement>,
            |'onChange' // converted to TValue
        >
{
}
const QuantityEditor = <TElement extends Element = HTMLSpanElement>(props: QuantityEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,
        value,
        onChange,
        onChangeAsText,
        
        
        
        // components:
        decreaseButtonComponent,
        increaseButtonComponent,
        inputComponent,
        
        
        
        // children:
        childrenBeforeButton,
        childrenBeforeInput,
        childrenAfterInput,
        childrenAfterButton,
    ...restQuantityInputProps} = props;
    
    
    
    // handlers:
    const handleValueChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        onChangeAsText?.(event.target.value, event);
        onChange?.(event.target.value ? event.target.valueAsNumber : null, event);
    });
    
    
    
    // jsx:
    return (
        <QuantityInput<TElement>
            // other props:
            {...restQuantityInputProps}
            
            
            
            // values:
            defaultValue = {defaultValue     }
            value        = {value            }
            onChange     = {handleValueChange}
            
            
            
            // components:
            decreaseButtonComponent = {decreaseButtonComponent}
            increaseButtonComponent = {increaseButtonComponent}
            inputComponent          = {inputComponent         }
            
            
            
            // children:
            childrenBeforeButton = {childrenBeforeButton}
            childrenBeforeInput  = {childrenBeforeInput }
            childrenAfterInput   = {childrenAfterInput  }
            childrenAfterButton  = {childrenAfterButton }
        />
    );
};
export {
    QuantityEditor,
    QuantityEditor as default,
}
