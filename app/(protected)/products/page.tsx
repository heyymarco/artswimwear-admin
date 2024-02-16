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
    EditProductDialog,
}                           from '@/components/dialogs/EditProductDialog'
import {
    ProductPreview,
}                           from '@/components/views//ProductPreview'

// stores:
import {
    // types:
    ProductDetail,
    
    
    
    // hooks:
    useGetProductPage,
}                           from '@/store/features/api/apiSlice'

// // configs:
// import {
//     PAGE_PRODUCT_TITLE,
//     PAGE_PRODUCT_DESCRIPTION,
// }                           from '@/website.config' // TODO: will be used soon



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'pcyfaeow8d' });
import './pageStyles';



// react components:
export default function ProductPage(): JSX.Element|null {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // states:
    const [page   , setPage   ] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    
    
    
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const role = session?.role;
    const privilegeAdd = !!role?.product_c;
    
    
    
    // stores:
    const getModelPaginationApi = useGetProductPage({ page, perPage });
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = getModelPaginationApi;
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData || (sessionStatus === 'loading'        )) return <PageLoading />;
    if (isErrorAndNoData   || (sessionStatus === 'unauthenticated')) return <PageError onRetry={refetch} />;
    return (
        <Main className={styleSheet.main}>
            <PagedModelExplorer<ProductDetail>
                // accessibilities:
                createItemText='Add New Product'
                
                
                
                // data:
                page={page}
                perPage={perPage}
                setPage={setPage}
                setPerPage={setPerPage}
                getModelPaginationApi={getModelPaginationApi}
                
                
                
                // components:
                modelPreviewComponent={
                    <ProductPreview
                        // data:
                        model={undefined as any}
                    />
                }
                modelCreateComponent={
                    privilegeAdd
                    ? <EditProductDialog
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
//     title       : PAGE_PRODUCT_TITLE,
//     description : PAGE_PRODUCT_DESCRIPTION,
// };
