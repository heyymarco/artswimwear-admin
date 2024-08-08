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

// // configs:
// import {
//     PAGE_SHIPPING_TITLE,
//     PAGE_SHIPPING_DESCRIPTION,
// }                           from '@/website.config' // TODO: will be used soon



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'sv7xyz1vfm' });
import './pageStyles';



// react components:
export default function ShippingPage(): JSX.Element|null {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // states:
    const [page   , setPage   ] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    
    
    
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const role = session?.role;
    const privilegeAdd = !!role?.shipping_c;
    
    
    
    // stores:
    const getModelPaginationApi = useGetShippingPage({ page, perPage });
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = getModelPaginationApi;
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
        <Main className={styleSheet.main}>
            <PagedModelExplorer<ShippingDetail>
                // accessibilities:
                createItemText='Add New Shipping'
                
                
                
                // data:
                page={page}
                perPage={perPage}
                setPage={setPage}
                setPerPage={setPerPage}
                getModelPaginationApi={getModelPaginationApi}
                
                
                
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
        </Main>
    );
}



// export const metadata : Metadata = {
//     title       : PAGE_SHIPPING_TITLE,
//     description : PAGE_SHIPPING_DESCRIPTION,
// };
