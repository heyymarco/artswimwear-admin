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
    SectionModelEditor,
}                           from '@/components/SectionModelEditor'
import {
    OrderPreview,
}                           from '@/components/views//OrderPreview'

// stores:
import {
    // types:
    OrderDetail,
    
    
    
    // hooks:
    useGetOrderPage,
}                           from '@/store/features/api/apiSlice';

// internals:

// // configs:
// import {
//     PAGE_ORDER_TITLE,
//     PAGE_ORDER_DESCRIPTION,
// }                           from '@/website.config' // TODO: will be used soon



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'nxhip40jm2' });



// react components:
export default function OrderPage(): JSX.Element|null {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // states:
    const [page   , setPage   ] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    
    
    
    // sessions:
    
    
    
    // stores:
    const getModelPaginationApi = useGetOrderPage({ page, perPage });
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = getModelPaginationApi;
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <Main className={styleSheet.main}>
            <SectionModelEditor<OrderDetail>
                // data:
                page={page}
                perPage={perPage}
                setPage={setPage}
                setPerPage={setPerPage}
                getModelPaginationApi={getModelPaginationApi}
                
                
                
                // components:
                modelPreviewComponent={
                    <OrderPreview
                        // data:
                        model={undefined as any}
                    />
                }
            />
        </Main>
    )
}



// export const metadata : Metadata = {
//     title       : PAGE_ORDER_TITLE,
//     description : PAGE_ORDER_DESCRIPTION,
// };
