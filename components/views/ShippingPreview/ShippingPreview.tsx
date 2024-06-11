'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// // next-js:
// import type {
//     Metadata,
// }                           from 'next'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Button,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PagedModelExplorer'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
import {
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
import {
    EditShippingDialog,
}                           from '@/components/dialogs/EditShippingDialog'

// models:
import {
    type ShippingDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateShipping,
}                           from '@/store/features/api/apiSlice'



// styles:
const usePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./ShippingPreviewStyles')
, { specificityWeight: 2, id: 'kr8hwb6q2w' });
import './ShippingPreviewStyles';



// react components:
export interface ShippingPreviewProps extends ModelPreviewProps<ShippingDetail> {}
const ShippingPreview = (props: ShippingPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // rest props:
    const {
        model,
    ...restListItemProps} = props;
    const {
        visibility,
        name,
    } = model;
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // privileges:
    // const privilegeAdd            = !!role?.shipping_c;
    const privilegeUpdateDescription = !!role?.shipping_ud;
    const privilegeUpdatePrice       = !!role?.shipping_up;
    const privilegeUpdateVisibility  = !!role?.shipping_uv;
    const privilegeDelete            = !!role?.shipping_d;
    const privilegeWrite             = (
        /* privilegeAdd */ // except for add
        privilegeUpdateDescription
        || privilegeUpdatePrice
        || privilegeUpdateVisibility
        || privilegeDelete
    );
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    type EditMode = Exclude<keyof ShippingDetail, 'id'>|'full'
    const handleEdit = useEvent((editMode: EditMode): void => {
        // just for cosmetic backdrop:
        const dummyPromise = (
            ['name', 'visibility', 'full'].includes(editMode)
            ? showDialog(
                <DummyDialog
                    // global stackable:
                    viewport={listItemRef}
                />
            )
            : undefined
        );
        
        const dialogPromise = showDialog((() => {
            switch (editMode) {
                case 'name'       : return (
                    <SimpleEditModelDialog<ShippingDetail>
                        // data:
                        model={model}
                        edit='name'
                        
                        
                        
                        // stores:
                        updateModelApi={useUpdateShipping}
                        
                        
                        
                        // components:
                        editorComponent={<NameEditor />}
                    />
                );
                case 'visibility' : return (
                    <SimpleEditModelDialog<ShippingDetail>
                        // data:
                        model={model}
                        edit='visibility'
                        
                        
                        
                        // stores:
                        updateModelApi={useUpdateShipping}
                        
                        
                        
                        // components:
                        editorComponent={<VisibilityEditor theme='primaryAlt' optionHidden={false} />}
                    />
                );
                case 'full'       : return (
                    <EditShippingDialog
                        // data:
                        model={model} // modify current model
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={(() => {
                            switch (editMode) {
                                default         : return undefined;
                            } // switch
                        })()}
                    />
                );
                default           : throw new Error('app error');
            } // switch
        })());
        
        if (dummyPromise) {
            dialogPromise.collapseStartEvent().then(() => dummyPromise.closeDialog(undefined));
        } // if
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheet.main}
        >
            <h3 className='name'>
                {name}
                {privilegeUpdateDescription && <EditButton onClick={() => handleEdit('name')} />}
            </h3>
            <p className='visibility'>
                Visibility: <strong className='value'>{visibility}</strong>
                {privilegeUpdateVisibility  && <EditButton onClick={() => handleEdit('visibility')} />}
            </p>
            <p className='fullEditor'>
                {privilegeWrite             && <Button buttonStyle='link' onClick={() => handleEdit('full')}>
                    More...
                </Button>}
            </p>
        </ListItem>
    );
};
export {
    ShippingPreview,
    ShippingPreview as default,
}
