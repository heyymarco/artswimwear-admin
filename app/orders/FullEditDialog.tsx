'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { ButtonIcon, Generic, Content, CardBody, CardHeader, CardFooter, Button, CloseButton, List, Carousel, Masonry, masonries } from '@reusable-ui/components';
import { OrderDetail, useUpdateOrder } from '@/store/features/api/apiSlice';
import { useEffect, useRef, useState } from 'react';
import { getCurrencySign } from '@/libs/formatters';
import { AccessibilityProvider, ValidationProvider, useEvent } from '@reusable-ui/core';
import { ModalStatus } from '../../components/ModalStatus'

import { STORE_WEBSITE_URL, PAGE_PRODUCTS_TAB_INFORMATIONS, PAGE_PRODUCTS_TAB_DESCRIPTION, PAGE_PRODUCTS_TAB_IMAGES } from '@/website.config'
import { COMMERCE_CURRENCY_FRACTION_MAX } from '@/commerce.config'
import { TextEditor } from '@/components/editors/TextEditor'
import { PathEditor } from '@/components/editors/PathEditor'
import { CurrencyEditor } from '@/components/editors/CurrencyEditor'
import { ShippingWeightEditor } from '@/components/editors/ShippingWeightEditor'
import { StockEditor } from '@/components/editors/StockEditor'
import { GalleryEditor } from '@/components/editors/GalleryEditor/GalleryEditor'
import { Tab, TabPanel } from '@reusable-ui/components'
import { Image } from '@heymarco/image'
import axios from 'axios'
import { resolveMediaUrl } from '@/libs/mediaStorage.client'
import { WysiwygEditorState, WysiwygEditor, ToolbarPlugin, EditorPlugin } from '@/components/editors/WysiwygEditor';



// styles:
const useFullEditDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./FullEditDialogStyles')
, { id: 'wz8sbhtojl' }); // need 3 degrees to overwrite `.cardClass.body`



// react components:
export interface FullEditDialogProps {
    // data:
    order            : OrderDetail
    
    
    
    // handlers:
    onClose          : () => void
}
export const FullEditDialog = (props: FullEditDialogProps) => {
    // styles:
    const styles = useFullEditDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        order,
        
        
        
        // handlers:
        onClose,
    } = props;
    const {
        _id,
    } = order;
    
    
    
    // refs:
    const firstEditorRef     = useRef<HTMLInputElement|null>(null); // TODO: finish this
    const editorContainerRef = useRef<HTMLElement|null>(null); // TODO: finish this
    
    
    
    // dialogs:
    const [errorMessage   , setErrorMessage   ] = useState<React.ReactNode>(undefined);
    
    
    
    // handlers:
    const handleClosing = useEvent(() => {
        onClose();
    });
    const handleKeyDown : React.KeyboardEventHandler<HTMLElement> = useEvent((event) => {
        switch (event.key) {
            // case 'Enter':
            //     event.preventDefault();
            //     handleSave();
            //     break;
            
            case 'Escape':
                event.preventDefault();
                // handleClosing();
                break;
        } // switch
    });
    
    
    
    // dom effects:
    useEffect(() => {
        // setups:
        const cancelFocus = setTimeout(() => {
            // conditions:
            const firstEditorElm = firstEditorRef.current;
            if (!firstEditorElm) return;
            
            
            
            firstEditorElm.setSelectionRange(0, -1);
            firstEditorElm.focus({ preventScroll: true });
        }, 0);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelFocus);
        };
    }, []);
    
    
    
    // jsx:
    return (
        <>
            <CardHeader
                // handlers:
                onKeyDown={handleKeyDown}
            >
                {_id}
                <CloseButton onClick={handleClosing} />
            </CardHeader>
            <Tab
                // variants:
                mild='inherit'
                
                
                
                // classes:
                className={styles.cardBody}
                
                
                
                // components:
                listComponent={<List className={styles.tabList} />}
                bodyComponent={<Content className={styles.tabBody} />}
                
                
                
                // handlers:
                onKeyDown={handleKeyDown}
            >
                <TabPanel label={PAGE_PRODUCTS_TAB_INFORMATIONS} panelComponent={<Generic className={styles.pageInfo} />}>
                    blah blah...
                </TabPanel>
            </Tab>
            <CardFooter onKeyDown={handleKeyDown}>
                <ButtonIcon className='btnClose' icon='close_fullscreen' theme='secondary' onClick={handleClosing}>Close</ButtonIcon>
            </CardFooter>
            <ModalStatus
                theme='danger'
                backdropStyle='static'
            >
                {!!errorMessage && <>
                    <CardHeader>
                        Error Saving Data
                        <CloseButton onClick={() => setErrorMessage(undefined)} />
                    </CardHeader>
                    <CardBody>
                        {errorMessage}
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => setErrorMessage(undefined)}>
                            Okay
                        </Button>
                    </CardFooter>
                </>}
            </ModalStatus>
        </>
    );
}
