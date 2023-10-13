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
    
    
    
    // layout-components:
    ListItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

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
}                           from '@/components/SectionModelEditor'
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'
import {
    CollapsibleSuspense,
}                           from '@/components/CollapsibleSuspense'
import type {
    // types:
    EditModelDialogExpandedChangeEvent,
    DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditRoleDialog,
}                           from '@/components/dialogs/EditRoleDialog'

// stores:
import type {
    // types:
    RoleDetail,
}                           from '@/store/features/api/apiSlice'



// styles:
const useRolePreviewStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */'./RolePreviewStyles')
, { specificityWeight: 2, id: 'r52809dkaf' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './RolePreviewStyles';



// react components:
export interface RolePreviewProps extends Omit<ModelPreviewProps<RoleDetail>, 'onChange'> {
    // data:
    selectedRoleId  : string|null
    
    
    
    // appearances:
    isShown         : boolean
    
    
    
    // handlers:
    onChange       ?: EditorChangeEventHandler<string|null>
    onDelete       ?: DeleteHandler
}
const RolePreview = (props: RolePreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useRolePreviewStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        selectedRoleId,
        
        
        
        // appearances:
        isShown,
        
        
        
        // accessibilities:
        readOnly = false,
        
        
        
        // states:
        active = false,
        
        
        
        // handlers:
        onChange,
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
    const handleClick          = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // conditions:
        if (!event.currentTarget.contains(event.target as Node)) return; // ignore bubbling from <portal> of <EditRoleDialog>
        
        
        
        // actions:
        onChange?.(id || null); // null (no selection) if the id is an empty string
    });
    
    const handleExpandedChange = useEvent<EventHandler<EditModelDialogExpandedChangeEvent>>(({expanded, result}) => {
        if (!expanded) {
            // first: trigger the change (if any), before this <RolePreview> will be deleted:
            if (result === false) {
                onDelete?.({
                    id : id,
                });
            } // if
            
            
            
            // second: close the dialog:
            setEditMode(null);
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
            <RadioDecorator enabled={!readOnly} />
            <p className='name'>{!!id ? name : <span className='noValue'>No Access</span>}</p>
            {!!id && <EditButton
                iconComponent={<Icon icon='edit' mild={active} />}
                onClick={(event) => { setEditMode('full'); event.stopPropagation(); }}
            />}
            {/* edit dialog: */}
            <CollapsibleSuspense>
                <EditRoleDialog
                    // data:
                    model={model} // modify current model
                    
                    
                    
                    // states:
                    expanded={(editMode === 'full')}
                    
                    
                    
                    // handlers:
                    onExpandedChange={handleExpandedChange}
                />
            </CollapsibleSuspense>
        </ListItem>
    );
};
export {
    RolePreview,
    RolePreview as default,
}