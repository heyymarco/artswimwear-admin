import '@reusable-ui/typos/effects'
import { iconConfig, navbarValues } from '@reusable-ui/components'
import { galleryEditors } from '@/components/editors/GalleryEditor/styles/config'
import { commerces } from '@/config'
import { imageValues } from '@heymarco/image'
import { carouselValues } from '@reusable-ui/components'
import './theme.basics.config'



// <Icon>:
iconConfig.image.files.push(
    { name: 'artswimwear.svg', ratio: '48/40' },
    { name: 'scrolldown.svg', ratio: '20/40' },
);



// <Navbar>:
navbarValues.boxSizing = 'border-box';
navbarValues.blockSize = '4rem';



// <SignIn>
// (signIns as any).maxInlineSize = `${breakpoints.sm}px`;



// <GalleryEditor>:
galleryEditors.itemAspectRatio = commerces.defaultProductAspectRatio;



// <UploadImage>:
// uploadImages.mediaAspectRatio  = commerces.defaultProductAspectRatio;



// <Image>:
imageValues.objectFit = 'cover';



// <Carousel>:
carouselValues.mediaFlex = [[1, 1, 'auto']]; // growable, shrinkable, initial from it's height
