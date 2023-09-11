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
    Model,
}                           from '../types'
import type {
    Pagination,
}                           from '@/libs/types'



// hooks:

// states:

//#region paginationDataState
export interface PaginationDataState<TModel extends Model>
{
    // data:
    data       ?: Pagination<TModel>
    isLoading   : boolean
    isFetching  : boolean
    isError     : boolean
    refetch     : () => void
}

const PaginationDataStateContext = createContext<PaginationDataState<any>>({
    // data:
    data       : undefined,
    isLoading  : false,
    isFetching : false,
    isError    : false,
    refetch    : () => {}
});
PaginationDataStateContext.displayName  = 'PaginationDataState';

export const usePaginationDataState = <TModel extends Model>(): PaginationDataState<TModel> => {
    return useContext(PaginationDataStateContext);
}



// react components:
export interface PaginationDataStateProps<TModel extends Model> {
    dataSource : PaginationDataState<TModel>
}
const PaginationDataStateProvider = <TModel extends Model>(props: React.PropsWithChildren<PaginationDataStateProps<TModel>>): JSX.Element|null => {
    // jsx:
    return (
        <PaginationDataStateContext.Provider value={props.dataSource}>
            {props.children}
        </PaginationDataStateContext.Provider>
    );
};
export {
    PaginationDataStateProvider,
    PaginationDataStateProvider as default,
}
//#endregion paginationDataState
