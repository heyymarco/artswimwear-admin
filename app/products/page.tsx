'use client'

import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import { List, ListItem } from '@reusable-ui/components';
import { ProductEntry, useGetProductList } from '@/store/features/api/apiSlice';
import { useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });



export default function Products() {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // stores:
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(20);
    const {data: products, isError, isLoading } = useGetProductList({ page, perPage });
    
    
    
    // jsx:
    return (
        <Main nude={true}>
            <Section className={styles.toolbox}>
                <p>
                    toolbox
                </p>
            </Section>
            <Section title='Products' className={styles.products}>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={5}>
                                Products
                            </th>
                        </tr>
                        <tr>
                            <th>
                                Image
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                Price
                            </th>
                            <th>
                                Stock
                            </th>
                            <th>
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(isLoading || isError) && <tr><td colSpan={5}>
                            {isLoading && <LoadingBar theme='primary' />}
                            {isError && <p>Oops, an error occured!</p>}
                        </td></tr>}
                        
                        {!!products && Object.values(products?.entities).filter((product): product is Exclude<typeof product, undefined> => !!product).map((product) =>
                            <tr key={product._id}>
                                <td>
                                    Image
                                </td>
                                <td>
                                    {product.name}
                                </td>
                                <td>
                                    {product.price}
                                </td>
                                <td>
                                    {product.stock}
                                </td>
                                <td>
                                    Status
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Section>
        </Main>
    )
}
