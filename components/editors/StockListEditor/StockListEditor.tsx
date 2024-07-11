// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// reusable-ui components:
import {
    // layout-components:
    ListProps,
    List,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import type {
    // types:
    UpdatedHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import type {
    StockPreviewProps,
}                           from '@/components/views/StockPreview'

// models:
import {
    // types:
    type VariantGroupDetail,
    type StockDetail,
}                           from '@/models'



// react components:
interface StockListEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, StockDetail[]>,
            // values:
            |'defaultValue' // not supported, controllable only
            |'value'
            |'onChange'
        >,
        Omit<ListProps<TElement>,
            // values:
            |'defaultValue' // already taken over
            |'value'        // already taken over
            |'onChange'     // already taken over
            
            
            
            // children:
            |'children'     // already taken over
        >
{
    // models:
    variantGroups         ?: VariantGroupDetail[]
    
    
    
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, StockPreviewProps>
}
const StockListEditor = <TElement extends Element = HTMLElement>(props: StockListEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // models:
        variantGroups,
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = [],
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // components:
        modelPreviewComponent,
    ...restListProps} = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<StockDetail[]>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    
    
    // handlers:
    const handleModelUpdated   = useEvent<UpdatedHandler<StockDetail>>((updatedModel) => {
        const mutatedValue = value.slice(0); // copy
        const id = updatedModel.id;
        const modelIndex = mutatedValue.findIndex((model) => model.id === id);
        if (modelIndex < 0) {
            mutatedValue.unshift(updatedModel as StockDetail);
        }
        else {
            mutatedValue[modelIndex] = updatedModel as StockDetail;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    
    
    
    // jsx:
    // console.log('value: ', value);
    return (
        <List<TElement>
            // other props:
            {...restListProps}
        >
            {value.map((stockItem) =>
                /* <ModelPreview> */
                React.cloneElement<StockPreviewProps>(modelPreviewComponent,
                    // props:
                    {
                        // identifiers:
                        key       : modelPreviewComponent.key            ?? stockItem.id,
                        
                        
                        
                        // data:
                        model     : modelPreviewComponent.props.model    ?? stockItem,
                        variants  : modelPreviewComponent.props.variants ?? (variantGroups?.flatMap(({variants}) => variants) ?? []),
                        
                        
                        
                        // handlers:
                        onUpdated : handleModelUpdated,
                    },
                )
            )}
        </List>
    );
};
export {
    StockListEditor,
    StockListEditor as default,
}
