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
    VariantGroupPreviewProps,
}                           from '@/components/views/VariantGroupPreview'

// stores:
import type {
    // types:
    ProductVariantGroupDetail,
}                           from '@/store/features/api/apiSlice'



// react components:
interface VariantGroupEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, ProductVariantGroupDetail[]>,
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
        Partial<Pick<ModelCreateOuterProps<ProductVariantGroupDetail>,
            // components:
            |'modelCreateComponent'
        >>,
        
        // privileges:
        Pick<VariantGroupPreviewProps,
            // privileges:
            |'privilegeAdd'
            |'privilegeUpdate'
            |'privilegeDelete'
        >
{
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, VariantGroupPreviewProps>
}
const VariantGroupEditor = <TElement extends Element = HTMLElement>(props: VariantGroupEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue : defaultUncontrollableValue = [],
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // accessibilities:
        readOnly = true,
        
        
        
        // components:
        modelCreateComponent,
        modelPreviewComponent,
    ...restListProps} = props;
    
    
    
    // states:
    let {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<ProductVariantGroupDetail[]>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    
    
    // handlers:
    const handleChildrenChange = useEvent((children: React.ReactComponentElement<any, OrderableListItemProps<HTMLElement, unknown>>[]) => {
        const restChildren = children.slice(0); // copy
        if (!!modelCreateComponent) restChildren.splice(0, 1); // remove the <ModelCreate> component
        triggerValueChange(
            restChildren
            .map((modelPreviewComponent, index) => {
                const model = (modelPreviewComponent.props as any).model as ProductVariantGroupDetail;
                return {
                    ...model,
                    sort: index,
                } satisfies ProductVariantGroupDetail;
            })
        , { triggerAt: 'immediately' });
    });
    const handleModelCreated   = useEvent<CreateHandler<ProductVariantGroupDetail>>((createdModel) => {
        const mutatedValue = value.slice(0); // copy
        mutatedValue.unshift(createdModel as ProductVariantGroupDetail);
        for (let index = 0; index < mutatedValue.length; index++) {
            mutatedValue[index] = {
                ...mutatedValue[index],
                sort: index,
            };
        } // for
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelUpdated   = useEvent<UpdatedHandler<ProductVariantGroupDetail>>((updatedModel) => {
        const mutatedValue = value.slice(0); // copy
        const id = updatedModel.id;
        const modelIndex = mutatedValue.findIndex((model) => model.id === id);
        if (modelIndex < 0) {
            mutatedValue.unshift(updatedModel as ProductVariantGroupDetail);
        }
        else {
            mutatedValue[modelIndex] = updatedModel as ProductVariantGroupDetail;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately' });
    });
    const handleModelDeleted   = useEvent<DeleteHandler<ProductVariantGroupDetail>>(({id}) => {
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
        {!!modelCreateComponent  && <ModelCreateOuter<ProductVariantGroupDetail>
            // classes:
            className='solid'
            
            
            
            // accessibilities:
            createItemText='Add New Variant Group'
            
            
            
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
            React.cloneElement<VariantGroupPreviewProps>(modelPreviewComponent,
                // props:
                {
                    // identifiers:
                    key             : modelPreviewComponent.key                   ?? modelOption.id,
                    
                    
                    
                    // data:
                    model           : modelPreviewComponent.props.model           ?? modelOption,
                    
                    
                    
                    // privileges:
                    privilegeAdd    : modelPreviewComponent.props.privilegeAdd    ?? privilegeAdd,
                    privilegeUpdate : modelPreviewComponent.props.privilegeUpdate ?? privilegeUpdate,
                    privilegeDelete : modelPreviewComponent.props.privilegeDelete ?? privilegeDelete,
                    
                    
                    
                    // handlers:
                    onUpdated       : handleModelUpdated,
                    onDeleted       : handleModelDeleted,
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
    VariantGroupEditor,
    VariantGroupEditor as default,
}
