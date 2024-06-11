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

//#region shippingState

// types:
export interface ShippingPrivilege
{
    // privileges:
    privilegeAdd     ?: boolean
    privilegeUpdate  ?: {
        description   : boolean,
        price         : boolean,
        visibility    : boolean,
    }
    privilegeDelete  ?: boolean
}



// utilities:
export const privilegeShippingUpdateFullAccess : Required<ShippingPrivilege>['privilegeUpdate'] = {
    description : true,
    price       : true,
    visibility  : true,
};



// contexts:
export interface ShippingState
    extends
        // apis:
        ShippingPrivilege
{
}

const defaultShippingStateContext : ShippingState = {
    // privileges:
    privilegeAdd    : false,
    privilegeUpdate : {
        description : false,
        price       : false,
        visibility  : false,
    },
    privilegeDelete : false,
}
const ShippingStateContext = createContext<ShippingState>(defaultShippingStateContext);
ShippingStateContext.displayName  = 'ShippingState';

export const useShippingState = (): ShippingState => {
    const shippingState = useContext(ShippingStateContext);
    if (shippingState === defaultShippingStateContext) throw Error('not inside <ShippingStateProvider>');
    return shippingState;
}



// react components:
export interface ShippingStateProps
    extends
        // apis:
        ShippingPrivilege
{
}
const ShippingStateProvider = (props: React.PropsWithChildren<ShippingStateProps>): JSX.Element|null => {
    // rest props:
    const {
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
    } = props;
    
    
    
    // states:
    const shippingState = useMemo<ShippingState>(() => ({
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
        <ShippingStateContext.Provider value={shippingState}>
            {props.children}
        </ShippingStateContext.Provider>
    );
};
export {
    ShippingStateProvider,
    ShippingStateProvider as default,
}
//#endregion shippingState
