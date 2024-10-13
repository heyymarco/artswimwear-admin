'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// styles:
import {
    useRolePreviewStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    RadioDecorator,
}                           from '@heymarco/radio-decorator'

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
}                           from '@/components/explorers/PaginationList'
import type {
    // types:
    ComplexEditModelDialogResult,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditRoleDialog,
}                           from '@/components/dialogs/EditRoleDialog'

// models:
import {
    type RoleDetail,
}                           from '@/models'



// react components:
export interface RolePreviewProps
    extends
        // bases:
        ModelPreviewProps<RoleDetail>
{
    // appearances:
    isShown        : boolean
    
    
    
    // handlers:
    onModelSelect ?: EditorChangeEventHandler<string|null>
    onModelDelete ?: DeleteHandler<RoleDetail>
}
const RolePreview = (props: RolePreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useRolePreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // appearances:
        isShown,
        
        
        
        // accessibilities:
        readOnly = false,
        
        
        
        // states:
        active = false,
        
        
        
        // handlers:
        onModelSelect,
        onModelDelete,
        
        
        
        // other props:
        ...restListItemProps
    } = props;
    const {
        id,
        name,
    } = model;
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleClick           = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // conditions:
        if (!event.currentTarget.contains(event.target as Node)) return; // ignore bubbling from <portal> of <EditRoleDialog>
        
        
        
        // actions:
        onModelSelect?.(id || null); // null (no selection) if the id is an empty string
    });
    const handleEditButtonClick = useEvent<React.MouseEventHandler<HTMLButtonElement>>(async (event) => {
        event.stopPropagation(); // prevents triggering `ListItem::onClick`
        
        
        
        const updatedRoleModel = await showDialog<ComplexEditModelDialogResult<RoleDetail>>(
            <EditRoleDialog
                // data:
                model={model} // modify current model
            />
        );
        if (updatedRoleModel === false) {
            await onModelDelete?.(model);
        } // if
    });
    
    
    
    // dom effects:
    
    // initial-focus on initial-tab-is-role:
    useEffect(() => {
        // conditions:
        if (!isShown)     return;
        if (!active)      return;
        const listItemElm = listItemRef.current;
        if (!listItemElm) return;
        
        
        
        // actions:
        setTimeout(() => {
            listItemElm.scrollIntoView({
                behavior : 'smooth',
                
                inline   : 'nearest',
                block    : 'nearest',
            });
        }, 500); // a delay to compensate <Modal> showing => <Modal> shown
        // @ts-ignore
    }, []);
    
    // re-focus on selected tab changed:
    useEffect(() => {
        // conditions:
        if (!isShown)     return;
        if (!active)      return;
        const listItemElm = listItemRef.current;
        if (!listItemElm) return;
        
        
        
        // actions:
        listItemElm.scrollIntoView({
            behavior : 'smooth',
            
            inline   : 'nearest',
            block    : 'nearest',
        });
        // @ts-ignore
    }, [isShown, /* active // do not re-focus on re-selected */]);
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styleSheet.main}
            
            
            
            // behaviors:
            actionCtrl={!readOnly}
            
            
            
            // states:
            active={active}
            
            
            
            // handlers:
            onClick={!readOnly ? handleClick : undefined}
        >
            <RadioDecorator
                // classes:
                className='decorator'
                
                
                
                // accessibilities:
                enabled={!readOnly}
            />
            <p className='name'>
                {!!id ? name : <span className='noValue'>No Access</span>}
            </p>
            {!!id && <EditButton
                // classes:
                className='edit'
                
                
                
                // components:
                iconComponent={<Icon icon='edit' mild={active} />}
                
                
                
                // handlers:
                onClick={handleEditButtonClick}
            />}
        </ListItem>
    );
};
export {
    RolePreview,
    RolePreview as default,
}
