'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

import { Section, Main } from '@heymarco/section'
import { Button, useDialogMessage } from '@reusable-ui/components'
import { useEvent } from '@reusable-ui/core'
import BuyShippingLabelDialog from '@/components/dialogs/BuyShippingLabelDialog/BuyShippingLabelDialog'


export default function DashboardPage() {
    const {
        showDialog,
    } = useDialogMessage();
    const handleClick = useEvent(async (): Promise<void> => {
        const result = await showDialog(
            <BuyShippingLabelDialog />
        );
        console.log(result);
    });
    return (
        <Main nude={true}>
            <Section title='Dashboard'>
                <p>
                    Coming soon: analitic data &amp; store summary goes here.
                </p>
                <Button onClick={handleClick} theme='primary'>
                    Test
                </Button>
            </Section>
        </Main>
    )
}
