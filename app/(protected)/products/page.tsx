'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Main } from '@heymarco/section'

import type { Metadata } from 'next'

import { Image } from '@heymarco/image'
import { ListItem, ListItemProps, Badge, Content, ModalStatus } from '@reusable-ui/components';
import { ProductDetail, useGetProductPage } from '@/store/features/api/apiSlice';
import { useRef, useState } from 'react';
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
import {
    ModelCreateProps,
    ModelPreviewProps,
    SectionModelEditor,
}                           from '@/components/SectionModelEditor'



// defaults:
const imageSize = 128;  // 128px



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });
import './pageStyles';



// react components:

interface ProductCreateProps extends ModelCreateProps {}
const ProductCreate = (props: ProductCreateProps) => {
    // jsx:
    return (
        <FullEditDialog product={undefined} onClose={props.onClose} />
    );
};

interface ProductPreviewProps extends ModelPreviewProps<ProductDetail> {}
const ProductPreview = (props: ProductPreviewProps) => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    const {
        model,
    ...restListItem} = props;
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
                    {(editMode === 'name'      ) && <SimpleEditProductDialog model={model} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor       type='text' required={true } />} />}
                    {(editMode === 'price'     ) && <SimpleEditProductDialog model={model} edit={editMode} onClose={handleEditDialogClose} editorComponent={<CurrencyEditor   currencySign={getCurrencySign()} currencyFraction={COMMERCE_CURRENCY_FRACTION_MAX} />} />}
                    {(editMode === 'stock'     ) && <SimpleEditProductDialog model={model} edit={editMode} onClose={handleEditDialogClose} editorComponent={<StockEditor      theme='secondary' />} />}
                    {(editMode === 'visibility') && <SimpleEditProductDialog model={model} edit={editMode} onClose={handleEditDialogClose} editorComponent={<VisibilityEditor theme='secondary' />} />}
                </>}
            </ModalStatus>
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && ((editMode === 'images') || (editMode === 'full')) && <FullEditDialog product={model} onClose={handleEditDialogClose} defaultExpandedTabIndex={(editMode === 'images') ? 1 : undefined} />}
            </ModalStatus>
        </ListItem>
    );
}

export default function ProductPage() {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // states:
    const [page   , setPage   ] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const dataSource            = useGetProductPage({ page, perPage });
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = dataSource;
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <Main className={styles.page}>
            <SectionModelEditor<ProductDetail>
                // accessibilities:
                createItemText='Add New Product'
                
                
                
                // data:
                page={page}
                perPage={perPage}
                setPage={setPage}
                setPerPage={setPerPage}
                dataSource={dataSource}
                
                
                
                // components:
                modelPreviewComponent={
                    <ProductPreview model={undefined as any} />
                }
                modelCreateComponent={
                    <ProductCreate onClose={undefined as any} />
                }
            />
        </Main>
    )
}



// export const metadata : Metadata = {
//     title       : PAGE_PRODUCTS_TITLE,
//     description : PAGE_PRODUCTS_DESCRIPTION,
// };
