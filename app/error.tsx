'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import {
    PageError,
}                           from '@/components/PageError'



export interface ErrorPageProps {
    error : Error
    reset : () => void
}
export default function ErrorPage(props: ErrorPageProps) {
    // jsx:
    return (
        <PageError onRetry={props.reset} />
    );
}
