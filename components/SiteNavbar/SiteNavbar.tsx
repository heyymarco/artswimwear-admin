'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    basics,
    
    navbarValues,
    Navbar,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals components:
import {
    SiteNavbarMenu,
}                           from './SiteNavbarMenu'



navbarValues.boxSizing = 'border-box';
navbarValues.blockSize = '4rem';

navbarValues.extraMarginInline = 'unset';
navbarValues.extraMarginBlock  = [[
    'calc(0px - ', basics.paddingBlock, ')',
]];
navbarValues.extraJustifySelf  = 'stretch';
navbarValues.extraAlignSelf    = 'stretch';



const SiteNavbar = () => {
    return (
        <Navbar theme='primary' gradient={true} className='siteNavbar' breakpoint='md'>{(params) =>
            <SiteNavbarMenu {...params} />
        }</Navbar>
    );
}
export {
    SiteNavbar,
    SiteNavbar as default,
}
