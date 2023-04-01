'use client'

import { usePageStyleSheet } from './pageStylesLoader'

import { Main } from '@/components/sections/Main'
import { Section } from '@/components/sections/Section'



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
