'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import type { Metadata } from 'next'

import { Image } from '@heymarco/image'
import { ButtonIcon, List, ListItem, ListItemProps, NavNextItem, NavPrevItem, Pagination, PaginationProps, Basic, CardBody, Badge, Content, ModalStatus } from '@reusable-ui/components';
import { ProductDetail, useGetProductPage } from '@/store/features/api/apiSlice';
import { useRef, useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency, getCurrencySign } from '@/libs/formatters';
import { useEvent } from '@reusable-ui/core';

import { PAGE_PRODUCTS_TITLE, PAGE_PRODUCTS_DESCRIPTION } from '@/website.config'
import { COMMERCE_CURRENCY_FRACTION_MAX } from '@/commerce.config'
import { EditButton } from '@/components/EditButton'
import { TextEditor } from '@/components/editors/TextEditor'
import { CurrencyEditor } from '@/components/editors/CurrencyEditor'
import { StockEditor } from '@/components/editors/StockEditor'
import { VisibilityEditor } from '@/components/editors/VisibilityEditor'
import { SimpleEditProductDialog } from '@/components/dialogs/SimpleEditProductDialog'
import { FullEditDialog } from './FullEditDialog'
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
import { CompoundWithBadge } from '@/components/CompoundWithBadge'
import { MiniCarousel } from '@/components/MiniCarousel'

// internal components:
import {
    PageLoading,
}                           from '@/components/PageLoading'
import {
    PageError,
}                           from '@/components/PageError'



// defaults:
const imageSize = 128;  // 128px



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });
import './pageStyles';



const ProductCreate = () => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // states:
    const [showAddNew, setShowAddNew] = useState<boolean>(false);
    
    
    
    return (
        <ListItem className={styles.productCreate}>
            <ButtonIcon icon='create' onClick={() => setShowAddNew(true)}>
                Add New Product
            </ButtonIcon>
            {/* add_new_product dialog: */}
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setShowAddNew(false)}>
                {showAddNew && <FullEditDialog product={undefined} onClose={() => setShowAddNew(false)} />}
            </ModalStatus>
        </ListItem>
    );
};

interface ProductItemProps extends ListItemProps {
    product: ProductDetail
}
const ProductItem = (props: ProductItemProps) => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    const {
        product,
    ...restListItem} = props;
    const {
        visibility,
        name,
        images,
        price,
        stock,
    } = product;
    
    
    
    // states:
    type EditMode = Exclude<keyof ProductDetail, 'id'>|'images'|'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const handleEditDialogClose = useEvent((): void => {
        setEditMode(null);
    });
    
    
    
    // jsx:
    return (
        <ListItem {...restListItem} elmRef={listItemRef} className={styles.productItem}>
            <div className={styles.productItemWrapper}>
                {/* carousel + edit button */}
                <CompoundWithBadge
                    // components:
                    wrapperComponent={<React.Fragment />}
                    badgeComponent={
                        <Badge
                            // variants:
                            nude={true}
                            
                            
                            
                            // floatable:
                            floatingPlacement='left-start'
                            floatingShift={10}
                            floatingOffset={-30}
                        >
                            <EditButton onClick={() => setEditMode('images')} />
                        </Badge>
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
                    <EditButton onClick={() => setEditMode('name')} />
                </h3>
                <p className='price'>
                    <strong className='value'>{formatCurrency(price)}</strong>
                    <EditButton onClick={() => setEditMode('price')} />
                </p>
                <p className='stock'>
                    Stock: <strong className='value'>{stock ?? 'unlimited'}</strong>
                    <EditButton onClick={() => setEditMode('stock')} />
                </p>
                <p className='visibility'>
                    Visibility: <strong className='value'>{visibility}</strong>
                    <EditButton onClick={() => setEditMode('visibility')} />
                </p>
                <p className='fullEditor'>
                    <EditButton buttonStyle='regular' onClick={() => setEditMode('full')}>
                        Open Full Editor
                    </EditButton>
                </p>
            </div>
            {/* edit dialog: */}
            <ModalStatus theme='primary' viewport={listItemRef} backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode !== 'images') && (editMode !== 'full') && <>
                    {(editMode === 'name'      ) && <SimpleEditProductDialog model={product} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor       type='text' required={true } />} />}
                    {(editMode === 'price'     ) && <SimpleEditProductDialog model={product} edit={editMode} onClose={handleEditDialogClose} editorComponent={<CurrencyEditor   currencySign={getCurrencySign()} currencyFraction={COMMERCE_CURRENCY_FRACTION_MAX} />} />}
                    {(editMode === 'stock'     ) && <SimpleEditProductDialog model={product} edit={editMode} onClose={handleEditDialogClose} editorComponent={<StockEditor      theme='secondary' />} />}
                    {(editMode === 'visibility') && <SimpleEditProductDialog model={product} edit={editMode} onClose={handleEditDialogClose} editorComponent={<VisibilityEditor theme='secondary' />} />}
                </>}
            </ModalStatus>
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && ((editMode === 'images') || (editMode === 'full')) && <FullEditDialog product={product} onClose={handleEditDialogClose} defaultExpandedTabIndex={(editMode === 'images') ? 1 : undefined} />}
            </ModalStatus>
        </ListItem>
    );
}
export default function Products() {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // stores:
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const {data: products, isLoading: isLoadingAndNoData, isFetching, isError, refetch } = useGetProductPage({ page, perPage });
    const isErrorAndNoData = isError && !products;
    const pages = Math.ceil((products?.total ?? 0) / perPage);
    
    
    
    // refs:
    const productListRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    const ProductPagination = (props: PaginationProps) => (
        <Pagination
            {...props}
            theme={props.theme ?? 'primary'}
            size={props.size ?? 'sm'}
            itemsLimit={props.itemsLimit ?? 20}
            
            prevItems={
                <NavPrevItem
                    onClick={() => setPage(1)}
                />
            }
            nextItems={
                <NavNextItem
                    onClick={() => setPage(pages)}
                />
            }
        >
            {!products && <ListItem actionCtrl={false} nude={true}><LoadingBar className={styles.paginationLoading}
                nude={true}
                running={isFetching}
                theme={isError ? 'danger' : undefined}
            /></ListItem>}
            
            {[...Array(pages)].map((_, index) =>
                <ListItem
                    key={index}
                    
                    active={(index + 1) === page}
                    onClick={() => setPage(index + 1)}
                >
                    {index + 1}
                </ListItem>
            )}
        </Pagination>
    );
    return (
        <Main className={styles.page}>
            <Section className={`fill-self ${styles.products}`}>
                <ProductPagination className={styles.paginTop} />
                <Basic<HTMLElement> className={styles.productList} theme='primary' mild={true} elmRef={productListRef}>
                    {/* loading|error dialog: */}
                    <ModalStatus viewport={productListRef} theme={isError ? 'danger' : undefined}>
                        {(isFetching || isError) && <CardBody className={styles.productFetching}>
                            {isFetching && <>
                                <p>Retrieving data from the server. Please wait...</p>
                                <LoadingBar className='loadingBar' />
                            </>}
                            
                            {isError && <>
                                <h3>Oops, an error occured!</h3>
                                <p>We were unable to retrieve data from the server.</p>
                                <ButtonIcon icon='refresh' theme='success' onClick={refetch}>
                                    Retry
                                </ButtonIcon>
                            </>}
                        </CardBody>}
                    </ModalStatus>
                    
                    {!!products && <List listStyle='flush' className={styles.productListInner}>
                        <ProductCreate />
                        {Object.values(products?.entities).filter((product): product is Exclude<typeof product, undefined> => !!product).map((product, index) =>
                            <ProductItem key={product.id ?? (`${page}-${index}`)} product={product} />
                        )}
                    </List>}
                </Basic>
                <ProductPagination className={styles.paginBtm} />
            </Section>
        </Main>
    )
}



// export const metadata : Metadata = {
//     title       : PAGE_PRODUCTS_TITLE,
//     description : PAGE_PRODUCTS_DESCRIPTION,
// };
