'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useEffect,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    OrderableListItem,
}                           from '@heymarco/orderable-list'

// internal components:
import {
    EditButton,
}                           from '@/components/EditButton'
import type {
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import type {
    // react components:
    ModelPreviewProps,
}                           from '@/components/explorers/PagedModelExplorer'
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'
import {
    CollapsibleSuspense,
}                           from '@/components/CollapsibleSuspense'
import type {
    // types:
    ComplexEditModelDialogExpandedChangeEvent,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditProductVariantGroupDialog,
}                           from '@/components/dialogs/EditProductVariantGroupDialog'

// stores:
import type {
    // types:
    ProductVariantGroupDetail,
}                           from '@/store/features/api/apiSlice'



// styles:
const useVariantGroupPreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./VariantGroupPreviewStyles')
, { specificityWeight: 2, id: 'r52809dkaf' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './VariantGroupPreviewStyles';



// react components:
export interface VariantGroupPreviewProps extends Omit<ModelPreviewProps<ProductVariantGroupDetail>, 'onChange'> {
    // data:
    productId : string
    
    
    
    // handlers:
    onDelete ?: DeleteHandler
}
const VariantGroupPreview = (props: VariantGroupPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useVariantGroupPreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        productId,
        
        
        
        // accessibilities:
        readOnly = false, // TODO: unordrable if readonly
        
        
        
        // handlers:
        onDelete,
    ...restListItemProps} = props;
    const {
        id,
        name,
    } = model;
    
    
    
    // states:
    type EditMode = 'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<ComplexEditModelDialogExpandedChangeEvent>>(async ({expanded, data}) => {
        if (!expanded) {
            // first: trigger the `onDelete()` event (if any):
            if (data === false) {
                await onDelete?.({
                    id : id,
                });
            } // if
            
            
            
            // second: close the dialog:
            setEditMode(null);
        } // if
    });
    
    
    
    // jsx:
    return (
        <OrderableListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            // TODO: {'<Grip>'}
            <p className='name'>{!!id ? name : <span className='noValue'>No Access</span>}</p>
            {!!id && <EditButton
                iconComponent={<Icon icon='edit' />}
                onClick={(event) => { setEditMode('full'); event.stopPropagation(); }}
            />}
            {/* edit dialog: */}
            <CollapsibleSuspense>
                <EditProductVariantGroupDialog
                    // data:
                    model={model} // modify current model
                    productId={productId}
                    
                    
                    
                    // states:
                    expanded={(editMode === 'full')}
                    
                    
                    
                    // handlers:
                    onExpandedChange={handleExpandedChange}
                />
            </CollapsibleSuspense>
        </OrderableListItem>
    );
};
export {
    VariantGroupPreview,
    VariantGroupPreview as default,
}
