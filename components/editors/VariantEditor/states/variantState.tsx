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
        visibility    : boolean,
    }
    privilegeDelete  ?: boolean
}



// utilities:
export const privilegeVariantUpdateFullAccess : Required<VariantPrivilege>['privilegeUpdate'] = {
    description : true,
    images      : true,
    price       : true,
    visibility  : true,
};



// contexts:
export interface VariantState
    extends
        // apis:
        VariantPrivilege
{
}

const defaultVariantStateContext : VariantState = {
    // privileges:
    privilegeAdd    : false,
    privilegeUpdate : {
        description   : false,
        images        : false,
        price         : false,
        visibility    : false,
    },
    privilegeDelete : false,
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
        VariantPrivilege
{
}
const VariantStateProvider = (props: React.PropsWithChildren<VariantStateProps>): JSX.Element|null => {
    // rest props:
    const {
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
    } = props;
    
    
    
    // states:
    const variantState = useMemo<VariantState>(() => ({
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
    }), [
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
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
