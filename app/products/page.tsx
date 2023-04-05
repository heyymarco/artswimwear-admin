'use client'

import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import { Image } from '@heymarco/image'
import { ButtonIcon, List, ListItem, NavNextItem, NavPrevItem, Pagination } from '@reusable-ui/components';
import { ProductEntry, useGetProductList } from '@/store/features/api/apiSlice';
import { useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency } from '@/libs/formatters';



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });



export default function Products() {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // stores:
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(5);
    const {data: products, isError, isLoading, isFetching } = useGetProductList({ page, perPage });
    const pages = Math.ceil((products?.total ?? 0) / perPage);
    
    
    // jsx:
    const ProductPagination = () => (
        <Pagination theme='primary' size='sm' itemsLimit={20}
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
                <ProductPagination />
                <List theme='primary' enabled={!products || !isFetching}>
                    {isLoading && <LoadingBar
                        nude={true}
                    />}
                    
                    {isError && <ListItem>
                        {isError && <p>Oops, an error occured!</p>}
                    </ListItem>}
                    
                    {!!products && Object.values(products?.entities).filter((product): product is Exclude<typeof product, undefined> => !!product).map((product, index) =>
                        <ListItem key={index}>
                            <Image
                                className='prodImg'
                                
                                alt={product?.name ?? ''}
                                src={product?.image ? `/products/${product?.name}/${product?.image}` : undefined}
                                sizes='48px'
                            />
                            <h3>
                                {product.name}
                            </h3>
                            <p>
                                {formatCurrency(product.price)}
                                <ButtonIcon icon='edit' theme='primary' size='xs' buttonStyle='link' />
                            </p>
                            <p>
                                Stock: {product.stock}
                                <ButtonIcon icon='edit' theme='primary' size='xs' buttonStyle='link' />
                            </p>
                            <p>
                                Status
                                <ButtonIcon icon='edit' theme='primary' size='xs' buttonStyle='link' />
                            </p>
                        </ListItem>
                    )}
                </List>
                <ProductPagination />
            </Section>
        </Main>
    )
}
