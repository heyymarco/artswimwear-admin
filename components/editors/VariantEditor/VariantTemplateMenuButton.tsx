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
const VariantTemplateMenuButton = (props: DropdownListButtonProps): JSX.Element|null => {
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
    const handleMenuExpandedChange = useEvent<EventHandler<DropdownListExpandedChangeEvent<any>>>(({expanded}) => {
        setMenuExpanded(expanded);
    });
    const handleCreateNewVariantTemplate = useEvent(async () => {
        setMenuExpanded(false);
        
        
        
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
                onClick={handleCreateNewVariantTemplate}
            >
                Crete New Variant Template
            </ListItem>}
            
            {data?.ids.length && <>
                <ListSeparatorItem />
                
                {Object.values(data.entities).filter((model): model is Exclude<typeof model, undefined> => !!model).map(({id, name}) =>
                    <ListItem key={id}>
                        {name}
                    </ListItem>
                )}
            </>}
        </DropdownListButton>
    );
};
export {
    VariantTemplateMenuButton,
    VariantTemplateMenuButton as default,
}
