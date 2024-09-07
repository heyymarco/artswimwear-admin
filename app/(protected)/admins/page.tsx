'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// // next-js:
// import type {
//     Metadata,
// }                           from 'next'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// heymarco components:
import {
    Main,
}                           from '@heymarco/section'

// internal components:
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

// // configs:
// import {
//     PAGE_ADMIN_TITLE,
//     PAGE_ADMIN_DESCRIPTION,
// }                           from '@/website.config' // TODO: will be used soon



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'y1d8f9k6xl' });
import './pageStyles';



// react components:
export default function AdminPage(): JSX.Element|null {
    // jsx:
    return (
        <PaginationExplorerStateProvider
            // data:
            useGetModelPage={useGetAdminPage}
        >
            <AdminPageInternal />
        </PaginationExplorerStateProvider>
    );
}
function AdminPageInternal(): JSX.Element|null {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
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
    } = usePaginationExplorerState<AdminDetail>();
    const isErrorAndNoData = isError && !data;
    
    const getRolePaginationApi  = useGetRoleList();
    
    
    
    // jsx:
    if (isLoadingAndNoData || (sessionStatus === 'loading'        )) return <PageLoading />;
    if (isErrorAndNoData   || (sessionStatus === 'unauthenticated')) return <PageError onRetry={refetch} />;
    return (
        <Main className={styleSheet.main}>
            <PaginationExplorer<AdminDetail>
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
        </Main>
    );
}



// export const metadata : Metadata = {
//     title       : PAGE_ADMIN_TITLE,
//     description : PAGE_ADMIN_DESCRIPTION,
// };
