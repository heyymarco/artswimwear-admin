'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { ButtonIcon, Generic, Content, CardBody, CardHeader, CardFooter, Button, CloseButton, List } from '@reusable-ui/components';
import { ProductEntry, useUpdateProduct } from '@/store/features/api/apiSlice';
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
import { ProductVisibility, VisibilityEditor } from '@/components/editors/VisibilityEditor'
import { Tab, TabPanel } from '@/components/Tab';



// styles:
const useFullEditDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./FullEditDialogStyles')
, { id: 'pkeb1tledn' }); // need 3 degrees to overwrite `.cardClass.body`



// react components:
export interface FullEditDialogProps {
    // data:
    product          : ProductEntry
    
    
    
    // handlers:
    onClose          : () => void
}
export const FullEditDialog = (props: FullEditDialogProps) => {
    // styles:
    const styles = useFullEditDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        product,
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // states:
    const [isPathModified  , setIsPathModified  ] = useState<boolean>(false);
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [visibility      , setVisibility      ] = useState<ProductVisibility>(product.visibility as ProductVisibility);
    const [name            , setName            ] = useState<string>(product.name);
    const [path            , setPath            ] = useState<string>(product.path ?? '');
    const [price           , setPrice           ] = useState<number|null>(product.price          ?? null);
    const [shippingWeight  , setShippingWeight  ] = useState<number|null>(product.shippingWeight ?? null);
    const [stock           , setStock           ] = useState<number|null>(product.stock          ?? null);
    const [description     , setDescription     ] = useState<string>(product.description ?? '');
    
    
    
    // stores:
    const [updateProduct, {isLoading}] = useUpdateProduct();
    
    
    
    // refs:
    const firstEditorRef     = useRef<HTMLInputElement|null>(null);
    const editorContainerRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const [errorMessage   , setErrorMessage   ] = useState<React.ReactNode>(undefined);
    const [showWarnUnsaved, setShowWarnUnsaved] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleNameChange = useEvent((name: string) => {
        // conditions:
        if (isPathModified) return; // path is already modified by user, do not perform *auto* modify
        
        
        
        // sync path:
        setPath(
            name.trim().toLowerCase().replace(/(\s|_|-)+/ig, '-')
        );
    })
    const handleSave = useEvent(async () => {
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (editorContainerRef.current?.querySelector(':is(.invalidating, .invalidated)')) return;
        
        
        
        try {
            await updateProduct({
                _id    : product._id,
                
                visibility,
                name,
                path,
                price          : price          ?? undefined,
                shippingWeight : shippingWeight ?? undefined,
                stock          : stock          ?? undefined,
                description,
            }).unwrap();
            
            onClose();
        }
        catch (error: any) {
            const errorStatus = error?.status;
            setErrorMessage(<>
                <p>Oops, an error occured!</p>
                <p>We were unable to save data to the server.</p>
                {(errorStatus >= 400) && (errorStatus <= 499) && <p>
                    There was a <strong>problem contacting our server</strong>.<br />
                    Make sure your internet connection is available.
                </p>}
                {(errorStatus >= 500) && (errorStatus <= 599) && <p>
                    There was a <strong>problem on our server</strong>.<br />
                    The server may be busy or currently under maintenance.
                </p>}
                <p>
                    Please try again in a few minutes.
                </p>
            </>);
        } // try
    });
    const handleClosing = useEvent(() => {
        if (isModified || isPathModified) {
            setShowWarnUnsaved(true);
        }
        else {
            onClose();
        } // if
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
        }
    }, []);
    
    
    
    // jsx:
    return (
        <>
            <CardHeader
                // handlers:
                onKeyDown={handleKeyDown}
            >
                {name}
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
                    <AccessibilityProvider enabled={!isLoading}>
                        <ValidationProvider enableValidation={enableValidation}>
                            <span className='name label'>Name:</span>
                            <TextEditor           className='name editor'       value={name}           onChange={(value) => { setName(value); setIsModified(true); handleNameChange(value); }} />
                            
                            <span className='path label'>Path:</span>
                            <PathEditor           className='path editor'       value={path}           onChange={(value) => { setPath(value); setIsPathModified(true); }} homeUrl={STORE_WEBSITE_URL} />
                            
                            <span className='price label'>Price:</span>
                            <CurrencyEditor       className='price editor'      value={price}          onChange={(value) => { setPrice(value); setIsModified(true); }} currencySign={getCurrencySign()} currencyFraction={COMMERCE_CURRENCY_FRACTION_MAX} />
                            
                            <span className='sWeight label'>Shipping Weight:</span>
                            <ShippingWeightEditor className='sWeight editor'    value={shippingWeight} onChange={(value) => { setShippingWeight(value); setIsModified(true); }} />
                            
                            <span className='stock label'>Stock:</span>
                            <StockEditor          className='stock editor'      value={stock}          onChange={(value) => { setStock(value)     ; setIsModified(true); }} theme='secondary' />
                            
                            <span className='visibility label'>Visibility:</span>
                            <VisibilityEditor     className='visibility editor' value={visibility}     onChange={(value) => { setVisibility(value); setIsModified(true); }} theme='secondary' />
                        </ValidationProvider>
                    </AccessibilityProvider>
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
                    <ModalStatus
                        theme='warning'
                        backdropStyle='static'
                    >
                        {showWarnUnsaved && <>
                            <CardHeader>
                                Unsaved Data
                            </CardHeader>
                            <CardBody>
                                <p>
                                    Do you want to save the changes?
                                </p>
                            </CardBody>
                            <CardFooter>
                                <ButtonIcon theme='success' icon='save' onClick={() => {
                                    // close the dialog first:
                                    setShowWarnUnsaved(false);
                                    // then do a save (it will automatically close the editor after successfully saving):
                                    handleSave();
                                }}>
                                    Save
                                </ButtonIcon>
                                <ButtonIcon theme='danger' icon='cancel' onClick={() => {
                                    // close the dialog first:
                                    setShowWarnUnsaved(false);
                                    // then close the editor (without saving):
                                    onClose();
                                }}>
                                    Don&apos;t Save
                                </ButtonIcon>
                                <ButtonIcon theme='secondary' icon='edit' onClick={() => {
                                    // close the dialog:
                                    setShowWarnUnsaved(false);
                                }}>
                                    Continue Editing
                                </ButtonIcon>
                            </CardFooter>
                        </>}
                    </ModalStatus>
                </TabPanel>
                <TabPanel label={PAGE_PRODUCTS_TAB_IMAGES}>
                    <p>todo images</p>
                </TabPanel>
                <TabPanel label={PAGE_PRODUCTS_TAB_DESCRIPTION}>
                    <p>todo description</p>
                </TabPanel>
            </Tab>
            <CardFooter onKeyDown={handleKeyDown}>
                <ButtonIcon className='btnSave' icon={isLoading ? 'busy' : 'save'} theme='success' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' onClick={handleClosing}>Cancel</ButtonIcon>
            </CardFooter>
        </>
    );
}
