'use client'

// react-redux:
import type {
    MutationDefinition,
    BaseQueryFn,
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
    InitialValueHandler,
    UpdateHandler,
    ImplementedSimpleEditDialogProps,
    SimpleEditDialog,
}                           from '@/components/dialogs/SimpleEditDialog'

// internals:
import type {
    Model, MutationArgs,
}                           from '@/libs/types'




// types:
export type UpdateModelApi<TModel extends Model> = readonly [
    MutationTrigger<MutationDefinition<MutationArgs<TModel>, BaseQueryFn<any, unknown, unknown, {}, {}>, string, TModel>>,
    {
        isLoading   : boolean
    }
]



// react components:
export type TransformValueHandler<TValue extends any, TModel extends Model, TEdit extends string> = (value: TValue, edit: TEdit, model: TModel) => MutationArgs<TModel>
export interface SimpleEditModelDialogProps<TModel extends Model>
    extends
        ImplementedSimpleEditDialogProps<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>
{
    // data:
    initialValue   ?: InitialValueHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>
    transformValue ?: TransformValueHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>
    updateModelApi  : UpdateModelApi<TModel> | (() => UpdateModelApi<TModel>)
}
export const SimpleEditModelDialog = <TModel extends Model>(props: SimpleEditModelDialogProps<TModel>) => {
    // rest props:
    const {
        // data:
        initialValue,
        transformValue,
        updateModelApi,
    ...restSimpleEditDialogProps} = props;
    
    
    
    // stores:
    const [updateModel, {isLoading}] = (typeof(updateModelApi) === 'function') ? updateModelApi() : updateModelApi;
    
    
    
    // handlers:
    const handleDefaultInitialValue   = useEvent<InitialValueHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>>((edit, model) => {
        return model[edit] as TModel[keyof TModel];
    });
    const handleDefaultTransformValue = useEvent<TransformValueHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>>((value, edit, model) => {
        return {
            id     : model.id,
            
            [edit] : (value === '') ? (null as typeof value) : value, // auto convert empty string to null
        } as any;
    });
    const handleUpdate                = useEvent<UpdateHandler<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>>(async (value, edit, model) => {
        const transformed = (transformValue ?? handleDefaultTransformValue)(value, edit, model);
        await updateModel(transformed).unwrap();
    });
    
    
    
    // jsx:
    return (
        <SimpleEditDialog<TModel[keyof TModel], TModel, Extract<keyof TModel, string>>
            // other props:
            {...restSimpleEditDialogProps}
            
            
            
            // states:
            isLoading={isLoading}
            
            
            
            // data:
            initialValue={initialValue ?? handleDefaultInitialValue}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
        />
    );
};