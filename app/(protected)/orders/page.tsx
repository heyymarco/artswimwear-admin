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

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
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
    OrderPreview,
}                           from '@/components/views/OrderPreview'
import {
    EditOrderNotificationsDialog,
}                           from '@/components/dialogs/EditOrderNotificationsDialog'

// models:
import type {
    OrderDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetOrderPage,
}                           from '@/store/features/api/apiSlice';

// // configs:
// import {
//     PAGE_ORDER_TITLE,
//     PAGE_ORDER_DESCRIPTION,
// }                           from '@/website.config' // TODO: will be used soon



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'nxhip40jm2' });
import './pageStyles';
import { ButtonIcon } from '@reusable-ui/components'



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
        <Main className={styleSheet.main}>
            <PagedModelExplorer<OrderDetail>
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
                
                
                
                // children:
                menusAfter={<>
                    <ButtonIcon size='sm' mild={true} icon='notifications' title='Notification settings' onClick={handleChangeNotificationSettings} />
                </>}
            />
        </Main>
    );
}



// export const metadata : Metadata = {
//     title       : PAGE_ORDER_TITLE,
//     description : PAGE_ORDER_DESCRIPTION,
// };
