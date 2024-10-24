'use client'

// private components:
import {
    RootLayoutContent,
}                           from './layout-content'



// react components:
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // jsx:
    return (
        <RootLayoutContent>
            {children}
        </RootLayoutContent>
    );
}
