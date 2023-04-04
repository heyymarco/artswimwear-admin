'use client'

import Image from 'next/image'
import { Section, Main } from '@heymarco/section'



export default function Home() {
    return (
        <Main nude={true}>
            <Section title='Homepage'>
                <p>
                    This is a home page.
                </p>
            </Section>
        </Main>
    )
}
