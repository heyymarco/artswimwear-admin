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

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Indicator,
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

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
    const [model, setModel] = useState<DefaultShippingOriginDetail|null>(null);
    
    const [isModified, setIsModified] = useState<boolean>(false);
    
    
    
    // stores:
    const {data: modelData,   isLoading : isLoadingAndNoData, isError: isErrorModel, refetch: refetchModel} = useGetDefaultShippingOrigin();
    const isErrorAndNoData = isErrorModel && !modelData;
    
    const [updateDefaultShippingOrigin, {isLoading : isLoadingUpdate}] = useUpdateDefaultShippingOrigin();
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (!modelData) return;
        
        
        
        // actions:
        setModel(modelData);
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
            privilegeAdd    = {true}
            privilegeUpdate = {useMemo(() => ({
                any : true,
            }), [])}
            
            
            
            // stores:
            isModelLoading = {isLoadingAndNoData}
            isModelError   = {isErrorAndNoData}
            onModelRetry   = {refetchModel}
            
            isModified     = {isModified}
            isCommiting    = {isLoadingUpdate}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            
            onConfirmUnsaved={handleConfirmUnsaved}
        >
            <TabPanel label='Test' >
                <form>
                    <ValidationProvider
                        // validations:
                        /* disable validation for all <Check> */
                        enableValidation={false}
                        inheritValidation={false}
                    >
                        <Indicator tag='p' nude={true}>
                            Please specify the delivery departure location <span className='txt-sec'>(usually your shop location)</span>:
                        </Indicator>
                        <AddressEditor
                            // values:
                            value={model as Address|null}
                            onChange={(newValue) => {
                                if (!newValue) {
                                    setModel(null);
                                }
                                else {
                                    const {
                                        zip       : _zip,
                                        address   : _address,
                                        firstName : _firstName,
                                        lastName  : _lastName,
                                        phone     : _phone,
                                        
                                        ...newOrigin
                                    } = newValue;
                                    setModel({
                                        id : model?.id ?? '',
                                        ...newOrigin,
                                    });
                                } // if
                                
                                setIsModified(true);
                            }}
                            
                            
                            
                            // validations:
                            required={true}
                            
                            
                            
                            // components:
                            zipEditorComponent={null}
                            addressEditorComponent={null}
                            firstNameEditorComponent={null}
                            lastNameEditorComponent={null}
                            phoneEditorComponent={null}
                        />
                    </ValidationProvider>
                </form>
            </TabPanel>
        </ComplexEditModelDialog>
    );
};
