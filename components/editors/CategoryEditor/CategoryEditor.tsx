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

// internal components:
import {
    // types:
    type DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    // types:
    type EditorChangeEventHandler,
    
    
    
    // react components:
    type EditorProps,
}                           from '@/components/editors/Editor'
import {
    ModelCreateOuterProps,
    
    PaginationListProps,
    PaginationList,
}                           from '@/components/explorers/PaginationList'
import {
    type ModelSelectEvent,
    type CategoryPreviewProps,
}                           from '@/components/views/CategoryPreview'

// models:
import {
    type CategoryDetail,
}                           from '@/models'

// internals:
import {
    // types:
    CategoryState,
    CategoryStateProps,
    
    
    
    // react components:
    CategoryStateProvider,
}                           from './states/categoryState'



// react components:
interface CategoryEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, Set<string>>,
            // values:
            // |'defaultValue' // not supported, controllable only
            |'value'
            |'onChange'
        >,
        Omit<PaginationListProps<CategoryDetail, TElement>,
            // values:
            |'defaultValue' // already taken over
            |'value'        // already taken over
            |'onChange'     // already taken over
            
            
            
            // children:
            |'children'     // already taken over
        >,
        // data:
        Partial<Pick<ModelCreateOuterProps<CategoryDetail>,
            // components:
            |'modelCreateComponent'
            
            
            
            // handlers:
            |'onModelCreate'
        >>,
        
        // states:
        Pick<CategoryStateProps,
            // privileges:
            |'privilegeAdd'
            |'privilegeUpdate'
            |'privilegeDelete'
            
            // images:
            |'registerAddedImage'
            |'registerDeletedImage'
        >
{
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, CategoryPreviewProps>
}
const CategoryEditor = <TElement extends Element = HTMLElement>(props: CategoryEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        createItemText = 'Add New Category',
        
        
        
        // values:
        // defaultValue, // not supported, controllable only
        value,
        onChange,
        
        
        
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // images:
        registerAddedImage,
        registerDeletedImage,
        
        
        
        // components:
        modelPreviewComponent,
        
        
        
        // handlers:
        onModelCreate,
        
        
        
        // other props:
        ...restPaginationListProps
    } = props;
    
    
    
    // handlers:
    const handleModelSelect = useEvent<EditorChangeEventHandler<ModelSelectEvent>>(({ id, selected }) => {
        // conditions:
        if (!onChange) return; // no onChange handler => noop
        
        
        
        if (selected) {
            // add to collection:
            if (!value /* no collection */ || !value.has(id) /* the collection not having the id */) {
                const valueCopy = new Set<string>(value);
                valueCopy.add(id);
                onChange(valueCopy);
            } // if
        }
        else {
            // remove from collection:
            if (value /* has collection */ && value.has(id) /* the collection having the id */) {
                const valueCopy = new Set<string>(value);
                valueCopy.delete(id);
                onChange(valueCopy);
            } // if
        } // if
    });
    const handleModelDelete = useEvent<DeleteHandler<CategoryDetail>>(({ id }) => {
        // if the model deleted => treat as unselect:
        handleModelSelect({ id, selected: false });
    });
    
    
    
    // jsx:
    return (
        <CategoryStateProvider
            // privileges:
            privilegeAdd    = {privilegeAdd   }
            privilegeUpdate = {privilegeUpdate}
            privilegeDelete = {privilegeDelete}
            
            
            
            // images:
            registerAddedImage   = {registerAddedImage  }
            registerDeletedImage = {registerDeletedImage}
            
            
            
            // values:
            value={value}
            
            
            
            // handlers:
            onModelSelect={handleModelSelect}
            onModelDelete={handleModelDelete}
        >
            <PaginationList<CategoryDetail, TElement>
                // other props:
                {...restPaginationListProps}
                
                
                
                // accessibilities:
                createItemText={createItemText}
                
                
                
                // components:
                modelPreviewComponent={modelPreviewComponent}
            />
        </CategoryStateProvider>
    );
};
export {
    CategoryEditor,
    CategoryEditor as default,
}
