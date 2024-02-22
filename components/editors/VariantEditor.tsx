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

// heymarco components:
import {
    OrderableListItemProps,
    OrderableListItem,
    
    OrderableList,
}                           from '@heymarco/orderable-list'

// internal components:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import type {
    // types:
    UpdatedHandler,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    CreateHandler,
    ModelCreateOuterProps,
    ModelCreateOuter,
}                           from '@/components/explorers/PagedModelExplorer'
import type {
    VariantPreviewProps,
}                           from '@/components/views/VariantPreview'

// stores:
import type {
    // types:
    ProductVariantDetail,
}                           from '@/store/features/api/apiSlice'



// react components:
interface VariantEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, ProductVariantDetail[]>,
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
        >,
        // data:
        Partial<Pick<ModelCreateOuterProps<ProductVariantDetail>,
            // components:
            |'modelCreateComponent'
        >>
{
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, VariantPreviewProps>
}
const VariantEditor = <TElement extends Element = HTMLElement>(props: VariantEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        readOnly = false,
        
        
        
        // values:
        defaultValue : defaultUncontrollableValue = [],
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // components:
        modelCreateComponent,
        modelPreviewComponent,
    ...restListProps} = props;
    
    
    
    // states:
    let {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<ProductVariantDetail[]>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    
    
    // handlers:
    const handleChildrenChange = useEvent((children: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, unknown>>[]) => {
        const [
            _firstChild, // remove
        ...restChildren] = children;
        triggerValueChange(
            restChildren
            .map((modelPreviewComponent, index) => {
                const model = (modelPreviewComponent.props as any).model as ProductVariantDetail;
                return {
                    ...model,
                    sort: index,
                } satisfies ProductVariantDetail;
            })
        , { triggerAt: 'immediately' });
    });
    const handleModelCreated   = useEvent<CreateHandler<ProductVariantDetail>>((createdModel) => {
        const mutatedValue = value.slice(0); // copy
        mutatedValue.unshift(createdModel as ProductVariantDetail);
        for (let index = 0; index < mutatedValue.length; index++) {
            mutatedValue[index] = {
                ...mutatedValue[index],
                sort: index,
            };
        } // for
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelUpdated = useEvent<UpdatedHandler<ProductVariantDetail>>((updatedModel) => {
        const mutatedValue = value.slice(0); // copy
        const id = updatedModel.id;
        const modelIndex = mutatedValue.findIndex((model) => model.id === id);
        if (modelIndex < 0) {
            mutatedValue.unshift(updatedModel as ProductVariantDetail);
        }
        else {
            mutatedValue[modelIndex] = updatedModel as ProductVariantDetail;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelDeleted = useEvent<DeleteHandler<ProductVariantDetail>>(({id}) => {
        const mutatedValue = value.slice(0); // copy
        const modelIndex = mutatedValue.findIndex((model) => model.id === id);
        if (modelIndex < 0) return;
        mutatedValue.splice(modelIndex, 1);
        for (let index = 0; index < mutatedValue.length; index++) {
            mutatedValue[index] = {
                ...mutatedValue[index],
                sort: index,
            };
        } // for
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    
    
    
    // jsx:
    const children = <>
        {/* <ModelCreate> */}
        {!!modelCreateComponent  && <ModelCreateOuter<ProductVariantDetail>
            // classes:
            className='solid'
            
            
            
            // accessibilities:
            createItemText='Add New Variant'
            
            
            
            // components:
            modelCreateComponent={modelCreateComponent}
            listItemComponent={
                <OrderableListItem
                    orderable={false}
                />
            }
            
            
            
            // handlers:
            onCreated={handleModelCreated}
        />}
        
        {value.map((modelOption) =>
            /* <ModelPreview> */
            React.cloneElement<VariantPreviewProps>(modelPreviewComponent,
                // props:
                {
                    // identifiers:
                    key       : modelPreviewComponent.key          ?? modelOption.id,
                    
                    
                    
                    // data:
                    model     : modelPreviewComponent.props.model  ?? modelOption,
                    
                    
                    
                    // handlers:
                    onUpdated : handleModelUpdated,
                    onDeleted : handleModelDeleted,
                },
            )
        )}
    </>;
    
    if (readOnly) return (
        <List<TElement>
            // other props:
            {...restListProps}
        >
            {children}
        </List>
    );
    
    return (
        <OrderableList<TElement, unknown>
            // other props:
            {...restListProps}
            
            
            
            // values:
            onChildrenChange={handleChildrenChange}
        >
            {children}
        </OrderableList>
    );
};
export {
    VariantEditor,
    VariantEditor as default,
}
