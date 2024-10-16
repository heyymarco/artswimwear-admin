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
export interface VariantPrivilege
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
export const privilegeVariantUpdateFullAccess : Required<VariantPrivilege>['privilegeUpdate'] = {
    description : true,
    images      : true,
    visibility  : true,
};



// contexts:
export interface CategoryState
    extends
        // apis:
        VariantPrivilege,
        
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
    const categoryState = useContext(CategoryStateContext);
    if (categoryState === defaultCategoryStateContext) throw Error('not inside <CategoryStateProvider>');
    return categoryState;
}



// react components:
export interface CategoryStateProps
    extends
        // apis:
        VariantPrivilege,
        
        // states:
        Partial<Pick<DraftDifferentialImagesApi,
            // images:
            |'registerAddedImage'
            |'registerDeletedImage'
        >>
{
}
const CategoryStateProvider = (props: React.PropsWithChildren<CategoryStateProps>): JSX.Element|null => {
    // rest props:
    const {
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // images:
        registerAddedImage,
        registerDeletedImage,
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
