// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    ListSeparatorItem,
    
    
    
    // menu-components:
    DropdownListExpandedChangeEvent,
    DropdownListButtonProps,
    DropdownListButton,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import type {
    // types:
    ComplexEditModelDialogResult,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditTemplateVariantGroupDialog,
}                           from '@/components/dialogs/EditTemplateVariantGroupDialog'
import {
    TemplateVariantGroupPreview,
}                           from '@/components/views/TemplateVariantGroupPreview'
import {
    MessageLoading,
}                           from '@/components/MessageLoading'
import {
    MessageError,
}                           from '@/components/MessageError'

// internals:
import {
    useTemplateVariantMenuButtonStyleSheet,
}                           from './styles/loader'
import {
    // states:
    useVariantState,
}                           from '@/components/editors/VariantEditor/states/variantState'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// models:
import {
    // types:
    type ModelEditEventHandler,
    type ModelUpsertEventHandler,
    
    type VariantGroupDetail,
    type TemplateVariantGroupDetail,
    type TemplateVariantDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useGetTemplateVariantGroupList,
}                           from '@/store/features/api/apiSlice'



// react components:
export interface TemplateVariantMenuButtonProps
    extends
        // bases:
        DropdownListButtonProps
{
    // handlers:
    onModelCreate ?: ModelUpsertEventHandler<VariantGroupDetail>
}
const TemplateVariantMenuButton = (props: TemplateVariantMenuButtonProps): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onModelCreate,
    ...restDropdownListButtonProps} = props;
    
    
    
    // styles:
    const styleSheet = useTemplateVariantMenuButtonStyleSheet();
    
    
    
    // states:
    const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
    
    
    
    // states:
    // workaround for penetrating <VariantStateProvider> to showDialog():
    const {
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
    ...restVariantState} = useVariantState();
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleMenuExpandedChange       = useEvent<EventHandler<DropdownListExpandedChangeEvent<any>>>(({expanded}) => {
        setMenuExpanded(expanded);
    });
    const handleCreateNewTemplateVariant = useEvent<React.MouseEventHandler<HTMLElement>>(async (event): Promise<void> => {
        await showDialog<ComplexEditModelDialogResult<VariantGroupDetail>>(
            <EditTemplateVariantGroupDialog
                // data:
                model={null} // create a new model
                
                
                
                // workaround for penetrating <VariantStateProvider> to showDialog():
                {...restVariantState}
                
                
                
                // privileges:
                privilegeAdd    = {privilegeAdd   }
                privilegeUpdate = {privilegeUpdate}
                privilegeDelete = {privilegeDelete}
            />
        );
    });
    const handleMenuClose                = useEvent((): void => {
        setMenuExpanded(false);
    });
    
    
    
    // jsx:
    return (
        <DropdownListButton
            // other props:
            {...restDropdownListButtonProps}
            
            
            
            // variants:
            theme='primary'
            
            
            
            // behaviors:
            lazy={true}
            
            
            
            // states:
            expanded={menuExpanded}
            onExpandedChange={handleMenuExpandedChange}
            
            
            
            // floatable:
            floatingPlacement='bottom-end'
        >
            {privilegeAdd && <ListItem
                // variants:
                mild={false}
                
                
                
                // classes:
                className={styleSheet.createModel}
                
                
                
                // behaviors:
                actionCtrl={true}
                
                
                
                // handlers:
                onClick={handleCreateNewTemplateVariant}
            >
                <p>Crete New Variant Template</p>
            </ListItem>}
            
            <ListSeparatorItem />
            
            <TemplateVariantMenuItems
                // handlers:
                onModelCreate={onModelCreate}
                onClose={handleMenuClose}
            />
        </DropdownListButton>
    );
};
export {
    TemplateVariantMenuButton,
    TemplateVariantMenuButton as default,
}



interface TemplateVariantMenuItemsProps {
    // handlers:
    onModelCreate ?: ModelUpsertEventHandler<VariantGroupDetail>
    onClose       ?: () => void
}
const TemplateVariantMenuItems = (props: TemplateVariantMenuItemsProps): JSX.Element|null => {
    // props:
    const {
        // handlers:
        onModelCreate,
        onClose,
    } = props;
    
    
    
    // styles:
    const styleSheet = useTemplateVariantMenuButtonStyleSheet();
    
    
    
    // handlers:
    const handleModelClick = useEvent(async (event: React.MouseEvent<HTMLElement, MouseEvent>, templateVariantGroupDetail: TemplateVariantGroupDetail) => {
        // conditions:
        if (event.defaultPrevented) return; // ignores clicking by <EditButton>
        onClose?.();                        // preserves the prevented default closing <DropdownMenu>
        if (!onModelCreate) return;         // the `onModelCreate()` handler is not assigned => ignore
        
        
        
        const {
            variants,
            ...restTemplateVariantGroupDetail
        } = templateVariantGroupDetail;
        
        const variantGroupDetail : VariantGroupDetail = {
            ...restTemplateVariantGroupDetail,
            id   : await (async () => {
                const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
                return ` ${await nanoid()}`; // starts with space{random-temporary-id}
            })(),
            sort : 0,
            variants : await Promise.all((variants as TemplateVariantDetail[]).map(async ({id, ...restVariant}) => ({
                ...restVariant,
                id   : await (async () => {
                    const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
                    return ` ${await nanoid()}`; // starts with space{random-temporary-id}
                })(),
            }))),
        };
        onModelCreate({
            model : variantGroupDetail,
            event : event,
        });
    });
    const handleModelEdit  = useEvent<ModelEditEventHandler<TemplateVariantGroupDetail>>(() => {
        onClose?.(); // preserves the prevented default closing <DropdownMenu>
    });
    
    
    
    // stores:
    const getModelPaginationApi = useGetTemplateVariantGroupList();
    const {
        // data:
        data,
        isLoading: isLoadingAndNoData,
        isError,
        refetch,
    } = getModelPaginationApi;
    const isErrorAndNoData = isError && !data;
    const modelList = !data?.ids.length ? undefined : Object.values(data.entities).filter((model): model is Exclude<typeof model, undefined> => !!model);
    
    
    
    // jsx:
    return (
        <>
            {isLoadingAndNoData && <ListItem
                // classes:
                className={styleSheet.loadingModel}
                
                
                
                // behaviors:
                actionCtrl={false}
            >
                <MessageLoading />
            </ListItem>}
            
            {isErrorAndNoData && <ListItem
                // variants:
                theme='danger'
                
                
                
                // classes:
                className={styleSheet.errorModel}
                
                
                
                // behaviors:
                actionCtrl={false}
            >
                <MessageError onRetry={refetch} />
            </ListItem>}
            
            {modelList?.map((model) =>
                <TemplateVariantGroupPreview
                    // indentifiers:
                    key={model.id}
                    
                    
                    
                    // data:
                    model={model}
                    
                    
                    
                    // behaviors:
                    actionCtrl={true}
                    
                    
                    
                    // handlers:
                    onClick     = {(event) => handleModelClick(event, model)}
                    onModelEdit = {handleModelEdit}
                />
            )}
        </>
    );
}
