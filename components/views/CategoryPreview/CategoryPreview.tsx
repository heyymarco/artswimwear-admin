'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// styles:
import {
    useCategoryStyleSheet,
}                           from './styles/loader'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    type EventHandler,
    type ActiveChangeEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
    Check,
    
    
    
    // layout-components:
    ListProps,
    List,
    ListItem,
    
    
    
    // status-components:
    Badge,
    
    
    
    // utility-components:
    useDialogMessage,
    ListItemProps,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'

// internal components:
import {
    ModelPreviewProps,
}                           from '@/components/explorers/PaginationList'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    // states:
    useCategoryState,
    
    
    
    // react components:
    CategoryStateProvider,
}                           from '@/components/editors/CategoryEditor'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
import {
    VisibilityBadge,
}                           from '@/components/VisibilityBadge'
import {
    DummyDialog,
}                           from '@/components/dialogs/DummyDialog'
import {
    // types:
    type ComplexEditModelDialogResult,
    type DeleteHandler,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    EditCategoryDialog,
}                           from '@/components/dialogs/EditCategoryDialog'

// models:
import {
    // types:
    type CategoryDetail,
}                           from '@/models'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// defaults:
const minImageWidth = 102;  // 102px === (120px + (2* paddingBlock)) * aspectRatio === (120px + (2* 16px)) * 2/3
const minImageWidthSub = 75;   // 75px === (80px + (2* paddingBlock)) * aspectRatio === (80px + (2* 16px)) * 2/3



// types:
export interface ModelSelectEvent {
    id       : string
    selected : boolean
}



// react components:
export interface CategoryPreviewProps
    extends
        // bases:
        Omit<ModelPreviewProps<CategoryDetail>,
            // values:
            |'value'
            |'onChange'
        >
{
}
const CategoryPreview = (props: CategoryPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // other props:
        ...restCategoryPreviewProps
    } = props;
    const {
        id,
        visibility,
        name,
        images,
        subcategories,
    } = model;
    
    
    
    // states:
    const categoryState = useCategoryState();
    const {
        // behaviors:
        selectable,
        
        
        
        // values:
        value,
        
        
        
        // handlers:
        onModelSelect,
        onModelDelete,
    } = categoryState;
    
    
    
    // privileges:
 // const privilegeAdd               = !!categoryState.privilegeAdd;
    const privilegeUpdateDescription = !!categoryState.privilegeUpdate?.description;
    const privilegeUpdateImages      = !!categoryState.privilegeUpdate?.images;
    const privilegeUpdateVisibility  = !!categoryState.privilegeUpdate?.visibility;
    const privilegeDelete            = !!categoryState.privilegeDelete;
    const privilegeWrite             = (
        /* privilegeAdd */ // except for add
        privilegeUpdateDescription
        || privilegeUpdateImages
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
    type EditMode = 'images'|'full'
    const handleEdit = useEvent((editMode: EditMode): void => {
        // just for cosmetic backdrop:
        const dummyPromise = (
            ['images', 'full'].includes(editMode)
            ? showDialog(
                <DummyDialog
                    // global stackable:
                    viewport={listItemRef}
                />
            )
            : undefined
        );
        
        const dialogPromise = showDialog<ComplexEditModelDialogResult<CategoryDetail>>((() => {
            switch (editMode) {
                case 'images'     :
                case 'full'       : return (
                    <EditCategoryDialog
                        // data:
                        model={model} // modify current model
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={(() => {
                            switch (editMode) {
                                case 'images'   : return 1;
                                default         : return undefined;
                            } // switch
                        })()}
                        
                        
                        
                        // workaround for penetrating <CategoryStateProvider> to showDialog():
                        // states:
                        categoryState={{
                            ...categoryState,
                            
                            
                            
                            // behaviors:
                            selectable : false,
                        }}
                    />
                );
                default           : throw new Error('app error');
            } // switch
        })());
        
        if (dummyPromise) {
            dialogPromise.collapseStartEvent().then(() => dummyPromise.closeDialog(undefined));
        } // if
        
        dialogPromise.then((updatedModel) => {
            if (updatedModel === false) {
                onModelDelete?.(model);
            } // if
        });
    });
    
    const handleCheckActiveChange = useEvent<EventHandler<ActiveChangeEvent>>(({ active }) => {
        onModelSelect?.({ id: id, selected: active });
    });
    
    
    
    // default props:
    const {
        // classes:
        className = styleSheet.categoryPreview,
        
        
        
        // other props:
        ...restListItemProps
    } = restCategoryPreviewProps;
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={className}
        >
            {/* carousel + edit button */}
            <CompoundWithBadge
                // components:
                wrapperComponent={<React.Fragment />}
                badgeComponent={
                    privilegeUpdateImages
                    ? <Badge
                        // variants:
                        nude={true}
                        
                        
                        
                        // floatable:
                        floatingPlacement='left-start'
                        floatingShift={10}
                        floatingOffset={-30}
                    >
                        <EditButton className='edit overlay' onClick={() => handleEdit('images')} />
                    </Badge>
                    : null
                }
                elementComponent={
                    <Basic
                        // variants:
                        mild={true}
                        
                        
                        
                        // classes:
                        className='preview'
                    >
                        <MiniCarousel
                            // variants:
                            theme='danger'
                            nude={true}
                            
                            
                            
                            // classes:
                            className='image'
                            
                            
                            
                            // components:
                            basicComponent={<Content theme='primary' />}
                        >
                            {images.map((image, index) =>
                                <Image
                                    // identifiers:
                                    key={index}
                                    
                                    
                                    
                                    className='prodImg'
                                    
                                    alt={name ?? ''}
                                    src={resolveMediaUrl(image)}
                                    sizes={`${minImageWidth}px`}
                                />
                            )}
                        </MiniCarousel>
                    </Basic>
                }
            />
            
            <h3 className='name'>
                {!selectable && <span
                    // classes:
                    className='decorator'
                >
                    {name}
                </span>}
                {selectable && <Check
                    // classes:
                    className='decorator'
                    
                    
                    
                    // variants:
                    theme={(visibility !== 'PUBLISHED') ? 'secondary' : undefined}
                    
                    
                    
                    // states:
                    active={value.has(id)}
                    onActiveChange={handleCheckActiveChange}
                >
                    {name}
                </Check>}
                
                {privilegeWrite && <EditButton
                    // classes:
                    className='edit'
                    
                    
                    
                    // components:
                    iconComponent={<Icon icon='edit' />}
                    
                    
                    
                    // handlers:
                    onClick={() => handleEdit('full')}
                />}
                
                <VisibilityBadge visibility={visibility} className='visibility' />
            </h3>
            
            <CategoryStateProvider
                // data:
                parentCategoryId={model.id} // creates the sub_categories of current_category_view
            >
                <SubcategoryList
                    // data:
                    subcategories={subcategories}
                    
                    
                    
                    // classes:
                    className='subcategories'
                />
            </CategoryStateProvider>
        </ListItem>
    );
};
export {
    CategoryPreview,
    CategoryPreview as default,
}



interface SubcategoryListProps
    extends
        // bases:
        Omit<ListProps,
            // values:
            |'value'
            |'onChange'
        >
{
    // data:
    subcategories : CategoryDetail[]
}
const SubcategoryList = (props: SubcategoryListProps): JSX.Element|null => {
    // props:
    const {
        // data:
        subcategories,
        
        
        
        // other props:
        ...restListProps
    } = props;
    
    
    
    // jsx:
    if (!subcategories.length) return null;
    return (
        <List
            // other props:
            {...restListProps}
        >
            {subcategories.map((subcategory, index) =>
                <SubcategoryListItem
                    // identifiers:
                    key={index}
                    
                    
                    
                    // data:
                    model={subcategory}
                />
            )}
        </List>
    );
}

interface SubcategoryListItemProps
    extends
        // bases:
        Omit<ListItemProps,
            // values:
            |'value'
            |'onChange'
        >
{
    // data:
    model: CategoryDetail
}
const SubcategoryListItem = (props: SubcategoryListItemProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryStyleSheet();
    
    
    
    // props:
    const {
        // data:
        model,
        
        
        
        // other props:
        ...restSubcategoryListItemProps
    } = props;
    const {
        id,
        visibility,
        name,
        images,
        subcategories,
    } = model;
    
    
    
    // states:
    const categoryState = useCategoryState();
    const {
        // behaviors:
        selectable,
        
        
        
        // values:
        value,
        
        
        
        // handlers:
        onModelSelect,
        onModelDelete,
    } = categoryState;
    
    
    
    // privileges:
 // const privilegeAdd               = !!categoryState.privilegeAdd;
    const privilegeUpdateDescription = !!categoryState.privilegeUpdate?.description;
    const privilegeUpdateImages      = !!categoryState.privilegeUpdate?.images;
    const privilegeUpdateVisibility  = !!categoryState.privilegeUpdate?.visibility;
    const privilegeDelete            = !!categoryState.privilegeDelete;
    const privilegeWrite             = (
        /* privilegeAdd */ // except for add
        privilegeUpdateDescription
        || privilegeUpdateImages
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
    type EditMode = 'images'|'full'
    const handleEdit = useEvent((editMode: EditMode): void => {
        // just for cosmetic backdrop:
        const dummyPromise = (
            ['images', 'full'].includes(editMode)
            ? showDialog(
                <DummyDialog
                    // global stackable:
                    viewport={listItemRef}
                />
            )
            : undefined
        );
        
        const dialogPromise = showDialog<ComplexEditModelDialogResult<CategoryDetail>>((() => {
            switch (editMode) {
                case 'images'     :
                case 'full'       : return (
                    <EditCategoryDialog
                        // data:
                        model={model} // modify current model
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={(() => {
                            switch (editMode) {
                                case 'images'   : return 1;
                                default         : return undefined;
                            } // switch
                        })()}
                        
                        
                        
                        // workaround for penetrating <CategoryStateProvider> to showDialog():
                        // states:
                        categoryState={{
                            ...categoryState,
                            
                            
                            
                            // behaviors:
                            selectable : false,
                        }}
                    />
                );
                default           : throw new Error('app error');
            } // switch
        })());
        
        if (dummyPromise) {
            dialogPromise.collapseStartEvent().then(() => dummyPromise.closeDialog(undefined));
        } // if
        
        dialogPromise.then((updatedModel) => {
            if (updatedModel === false) {
                onModelDelete?.(model);
            } // if
        });
    });
    
    const handleCheckActiveChange = useEvent<EventHandler<ActiveChangeEvent>>(({ active }) => {
        onModelSelect?.({ id: id, selected: active });
    });
    
    
    
    // default props:
    const {
        // classes:
        className = `${styleSheet.categoryPreview} ${styleSheet.categoryPreviewSub}`,
        
        
        
        // other props:
        ...restListItemProps
    } = restSubcategoryListItemProps;
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={className}
        >
            {/* image + edit button */}
            <CompoundWithBadge
                // components:
                wrapperComponent={<React.Fragment />}
                badgeComponent={
                    privilegeUpdateImages
                    ? <Badge
                        // variants:
                        nude={true}
                        
                        
                        
                        // floatable:
                        floatingPlacement='left-start'
                        floatingShift={10}
                        floatingOffset={-30}
                    >
                        <EditButton className='edit overlay' onClick={() => handleEdit('images')} />
                    </Badge>
                    : null
                }
                elementComponent={
                    <Basic
                        // variants:
                        mild={true}
                        
                        
                        
                        // classes:
                        className='preview'
                    >
                        <MiniCarousel
                            // variants:
                            theme='danger'
                            nude={true}
                            
                            
                            
                            // classes:
                            className='image'
                            
                            
                            
                            // components:
                            basicComponent={<Content theme='primary' />}
                        >
                            {images.map((image, index) =>
                                <Image
                                    // identifiers:
                                    key={index}
                                    
                                    
                                    
                                    className='prodImg'
                                    
                                    alt={name ?? ''}
                                    src={resolveMediaUrl(image)}
                                    sizes={`${minImageWidthSub}px`}
                                />
                            )}
                        </MiniCarousel>
                    </Basic>
                }
            />
            
            <h4 className='name'>
                {!selectable && <span
                    // classes:
                    className='decorator'
                >
                    {name}
                </span>}
                {selectable && <Check
                    // classes:
                    className='decorator'
                    
                    
                    
                    // variants:
                    theme={(visibility !== 'PUBLISHED') ? 'secondary' : undefined}
                    
                    
                    
                    // states:
                    active={value.has(id)}
                    onActiveChange={handleCheckActiveChange}
                >
                    {name}
                </Check>}
                
                {privilegeWrite && <EditButton
                    // classes:
                    className='edit'
                    
                    
                    
                    // components:
                    iconComponent={<Icon icon='edit' />}
                    
                    
                    
                    // handlers:
                    onClick={() => handleEdit('full')}
                />}
                
                <VisibilityBadge visibility={visibility} className='visibility' />
            </h4>
            
            <CategoryStateProvider
                // data:
                parentCategoryId={model.id} // creates the sub_categories of current_category_view
            >
                <SubcategoryList
                    // data:
                    subcategories={subcategories}
                    
                    
                    
                    // classes:
                    className='subcategories'
                />
            </CategoryStateProvider>
        </ListItem>
    );
}
