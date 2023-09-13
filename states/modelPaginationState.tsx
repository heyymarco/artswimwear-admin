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

//#region modelPaginationState

// types:
export interface GetModelPaginationApi<TModel extends Model>
{
    // data:
    data       ?: Pagination<TModel>
    isLoading   : boolean
    isFetching  : boolean
    isError     : boolean
    refetch     : () => void
}



// contexts:
export interface ModelPaginationState<TModel extends Model>
    extends
        // apis:
        GetModelPaginationApi<TModel>
{
}

const ModelPaginationStateContext = createContext<ModelPaginationState<any>>({
    // data:
    data       : undefined,
    isLoading  : false,
    isFetching : false,
    isError    : false,
    refetch    : () => {}
});
ModelPaginationStateContext.displayName  = 'ModelPaginationState';

export const useModelPaginationState = <TModel extends Model>(): ModelPaginationState<TModel> => {
    return useContext(ModelPaginationStateContext);
}



// react components:
export interface ModelPaginationStateProps<TModel extends Model> {
    // data:
    getModelPaginationApi : GetModelPaginationApi<TModel> | (() => GetModelPaginationApi<TModel>)
}
const ModelPaginationStateProvider = <TModel extends Model>(props: React.PropsWithChildren<ModelPaginationStateProps<TModel>>): JSX.Element|null => {
    // rest props:
    const {
        // data:
        getModelPaginationApi,
    } = props;
    
    
    
    // jsx:
    return (
        <ModelPaginationStateContext.Provider value={(typeof(getModelPaginationApi) === 'function') ? getModelPaginationApi() : getModelPaginationApi}>
            {props.children}
        </ModelPaginationStateContext.Provider>
    );
};
export {
    ModelPaginationStateProvider,
    ModelPaginationStateProvider as default,
}
//#endregion modelPaginationState
