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

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

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
    PaginationStateProvider,
    usePaginationState,
}                           from '@/components/explorers/Pagination'
import {
    PaginationList,
}                           from '@/components/explorers/PaginationList'
import {
    EditAdminDialog,
}                           from '@/components/dialogs/EditAdminDialog'
import {
    AdminPreview,
}                           from '@/components/views/AdminPreview'

// models:
import {
    // types:
    type AdminDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetAdminPage,
    
    useGetRoleList,
}                           from '@/store/features/api/apiSlice'



// react components:
export function AdminPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationStateProvider
            // data:
            useGetModelPage={useGetAdminPage}
        >
            <AdminPageContentInternal />
        </PaginationStateProvider>
    );
}
function AdminPageContentInternal(): JSX.Element|null {
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const role = session?.role;
    const privilegeAdd = !!role?.admin_c;
    
    
    
    // stores:
    const {
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = usePaginationState<AdminDetail>();
    const isErrorAndNoData = isError && !data;
    
    const getRolePaginationApi  = useGetRoleList();
    
    
    
    // jsx:
    if (isLoadingAndNoData || (sessionStatus === 'loading'        )) return <PageLoading />;
    if (isErrorAndNoData   || (sessionStatus === 'unauthenticated')) return <PageError onRetry={refetch} />;
    return (
        <SimpleMainPage>
            <Section theme='primary'>
                <PaginationList<AdminDetail>
                    // accessibilities:
                    createItemText='Add New Admin'
                    
                    
                    
                    // components:
                    modelPreviewComponent={
                        <AdminPreview
                            // data:
                            model={undefined as any}
                            
                            
                            
                            // stores:
                            getRolePaginationApi={getRolePaginationApi}
                        />
                    }
                    modelCreateComponent={
                        privilegeAdd
                        ? <EditAdminDialog
                            // data:
                            model={null} // create a new model
                        />
                        : undefined
                    }
                />
            </Section>
        </SimpleMainPage>
    );
}
