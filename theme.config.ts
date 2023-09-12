import '@reusable-ui/typos/effects'
import { defineTheme, colorValues, breakpoints } from '@reusable-ui/core'
import { iconConfig, navbarValues } from '@reusable-ui/components'
import { galleryEditors } from '@/components/editors/GalleryEditor/styles/config'
import { commerces } from '@/config'
import { basicValues } from '@reusable-ui/components'
import { imageValues } from '@heymarco/image'
import { carouselValues } from '@reusable-ui/components'

// other libs:
import Color                from 'color'                // color utilities
import { signIns } from '@heymarco/next-auth'



// Theme:
// light theme
colorValues.backg = colorValues.light;
colorValues.foreg = colorValues.dark;

const primaryCol = Color('hsl(185, 35%, 60%)').darken(0.2).saturate(0.2);
defineTheme('primary',    primaryCol);
colorValues.primaryText = primaryCol.lighten(1);
colorValues.primaryMild = primaryCol.lighten(1);
// colorValues.primaryMild = primaryCol.darken(0.5);

const secondaryCol = primaryCol.rotate(5).desaturate(0.5).lighten(0.65);
defineTheme('secondary', secondaryCol);
colorValues.secondaryText = secondaryCol.darken(0.6);
colorValues.secondaryMild = secondaryCol.lighten(1);

// colorValues.dark = primaryCol.darken(0.5);
// colorValues.light = primaryCol.lighten(0.5);
// colorValues.dark = primaryCol.lighten(0.5);
// colorValues.light = primaryCol.darken(0.5);



// <Basic>:
basicValues.backgGrad = [
    ['linear-gradient(180deg, transparent, rgba(100, 100, 100, 1)) border-box'],
];
basicValues.backgroundBlendMode = 'saturation';



// <Icon>:
iconConfig.image.files.push(
    { name: 'artswimwear.svg', ratio: '48/40' },
    { name: 'scrolldown.svg', ratio: '20/40' },
);



// <Navbar>:
navbarValues.boxSizing = 'border-box';
navbarValues.blockSize = '4rem';



// <SignIn>
(signIns as any).maxInlineSize = `${breakpoints.md}px`;



// <GalleryEditor>:
galleryEditors.itemAspectRatio = commerces.defaultProductAspectRatio;

imageValues.objectFit = 'cover';

carouselValues.mediaFlex = [[1, 1, 'auto']]; // growable, shrinkable, initial from it's height
