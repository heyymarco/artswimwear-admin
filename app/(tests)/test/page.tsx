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
import { useGetOrderPage } from '@/store/features/api/apiSlice'


export default function DashboardPage() {
    const {data: orderData} = useGetOrderPage({ page: 1, perPage: 10 });
    const filteredOrders = !orderData ? undefined : Object.values(orderData.entities).filter((shippingEntry): shippingEntry is Exclude<typeof shippingEntry, undefined> => !!shippingEntry);
    
    const {
        showDialog,
    } = useDialogMessage();
    const handleClick = useEvent(async (): Promise<void> => {
        const theOrder = filteredOrders?.[0];
        if (!theOrder) return;
        const result = await showDialog(
            <BuyShippingLabelDialog
                order={theOrder}
            />
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
