'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// next-js:
import type {
    Metadata,
}                           from 'next'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Badge,
    
    
    
    // utility-components:
    ModalStatus,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'
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
    ModelCreateProps,
    ModelPreviewProps,
    SectionModelEditor,
}                           from '@/components/SectionModelEditor'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'
import {
    StockEditor,
}                           from '@/components/editors/StockEditor'
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
import {
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'

// private components:
import {
    EditProductDialog,
}                           from './EditProductDialog'

// stores:
import {
    // types:
    ProductDetail,
    
    
    
    // hooks:
    useGetProductPage,
    useUpdateProduct,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    formatCurrency,
    getCurrencySign,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// configs:
import {
    PAGE_PRODUCT_TITLE,
    PAGE_PRODUCT_DESCRIPTION,
}                           from '@/website.config' // TODO: will be used soon
import {
    COMMERCE_CURRENCY_FRACTION_MAX,
}                           from '@/commerce.config'



// defaults:
const imageSize = 128;  // 128px



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'pcyfaeow8d' });



// react components:

/* <ProductCreate> */
interface ProductCreateProps extends ModelCreateProps {}
const ProductCreate = (props: ProductCreateProps): JSX.Element|null => {
    // jsx:
    return (
        <EditProductDialog product={undefined} onClose={props.onClose} />
    );
};

/* <ProductPreview> */
interface ProductPreviewProps extends ModelPreviewProps<ProductDetail> {}
const ProductPreview = (props: ProductPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        model,
    ...restListItemProps} = props;
    const {
        visibility,
        name,
        images,
        price,
        stock,
    } = model;
    
    
    
    // states:
    type EditMode = Exclude<keyof ProductDetail, 'id'>|'images'|'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    const privelegeAdd               = !!role?.product_c;
    const privelegeUpdateDescription = !!role?.product_ud;
    const privelegeUpdateImages      = !!role?.product_ui;
    const privelegeUpdatePrice       = !!role?.product_up;
    const privelegeUpdateStock       = !!role?.product_us;
    const privelegeUpdateVisibility  = !!role?.product_uv;
    const privilegeDelete            = !!role?.product_d;
    const privilegeWrite             = (
        privelegeAdd
        || privelegeUpdateDescription
        || privelegeUpdateImages
        || privelegeUpdatePrice
        || privelegeUpdateStock
        || privelegeUpdateVisibility
        || privilegeDelete
    );
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const handleEditDialogClose = useEvent((): void => {
        setEditMode(null);
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheet.productItem}
        >
            <div className={styleSheet.productItemWrapper}>
                {/* carousel + edit button */}
                <CompoundWithBadge
                    // components:
                    wrapperComponent={<React.Fragment />}
                    badgeComponent={
                        privelegeUpdateImages
                        ? <Badge
                            // variants:
                            nude={true}
                            
                            
                            
                            // floatable:
                            floatingPlacement='left-start'
                            floatingShift={10}
                            floatingOffset={-30}
                        >
                            <EditButton className='edit overlay' onClick={() => setEditMode('images')} />
                        </Badge>
                        : null
                    }
                    elementComponent={
                        <MiniCarousel
                            // variants:
                            theme='danger'
                            
                            
                            
                            // classes:
                            className='images'
                            
                            
                            
                            // components:
                            basicComponent={<Content theme='primary' />}
                        >
                            {images.map((image, index) =>
                                <Image
                                    // identifiers:
                                    key={index}
                                    
                                    
                                    
                                    className='prodImg'
                                    
                                    alt={name ?? ''}
                                    src={resolveMediaUrl(image)}
                                    sizes={`${imageSize}px`}
                                />
                            )}
                        </MiniCarousel>
                    }
                />
                
                <h3 className='name'>
                    {name}
                    {privelegeUpdateDescription && <EditButton onClick={() => setEditMode('name')} />}
                </h3>
                <p className='price'>
                    <strong className='value'>{formatCurrency(price)}</strong>
                    {privelegeUpdatePrice       && <EditButton onClick={() => setEditMode('price')} />}
                </p>
                <p className='stock'>
                    Stock: <strong className='value'>{stock ?? 'unlimited'}</strong>
                    {privelegeUpdateStock       && <EditButton onClick={() => setEditMode('stock')} />}
                </p>
                <p className='visibility'>
                    Visibility: <strong className='value'>{visibility}</strong>
                    {privelegeUpdateVisibility  && <EditButton onClick={() => setEditMode('visibility')} />}
                </p>
                <p className='fullEditor'>
                    {privilegeWrite             && <EditButton buttonStyle='regular' onClick={() => setEditMode('full')}>
                        Open Full Editor
                    </EditButton>}
                </p>
            </div>
            {/* edit dialog: */}
            <ModalStatus theme='primary' viewport={listItemRef} backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode !== 'images') && (editMode !== 'full') && <>
                    {(editMode === 'name'      ) && <SimpleEditModelDialog<ProductDetail> model={model} updateModelApi={useUpdateProduct} edit={editMode} onClose={handleEditDialogClose} editorComponent={<NameEditor />} />}
                    {(editMode === 'price'     ) && <SimpleEditModelDialog<ProductDetail> model={model} updateModelApi={useUpdateProduct} edit={editMode} onClose={handleEditDialogClose} editorComponent={<PriceEditor />} />}
                    {(editMode === 'stock'     ) && <SimpleEditModelDialog<ProductDetail> model={model} updateModelApi={useUpdateProduct} edit={editMode} onClose={handleEditDialogClose} editorComponent={<StockEditor      theme='primaryAlt' />} />}
                    {(editMode === 'visibility') && <SimpleEditModelDialog<ProductDetail> model={model} updateModelApi={useUpdateProduct} edit={editMode} onClose={handleEditDialogClose} editorComponent={<VisibilityEditor theme='primaryAlt' />} />}
                </>}
            </ModalStatus>
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && ((editMode === 'images') || (editMode === 'full')) && <EditProductDialog product={model} onClose={handleEditDialogClose} defaultExpandedTabIndex={(editMode === 'images') ? 1 : undefined} />}
            </ModalStatus>
        </ListItem>
    );
};

/* <ProductPage> */
export default function ProductPage(): JSX.Element|null {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // states:
    const [page   , setPage   ] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    
    
    
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const role = session?.role;
    const privelegeAdd = !!role?.product_c;
    
    
    
    // stores:
    const getModelPaginationApi = useGetProductPage({ page, perPage });
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = getModelPaginationApi;
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData || (sessionStatus === 'loading'        )) return <PageLoading />;
    if (isErrorAndNoData   || (sessionStatus === 'unauthenticated')) return <PageError onRetry={refetch} />;
    return (
        <Main className={styleSheet.page}>
            <SectionModelEditor<ProductDetail>
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
                    <ProductPreview model={undefined as any} />
                }
                modelCreateComponent={
                    privelegeAdd
                    ? <ProductCreate onClose={undefined as any} />
                    : undefined
                }
            />
        </Main>
    )
}



// export const metadata : Metadata = {
//     title       : PAGE_PRODUCT_TITLE,
//     description : PAGE_PRODUCT_DESCRIPTION,
// };
