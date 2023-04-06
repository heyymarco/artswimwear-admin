'use client'

import { dynamicStyleSheets } from '@cssfn/cssfn-react'

import { Section, Main } from '@heymarco/section'

import { Image } from '@heymarco/image'
import { ButtonIcon, ButtonIconProps, CardBody, List, ListItem, ListItemProps, ModalCard, NavNextItem, NavPrevItem, Pagination, PaginationProps, TextInput } from '@reusable-ui/components';
import { ProductEntry, useGetProductList, useUpdateProduct } from '@/store/features/api/apiSlice';
import { useEffect, useRef, useState } from 'react';
import { LoadingBar } from '@heymarco/loading-bar'
import { formatCurrency } from '@/libs/formatters';
import { AccessibilityProvider, useEvent } from '@reusable-ui/core';



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
interface SimpleEditorProps {
    product  : ProductEntry
    edit     : Exclude<keyof ProductEntry, '_id'>
    type     : 'text'|'number'
    required : boolean
    onClose  : () => void
}
const SimpleEditor = ({product, edit, type, required, onClose}: SimpleEditorProps) => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // states:
    const [editorValue, setEditorValue] = useState(product[edit]);
    
    
    
    // stores:
    const [updateProduct, {isLoading}] = useUpdateProduct();
    
    
    
    // handlers:
    const handleEditorChange : React.ChangeEventHandler<HTMLInputElement> = useEvent((event) => {
        setEditorValue((type === 'number') ? event.target.valueAsNumber : event.target.value);
    });
    const handleSave = useEvent(async () => {
        try {
            await updateProduct({
                _id: product._id,
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
    const editorRef = useRef<HTMLInputElement|null>(null);
    useEffect(() => {
        // setups:
        const cancelFocus = setTimeout(() => {
            editorRef.current?.setSelectionRange(0, -1);
            editorRef.current?.focus({ preventScroll: true });
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
                <TextInput className='editor' type={type} value={editorValue} onChange={handleEditorChange} enableValidation={true} required={required} elmRef={editorRef} />
                <ButtonIcon className='btnSave' icon='save' theme='success' onClick={handleSave}>Save</ButtonIcon>
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
        name,
        image,
        price,
        stock,
    } = product;
    
    
    
    // states:
    type EditMode = 'name'|'price'|'stock'|'visibility'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
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
                Visibility:
                <EditButton onClick={() => setEditMode('visibility')} />
            </p>
            <ModalCard modalViewport={listItemRef} expanded={!!editMode} onExpandedChange={({expanded}) => !expanded && setEditMode(null)} lazy={true} backdropStyle='static'>
                {(editMode === 'name') && <SimpleEditor product={product} type='text' edit='name' required onClose={() => setEditMode(null)} />}
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
    const {data: products, isError, isLoading, isFetching } = useGetProductList({ page, perPage });
    const pages = Math.ceil((products?.total ?? 0) / perPage);
    
    
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
            {(isLoading || isError) && <ListItem nude={true}><LoadingBar className={styles.paginationLoading}
                nude={true}
                running={isLoading}
                theme={isError ? 'danger' : undefined}
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
        <Main nude={true}>
            <Section className={styles.toolbox}>
                <p>
                    toolbox
                </p>
            </Section>
            <Section title='Products' className={styles.products}>
                <ProductPagination className='pagin-top' />
                <List className='product-list' theme='primary' enabled={!products || !isFetching} listStyle={(isLoading || isError) ? 'content' : undefined}>
                    {(isLoading || isError) && <ListItem>
                        {isLoading && <LoadingBar />}
                        {isError && <p>Oops, an error occured!</p>}
                    </ListItem>}
                    
                    {!!products && Object.values(products?.entities).filter((product): product is Exclude<typeof product, undefined> => !!product).map((product, index) =>
                        <ProductItem key={product._id ?? (`${page}-${index}`)} product={product} />
                    )}
                </List>
                <ProductPagination className='pagin-btm' />
            </Section>
        </Main>
    )
}
