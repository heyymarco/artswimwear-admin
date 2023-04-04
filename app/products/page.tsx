'use client'

import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Main } from '@/components/sections/Main'
import { Section } from '@/components/sections/Section'



// styles:
export const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });



export default function Products() {
    const styles = usePageStyleSheet();
    
    
    
    // jsx:
    return (
        <Main nude={true}>
            <Section title='Products' className={styles.section1}>
                <p>
                    This is a products page.
                </p>
            </Section>
        </Main>
    )
}
