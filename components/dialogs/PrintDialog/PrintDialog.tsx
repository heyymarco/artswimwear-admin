// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useEffect,
    useMemo,
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
    
    
    
    // a set of client-side functions:
    isClientSide,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    ButtonIcon,
    CloseButton,
    
    
    
    // layout-components:
    CardHeader,
    CardFooter,
    CardProps,
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
const usePrintDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./PrintDialogStyles')
, { id: 'yffn5x8ff7' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:

/* <PrintDialog> */
export interface PrintDialogProps
    extends
        // bases:
        ModalCardProps<HTMLElement, ModalExpandedChangeEvent>
{
}
const PrintDialog = (props: PrintDialogProps): JSX.Element|null => {
    // styles:
    const styleSheets = usePrintDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // children:
        children,
    ...restModalCardProps} = props;
    
    
    
    // dom effects:
    
    // hides the website's page, only show the print dialog:
    useEffect(() => {
        // setups:
        const documentElm = isClientSide ? document.documentElement : undefined;
        const bodyElm     = isClientSide ? document.body            : undefined;
        
        const documentClass = styleSheets.document;
        documentElm?.classList.add(documentClass);
        
        const bodyClass = styleSheets.body;
        bodyElm?.classList.add(bodyClass);
        
        const cancelPrint = setTimeout(() => {
            window.print();
        }, 1000);
        
        
        
        // cleanups:
        return () => {
            documentElm?.classList.remove(documentClass);
            bodyElm?.classList.remove(bodyClass);
            
            clearTimeout(cancelPrint);
        };
    }, []);
    
    
    
    // classes:
    const cardComponentOri = useMemo<React.ReactComponentElement<any, CardProps<Element>>>(() =>
        props.cardComponent  ?? <Card  />
    , [props.cardComponent]);
    const mergedCardClasses = useMergeClasses(
        // preserves the original `classes` from `cardComponentOri`:
        cardComponentOri.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        styleSheets.card,
    );
    
    
    
    // handlers:
    const handleCloseDialog = useEvent(() => {
        props.onExpandedChange?.({
            expanded   : false,
            actionType : 'ui',
        });
    });
    const handlePrintDialog = useEvent(() => {
        window.print();
    });
    
    
    
    // jsx:
    const cardComponent  = useMemo<React.ReactComponentElement<any, CardProps<Element>>>(() =>
        React.cloneElement<CardProps<Element>>(cardComponentOri,
            // props:
            {
                // classes:
                classes : mergedCardClasses,
            },
        )
    , [cardComponentOri]);
    const modalComponent = props.modalComponent ?? <Modal className={styleSheets.backdrop}>{cardComponent}</Modal>;
    const popupComponent = props.popupComponent ?? <Popup className={styleSheets.popup} />;
    return (
        <ModalCard
            // other props:
            {...restModalCardProps}
            
            
            
            // global stackable:
            viewport={props.viewport ?? (isClientSide ? document.documentElement : undefined)}
            
            
            
            // components:
            cardComponent  = {cardComponent}
            modalComponent = {modalComponent}
            popupComponent = {popupComponent}
        >
            <CardHeader className={styleSheets.printCaption}>
                <h1>Print</h1>
                <CloseButton icon='close' onClick={handleCloseDialog} />
            </CardHeader>
            <Content    className={`body ${styleSheets.printDialog}`}>
                {children}
            </Content>
            <CardFooter className={styleSheets.printCaption}>
                <ButtonIcon icon='print' onClick={handlePrintDialog}>Print Again</ButtonIcon>
                <ButtonIcon icon='done' onClick={handleCloseDialog}>Close</ButtonIcon>
            </CardFooter>
        </ModalCard>
    );
};
export {
    PrintDialog,
    PrintDialog as default,
}
