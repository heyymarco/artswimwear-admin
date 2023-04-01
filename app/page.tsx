import Image from 'next/image'
import { Main } from '@/components/sections/Main'
import { Section } from '@/components/sections/Section'



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
