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

// heymarco components:
import {
    type EditorChangeEventHandler,
    type EditorProps,
}                           from '@heymarco/editor'

// internal components:
import {
    // types:
    type DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
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
    type CategoryState,
    
    
    
    // states:
    useCategoryState,
    
    
    
    // react components:
    type CategoryStateProps,
    CategoryStateProvider,
}                           from './states/categoryState'



// react components:
interface CategoryEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, Set<string>, React.MouseEvent<Element, MouseEvent>>,
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
            
            // behaviors:
            |'selectable'
        >
{
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, CategoryPreviewProps>
}
const CategoryEditor = <TElement extends Element = HTMLElement>(props: CategoryEditorProps<TElement>): JSX.Element|null => {
    // default states:
    const {
        // privileges:
        privilegeAdd         : defaultPrivilegeAdd,
        privilegeUpdate      : defaultPrivilegeUpdate,
        privilegeDelete      : defaultPrivilegeDelete,
        
        
        
        // images:
        registerAddedImage   : defaultRegisterAddedImage,
        registerDeletedImage : defaultRegisterDeletedImage,
        
        
        
        // behaviors:
        selectable           : defaultSelectable,
        
        
        
        // values:
        value                : defaultValue,
        onChange             : defaultOnChange,
    } = useCategoryState();
    
    
    
    // props:
    const {
        // accessibilities:
        createItemText = 'Add New Category',
        
        
        
        // values:
        // defaultValue, // not supported, controllable only
        value                = defaultValue,
        onChange             = defaultOnChange,
        
        
        
        // privileges:
        privilegeAdd         = defaultPrivilegeAdd,
        privilegeUpdate      = defaultPrivilegeUpdate,
        privilegeDelete      = defaultPrivilegeDelete,
        
        
        
        // images:
        registerAddedImage   = defaultRegisterAddedImage,
        registerDeletedImage = defaultRegisterDeletedImage,
        
        
        
        // behaviors:
        selectable           = defaultSelectable,
        
        
        
        // components:
        modelPreviewComponent,
        
        
        
        // handlers:
        onModelCreate,
        
        
        
        // other props:
        ...restPaginationListProps
    } = props;
    
    
    
    // handlers:
    const handleModelSelect = useEvent<EditorChangeEventHandler<ModelSelectEvent, React.MouseEvent<Element, MouseEvent>>>(({ id, selected }, event) => {
        // conditions:
        if (!onChange) return; // no onChange handler => noop
        
        
        
        if (selected) {
            // add to collection:
            if (!value /* no collection */ || !value.has(id) /* the collection not having the id */) {
                const valueCopy = new Set<string>(value);
                valueCopy.add(id);
                onChange(valueCopy, event);
            } // if
        }
        else {
            // remove from collection:
            if (value /* has collection */ && value.has(id) /* the collection having the id */) {
                const valueCopy = new Set<string>(value);
                valueCopy.delete(id);
                onChange(valueCopy, event);
            } // if
        } // if
    });
    const handleModelDelete = useEvent<DeleteHandler<CategoryDetail>>(({ id }) => {
        // if the model deleted => treat as unselect:
        handleModelSelect({ id, selected: false }, undefined as any); // TODO: fix the event
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
            
            
            
            // behaviors:
            selectable={selectable}
            
            
            
            // values:
            value={value}
            onChange={onChange}
            
            
            
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
