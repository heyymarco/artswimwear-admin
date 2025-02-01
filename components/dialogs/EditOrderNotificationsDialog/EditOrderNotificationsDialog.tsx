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

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    
    
    
    // a validation management system:
    ValidationProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Check,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    // types:
    UpdateHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import {
    type ModelConfirmUnsavedEventHandler,
    
    type AdminPreferenceDetail,
    defaultAdminPreferenceDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetPreference,
    useUpdatePreference,
}                           from '@/store/features/api/apiSlice'



// styles:
const useEditOrderNotificationsDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditOrderNotificationsDialogStyles')
, { id: 'zi5oj5u61l' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditOrderNotificationsDialogStyles';



// react components:
export interface EditOrderNotificationsDialogProps
    extends
        // bases:
        Omit<ImplementedComplexEditModelDialogProps<AdminPreferenceDetail>,
            // data:
            |'model'
        >
{
}
const EditOrderNotificationsDialog = (props: EditOrderNotificationsDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditOrderNotificationsDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // states:
        defaultExpandedTabIndex = 0,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [model, setModel] = useState<AdminPreferenceDetail|null>(null);
    
    const [isModified, setIsModified] = useState<boolean>(false);
    
    const [emailOrderNewPending, setEmailOrderNewPending] = useState<boolean>(false);
    const [emailOrderNewPaid   , setEmailOrderNewPaid   ] = useState<boolean>(false);
    const [emailOrderCanceled  , setEmailOrderCanceled  ] = useState<boolean>(false);
    const [emailOrderExpired   , setEmailOrderExpired   ] = useState<boolean>(false);
    const [emailOrderConfirmed , setEmailOrderConfirmed ] = useState<boolean>(false);
    const [emailOrderRejected  , setEmailOrderRejected  ] = useState<boolean>(false);
    const [emailOrderProcessing, setEmailOrderProcessing] = useState<boolean>(false);
    const [emailOrderShipping  , setEmailOrderShipping  ] = useState<boolean>(false);
    const [emailOrderCompleted , setEmailOrderCompleted ] = useState<boolean>(false);
    
    
    
    // stores:
    const {data: modelData, isLoading, isError, refetch} = useGetPreference();
    const [updatePreference, {isLoading : isUpdating}] = useUpdatePreference();
    
    
    
    // effects:
    useEffect(() => {
        // conditions:
        if (!modelData) return;
        
        
        
        // actions:
        setModel(modelData);
        setEmailOrderNewPending(modelData.emailOrderNewPending ?? defaultAdminPreferenceDetail.emailOrderNewPending);
        setEmailOrderNewPaid(   modelData.emailOrderNewPaid    ?? defaultAdminPreferenceDetail.emailOrderNewPaid   );
        setEmailOrderCanceled(  modelData.emailOrderCanceled   ?? defaultAdminPreferenceDetail.emailOrderCanceled  );
        setEmailOrderExpired(   modelData.emailOrderExpired    ?? defaultAdminPreferenceDetail.emailOrderExpired   );
        setEmailOrderConfirmed( modelData.emailOrderConfirmed  ?? defaultAdminPreferenceDetail.emailOrderConfirmed );
        setEmailOrderRejected(  modelData.emailOrderRejected   ?? defaultAdminPreferenceDetail.emailOrderRejected  );
        setEmailOrderProcessing(modelData.emailOrderProcessing ?? defaultAdminPreferenceDetail.emailOrderProcessing)
        setEmailOrderShipping(  modelData.emailOrderShipping   ?? defaultAdminPreferenceDetail.emailOrderShipping  );
        setEmailOrderCompleted( modelData.emailOrderCompleted  ?? defaultAdminPreferenceDetail.emailOrderCompleted );
        console.log('loaded');
    }, [modelData]);
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateHandler<AdminPreferenceDetail>>(async ({id}) => {
        return await updatePreference({
            id : id ?? '',
            
            emailOrderNewPending,
            emailOrderNewPaid,
            emailOrderCanceled,
            emailOrderExpired,
            emailOrderConfirmed,
            emailOrderRejected,
            emailOrderProcessing,
            emailOrderShipping,
            emailOrderCompleted,
        }).unwrap();
    });
    
    const handleConfirmUnsaved = useEvent<ModelConfirmUnsavedEventHandler<AdminPreferenceDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<AdminPreferenceDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Order Notifications'
            modelEntryName='Order Notifications'
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {true}
            privilegeUpdate = {useMemo(() => ({
                any : true,
            }), [])}
            
            
            
            // stores:
            isModelLoading = {isLoading}
            isModelError   = {isError}
            onModelRetry   = {refetch}
            
            isModified     = {isModified}
            isCommiting    = {isUpdating}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            
            onConfirmUnsaved={handleConfirmUnsaved}
        >
            <form className={styleSheet.notifications}>
                <ValidationProvider
                    // validations:
                    /* disable validation for all <Check> */
                    enableValidation={false}
                    inheritValidation={false}
                >
                    <Check className='check editor' active={emailOrderNewPending} onActiveChange={({active}) => { setEmailOrderNewPending(active); setIsModified(true); }}>
                        Email me if a new <strong>pending order</strong> comes in.
                    </Check>
                    <Check className='check editor' active={emailOrderNewPaid}    onActiveChange={({active}) => { setEmailOrderNewPaid(active);    setIsModified(true); }}>
                        Email me if a new <strong>paid order</strong> comes in.
                    </Check>
                    <Check className='check editor' active={emailOrderCanceled}   onActiveChange={({active}) => { setEmailOrderCanceled(active);   setIsModified(true); }}>
                        Email me if an <strong>order is canceled</strong>.
                    </Check>
                    <Check className='check editor' active={emailOrderExpired}    onActiveChange={({active}) => { setEmailOrderExpired(active);    setIsModified(true); }}>
                        Email me if an <strong>order is expired</strong>.
                    </Check>
                    <Check className='check editor' active={emailOrderConfirmed}  onActiveChange={({active}) => { setEmailOrderConfirmed(active);  setIsModified(true); }}>
                        Email me if a <strong>payment confirmation</strong> comes in.
                    </Check>
                    <Check className='check editor' active={emailOrderRejected}   onActiveChange={({active}) => { setEmailOrderRejected(active);   setIsModified(true); }}>
                        Email me if a <strong>payment confirmation is rejected</strong>.
                    </Check>
                    <Check className='check editor' active={emailOrderProcessing} onActiveChange={({active}) => { setEmailOrderProcessing(active); setIsModified(true); }}>
                        Email me if an <strong>order is being processed</strong>.
                    </Check>
                    <Check className='check editor' active={emailOrderShipping}   onActiveChange={({active}) => { setEmailOrderShipping(active);   setIsModified(true); }}>
                        Email me if an <strong>order is being shipped</strong>.
                    </Check>
                    <Check className='check editor' active={emailOrderCompleted}  onActiveChange={({active}) => { setEmailOrderCompleted(active);  setIsModified(true); }}>
                        Email me if an <strong>order has arrived</strong>.
                    </Check>
                </ValidationProvider>
            </form>
        </ComplexEditModelDialog>
    );
};
export {
    EditOrderNotificationsDialog,
    EditOrderNotificationsDialog as default,
}
