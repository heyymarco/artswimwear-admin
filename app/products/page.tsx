'use client'

import { default as React, useMemo } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import type { Metadata } from 'next'

import { Image } from '@heymarco/image'
import { ButtonIcon, InputProps, List, ListItem, ListItemProps, NavNextItem, NavPrevItem, Pagination, PaginationProps, Group, Label, Basic, CardBody, CardHeader, CardFooter, Button, CloseButton, Input, Generic, Icon } from '@reusable-ui/components';
import { ProductEntry, useGetProductList, useUpdateProduct } from '@/store/features/api/apiSlice';
import { useEffect, useRef, useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency, getCurrencySign } from '@/libs/formatters';
import { AccessibilityProvider, ValidationProvider, useEvent, useMergeRefs, useMergeStyles } from '@reusable-ui/core';
import { QuantityInput, QuantityInputProps } from '@heymarco/quantity-input'
import { ModalStatus } from '../../components/ModalStatus'

import { STORE_WEBSITE_URL, PAGE_PRODUCTS_TITLE, PAGE_PRODUCTS_DESCRIPTION, PAGE_PRODUCTS_STOCK_UNLIMITED, PAGE_PRODUCTS_STOCK_LIMITED, PAGE_PRODUCTS_VISIBILITY_DRAFT, PAGE_PRODUCTS_VISIBILITY_HIDDEN, PAGE_PRODUCTS_VISIBILITY_PUBLISHED, PAGE_PRODUCTS_TAB_INFORMATIONS, PAGE_PRODUCTS_TAB_DESCRIPTION, PAGE_PRODUCTS_TAB_IMAGES } from '@/website.config'
import { COMMERCE_CURRENCY_FRACTION_MAX } from '@/commerce.config'
import { EditButton } from '@/components/EditButton'
import { EditorProps } from '@/components/editors/Editor'
import { TextEditor } from '@/components/editors/TextEditor'
import { NumberEditorProps, NumberEditor } from '@/components/editors/NumberEditor'
import { PathEditor } from '@/components/editors/PathEditor'



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });



// utilities:
const getRealNumberOrNull = (number: number|null|undefined) => {
    if (number === undefined) return null;
    if (number === null)      return null;
    if (!isFinite(number))    return null;
    return number;
}



interface CurrencyEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        NumberEditorProps<TElement>
{
}
const CurrencyEditor = <TElement extends Element = HTMLSpanElement>(props: CurrencyEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        mainClass,
        classes,
        variantClasses,
        stateClasses,
        className,
        
        
        
        // styles:
        style,
    ...restNumberEditorProps} = props;
    
    
    
    // jsx:
    return (
        <Group
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // variants:
            size={size}
            theme={theme}
            gradient={gradient}
            outlined={outlined}
            mild={mild}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            <Label
                // classes:
                className='solid'
            >
                {getCurrencySign()}
            </Label>
            <NumberEditor<TElement>
                // other props:
                {...restNumberEditorProps}
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // classes:
                className='fluid'
                
                
                
                // validations:
                required={props.required ?? true}
                min={props.min ?? 0}
                step={1/(10 ** COMMERCE_CURRENCY_FRACTION_MAX)}
            />
        </Group>
    );
}

interface QuantityEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        NumberEditorProps<TElement>,
        Omit<QuantityInputProps<TElement>,
            |'onChange' // converted to TValue
        >
{
}
const QuantityEditor = <TElement extends Element = HTMLSpanElement>(props: QuantityEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,
        value,
        onChange,
        onChangeAsText,
        
        
        
        // components:
        decreaseButtonComponent,
        increaseButtonComponent,
        inputComponent,
        
        
        
        // children:
        childrenBeforeButton,
        childrenBeforeInput,
        childrenAfterInput,
        childrenAfterButton,
    ...restQuantityInputProps} = props;
    
    
    
    // handlers:
    const handleValueChange = (onChangeAsText || onChange) ? useEvent<React.ChangeEventHandler<HTMLInputElement>>(({target:{value, valueAsNumber}}) => {
        onChangeAsText?.(value);
        onChange?.(value ? valueAsNumber : null);
    }) : undefined;
    
    
    
    // jsx:
    return (
        <QuantityInput<TElement>
            // other props:
            {...restQuantityInputProps}
            
            
            
            // values:
            defaultValue = {defaultValue     }
            value        = {value            }
            onChange     = {handleValueChange}
            
            
            
            // components:
            decreaseButtonComponent = {decreaseButtonComponent}
            increaseButtonComponent = {increaseButtonComponent}
            inputComponent          = {inputComponent         }
            
            
            
            // children:
            childrenBeforeButton = {childrenBeforeButton}
            childrenBeforeInput  = {childrenBeforeInput }
            childrenAfterInput   = {childrenAfterInput  }
            childrenAfterButton  = {childrenAfterButton }
        />
    );
}

interface ShippingWeightEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        QuantityEditorProps<TElement>
{
}
const ShippingWeightEditor = <TElement extends Element = HTMLSpanElement>(props: ShippingWeightEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // components:
        inputComponent = (<Input<TElement> /> as React.ReactComponentElement<any, InputProps<TElement>>),
    ...restQuantityEditorProps} = props;
    
    
    
    // styles:
    const inputStyleInternal = useMemo<React.CSSProperties>(() => ({
        textAlign: 'end',
    }), []);
    const mergedInputStyle   = useMergeStyles(
        // values:
        inputStyleInternal,
        
        
        
        // preserves the original `style` from `inputComponent` (can overwrite the `inputStyleInternal`):
        inputComponent.props.style,
    );
    
    
    
    // jsx:
    return (
        <QuantityEditor<TElement>
            // other props:
            {...restQuantityEditorProps}
            
            
            
            // validations:
            step={props.step ?? 0.01}
            
            
            
            // components:
            inputComponent={React.cloneElement<InputProps<TElement>>(inputComponent,
                // props:
                {
                    // styles:
                    style : mergedInputStyle,
                },
            )}
            
            
            
            // children:
            childrenAfterInput={props.childrenAfterInput ?? <Label className='solid'>Kg</Label>}
        />
    );
}

interface StockEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        NumberEditorProps<TElement>
{
}
const StockEditor = <TElement extends Element = HTMLElement>(props: StockEditorProps<TElement>): JSX.Element|null => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // variants:
        size  = 'md',
        theme = 'secondary',
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        mainClass,
        classes,
        variantClasses,
        stateClasses,
        className,
        
        
        
        // styles:
        style,
        
        
        
        // values:
        defaultValue,
        value,
        onChange,
    ...restNumberEditorProps} = props;
    
    
    
    // states:
    const [selectedTabLimited, setSelectedTabLimited] = useState<boolean>(
        (value !== undefined)
        ? (typeof(value)        === 'number') /*controllable*/
        : (typeof(defaultValue) === 'number') /*uncontrollable*/
    );
    
    
    // refs:
    const numberEditorRefInternal = useRef<HTMLInputElement|null>(null);
    const numberInputRef = useMergeRefs(
        elmRef,
        numberEditorRefInternal,
    );
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        if (!selectedTabLimited) return;
        
        
        
        // actions:
        numberEditorRefInternal.current?.focus({ preventScroll: true });
    }, [selectedTabLimited]);
    
    
    
    // jsx:
    return (
        <Generic<TElement>
            // semantics:
            tag='div'
            
            
            
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            <List
                // variants:
                size={size}
                theme={theme}
                gradient={gradient}
                outlined={outlined}
                mild={mild}
                
                listStyle='tab'
                orientation='inline'
                
                
                
                // behaviors:
                actionCtrl={true}
            >
                {['unlimited', 'limited'].map((option) =>
                    <ListItem key={option}
                        // accessibilities:
                        active={selectedTabLimited === (option === 'limited')}
                        
                        
                        
                        // handlers:
                        onClick={() => {
                            const isSelectedTabLimited = (option === 'limited');
                            setSelectedTabLimited(isSelectedTabLimited);
                            
                            onChange?.(
                                isSelectedTabLimited
                                ? (getRealNumberOrNull(numberEditorRefInternal.current?.valueAsNumber) ?? 0)
                                : null
                            );
                        }}
                    >
                        {{
                            unlimited : PAGE_PRODUCTS_STOCK_UNLIMITED,
                            limited   : PAGE_PRODUCTS_STOCK_LIMITED,
                        }[option]}
                    </ListItem>
                )}
            </List>
            <Basic
                // variants:
                size={
                    (size === 'sm')
                    ? 'md'
                    : (size === 'md')
                    ? 'lg'
                    : size
                }
                theme={
                    (theme === 'secondary')
                    ? 'secondary'
                    : (theme === 'primary')
                    ? 'primary'
                    : theme
                }
                gradient={gradient}
                outlined={outlined}
                mild={mild}
                
                
                
                // classes:
                className={styles.editorTabBody}
            >
                <p className={!selectedTabLimited ? undefined : 'hidden'}>
                    The product stock is <em>always available</em>.
                </p>
                <Group
                    // variants:
                    size={size}
                    theme={
                        (theme === 'secondary')
                        ? 'primary'
                        : (theme === 'primary')
                        ? 'secondary'
                        : theme
                    }
                    gradient={gradient}
                    outlined={outlined}
                    mild={mild}
                    
                    
                    
                    // classes:
                    className={selectedTabLimited ? undefined : 'hidden'}
                >
                    <Label className='solid'>
                        Current stock:
                    </Label>
                    <NumberEditor<TElement>
                        // other props:
                        {...restNumberEditorProps}
                        
                        
                        
                        // refs:
                        elmRef={numberInputRef}
                        
                        
                        
                        // classes:
                        className='fluid'
                        
                        
                        
                        // values:
                        defaultValue={value ?? defaultValue} // force as UNCONTROLLED, so the last value when switching tab back & forth is NOT LOST
                        onChange={onChange}
                        
                        
                        
                        // validations:
                        isValid={props.isValid ?? (selectedTabLimited ? undefined : true)}
                        required={props.required ?? true}
                        min={props.min ?? 0   }
                        max={props.max ?? 9999}
                    />
                </Group>
            </Basic>
        </Generic>
    );
}

type ProductVisibility = 'published'|'hidden'|'draft'
interface VisibilityEditorProps<TElement extends Element = HTMLElement>
    extends
        EditorProps<TElement, ProductVisibility>
{
}
const VisibilityEditor = <TElement extends Element = HTMLElement>(props: VisibilityEditorProps<TElement>): JSX.Element|null => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // variants:
        size  = 'md',
        theme = 'secondary',
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        mainClass,
        classes,
        variantClasses,
        stateClasses,
        className,
        
        
        
        // styles:
        style,
        
        
        
        // values:
        defaultValue,
        value = defaultValue,
        onChange,
    ...restEditorProps} = props;
    type T1 = typeof restEditorProps
    type T2 = Omit<T1, keyof HTMLElement>
    
    
    
    // jsx:
    return (
        <Generic
            // semantics:
            tag='div'
            
            
            
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            <List
                // variants:
                size={size}
                theme={theme}
                gradient={gradient}
                outlined={outlined}
                mild={mild}
                
                listStyle='tab'
                orientation='inline'
                
                
                
                // behaviors:
                actionCtrl={true}
            >
                {(['published', 'hidden', 'draft'] as ProductVisibility[]).map((option) =>
                    <ListItem key={option}
                        // accessibilities:
                        active={value === option}
                        
                        
                        
                        // handlers:
                        onClick={() => onChange?.(option)}
                    >
                        {{
                            published : PAGE_PRODUCTS_VISIBILITY_PUBLISHED,
                            hidden    : PAGE_PRODUCTS_VISIBILITY_HIDDEN,
                            draft     : PAGE_PRODUCTS_VISIBILITY_DRAFT,
                        }[option]}
                    </ListItem>
                )}
            </List>
            <Basic
                // variants:
                size={
                    (size === 'sm')
                    ? 'md'
                    : (size === 'md')
                    ? 'lg'
                    : size
                }
                theme={
                    (theme === 'secondary')
                    ? 'secondary'
                    : (theme === 'primary')
                    ? 'primary'
                    : theme
                }
                gradient={gradient}
                outlined={outlined}
                mild={mild}
                
                
                
                // classes:
                className={styles.editorTabBody}
            >
                <p className={(value === 'published') ? undefined : 'hidden'}>The product is <em>shown</em> on the webiste.</p>
                <p className={(value === 'hidden'   ) ? undefined : 'hidden'}>The product can only be viewed via <em>a (bookmarked) link</em>.</p>
                <p className={(value === 'draft'    ) ? undefined : 'hidden'}>The product <em>cannot be viewed</em> on the entire website.</p>
            </Basic>
        </Generic>
    );
}



interface SimpleEditDialogProps<TValue> {
    // data:
    product         : ProductEntry
    edit            : Exclude<keyof ProductEntry, '_id'>
    
    
    
    // components:
    editorComponent : React.ReactComponentElement<any, EditorProps<Element, TValue>>
    
    
    
    // handlers:
    onClose         : () => void
}
const SimpleEditDialog = <TValue,>(props: SimpleEditDialogProps<TValue>) => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        product,
        edit,
        
        
        
        // components:
        editorComponent,
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // states:
    const [isModified      , setIsModified      ] = useState<boolean>(false);
    
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [editorValue     , setEditorValue     ] = useState<any>(product[edit]);
    
    
    
    // stores:
    const [updateProduct, {isLoading}] = useUpdateProduct();
    
    
    
    // refs:
    const editorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // dialogs:
    const [errorMessage   , setErrorMessage   ] = useState<React.ReactNode>(undefined);
    const [showWarnUnsaved, setShowWarnUnsaved] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleSave = useEvent(async () => {
        setEnableValidation(true);
        await new Promise<void>((resolve) => { // wait for a validation state applied
            setTimeout(() => {
                setTimeout(() => {
                    resolve();
                }, 0);
            }, 0);
        });
        if (editorRef.current?.parentElement?.matches(':is(.invalidating, .invalidated)')) return;
        
        
        
        try {
            await updateProduct({
                _id    : product._id,
                
                [edit] : editorValue,
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
        if (isModified) {
            setShowWarnUnsaved(true);
        }
        else {
            onClose();
        } // if
    });
    const handleKeyDown : React.KeyboardEventHandler<HTMLElement> = useEvent((event) => {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                handleSave();
                break;
            
            case 'Escape':
                event.preventDefault();
                handleClosing();
                break;
        } // switch
    });
    
    
    
    // dom effects:
    useEffect(() => {
        // setups:
        const cancelFocus = setTimeout(() => {
            // conditions:
            const editorElm = editorRef.current;
            if (!editorElm) return;
            
            
            
            const originType = editorElm.type;
            try {
                if (originType !== 'text') editorElm.type = 'text';
                editorElm.setSelectionRange(0, -1);
            }
            finally {
                if (originType !== 'text') editorElm.type = originType;
            } // try
            editorElm.focus({ preventScroll: true });
        }, 0);
        
        
        
        // cleanups:
        return () => {
            clearTimeout(cancelFocus);
        }
    }, []);
    
    
    
    // jsx:
    return (
        <CardBody className={styles.simpleEditor} onKeyDown={handleKeyDown}>
            <AccessibilityProvider enabled={!isLoading}>
                {React.cloneElement(editorComponent,
                    // props:
                    {
                        elmRef           : editorRef,
                        
                        
                        
                        size             : 'sm',
                        
                        
                        
                        className        : 'editor',
                        
                        
                        
                        value            : editorValue,
                        onChange         : (value: TValue) => { setEditorValue(value); setIsModified(true); },
                        
                        
                        
                        enableValidation : enableValidation,
                    },
                )}
                <ButtonIcon className='btnSave' icon={isLoading ? 'busy' : 'save'} theme='success' size='sm' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' size='sm' onClick={handleClosing}>Cancel</ButtonIcon>
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
        </CardBody>
    );
}



interface FullEditDialogProps {
    // data:
    product          : ProductEntry
    
    
    
    // handlers:
    onClose          : () => void
}
const FullEditDialog = (props: FullEditDialogProps) => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        product,
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // states:
    const [activeTab       , setActiveTab       ] = useState<string>('informations');
    
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
            <List
                // variants:
                listStyle='flat'
                orientation='inline'
                
                
                
                // behaviors:
                actionCtrl={true}
                
                
                
                // handlers:
                onKeyDown={handleKeyDown}
            >
                {['informations', 'images', 'description'].map((option) =>
                    <ListItem key={option}
                        // accessibilities:
                        active={activeTab === option}
                        
                        
                        
                        // handlers:
                        onClick={() => setActiveTab(option)}
                    >
                        {{
                            informations : PAGE_PRODUCTS_TAB_INFORMATIONS,
                            images       : PAGE_PRODUCTS_TAB_IMAGES,
                            description  : PAGE_PRODUCTS_TAB_DESCRIPTION,
                        }[option]}
                    </ListItem>
                )}
            </List>
            <CardBody className={styles.fullEditor} onKeyDown={handleKeyDown}>
                <AccessibilityProvider enabled={!isLoading}>
                    <ValidationProvider enableValidation={enableValidation}>
                        <span className='name label'>Name:</span>
                        <TextEditor           className='name editor'       value={name}           onChange={(value) => { setName(value); setIsModified(true); handleNameChange(value); }} />
                        
                        <span className='path label'>Path:</span>
                        <PathEditor           className='path editor'       value={path}           onChange={(value) => { setPath(value); setIsPathModified(true); }} homeUrl={STORE_WEBSITE_URL} />
                        
                        <span className='price label'>Price:</span>
                        <CurrencyEditor       className='price editor'      value={price}          onChange={(value) => { setPrice(getRealNumberOrNull(value)); setIsModified(true); }} />
                        
                        <span className='sWeight label'>Shipping Weight:</span>
                        <ShippingWeightEditor className='sWeight editor'    value={shippingWeight} onChange={(value) => { setShippingWeight(getRealNumberOrNull(value)); setIsModified(true); }} />
                        
                        <span className='stock label'>Stock:</span>
                        <StockEditor          className='stock editor'      value={stock}          onChange={(value) => { setStock(value); setIsModified(true); }} />
                        
                        <span className='visibility label'>Visibility:</span>
                        <VisibilityEditor     className='visibility editor' value={visibility}     onChange={(value) => { setVisibility(value); setIsModified(true); }} />
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
            </CardBody>
            <CardFooter onKeyDown={handleKeyDown}>
                <ButtonIcon className='btnSave' icon={isLoading ? 'busy' : 'save'} theme='success' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' onClick={handleClosing}>Cancel</ButtonIcon>
            </CardFooter>
        </>
    );
}



interface ProductItemProps extends ListItemProps {
    product: ProductEntry
}
const ProductItem = (props: ProductItemProps) => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    const {
        product,
    ...restListItem} = props;
    const {
        visibility,
        name,
        images,
        price,
        stock,
    } = product;
    
    
    
    // states:
    type EditMode = Exclude<keyof ProductEntry, '_id'|'image'>|'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const handleEditDialogClose = useEvent((): void => {
        setEditMode(null);
    });
    
    
    
    // jsx:
    return (
        <ListItem {...restListItem} elmRef={listItemRef} className={styles.productItem}>
            <div className={styles.productItemLayout}>
                <div className='prodImg'>
                    <Image
                        alt={name ?? ''}
                        src={images?.[0] ? `/products/${name}/${images[0]}` : undefined}
                        sizes='96px'
                    />
                    <EditButton onClick={() => setEditMode('full')} />
                </div>
                
                <h3 className='name'>
                    {name}
                    <EditButton onClick={() => setEditMode('name')} />
                </h3>
                <p className='price'>
                    <strong className='value'>{formatCurrency(price)}</strong>
                    <EditButton onClick={() => setEditMode('price')} />
                </p>
                <p className='stock'>
                    Stock: <strong className='value'>{stock ?? 'unlimited'}</strong>
                    <EditButton onClick={() => setEditMode('stock')} />
                </p>
                <p className='visibility'>
                    Visibility: <strong className='value'>{visibility}</strong>
                    <EditButton onClick={() => setEditMode('visibility')} />
                </p>
                <p className='fullEditor'>
                    <EditButton buttonStyle='regular' onClick={() => setEditMode('full')}>
                        Open full editor
                    </EditButton>
                </p>
            </div>
            <ModalStatus modalViewport={listItemRef} backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode !== 'full') && <>
                    {(editMode === 'name'      ) && <SimpleEditDialog product={product} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor       required={true } />} />}
                    {(editMode === 'price'     ) && <SimpleEditDialog product={product} edit={editMode} onClose={handleEditDialogClose} editorComponent={<CurrencyEditor                    />} />}
                    {(editMode === 'stock'     ) && <SimpleEditDialog product={product} edit={editMode} onClose={handleEditDialogClose} editorComponent={<StockEditor                       />} />}
                    {(editMode === 'visibility') && <SimpleEditDialog product={product} edit={editMode} onClose={handleEditDialogClose} editorComponent={<VisibilityEditor                  />} />}
                </>}
            </ModalStatus>
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode === 'full') && <FullEditDialog product={product} onClose={handleEditDialogClose} />}
            </ModalStatus>
        </ListItem>
    );
}
export default function Products() {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // stores:
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(5);
    const {data: products, isLoading, isFetching, isError, refetch } = useGetProductList({ page, perPage });
    const isErrorNoData  = isError && !products;
    const pages = Math.ceil((products?.total ?? 0) / perPage);
    
    
    
    // refs:
    const [productListRef, setProductListRef] = useState<HTMLElement|null>(null);
    
    
    
    // jsx:
    const ProductPagination = (props: PaginationProps) => (
        <Pagination
            {...props}
            theme={props.theme ?? 'primary'}
            size={props.size ?? 'sm'}
            itemsLimit={props.itemsLimit ?? 20}
            
            prevItems={
                <NavPrevItem
                    onClick={() => setPage(1)}
                />
            }
            nextItems={
                <NavNextItem
                    onClick={() => setPage(pages)}
                />
            }
        >
            {(isLoading || isErrorNoData) && <ListItem nude={true}><LoadingBar className={styles.paginationLoading}
                nude={true}
                running={isLoading}
                theme={isErrorNoData ? 'danger' : undefined}
            /></ListItem>}
            
            {[...Array(pages)].map((_, index) =>
                <ListItem
                    key={index}
                    
                    active={(index + 1) === page}
                    onClick={() => setPage(index + 1)}
                >
                    {index + 1}
                </ListItem>
            )}
        </Pagination>
    );
    return (
        <Main className={styles.page} title='Products'>
            <Section className={`fill-self ${styles.toolbox}`}>
                <p>
                    toolbox
                </p>
            </Section>
            <Section className={`fill-self ${styles.products}`}>
                <ProductPagination className={styles.paginTop} />
                <Basic<HTMLElement> className={styles.productList} theme='primary' mild={true} elmRef={setProductListRef}>
                    <ModalStatus className={styles.productFetching} modalViewport={productListRef}>
                        {(isFetching || isError) && <CardBody>
                            {isFetching && <>
                                <p>Retrieving data from the server. Please wait...</p>
                                <LoadingBar className='loadingBar' />
                            </>}
                            
                            {isError && <>
                                <h3>Oops, an error occured!</h3>
                                <p>We were unable to retrieve data from the server.</p>
                                <ButtonIcon icon='refresh' onClick={refetch}>
                                    Retry
                                </ButtonIcon>
                            </>}
                        </CardBody>}
                    </ModalStatus>
                    
                    {!!products && <List listStyle='flush' className={styles.productListInner}>
                        {Object.values(products?.entities).filter((product): product is Exclude<typeof product, undefined> => !!product).map((product, index) =>
                            <ProductItem key={product._id ?? (`${page}-${index}`)} product={product} />
                        )}
                    </List>}
                </Basic>
                <ProductPagination className={styles.paginBtm} />
            </Section>
        </Main>
    )
}



export const metadata : Metadata = {
    title       : PAGE_PRODUCTS_TITLE,
    description : PAGE_PRODUCTS_DESCRIPTION,
};
