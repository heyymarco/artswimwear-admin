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
}

const defaultCategoryStateContext : CategoryState = {
    // privileges:
    privilegeAdd    : false,
    privilegeUpdate : {
        description : false,
        images      : false,
        visibility  : false,
    },
    privilegeDelete : false,
    
    
    
    // images:
    registerAddedImage   : () => {},
    registerDeletedImage : () => {},
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
    }), [
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // images:
        registerAddedImage,
        registerDeletedImage,
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
