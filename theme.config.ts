import '@reusable-ui/typos/dist/effects'
import { defineTheme } from '@reusable-ui/core'
import { iconConfig } from '@reusable-ui/components'
import { galleryEditors } from '@/components/editors/GalleryEditor/styles/config';
import { commerces } from '@/config';



// themes:
defineTheme('primary', 'hsl(28, 60%, 10%)');
defineTheme('secondary', 'hsl(28, 30%, 80%)');



// icons:
iconConfig.image.files.push(
    { name: 'artswimwear.svg', ratio: '48/40' },
    { name: 'scrolldown.svg', ratio: '20/40' },
);



// gallery editors:
galleryEditors.itemAspectRatio = commerces.defaultProductAspectRatio;
