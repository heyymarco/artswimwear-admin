// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useMemo,
}                           from 'react'

// internal components:
import {
    // types:
    type EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    // types:
    type DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import {
    // types:
    type CategoryDetail,
}                           from '@/models'

// internals:
import type {
    DraftDifferentialImagesApi,
}                           from '@/states/draftDifferentialImages'



// hooks:

// states:

//#region categoryState

// types:
export interface CategoryPrivilege
{
    // privileges:
    privilegeAdd     ?: boolean
    privilegeUpdate  ?: {
        description   : boolean,
        images        : boolean,
        visibility    : boolean,
    }
    privilegeDelete  ?: boolean
}

export interface ModelSelectEvent {
    id       : string
    selected : boolean
}



// utilities:
export const privilegeCategoryUpdateFullAccess : Required<CategoryPrivilege>['privilegeUpdate'] = {
    description : true,
    images      : true,
    visibility  : true,
};



// contexts:
export interface CategoryState
    extends
        // apis:
        CategoryPrivilege,
        
        // states:
        Partial<Pick<DraftDifferentialImagesApi,
            // images:
            |'registerAddedImage'
            |'registerDeletedImage'
        >>
{
    // data:
    parentCategoryId     : string|null
    
    
    
    // behaviors:
    selectable           : boolean
    
    
    
    // values:
    value                : Set<string>
    onChange             : EditorChangeEventHandler<Set<string>>
    
    
    
    // handlers:
    onModelSelect        : EditorChangeEventHandler<ModelSelectEvent>
    onModelDelete        : DeleteHandler<CategoryDetail>
}

const noopCallback = () => {};
const defaultCategoryStateContext : CategoryState = {
    // privileges:
    privilegeAdd         : false,
    privilegeUpdate      : {
        description : false,
        images      : false,
        visibility  : false,
    },
    privilegeDelete      : false,
    
    
    
    // images:
    registerAddedImage   : () => {},
    registerDeletedImage : () => {},
    
    
    
    // data:
    parentCategoryId     : null,
    
    
    
    // behaviors:
    selectable           : false,
    
    
    
    // values:
    value                : new Set<string>(),
    onChange             : noopCallback,
    
    
    
    // handlers:
    onModelSelect        : noopCallback,
    onModelDelete        : noopCallback,
}
const CategoryStateContext = createContext<CategoryState>(defaultCategoryStateContext);
CategoryStateContext.displayName  = 'CategoryState';

export const useCategoryState = (): CategoryState => {
    return useContext(CategoryStateContext);
}



// react components:
export interface CategoryStateProps
    extends
        Partial<CategoryState>
{
}
const CategoryStateProvider = (props: React.PropsWithChildren<CategoryStateProps>): JSX.Element|null => {
    const {
        // privileges:
        privilegeAdd         : defaultPrivilegeAdd,
        privilegeUpdate      : defaultPrivilegeUpdate,
        privilegeDelete      : defaultPrivilegeDelete,
        
        
        
        // images:
        registerAddedImage   : defaultRegisterAddedImage,
        registerDeletedImage : defaultRegisterDeletedImage,
        
        
        
        // data:
        parentCategoryId     : defaultParentCategoryId,
        
        
        
        // behaviors:
        selectable           : defaultSelectable,
        
        
        
        // values:
        value                : defaultValue,
        onChange             : defaultOnChange,
        
        
        
        // handlers:
        onModelSelect        : defaultOnModelSelect,
        onModelDelete        : defaultOnModelDelete,
    } = useCategoryState();
    
    
    
    // props:
    const {
        // privileges:
        privilegeAdd         = defaultPrivilegeAdd,
        privilegeUpdate      = defaultPrivilegeUpdate,
        privilegeDelete      = defaultPrivilegeDelete,
        
        
        
        // images:
        registerAddedImage   = defaultRegisterAddedImage,
        registerDeletedImage = defaultRegisterDeletedImage,
        
        
        
        // data:
        parentCategoryId     = defaultParentCategoryId,
        
        
        
        // behaviors:
        selectable           = defaultSelectable,
        
        
        
        // values:
        value                = defaultValue,
        onChange             = defaultOnChange,
        
        
        
        // handlers:
        onModelSelect        = defaultOnModelSelect,
        onModelDelete        = defaultOnModelDelete,
    } = props;
    
    
    
    // states:
    const categoryState = useMemo<CategoryState>(() => ({
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // images:
        registerAddedImage,
        registerDeletedImage,
        
        
        
        // data:
        parentCategoryId,
        
        
        
        // behaviors:
        selectable,
        
        
        
        // values:
        value,
        onChange,
        
        
        
        // handlers:
        onModelSelect,
        onModelDelete,
    }), [
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // images:
        registerAddedImage,
        registerDeletedImage,
        
        
        
        // data:
        parentCategoryId,
        
        
        
        // behaviors:
        selectable,
        
        
        
        // values:
        value,
        onChange,
        
        
        
        // handlers:
        onModelSelect,
        onModelDelete,
    ]);
    
    
    
    // jsx:
    return (
        <CategoryStateContext.Provider value={categoryState}>
            {props.children}
        </CategoryStateContext.Provider>
    );
};
export {
    CategoryStateProvider,
    CategoryStateProvider as default,
}
//#endregion categoryState
