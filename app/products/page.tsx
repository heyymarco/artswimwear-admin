'use client'

import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import { Image } from '@heymarco/image'
import { ButtonIcon, ButtonIconProps, List, ListItem, ListItemProps, NavNextItem, NavPrevItem, Pagination, PaginationProps } from '@reusable-ui/components';
import { ProductEntry, useGetProductList } from '@/store/features/api/apiSlice';
import { useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency } from '@/libs/formatters';



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });



const EditButton = (props: ButtonIconProps) => {
    return (
        <ButtonIcon
            className={props.className ?? 'edit'}
            icon={props.icon ?? 'edit'}
            theme={props.theme ?? 'primary'}
            size={props.size ?? 'xs'}
            buttonStyle={props.buttonStyle ?? 'link'}
            title={props.title ?? 'edit'}
        />
    );
}
interface ProductUiProps extends ListItemProps {
    product: ProductEntry
}
const ProductItem = (props: ProductUiProps) => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    const {
        product,
    ...restListItem} = props;
    const {
        name,
        image,
        price,
        stock,
    } = product;
    
    
    
    // jsx:
    return (
        <ListItem {...restListItem} className={styles.productItem}>
            <Image
                className='prodImg'
                
                alt={name ?? ''}
                src={image ? `/products/${name}/${image}` : undefined}
                sizes='96px'
            />
            <h3 className='title'>
                {name}
            </h3>
            <p className='price'>
                <strong className='value'>{formatCurrency(price)}</strong>
                <EditButton />
            </p>
            <p className='stock'>
                Stock: <strong className='value'>{stock ?? 'unlimited'}</strong>
                <EditButton />
            </p>
            <p className='avail'>
                Availability:
                <EditButton />
            </p>
        </ListItem>
    );
}
export default function Products() {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // stores:
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(5);
    const {data: products, isError, isLoading, isFetching } = useGetProductList({ page, perPage });
    const pages = Math.ceil((products?.total ?? 0) / perPage);
    
    
    // jsx:
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
            {(isLoading || isError) && <LoadingBar
                nude={true}
                running={isLoading}
                theme={isError ? 'danger' : undefined}
            />}
            
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
        <Main nude={true}>
            <Section className={styles.toolbox}>
                <p>
                    toolbox
                </p>
            </Section>
            <Section title='Products' className={styles.products}>
                <ProductPagination className='pagin-top' />
                <List className='product-list' theme='primary' enabled={!products || !isFetching} listStyle={(isLoading || isError) ? 'content' : undefined}>
                    {(isLoading || isError) && <ListItem>
                        {isLoading && <LoadingBar />}
                        {isError && <p>Oops, an error occured!</p>}
                    </ListItem>}
                    
                    {!!products && Object.values(products?.entities).filter((product): product is Exclude<typeof product, undefined> => !!product).map((product, index) =>
                        <ProductItem key={product._id ?? (`${page}-${index}`)} product={product} />
                    )}
                </List>
                <ProductPagination className='pagin-btm' />
            </Section>
        </Main>
    )
}
