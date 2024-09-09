'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
    useMemo,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    
    
    
    // an accessibility management system:
    AccessibilityProvider,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// internal components:
import {
    type Address,
}                           from '@heymarco/address-editor'
import {
    AddressEditor,
}                           from '@/components/editors/AddressEditor'
import {
    // types:
    UpdateHandler,
    
    ConfirmUnsavedHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import {
    type DefaultShippingOriginDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetDefaultShippingOrigin,
    useUpdateDefaultShippingOrigin,
}                           from '@/store/features/api/apiSlice'



// utilities:
export const emptyShippingOrigin : DefaultShippingOriginDetail = {
    id        : '',
    
    country   : '',
    state     : '',
    city      : '',
    zip       : '',
    address   : '',
    
    company   : '',
    firstName : '',
    lastName  : '',
    phone     : '',
}



// react components:
export interface EditShippingOriginDialogProps
    extends
        // bases:
        Omit<ImplementedComplexEditModelDialogProps<DefaultShippingOriginDetail>,
            // data:
            |'model'
        >
{
}
export const EditShippingOriginDialog = (props: EditShippingOriginDialogProps) => {
    // states:
    const [model, setModel] = useState<DefaultShippingOriginDetail>(emptyShippingOrigin);
    
    const [isModified, setIsModified] = useState<boolean>(false);
    
    const isModelEmpty = useMemo(() => {
        return (
               (model.country   === '')
            && (model.state     === '')
            && (model.city      === '')
            && (model.zip       === '')
            && (model.address   === '')
            
            && (model.company   === '')
            && (model.firstName === '')
            && (model.lastName  === '')
            && (model.phone     === '')
        )
    }, [model]);
    
    
    
    // stores:
    const {data: modelData, isLoading, isError, refetch} = useGetDefaultShippingOrigin();
    const [updateDefaultShippingOrigin, {isLoading : isUpdating}] = useUpdateDefaultShippingOrigin();
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // privileges:
    // const privilegeAdd    = !!role?.shipping_up;
    const privilegeUpdate = useMemo(() => ({
        price       : !!role?.shipping_up,
    }), [role]);
    
    
    
    // effects:
    useEffect(() => {
        // actions:
        setModel(modelData ?? emptyShippingOrigin);
        console.log('loaded');
    }, [modelData]);
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateHandler<DefaultShippingOriginDetail>>(async ({id}) => {
        return await updateDefaultShippingOrigin(model).unwrap();
    });
    
    const handleConfirmUnsaved = useEvent<ConfirmUnsavedHandler<DefaultShippingOriginDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<DefaultShippingOriginDetail>
            // other props:
            {...props}
            
            
            
            // data:
            modelName='Shipping Origin'
            modelEntryName='Shipping Origin'
            model={model}
            
            
            
            // privileges:
            // privilegeAdd    = {privilegeAdd}
            privilegeAdd    = {false}
            privilegeUpdate = {privilegeUpdate}
            
            
            
            // stores:
            isModelLoading = {isLoading}
            isModelError   = {isError}
            onModelRetry   = {refetch}
            
            isModified     = {isModified}
            isCommiting    = {isUpdating}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            
            onConfirmUnsaved={handleConfirmUnsaved}
        >{({whenAdd, whenUpdate}) => <>
            <AccessibilityProvider
                // accessibilities:
                enabled={whenUpdate.price || whenAdd}
                inheritEnabled={true} // allows the `<ComplexEditModelDialog>` to disable when updating/loading
            >
                <p>
                    Please specify the delivery departure location <span className='txt-sec'>(usually your shop location)</span>.
                </p>
                <p>
                    The data will also be the sender&apos;s address for the shipments.
                </p>
                <AddressEditor
                    // accessibilities:
                    autoComplete={true}
                    
                    
                    
                    // types:
                    addressType='shipping'
                    
                    
                    
                    // values:
                    value={model as Address|null}
                    onChange={(newValue) => {
                        if (!newValue) {
                            setModel(emptyShippingOrigin);
                        }
                        else {
                            setModel({
                                id : model?.id ?? '',
                                ...newValue,
                            });
                        } // if
                        
                        setIsModified(true);
                    }}
                    
                    
                    
                    // validations:
                    required={!isModelEmpty}
                />
            </AccessibilityProvider>
        </>}</ComplexEditModelDialog>
    );
};
