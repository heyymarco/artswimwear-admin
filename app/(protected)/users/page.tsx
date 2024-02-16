'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
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
    PagedModelExplorer,
}                           from '@/components/explorers/PagedModelExplorer'
import {
    EditUserDialog,
}                           from '@/components/dialogs/EditUserDialog'
import {
    UserPreview,
}                           from '@/components/views//UserPreview'

// stores:
import {
    // types:
    UserDetail,
    
    
    
    // hooks:
    useGetUserPage,
    
    useGetRoleList,
}                           from '@/store/features/api/apiSlice'

// // configs:
// import {
//     PAGE_USER_TITLE,
//     PAGE_USER_DESCRIPTION,
// }                           from '@/website.config' // TODO: will be used soon



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'y1d8f9k6xl' });
import './pageStyles';



// react components:
export default function UserPage(): JSX.Element|null {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // states:
    const [page   , setPage   ] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    
    
    
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const role = session?.role;
    const privilegeAdd = !!role?.user_c;
    
    
    
    // stores:
    const getModelPaginationApi = useGetUserPage({ page, perPage });
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = getModelPaginationApi;
    const isErrorAndNoData = isError && !data;
    
    const getRolePaginationApi  = useGetRoleList();
    
    
    
    // jsx:
    if (isLoadingAndNoData || (sessionStatus === 'loading'        )) return <PageLoading />;
    if (isErrorAndNoData   || (sessionStatus === 'unauthenticated')) return <PageError onRetry={refetch} />;
    return (
        <Main className={styleSheet.main}>
            <PagedModelExplorer<UserDetail>
                // accessibilities:
                createItemText='Add New User'
                
                
                
                // data:
                page={page}
                perPage={perPage}
                setPage={setPage}
                setPerPage={setPerPage}
                getModelPaginationApi={getModelPaginationApi}
                
                
                
                // components:
                modelPreviewComponent={
                    <UserPreview
                        // data:
                        model={undefined as any}
                        
                        
                        
                        // stores:
                        getRolePaginationApi={getRolePaginationApi}
                    />
                }
                modelCreateComponent={
                    privilegeAdd
                    ? <EditUserDialog
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
//     title       : PAGE_USER_TITLE,
//     description : PAGE_USER_DESCRIPTION,
// };
