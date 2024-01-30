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

//#region orderableListState

// contexts:
export interface OrderableListState
{
    // identifiers:
    dragNDropId   : symbol,
    
    
    
    // handlers:
    handleDropped : (from: number, to: number) => void
}

const noopHandler = () => { throw Error('not inside <OrderableList>'); };
const OrderableListStateContext = createContext<OrderableListState>({
    // identifiers:
    dragNDropId   : undefined as any,
    
    
    
    // handlers:
    handleDropped : noopHandler,
});
OrderableListStateContext.displayName  = 'OrderableListState';

export const useOrderableListState = (): OrderableListState => {
    return useContext(OrderableListStateContext);
}



// react components:
export interface OrderableListStateProps
{
    // handlers:
    onDropped : (from: number, to: number) => void
}
const OrderableListStateProvider = (props: React.PropsWithChildren<OrderableListStateProps>): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onDropped,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // identifiers:
    const dragNDropId = useMemo(() => Symbol(), []);
    
    
    
    // states:
    const orderableListState = useMemo<OrderableListState>(() => ({
        // identifiers:
        dragNDropId, // stable ref
        
        
        
        // handlers:
        handleDropped : onDropped,
    }), [
        // handlers:
        onDropped,
    ]);
    
    
    
    // jsx:
    return (
        <OrderableListStateContext.Provider value={orderableListState}>
            {children}
        </OrderableListStateContext.Provider>
    );
};
export {
    OrderableListStateProvider,
    OrderableListStateProvider as default,
}
//#endregion orderableListState
