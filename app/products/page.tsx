'use client'

import { default as React, useLayoutEffect, useMemo } from 'react'
import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import { Image } from '@heymarco/image'
import { ButtonIcon, ButtonIconProps, CardBody, InputProps, List, ListItem, ListItemProps, ModalCard, NavNextItem, NavPrevItem, Pagination, PaginationProps, TextInput, NumberInput, Group, Label, Basic, Content, Modal } from '@reusable-ui/components';
import { ProductEntry, useGetProductList, useUpdateProduct } from '@/store/features/api/apiSlice';
import { useEffect, useRef, useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency, getCurrencySign } from '@/libs/formatters';
import { AccessibilityProvider, useEvent, useMergeRefs } from '@reusable-ui/core';
import { QuantityInput, QuantityInputProps } from '@heymarco/quantity-input'



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
        // classes:
        className,
        
        
        
        // values:
        value,
        onChange,
    ...restTextEditorProps} = props;
    
    
    
    return (
        <Group
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
    
    
    
    // jsx:
    return (
        <div
            // classes:
            className={className}
        >
            <List
                // variants:
                theme='secondary'
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
            <Basic theme='secondary' className={styles.editorTabBody}>
                <p     className={!selectedTabLimited ? undefined : 'hidden'}>The product stock is <em>always available</em>.</p>
                <Group className={ selectedTabLimited ? undefined : 'hidden'} theme='primary'>
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
                theme='secondary'
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
            <Basic theme='secondary' className={styles.editorTabBody}>
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
        catch (error) {
            console.log('error: ', error);
        } // try
    });
    const handleKeyDown : React.KeyboardEventHandler<HTMLElement> = useEvent((event) => {
        if (event.key === 'Enter') handleSave();
    })
    
    
    
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
                        
                        
                        
                        className        : 'editor',
                        
                        
                        
                        value            : editorValue,
                        onChange         : (value: any) => setEditorValue(value),
                        
                        
                        
                        enableValidation : enableValidation,
                    },
                )}
                <ButtonIcon className='btnSave' icon={isLoading ? 'busy' : 'save'} theme='success' onClick={handleSave}>Save</ButtonIcon>
                <ButtonIcon className='btnCancel' icon='cancel' theme='danger' onClick={onClose}>Cancel</ButtonIcon>
            </AccessibilityProvider>
        </CardBody>
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
    type EditMode = Exclude<keyof ProductEntry, '_id'|'image'>
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    // for nicely modal collapsing animation -- the JSX is still *residual* even if the modal is *collapsing*:
    const newDynamicEditDialog = useMemo((): React.ReactNode => {
        // jsx:
        const uniqueKey = Date.now(); // generate a unique key every time the editMode changes
        switch (editMode) {
            /*
                NOTE:
                The `key` of `<SimpleEditDialog>` is IMPORTANT in order to React know the `{dynamicEditDialog.current}` was replaced with another <SimpleEditDialog>.
            */
            case 'name':
                return (
                    <SimpleEditDialog key={uniqueKey} product={product} edit={editMode} onClose={() => setEditMode(null)} editorComponent={<TextEditor       required={true } />} />
                );
            case 'price':
                return (
                    <SimpleEditDialog key={uniqueKey} product={product} edit={editMode} onClose={() => setEditMode(null)} editorComponent={<CurrencyEditor                    />} />
                );
            case 'stock':
                return (
                    <SimpleEditDialog key={uniqueKey} product={product} edit={editMode} onClose={() => setEditMode(null)} editorComponent={<StockEditor                       />} />
                );
            case 'visibility':
                return (
                    <SimpleEditDialog key={uniqueKey} product={product} edit={editMode} onClose={() => setEditMode(null)} editorComponent={<VisibilityEditor                  />} />
                );
            default:
                return undefined;
        } // switch
    }, [editMode]);
    const dynamicEditDialog = useRef<React.ReactNode>(newDynamicEditDialog);
    if (newDynamicEditDialog !== undefined) dynamicEditDialog.current = newDynamicEditDialog;
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <ListItem {...restListItem} elmRef={listItemRef} className={styles.productItem}>
            <Image
                className='prodImg'
                
                alt={name ?? ''}
                src={image ? `/products/${name}/${image}` : undefined}
                sizes='96px'
            />
            
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
            <ModalCard modalViewport={listItemRef} expanded={!!editMode} onExpandedChange={({expanded}) => !expanded && setEditMode(null)} backdropStyle='static'>
                {dynamicEditDialog.current}
            </ModalCard>
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
    // for nicely modal collapsing animation -- the JSX is still *residual* even if the modal is *collapsing*:
    const dynamicLoadingMessage = useRef<React.ReactNode>(null);
    /*
        NOTE:
        The `key` of `<React.Fragment>` is NOT_NEEDED because there's no `props` other than `children`.
    */
    if (isFetching) {
        dynamicLoadingMessage.current = <>
            <p>Retrieving data from the server. Please wait...</p>
            <LoadingBar className='loadingBar' />
        </>;
    }
    else if (isError) {
        dynamicLoadingMessage.current = <>
            <h3>Oops, an error occured!</h3>
            <p>We were unable to retrieve data from the server.</p>
            <ButtonIcon icon='refresh' onClick={refetch}>
                Retry
            </ButtonIcon>
        </>;
    } // if
    
    
    
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
                    <Modal expanded={isFetching || isError} modalViewport={productListRef}>
                        <Content tag='article' className={styles.productFetching}>
                            {dynamicLoadingMessage.current}
                        </Content>
                    </Modal>
                    
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
