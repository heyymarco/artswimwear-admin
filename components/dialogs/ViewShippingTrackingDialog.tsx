'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    DataTableBody,
    DataTableItem,
    DataTable,
}                           from '@heymarco/data-table'

// internal components:
import {
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    TimezoneEditor,
}                           from '@/components/editors/TimezoneEditor'
import {
    DateTimeDisplay,
}                           from '@/components/DateTimeDisplay'

// models:
import {
    type ShippingTrackingDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetShippingTracking,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    checkoutConfigShared,
}                           from '@/checkout.config.shared'



// react components:
export interface ViewShippingTrackingDialogProps
    extends
        // bases:
        Omit<ImplementedComplexEditModelDialogProps<ShippingTrackingDetail & { id: never }>,
            // data:
            |'model'
        >
{
    orderId : string
}
export const ViewShippingTrackingDialog = (props: ViewShippingTrackingDialogProps) => {
    // props:
    const {
        orderId,
        
        
        
        // other props:
        ...restComplexEditModelDialogProps
    } = props;
    
    
    
    // stores:
    const {data: model, isLoading : isLoadingAndNoData, isError: isErrorModel, refetch: refetchModel} = useGetShippingTracking(orderId);
    const isErrorAndNoData = isErrorModel && !model;
    
    
    
    // states:
    const [preferredTimezone, setPreferredTimezone] = useState<number>(model?.preferredTimezone ?? checkoutConfigShared.intl.defaultTimezone);
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<ShippingTrackingDetail & { id: never }>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Delivery Tracking'
            modelEntryName='Delivery Tracking'
            model={model as (ShippingTrackingDetail & { id: never })}
            
            
            
            // privileges:
            privilegeAdd    = {false}
            
            
            
            // stores:
            isModelLoading = {isLoadingAndNoData}
            isModelError   = {isErrorAndNoData}
            onModelRetry   = {refetchModel}
        >
            <div>
                <DataTable breakpoint='sm'>
                    <DataTableBody>
                        <DataTableItem
                            // accessibilities:
                            label='Ship By'
                        >
                            {model?.shippingCarrier}
                        </DataTableItem>
                        <DataTableItem
                            // accessibilities:
                            label='Shipping Tracking Number'
                        >
                            {model?.shippingNumber}
                        </DataTableItem>
                    </DataTableBody>
                </DataTable>
                
                {!model?.shippingTrackingLogs?.length && <Content theme='warning' mild={true}>
                    <p>
                        <Icon icon='timer' theme='primary' size='xl' />
                    </p>
                    <p className='h5'>
                        There are no tracking logs yet.
                    </p>
                    <p>
                        Please check it again later.
                    </p>
                </Content>}
                
                {!!model?.shippingTrackingLogs?.length && <>
                    <DataTable breakpoint='sm'>
                        <DataTableBody>
                            <DataTableItem
                                // accessibilities:
                                label='Timezone'
                                
                                
                                
                                // components:
                                tableDataComponent={<Generic />}
                            >
                                <TimezoneEditor
                                    // variants:
                                    theme='primary'
                                    mild={true}
                                    
                                    
                                    
                                    // values:
                                    value={preferredTimezone}
                                    onChange={setPreferredTimezone}
                                />
                            </DataTableItem>
                            {model?.shippingTrackingLogs.map(({reportedAt, log}, index) =>
                                <DataTableItem
                                    // identifiers:
                                    key={index}
                                    
                                    
                                    
                                    // accessibilities:
                                    label={
                                        !!reportedAt && <span>
                                            <DateTimeDisplay dateTime={reportedAt} timezone={preferredTimezone} showTimezone={false} />
                                        </span>
                                    }
                                    
                                    
                                    
                                    // components:
                                    tableLabelComponent={<Generic className='labelDateTime' />}
                                >
                                    {log}
                                </DataTableItem>
                            )}
                        </DataTableBody>
                    </DataTable>
                </>}
            </div>
        </ComplexEditModelDialog>
    );
};
