// cssfn:
import {
    // writes css in javascript:
    rule,
    children,
    scope,
    style,
}                           from '@cssfn/core'          // writes css in javascript

// reusable-ui core:
import {
    // a responsive management system:
    breakpoints,
    
    
    
    // border (stroke) stuff of UI:
    usesBorder,
    
    
    
    // padding (inner spacing) stuff of UI:
    usesPadding,
    
    
    
    // groups a list of UIs into a single UI
    usesGroupable,
}                           from '@reusable-ui/core'    // a set of reusable-ui packages which are responsible for building any component



// styles:
// defaults:
const usesListDataLayout = () => {
    // dependencies:
    
    // capabilities:
    const {groupableRule} = usesGroupable({
        orientationInlineSelector : null, // craft the <List>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
        orientationBlockSelector  : null, // craft the <List>'s borderRadius manually, uncraft the other <portal><ModalBackdrop><ModalDialog>
    });
    
    // features:
    const {paddingVars} = usesPadding();
    
    
    
    return style({
        // capabilities:
        ...groupableRule(),  // make a nicely rounded corners
        
        
        
        // layouts:
        ...style({
            // positions:
            gridArea  : 'dataList',
            alignSelf : 'start',
            
            
            
            // layouts:
            display            : 'flex',
            flexDirection      : 'column',
            justifyContent     : 'start', // align to top
            
            
            
            // sizes:
            ...rule('.empty', {
                blockSize : '100%', // if data empty => fill the entire available page height
                overflow  : 'hidden', // a fix for <Backdrop>'s borderRadius // TODO: fix reusable-ui's <ModalBackdrop>
            }),
            
            
            
            // spacings:
            [paddingVars.paddingInline] : '0px',
            [paddingVars.paddingBlock ] : '0px',
        }),
    });
};
const usesDataListInnerLayout = () => { // the <List> of data
    // dependencies:
    
    // capabilities:
    const {groupableVars} = usesGroupable();
    
    // features:
    const {borderVars } = usesBorder();
    
    
    
    return style({
        // sizes:
        blockSize: '100%', // fill the entire <Outer>
        
        
        
        // borders:
        [groupableVars.borderStartStartRadius] : 'inherit !important', // reads parent's prop
        [groupableVars.borderStartEndRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndStartRadius  ] : 'inherit !important', // reads parent's prop
        [groupableVars.borderEndEndRadius    ] : 'inherit !important', // reads parent's prop
        
        [borderVars.borderStartStartRadius] : groupableVars.borderStartStartRadius,
        [borderVars.borderStartEndRadius  ] : groupableVars.borderStartEndRadius,
        [borderVars.borderEndStartRadius  ] : groupableVars.borderEndStartRadius,
        [borderVars.borderEndEndRadius    ] : groupableVars.borderEndEndRadius,
    });
};

const usesCreateDataLayout = () => { // the <ListItem> of data add_new
    return style({
        // layouts:
        display: 'flex',
        flexDirection: 'column',
    });
};

export default () => [
    scope('sectionModel', {
        flexGrow: 1,
        
        display: 'flex',
        flexDirection: 'column',
        ...children('article', {
            // layouts:
            display      : 'grid',
            gridTemplate : [[
                '"paginTop"', 'auto',
                '"dataList"', '1fr',
                '"paginBtm"', 'auto',
                '/',
                'auto',
            ]],
            
            
            
            // spacings:
            gapInline : '1rem',
            gapBlock  : '1rem',
            
            
            
            // sizes:
            flexGrow      : 1,
            maxInlineSize : `${breakpoints.xxxl}px`,
            alignSelf     : 'center',
        }),
    }, { specificityWeight: 2 }),
    scope('paginTop', {
        gridArea: 'paginTop',
        
        justifySelf: 'center',
    }),
    scope('listData', {
        ...usesListDataLayout(),
    }, { specificityWeight: 2 }),
    scope('paginBtm', {
        gridArea: 'paginBtm',
        
        justifySelf: 'center',
    }),
    scope('listDataInner', { // the <List> of data
        ...usesDataListInnerLayout(),
    }, { specificityWeight: 2 }),
    scope('createData', { // the <ListItem> of data add_new
        ...usesCreateDataLayout(),
    }),
];
