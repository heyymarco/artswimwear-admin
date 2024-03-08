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

//#region variantState

// types:
export interface VariantPrivilege
{
    // privileges:
    privilegeAdd     ?: boolean
    privilegeUpdate  ?: {
        description   : boolean,
        images        : boolean,
        price         : boolean,
        stock         : boolean,
        visibility    : boolean,
    }
    privilegeDelete  ?: boolean
}



// utilities:
export const privilegeVariantUpdateFullAccess : Required<VariantPrivilege>['privilegeUpdate'] = {
    description : true,
    images      : true,
    price       : true,
    stock       : true,
    visibility  : true,
};



// contexts:
export interface VariantState
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

const defaultVariantStateContext : VariantState = {
    // privileges:
    privilegeAdd    : false,
    privilegeUpdate : {
        description : false,
        images      : false,
        price       : false,
        stock       : false,
        visibility  : false,
    },
    privilegeDelete : false,
    
    
    
    // images:
    registerAddedImage   : () => {},
    registerDeletedImage : () => {},
}
const VariantStateContext = createContext<VariantState>(defaultVariantStateContext);
VariantStateContext.displayName  = 'VariantState';

export const useVariantState = (): VariantState => {
    const variantState = useContext(VariantStateContext);
    if (variantState === defaultVariantStateContext) throw Error('not inside <VariantStateProvider>');
    return variantState;
}



// react components:
export interface VariantStateProps
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
const VariantStateProvider = (props: React.PropsWithChildren<VariantStateProps>): JSX.Element|null => {
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
    const variantState = useMemo<VariantState>(() => ({
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
        <VariantStateContext.Provider value={variantState}>
            {props.children}
        </VariantStateContext.Provider>
    );
};
export {
    VariantStateProvider,
    VariantStateProvider as default,
}
//#endregion variantState
