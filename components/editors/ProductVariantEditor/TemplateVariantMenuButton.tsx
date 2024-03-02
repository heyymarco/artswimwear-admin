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
    useMountedFlag,
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

// internals:
import {
    // states:
    useVariantState,
}                           from './states/variantState'

// stores:
import {
    // types:
    ProductVariantGroupDetail,
    
    
    
    // hooks:
    useGetTemplateVariantGroupList,
}                           from '@/store/features/api/apiSlice'



// react components:
const TemplateVariantMenuButton = (props: DropdownListButtonProps): JSX.Element|null => {
    // states:
    const [menuExpanded, setMenuExpanded] = useState<boolean>(false);
    const isMounted = useMountedFlag();
    
    
    
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
        const createdModel = await showDialog<ComplexEditModelDialogResult<ProductVariantGroupDetail>>(
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
        if (!createdModel) return; // modal canceled => ignore
        if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        
        
        
        console.log(createdModel);
    });
    const handleSelectTemplateVariant    = useEvent<React.MouseEventHandler<HTMLElement>>((event) => {
        // conditions:
        if (event.defaultPrevented) return; // ignores clicking by <EditButton>
        
        
        
        console.log('TODO: handle select template');
    });
    const handleEditingTemplateVariant   = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        event.preventDefault(); // prevents trigger <ListItem> => handleSelectTemplateVariant()
        setMenuExpanded(false); // preserves the prevented default closing <DropdownMenu>
    });
    
    
    
    // stores:
    const getModelPaginationApi = useGetTemplateVariantGroupList();
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = getModelPaginationApi;
    const isErrorAndNoData = isError && !data;
    
    
    
    // jsx:
    return (
        <DropdownListButton
            // other props:
            {...props}
            
            
            
            // variants:
            theme='primary'
            
            
            
            // states:
            expanded={menuExpanded}
            onExpandedChange={handleMenuExpandedChange}
            
            
            
            // floatable:
            floatingPlacement='bottom-end'
        >
            {privilegeAdd && <ListItem
                // variants:
                mild={false}
                
                
                
                // behaviors:
                actionCtrl={true}
                
                
                
                // handlers:
                onClick={handleCreateNewTemplateVariant}
            >
                Crete New Variant Template
            </ListItem>}
            
            {data?.ids.length && <>
                <ListSeparatorItem />
                
                {Object.values(data.entities).filter((model): model is Exclude<typeof model, undefined> => !!model).map((model) =>
                    <TemplateVariantGroupPreview
                        // indentifiers:
                        key={model.id}
                        
                        
                        
                        // data:
                        model={model}
                        
                        
                        
                        // handlers:
                        onClick   = {handleSelectTemplateVariant }
                        onEditing = {handleEditingTemplateVariant}
                    />
                )}
            </>}
        </DropdownListButton>
    );
};
export {
    TemplateVariantMenuButton,
    TemplateVariantMenuButton as default,
}
