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

// heymarco core:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'
import {
    type DraggedEvent,
}                           from '@heymarco/draggable'

// reusable-ui components:
import type {
    // layout-components:
    ListProps,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    type EditorProps,
}                           from '@heymarco/editor'
import {
    type ChildrenChangeEventHandler,
    
    OrderableListItemProps,
    OrderableListItem,
    
    OrderableList,
}                           from '@heymarco/orderable-list'

// internal components:
import type {
    // types:
    UpdatedHandler,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import type {
    EditVariantDialogProps,
}                           from '@/components/dialogs/EditVariantDialog'
import {
    type CreateHandler,
    type ModelCreateProps,
}                           from '@/components/explorers/Pagination'
import {
    type ModelCreateOuterProps,
    ModelCreateOuter,
    ModelEmpty,
}                           from '@/components/explorers/PaginationList'
import type {
    VariantPreviewProps,
}                           from '@/components/views/VariantPreview'

// internals:
import {
    // states:
    useVariantState,
}                           from './states/variantState'

// models:
import {
    // types:
    type VariantDetail,
}                           from '@/models'



// react components:
interface VariantEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, VariantDetail[], React.MouseEvent<Element, MouseEvent>|DraggedEvent<HTMLElement>>,
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
        Partial<Pick<ModelCreateOuterProps<VariantDetail>,
            // components:
            |'modelCreateComponent'
        >>
{
    // components:
    modelCreateComponent  ?: React.ReactElement<ModelCreateProps & EditVariantDialogProps>
    modelPreviewComponent  : React.ReactElement<VariantPreviewProps>
}
const VariantEditor = <TElement extends Element = HTMLElement>(props: VariantEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue : defaultUncontrollableValue = [],
        value        : controllableValue,
        onChange     : onControllableValueChange,
        
        
        
        // components:
        modelCreateComponent,
        modelPreviewComponent,
    ...restListProps} = props;
    
    
    
    // states:
    // workaround for penetrating <VariantStateProvider> to showDialog():
    const variantState = useVariantState();
    
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<VariantDetail[], React.MouseEvent<Element, MouseEvent>|DraggedEvent<HTMLElement>>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onControllableValueChange,
    });
    
    
    
    // handlers:
    const handleChildrenChange = useEvent<ChildrenChangeEventHandler<unknown>>((children, event) => {
        const restChildren = children.slice(0); // copy
        if (!!modelCreateComponent) restChildren.splice(0, 1); // remove the <ModelCreate> component
        triggerValueChange(
            restChildren
            .map((modelPreviewComponent, index) => {
                const model = (modelPreviewComponent.props as any).model as VariantDetail;
                return {
                    ...model,
                    sort: index,
                } satisfies VariantDetail;
            })
        , { triggerAt: 'immediately', event: event });
    });
    const handleModelCreated   = useEvent<CreateHandler<VariantDetail>>((createdModel) => {
        const mutatedValue = value.slice(0); // copy
        mutatedValue.unshift(createdModel as VariantDetail);
        for (let index = 0; index < mutatedValue.length; index++) {
            mutatedValue[index] = {
                ...mutatedValue[index],
                sort: index,
            };
        } // for
        triggerValueChange(mutatedValue, { triggerAt: 'immediately', event: undefined as any }); // TODO: fix this event
    });
    const handleModelUpdated   = useEvent<UpdatedHandler<VariantDetail>>((updatedModel) => {
        const mutatedValue = value.slice(0); // copy
        const id = updatedModel.id;
        const modelIndex = mutatedValue.findIndex((model) => model.id === id);
        if (modelIndex < 0) {
            mutatedValue.unshift(updatedModel as VariantDetail);
        }
        else {
            mutatedValue[modelIndex] = updatedModel as VariantDetail;
        } // if
        triggerValueChange(mutatedValue, { triggerAt: 'immediately', event: undefined as any }); // TODO: fix this event
    });
    const handleModelDeleted   = useEvent<DeleteHandler<VariantDetail>>(({id}) => {
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
        triggerValueChange(mutatedValue, { triggerAt: 'immediately', event: undefined as any }); // TODO: fix this event
    });
    
    
    
    // jsx:
    return (
        <OrderableList<TElement, unknown>
            // other props:
            {...restListProps}
            
            
            
            // values:
            onChildrenChange={handleChildrenChange}
        >
            {/* <ModelCreate> */}
            {!!modelCreateComponent  && <ModelCreateOuter<VariantDetail>
                // classes:
                className='solid'
                
                
                
                // accessibilities:
                createItemText='Add New Variant'
                
                
                
                // components:
                modelCreateComponent={
                    React.cloneElement<ModelCreateProps & EditVariantDialogProps>(modelCreateComponent,
                        // props:
                        {
                            // workaround for penetrating <VariantStateProvider> to showDialog():
                            ...variantState,
                        },
                    )
                }
                listItemComponent={
                    <OrderableListItem
                        orderable={false}
                    />
                }
                
                
                
                // handlers:
                onModelCreate={handleModelCreated}
            />}
            
            {!value.length && <ModelEmpty />}
            
            {value.map((modelOption) =>
                /* <ModelPreview> */
                React.cloneElement<VariantPreviewProps>(modelPreviewComponent,
                    // props:
                    {
                        // identifiers:
                        key           : modelPreviewComponent.key         ?? modelOption.id,
                        
                        
                        
                        // data:
                        model         : modelPreviewComponent.props.model ?? modelOption,
                        
                        
                        
                        // handlers:
                        onModelUpdate : handleModelUpdated,
                        onModelDelete : handleModelDeleted,
                    },
                )
            )}
        </OrderableList>
    );
};
export {
    VariantEditor,
    VariantEditor as default,
}
