'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    SimpleMainPage,
}                           from '@/components/pages/SimpleMainPage'
import {
    PageLoading,
}                           from '@/components/PageLoading'
import {
    PageError,
}                           from '@/components/PageError'
import {
    PaginationExplorerStateProvider,
    usePaginationExplorerState,
    PaginationExplorer,
}                           from '@/components/explorers/PaginationExplorer'
import {
    OrderPreview,
}                           from '@/components/views/OrderPreview'
import {
    EditOrderNotificationsDialog,
}                           from '@/components/dialogs/EditOrderNotificationsDialog'

// models:
import {
    type OrderDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetOrderPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export function OrderPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationExplorerStateProvider
            // data:
            useGetModelPage={useGetOrderPage}
        >
            <OrderPageContentInternal />
        </PaginationExplorerStateProvider>
    );
}
function OrderPageContentInternal(): JSX.Element|null {
    // stores:
    const {
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = usePaginationExplorerState<OrderDetail>();
    const isErrorAndNoData = isError && !data;
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleChangeNotificationSettings = useEvent(() => {
        showDialog(
            <EditOrderNotificationsDialog />
        )
    });
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <SimpleMainPage>
            <PaginationExplorer<OrderDetail>
                // components:
                modelPreviewComponent={
                    <OrderPreview
                        // data:
                        model={undefined as any}
                    />
                }
                
                
                
                // children:
                menusAfter={<>
                    <ButtonIcon size='sm' mild={true} icon='notifications' title='Notification settings' onClick={handleChangeNotificationSettings} />
                </>}
            />
        </SimpleMainPage>
    );
}