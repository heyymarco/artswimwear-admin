'use client'

import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Main } from '@/components/sections/Main'
import { Section } from '@/components/sections/Section'
import { List, ListItem } from '@reusable-ui/components';



// styles:
export const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });



export default function Products() {
    const styles = usePageStyleSheet();
    
    
    
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
                            <th>
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
                        <tr>
                            <td>
                                Image
                            </td>
                            <td>
                                Name
                            </td>
                            <td>
                                Price
                            </td>
                            <td>
                                Stock
                            </td>
                            <td>
                                Status
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Section>
        </Main>
    )
}
