// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'
import {
    createPortal,
}                           from 'react-dom'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useMergeClasses,
    
    
    
    // a capability of UI to stack on top-most of another UI(s) regardless of DOM's stacking context:
    useGlobalStackable,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui components:
import {
    // react components:
    ContentProps,
    Content,
}                           from '@reusable-ui/content'             // a base component
import {
    // react components:
    ButtonIcon,
}                           from '@reusable-ui/button-icon'         // a button component with a nice icon



// styles:
const usePrintDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./PrintDialogStyles')
, { id: 'yffn5x8ff7' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:

/* <PrintDialog> */
export interface PrintDialogProps
    extends
        ContentProps
{
    // handlers:
    onDone ?: () => void
}
const PrintDialog = (props: PrintDialogProps): JSX.Element|null => {
    // styles:
    const styleSheets = usePrintDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // handlers:
        onDone,
        
        
        
        // children:
        children,
    ...restContentProps} = props;
    
    
    
    // dom effects:
    
    // hides the website's page, only show the print dialog:
    useEffect(() => {
        // setups:
        const visuallyHiddenClass = styleSheets.visuallyHidden;
        
        const headerElm = document.body.getElementsByTagName('header')?.[0];
        const mainElm   = document.body.getElementsByTagName('main')?.[0];
        const footerElm = document.body.getElementsByTagName('footer')?.[0];
        
        headerElm?.classList.add(visuallyHiddenClass);
        mainElm?.classList.add(visuallyHiddenClass);
        footerElm?.classList.add(visuallyHiddenClass);
        
        const cancelPrint = setTimeout(() => {
            window.print();
        }, 1000);
        
        
        
        // cleanups:
        return () => {
            headerElm?.classList.remove(visuallyHiddenClass);
            mainElm?.classList.remove(visuallyHiddenClass);
            footerElm?.classList.remove(visuallyHiddenClass);
            
            clearTimeout(cancelPrint);
        };
    }, []);
    
    
    
    // capabilities:
    const {portalElm} = useGlobalStackable({});
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        props.mainClass ?? styleSheets.printDialog,
    );
    
    
    
    // jsx:
    if (!portalElm) return null; // server side -or- client side but not already hydrated => nothing to render
    return createPortal( // workaround for zIndex stacking context
        <Content
            // other props:
            {...restContentProps}
            
            
            
            // classes:
            classes={classes}
        >
            <ButtonIcon className={styleSheets.closeButton} icon='close' theme='primary' onClick={onDone}>Close</ButtonIcon>
            {children}
            <ButtonIcon className={styleSheets.closeButton} icon='close' theme='primary' onClick={onDone}>Close</ButtonIcon>
        </Content>
    , portalElm);
};
export {
    PrintDialog,
    PrintDialog as default,
}
