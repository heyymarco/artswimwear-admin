'use client'

// react-redux:
import type {
    MutationDefinition,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
}                           from '@reduxjs/toolkit/dist/query'
import type {
    MutationTrigger,
}                           from '@reduxjs/toolkit/dist/query/react/buildHooks'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    InitialValueEventHandler,
    UpdateModelEventHandler,
    SimpleEditDialogProps,
    SimpleEditDialog,
}                           from '@/components/dialogs/SimpleEditDialog'

// internals:
import type {
    Model, MutationArgs,
}                           from '@/libs/types'




// types:
export type UseUpdateModelApi<TModel extends Model> = readonly [
    MutationTrigger<MutationDefinition<MutationArgs<TModel>, BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>, string, TModel>>,
    {
        isLoading   : boolean
    }
]



// react components:
export interface SimpleEditModelDialogProps<TModel extends Model>
    extends
        Omit<SimpleEditDialogProps<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>,
            // states:
            |'isLoading'
            
            
            
            // data:
            |'initialValue'
            
            
            
            // handlers:
            |'onUpdateModel'
        >
{
    // data:
    useUpdateModelApi : () => UseUpdateModelApi<TModel>
}
export const SimpleEditModelDialog = <TModel extends Model>(props: SimpleEditModelDialogProps<TModel>) => {
    // rest props:
    const {
        // data:
        useUpdateModelApi,
    ...restSimpleEditDialogProps} = props;
    
    
    
    // stores:
    const [updateModel, {isLoading}] = useUpdateModelApi();
    
    
    
    // handlers:
    const handleInitialValue = useEvent<InitialValueEventHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>>((edit, model) => {
        return model[edit] as TModel[keyof TModel];
    });
    const handleUpdateModel  = useEvent<UpdateModelEventHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>>(async (value, edit, model) => {
        await updateModel({
            // @ts-ignore
            id     : model.id,
            
            [edit] : value,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>
            // other props:
            {...restSimpleEditDialogProps}
            
            
            
            // states:
            isLoading={isLoading}
            
            
            
            // data:
            initialValue={handleInitialValue}
            
            
            
            // handlers:
            onUpdateModel={handleUpdateModel}
        />
    );
};