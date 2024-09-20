'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    SimpleMainPage,
}                           from '@/components/pages/SimpleMainPage'
import {
    // simple-components:
    ButtonIcon,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internal components:
import {
    PageLoading,
}                           from '@/components/PageLoading'
import {
    PageError,
}                           from '@/components/PageError'
import {
    PaginationStateProvider,
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    PaginationList,
}                           from '@/components/explorers/PaginationList'
import {
    EditShippingDialog,
}                           from '@/components/dialogs/EditShippingDialog'
import {
    ShippingPreview,
}                           from '@/components/views/ShippingPreview'
import {
    EditShippingOriginDialog,
}                           from '@/components/dialogs/EditShippingOriginDialog'

// models:
import {
    type ShippingDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetShippingPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export function ShippingPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationStateProvider<ShippingDetail>
            // data:
            useGetModelPage={useGetShippingPage}
        >
            <ShippingPageContentInternal />
        </PaginationStateProvider>
    );
}
function ShippingPageContentInternal(): JSX.Element|null {
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const role = session?.role;
    const privilegeAdd = !!role?.shipping_c;
    
    
    
    // stores:
    const {
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = usePaginationState<ShippingDetail>();
    const isErrorAndNoData = isError && !data;
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleChangeNotificationSettings = useEvent(() => {
        showDialog(
            <EditShippingOriginDialog />
        );
    });
    
    
    
    // jsx:
    if (isLoadingAndNoData || (sessionStatus === 'loading'        )) return <PageLoading />;
    if (isErrorAndNoData   || (sessionStatus === 'unauthenticated')) return <PageError onRetry={refetch} />;
    return (
        <SimpleMainPage>
            <Section theme='primary'>
                <PaginationList<ShippingDetail>
                    // accessibilities:
                    createItemText='Add New Shipping'
                    
                    
                    
                    // components:
                    modelPreviewComponent={
                        <ShippingPreview
                            // data:
                            model={undefined as any}
                        />
                    }
                    modelCreateComponent={
                        privilegeAdd
                        ? <EditShippingDialog
                            // data:
                            model={null} // create a new model
                        />
                        : undefined
                    }
                    
                    
                    
                    // children:
                    menusBefore={<>
                        <ButtonIcon size='sm' mild={true} icon='home' title='Change shipping origin' onClick={handleChangeNotificationSettings} />
                    </>}
                />
            </Section>
        </SimpleMainPage>
    );
}
