// cssfn:
import {
    children,
    descendants,
    rule,
    style,
}                           from '@cssfn/core'          // writes css in javascript
import { basics } from '@reusable-ui/components';
import { typos, usesBorder, usesGroupable, usesPadding } from '@reusable-ui/core';



// styles:
const imageSize = 128;  // 128px
const usesAdminPreviewLayout = () => { // the <ListItem> of admin list
    // dependencies:
    
    // capabilities:
    const {groupableRule, groupableVars} = usesGroupable({
        orientationInlineSelector : null,     // craft the <Carousel>'s borderRadius manually
        orientationBlockSelector  : null,     // craft the <Carousel>'s borderRadius manually
        itemsSelector             : '.items', // select the <Carousel>
    });
    
    // features:
    const {borderRule , borderVars } = usesBorder({ borderWidth: '0px' });
    const {paddingRule, paddingVars} = usesPadding({
        paddingInline : '1rem',
        paddingBlock  : '1rem',
    });
    
    // spacings:
    const positivePaddingInline = groupableVars.paddingInline;
    const positivePaddingBlock  = groupableVars.paddingBlock;
    const negativePaddingInline = `calc(0px - ${positivePaddingInline})`;
    const negativePaddingBlock  = `calc(0px - ${positivePaddingBlock })`;
    
    
    
    return style({
        // capabilities:
        ...groupableRule(), // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // layouts:
            display: 'grid',
            gridTemplate: [[
                '"adminImg      name "', 'auto',
                '"adminImg  username "', 'auto',
                '"adminImg     email "', 'auto',
                '"adminImg      role "', 'auto',
                '"adminImg fullEditor"', 'auto',
                '/',
                `calc(${imageSize}px - ${paddingVars.paddingInline}) 1fr`,
            ]],
            
            
            
            // borders:
            // follows <parent>'s borderRadius
            border                   : borderVars.border,
         // borderRadius             : borderVars.borderRadius,
            borderStartStartRadius   : borderVars.borderStartStartRadius,
            borderStartEndRadius     : borderVars.borderStartEndRadius,
            borderEndStartRadius     : borderVars.borderEndStartRadius,
            borderEndEndRadius       : borderVars.borderEndEndRadius,
            [borderVars.borderWidth] : '0px', // only setup borderRadius, no borderStroke
            
            
            
            // spacings:
         // padding       : paddingVars.padding,
            paddingInline : paddingVars.paddingInline,
            paddingBlock  : paddingVars.paddingBlock,
            
            gapInline     : '1rem',
            gapBlock      : '0.5rem',
            
            
            
            // children:
            ...descendants(['.name', 'p'], {
                margin: 0,
            }),
            ...descendants('.noValue', {
                // appearances:
                opacity    : 0.5,
                
                
                
                // typos:
                fontStyle  : 'italic',
            }),
            ...descendants('.edit', {
                marginInlineStart: '0.25em',
                opacity: 0.5,
                transition: [
                    ['transform', '300ms', 'ease-out'],
                ],
                ...rule(':hover', {
                    opacity: 'unset',
                    transform: 'scale(105%)',
                }),
                // invert the edit overlay, so the edit overlay can be seen on busy background
                ...rule('.overlay', {
                    opacity : 0.8,
                    
                    
                    
                    // children:
                    ...children('[role="img"]', {
                        filter : [[
                            'invert(1)',
                        ]],
                    }),
                }),
            }),
            ...children('.adminImg', {
                // positions:
                gridArea    : 'adminImg',
                
                justifySelf : 'stretch', // stretch the self horizontally
                alignSelf   : 'stretch', // stretch the self vertically
                
                
                
                // layout:
                ...rule('.empty', {
                    display      : 'grid',
                    justifyItems : 'center',  // default center the items horizontally
                    alignItems   : 'center',  // default center the items vertically
                }),
                
                
                
                // backgrounds:
                backgroundBlendMode : 'normal',
                backgroundRepeat    : 'no-repeat',
                backgroundPosition  : 'center',
                backgroundSize      : 'cover',
                
                
                
                // borders:
                // follows <parent>'s borderRadius
                [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
                [borderVars.borderStartEndRadius  ] : '0px',
                [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
                [borderVars.borderEndEndRadius    ] : '0px',
                [borderVars.borderWidth           ] : '0px', // only setup borderRadius, no borderStroke
                borderInlineEndWidth : basics.borderWidth,
                
                
                
                // spacings:
                // cancel-out parent's padding with negative margin:
                marginInlineStart : negativePaddingInline,
                marginBlock       : negativePaddingBlock,
            }),
            ...children('.name', {
                gridArea: 'name',
                fontSize: typos.fontSizeXl,
            }),
            ...children('.username', {
                gridArea: 'username',
            }),
            ...children('.email', {
                gridArea: 'email',
            }),
            ...children('.role', {
                gridArea: 'role',
            }),
            ...children('.fullEditor', {
                gridArea: 'fullEditor',
            }),
            ...descendants('[role="dialog"]', {
                // remove the padding of <Dialog>'s backdrop:
                [paddingVars.paddingInline] : '0px',
                [paddingVars.paddingBlock ] : '0px',
            }),
        }),
        
        
        
        // features:
        ...borderRule(),  // must be placed at the last
        ...paddingRule(), // must be placed at the last
    });
};

export default style({
    // layouts:
    ...usesAdminPreviewLayout(),
});
