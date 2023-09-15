'use client'

import { UploadImage } from '@/components/editors/UploadImage'
import { Section, Main } from '@heymarco/section'



export default function DashboardPage() {
    return (
        <Main nude={true}>
            <Section title='Dashboard'>
                <p>
                    Coming soon: analitic data &amp; store summary goes here.
                </p>
                <UploadImage
                    theme='primary'
                    onUploadImageStart={async (imageFile, percentage) => {
                        for (let progress = 0; progress <= 100; progress+=10) {
                            await new Promise<void>((resolved) => {
                                setTimeout(() => {
                                    resolved();
                                }, 1000);
                            });
                            percentage(progress);
                            
                            if (progress >= 30) throw 'error bro!';
                        } // for
                        await new Promise<void>((resolved) => {
                            setTimeout(() => {
                                resolved();
                            }, 1000);
                        });
                        return 'test.jpg'
                    }}
                />
            </Section>
        </Main>
    )
}
