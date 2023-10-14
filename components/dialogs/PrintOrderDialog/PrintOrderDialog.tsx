// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeClasses,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    Card,
    
    
    
    // status-components:
    Popup,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    Modal,
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// styles:
const usePrintOrderDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./PrintOrderDialogStyles')
, { id: 'yffn5x8ff7' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:

/* <PrintOrderDialog> */
export interface PrintOrderDialogProps
    extends
        // bases:
        ModalCardProps<HTMLElement, ModalExpandedChangeEvent>
{
}
const PrintOrderDialog = (props: PrintOrderDialogProps): JSX.Element|null => {
    // styles:
    const styleSheets = usePrintOrderDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // children:
        children,
    ...restModalCardProps} = props;
    
    
    
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
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes`:
        props.classes,
        
        
        
        // classes:
        props.mainClass ?? styleSheets.printOrderDialog,
    );
    
    
    
    // handlers:
    const handleCloseDialog = useEvent(async () => {
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
        })
    });
    
    
    
    // jsx:
    const cardComponent  = <Card className={styleSheets.card} />;
    const modalComponent = <Modal className={styleSheets.backdrop}>{cardComponent}</Modal>;
    const popupComponent = <Popup className={styleSheets.popup} />
    return (
        <ModalCard
            // other props:
            {...restModalCardProps}
            
            
            
            // components:
            cardComponent  = {cardComponent}
            modalComponent = {modalComponent}
            popupComponent = {popupComponent}
        >
            <Content
                // classes:
                classes={classes}
                // theme='light'
            >
                <ButtonIcon className={styleSheets.closeButton} icon='close' theme='primary' onClick={handleCloseDialog}>Close</ButtonIcon>
                {children}
                <ButtonIcon className={styleSheets.closeButton} icon='close' theme='primary' onClick={handleCloseDialog}>Close</ButtonIcon>
            </Content>
        </ModalCard>
    );
};
export {
    PrintOrderDialog,
    PrintOrderDialog as default,
}
