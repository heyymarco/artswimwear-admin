// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
}                           from 'react'

// internals:
import type {
    Pagination,
    Model,
}                           from '@/libs/types'



// hooks:

// states:

//#region paginationModelState

// contexts:
export interface PaginationModelState<TModel extends Model>
{
    // data:
    data       ?: Pagination<TModel>
    isLoading   : boolean
    isFetching  : boolean
    isError     : boolean
    refetch     : () => void
}

const PaginationModelStateContext = createContext<PaginationModelState<any>>({
    // data:
    data       : undefined,
    isLoading  : false,
    isFetching : false,
    isError    : false,
    refetch    : () => {}
});
PaginationModelStateContext.displayName  = 'PaginationModelState';

export const usePaginationModelState = <TModel extends Model>(): PaginationModelState<TModel> => {
    return useContext(PaginationModelStateContext);
}



// react components:
export interface PaginationModelStateProps<TModel extends Model> {
    // data:
    dataSource : PaginationModelState<TModel>
}
const PaginationModelStateProvider = <TModel extends Model>(props: React.PropsWithChildren<PaginationModelStateProps<TModel>>): JSX.Element|null => {
    // jsx:
    return (
        <PaginationModelStateContext.Provider value={props.dataSource}>
            {props.children}
        </PaginationModelStateContext.Provider>
    );
};
export {
    PaginationModelStateProvider,
    PaginationModelStateProvider as default,
}
//#endregion paginationModelState
