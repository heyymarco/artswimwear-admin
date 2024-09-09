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
    EditProductDialog,
}                           from '@/components/dialogs/EditProductDialog'
import {
    ProductPreview,
}                           from '@/components/views/ProductPreview'

// models:
import {
    // types:
    type ProductDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetProductPage,
}                           from '@/store/features/api/apiSlice'



// react components:
export function ProductPageContent(): JSX.Element|null {
    // jsx:
    return (
        <PaginationExplorerStateProvider
            // data:
            useGetModelPage={useGetProductPage}
        >
            <ProductPageContentInternal />
        </PaginationExplorerStateProvider>
    );
}
function ProductPageContentInternal(): JSX.Element|null {
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const role = session?.role;
    const privilegeAdd = !!role?.product_c;
    
    
    
    // stores:
    const {
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = usePaginationExplorerState<ProductDetail>();
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData || (sessionStatus === 'loading'        )) return <PageLoading />;
    if (isErrorAndNoData   || (sessionStatus === 'unauthenticated')) return <PageError onRetry={refetch} />;
    return (
        <SimpleMainPage>
            <PaginationExplorer<ProductDetail>
                // accessibilities:
                createItemText='Add New Product'
                
                
                
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
        </SimpleMainPage>
    );
}
