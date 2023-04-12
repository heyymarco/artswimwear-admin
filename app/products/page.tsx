'use client'

import { default as React } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import { Image } from '@heymarco/image'
import { ButtonIcon, ButtonIconProps, InputProps, List, ListItem, ListItemProps, NavNextItem, NavPrevItem, Pagination, PaginationProps, TextInput, NumberInput, Group, Label, Basic, Content, CardBody, CardHeader, CardFooter, Button, CloseButton, Badge } from '@reusable-ui/components';
import { ProductEntry, useGetProductList, useUpdateProduct } from '@/store/features/api/apiSlice';
import { useEffect, useRef, useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency, getCurrencySign } from '@/libs/formatters';
import { AccessibilityProvider, useEvent, useMergeRefs } from '@reusable-ui/core';
import { QuantityInput, QuantityInputProps } from '@heymarco/quantity-input'
import { ModalStatus } from '../../components/ModalStatus'
import { ModalUi } from '../../components/ModalUi'



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'products-pcyfaeow8d' });



const EditButton = (props: ButtonIconProps) => {
    return (
        <ButtonIcon
            {...props}
            className={props.className ?? 'edit'}
            icon={props.icon ?? 'edit'}
            theme={props.theme ?? 'primary'}
            size={props.size ?? 'xs'}
            buttonStyle={props.buttonStyle ?? 'link'}
            title={props.title ?? 'edit'}
        />
    );
}

type CustomEditor = React.ReactComponentElement<any, Omit<InputProps<HTMLElement>, 'value'|'onChange'> & { value?: any, onChange?: (value: any) => void }>
const TextEditor = (props: CustomEditor['props']): CustomEditor['type'] => {
    // rest props:
    const {
        // values:
        value,
        onChange,
    ...restTextEditorProps} = props;
    
    
    
    return (
        <TextInput
            // other props:
            {...restTextEditorProps}
            
            
            
            // values:
            value={value ?? ''}
            onChange={(event) => onChange?.(event.target.value)}
        />
    );
}
const NumberEditor = (props: CustomEditor['props']): CustomEditor['type'] => {
    // rest props:
    const {
        // values:
        value,
        onChange,
    ...restTextEditorProps} = props;
    
    
    
    return (
        <NumberInput
            // other props:
            {...restTextEditorProps}
            
            
            
            // values:
            value={value ?? NaN}
            onChange={(event) => onChange?.(event.target.valueAsNumber)}
        />
    );
}
const CurrencyEditor = (props: CustomEditor['props']): CustomEditor['type'] => {
    // rest props:
    const {
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        className,
        
        
        
        // values:
        value,
        onChange,
    ...restTextEditorProps} = props;
    
    
    
    return (
        <Group
            // variants:
            size={size}
            theme={theme}
            gradient={gradient}
            outlined={outlined}
            mild={mild}
            
            
            
            // classes:
            className={className}
        >
            <Label
                // classes:
                className='solid'
            >
                {getCurrencySign()}
            </Label>
            <NumberInput
                // other props:
                {...restTextEditorProps}
                
                
                
                // classes:
                className='fluid'
                
                
                
                // values:
                value={value ?? NaN}
                onChange={(event) => onChange?.(event.target.valueAsNumber)}
                
                
                
                // validations:
                required={props.required ?? true}
                min={props.min ?? 0}
            />
        </Group>
    );
}
interface StockEditorProps
    extends
        Omit<CustomEditor['props'],
            // validations:
            |'minLength'|'maxLength' // text length constraint is not supported
            |'pattern'               // text regex is not supported
            |'min'|'max'|'step'      // only supports numeric value
        >,
        Omit<QuantityInputProps,
            // values:
            |'defaultValue'|'value'  // only supports numeric value
            
            
            
            // handlers:
            |'value'|'onChange'      // custom value
        >
{
}
const StockEditor = (props: StockEditorProps): CustomEditor['type'] => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        
        
        
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        className,
        
        
        
        // values:
        value,
        onChange,
    ...restTextEditorProps} = props;
    
    
    
    // states:
    const [selectedTabLimited, setSelectedTabLimited] = useState<boolean>(typeof(value) === 'number');
    
    
    
    // refs:
    const numberInputRefInternal = useRef<HTMLInputElement|null>(null);
    const numberInputRef = useMergeRefs(
        elmRef,
        numberInputRefInternal,
    );
    
    
    
    // utilities:
    const getRealNumberOrNull = (number: number|null|undefined) => {
        if (number === undefined) return null;
        if (number === null)      return null;
        if (!isFinite(number))    return null;
        return number;
    }
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        if (!selectedTabLimited) return;
        
        
        
        // actions:
        numberInputRefInternal.current?.focus({ preventScroll: true });
    }, [selectedTabLimited]);
    
    
    
    // jsx:
    return (
        <div
            // classes:
            className={className}
        >
            <List
                // variants:
                size={size}
                theme={theme ?? 'secondary'}
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
                                ? (getRealNumberOrNull(numberInputRefInternal.current?.valueAsNumber) ?? 0)
                                : null
                            );
                        }}
                    >
                        {option}
                    </ListItem>
                )}
            </List>
            <Basic
                // variants:
                size='md'
                theme={theme ?? 'secondary'}
                gradient={gradient}
                outlined={outlined}
                mild={mild}
                
                
                
                // classes:
                className={styles.editorTabBody}
            >
                <p     className={!selectedTabLimited ? undefined : 'hidden'}>The product stock is <em>always available</em>.</p>
                <Group
                    // variants:
                    size={size}
                    theme={theme ?? 'primary'}
                    gradient={gradient}
                    outlined={outlined}
                    mild={mild}
                    
                    
                    
                    // classes:
                    className={ selectedTabLimited ? undefined : 'hidden'}
                >
                    <Label className='solid'>
                        Current stock:
                    </Label>
                    <QuantityInput
                        // other props:
                        {...restTextEditorProps}
                        
                        
                        
                        // refs:
                        elmRef={numberInputRef}
                        
                        
                        
                        // values:
                        defaultValue={value ?? 0}
                        onChange={({target: {valueAsNumber}}) => onChange?.(getRealNumberOrNull(valueAsNumber) ?? 0)}
                        
                        
                        
                        // validations:
                        isValid={selectedTabLimited ? undefined : true }
                        required={props.required ?? true}
                        min={props.min ?? 0   }
                        max={props.max ?? 9999}
                    />
                </Group>
            </Basic>
        </div>
    );
}
const VisibilityEditor = (props: CustomEditor['props']): CustomEditor['type'] => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        className,
        
        
        
        // values:
        value,
        onChange,
    } = props;
    
    
    
    // jsx:
    return (
        <div
            // classes:
            className={className}
        >
            <List
                // variants:
                size={size}
                theme={theme ?? 'secondary'}
                gradient={gradient}
                outlined={outlined}
                mild={mild}
                listStyle='tab'
                orientation='inline'
                
                
                
                // behaviors:
                actionCtrl={true}
            >
                {['published', 'hidden', 'draft'].map((option) =>
                    <ListItem key={option}
                        // accessibilities:
                        active={value === option}
                        
                        
                        
                        // handlers:
                        onClick={() => onChange?.(option)}
                    >
                        {option}
                    </ListItem>
                )}
            </List>
            <Basic
                // variants:
                size='md'
                theme={theme ?? 'secondary'}
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
        </div>
    );
}



interface SimpleEditDialogProps {
    // data:
    product          : ProductEntry
    edit             : Exclude<keyof ProductEntry, '_id'>
    
    
    
    // components:
    editorComponent ?: CustomEditor
    
    
    
    // handlers:
    onClose          : () => void
}
const SimpleEditDialog = (props: SimpleEditDialogProps) => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        product,
        edit,
        
        
        
        // components:
        editorComponent = (<TextInput /> as CustomEditor),
        
        
        
        
        // handlers:
        onClose,
    } = props;
    
    
    
    // states:
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    const [editorValue, setEditorValue] = useState<any>(product[edit]);
    
    
    
    // stores:
    const [updateProduct, {isLoading}] = useUpdateProduct();
    
    
    
    // refs:
    const editorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // dialogs:
    const [errorMessage, setErrorMessage] = useState<React.ReactNode>(undefined);
    
    
    
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
    const handleKeyDown : React.KeyboardEventHandler<HTMLElement> = useEvent((event) => {
        if (event.key === 'Enter') handleSave();
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
                editorElm.type = 'text';
                editorElm.setSelectionRange(0, -1);
            }
            finally {
                editorElm.type = originType;
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
                        onChange         : (value: any) => setEditorValue(value),
                        
                        
                        
                        enableValidation : enableValidation,
                    },
                )}
                <ButtonIcon className='btnSave' icon={isLoading ? 'busy' : 'save'} theme='success' size='sm' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' size='sm' onClick={onClose}>Cancel</ButtonIcon>
            </AccessibilityProvider>
            <ModalStatus
                theme='danger'
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
        </CardBody>
    );
}



interface CompleteEditDialogProps {
    // data:
    product          : ProductEntry
    
    
    
    // handlers:
    onClose          : () => void
}
const CompleteEditDialog = (props: CompleteEditDialogProps) => {
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
    const [enableValidation, setEnableValidation] = useState<boolean>(false);
    
    
    
    // stores:
    const [updateProduct, {isLoading}] = useUpdateProduct();
    
    
    
    // refs:
    // const editorRef = useRef<HTMLInputElement|null>(null);
    
    
    
    // dialogs:
    const [errorMessage, setErrorMessage] = useState<React.ReactNode>(undefined);
    
    
    
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
        // if (editorRef.current?.parentElement?.matches(':is(.invalidating, .invalidated)')) return;
        
        
        
        try {
            // await updateProduct({
            //     _id    : product._id,
            //     [edit] : editorValue,
            // }).unwrap();
            
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
    const handleClose : React.MouseEventHandler<HTMLButtonElement> = useEvent((event) => {
        onClose?.();
    });
    
    
    
    // jsx:
    return (
        <>
            <CardHeader>
                {product.name}
                <CloseButton onClick={handleClose} />
            </CardHeader>
            <CardBody className={styles.fullEditor}>
                <AccessibilityProvider enabled={!isLoading}>
                    <span className='name label'>Name:</span>
                    <TextEditor className='name editor' />
                    
                    <span className='path label'>Path:</span>
                    <TextEditor className='path editor' />
                    
                    <span className='price label'>Price:</span>
                    <CurrencyEditor className='price editor' />
                    
                    <span className='sWeight label'>Shipping Weight:</span>
                    <QuantityInput className='sWeight editor' />
                    
                    <span className='stock label'>Stock:</span>
                    <StockEditor className='stock editor' />
                    
                    <span className='visibility label'>Visibility:</span>
                    <VisibilityEditor className='visibility editor' />
                </AccessibilityProvider>
                <ModalStatus
                    theme='danger'
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
            </CardBody>
            <CardFooter>
                <ButtonIcon className='btnSave' icon={isLoading ? 'busy' : 'save'} theme='success' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' onClick={onClose}>Cancel</ButtonIcon>
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
        image,
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
                        src={image ? `/products/${name}/${image}` : undefined}
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
                {!!editMode && (editMode === 'full') && <CompleteEditDialog product={product} onClose={handleEditDialogClose} />}
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
