'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

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
    type EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    // states:
    useCategoryState,
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
    // data:
    parentCategoryId : string|null
    selectedIds   ?: Set<string>
    
    
    
    // values:
    value    : Set<string>
    onChange : EditorChangeEventHandler<Set<string>>
    
    
    
    // handlers:
    onModelSelect ?: EditorChangeEventHandler<ModelSelectEvent>
    onModelDelete ?: DeleteHandler<CategoryDetail>
}
const CategoryPreview = (props: CategoryPreviewProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model,
        
        
        
        // data:
        parentCategoryId,
        selectedIds,
        
        
        
        // values:
        value,
        onChange,
        
        
        
        // handlers:
        onModelSelect,
        onModelDelete,
        
        
        
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
    // workaround for penetrating <CategoryStateProvider> to showDialog():
    const categoryState = useCategoryState();
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
                        parentCategoryId={parentCategoryId}
                        model={model} // modify current model
                        
                        
                        
                        // values:
                        value={value}
                        onChange={onChange}
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={(() => {
                            switch (editMode) {
                                case 'images'   : return 1;
                                default         : return undefined;
                            } // switch
                        })()}
                        
                        
                        
                        // workaround for penetrating <CategoryStateProvider> to showDialog():
                        {...categoryState}
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
                <Check
                    // classes:
                    className='decorator'
                    
                    
                    
                    // variants:
                    theme={(visibility !== 'PUBLISHED') ? 'secondary' : undefined}
                    
                    
                    
                    // states:
                    active={!!selectedIds && selectedIds.has(id)}
                    onActiveChange={handleCheckActiveChange}
                >
                    {name}
                </Check>
                
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
            
            <SubcategoryList
                // data:
                parentCategoryId={model.id} // creates the sub_categories of current_category_dialog
                subcategories={subcategories}
                selectedIds={selectedIds}
                
                
                
                // values:
                value={value}
                onChange={onChange}
                
                
                
                // classes:
                className='subcategories'
                
                
                
                // handlers:
                onModelSelect={onModelSelect}
            />
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
    parentCategoryId : string
    subcategories : CategoryDetail[]
    selectedIds   ?: Set<string>
    
    
    
    // values:
    value    : Set<string>
    onChange : EditorChangeEventHandler<Set<string>>
    
    
    
    // handlers:
    onModelSelect ?: EditorChangeEventHandler<ModelSelectEvent>
    onModelDelete ?: DeleteHandler<CategoryDetail>
}
const SubcategoryList = (props: SubcategoryListProps): JSX.Element|null => {
    // props:
    const {
        // data:
        parentCategoryId,
        subcategories,
        selectedIds,
        
        
        
        // values:
        value,
        onChange,
        
        
        
        // handlers:
        onModelSelect,
        onModelDelete,
        
        
        
        // other props:
        ...restUlProps
    } = props;
    
    
    
    // jsx:
    if (!subcategories.length) return null;
    return (
        <List
            // other props:
            {...restUlProps}
        >
            {subcategories.map((subcategory, index) =>
                <SubcategoryListItem
                    // identifiers:
                    key={index}
                    
                    
                    
                    // data:
                    parentCategoryId={parentCategoryId}
                    model={subcategory}
                    selectedIds={selectedIds}
                    
                    
                    
                    // values:
                    value={value}
                    onChange={onChange}
                    
                    
                    
                    // handlers:
                    onModelSelect={onModelSelect}
                    onModelDelete={onModelDelete}
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
    parentCategoryId : string
    model: CategoryDetail
    selectedIds   ?: Set<string>
    
    
    
    // values:
    value    : Set<string>
    onChange : EditorChangeEventHandler<Set<string>>
    
    
    
    // handlers:
    onModelSelect ?: EditorChangeEventHandler<ModelSelectEvent>
    onModelDelete ?: DeleteHandler<CategoryDetail>
}
const SubcategoryListItem = (props: SubcategoryListItemProps): JSX.Element|null => {
    // styles:
    const styleSheet = useCategoryStyleSheet();
    
    
    
    // props:
    const {
        // data:
        parentCategoryId,
        model,
        selectedIds,
        
        
        
        // values:
        value,
        onChange,
        
        
        
        // handlers:
        onModelSelect,
        onModelDelete,
        
        
        
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
    // workaround for penetrating <CategoryStateProvider> to showDialog():
    const categoryState = useCategoryState();
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
                        parentCategoryId={parentCategoryId}
                        model={model} // modify current model
                        
                        
                        
                        // values:
                        value={value}
                        onChange={onChange}
                        
                        
                        
                        // states:
                        defaultExpandedTabIndex={(() => {
                            switch (editMode) {
                                case 'images'   : return 1;
                                default         : return undefined;
                            } // switch
                        })()}
                        
                        
                        
                        // workaround for penetrating <CategoryStateProvider> to showDialog():
                        {...categoryState}
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
                                    sizes={`${minImageWidth}px`}
                                />
                            )}
                        </MiniCarousel>
                    </Basic>
                }
            />
            
            <h4 className='name'>
                <Check
                    // classes:
                    className='decorator'
                    
                    
                    
                    // variants:
                    theme={(visibility !== 'PUBLISHED') ? 'secondary' : undefined}
                    
                    
                    
                    // states:
                    active={!!selectedIds && selectedIds.has(id)}
                    onActiveChange={handleCheckActiveChange}
                >
                    {name}
                </Check>
                
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
            
            <SubcategoryList
                // data:
                parentCategoryId={model.id} // creates the sub_categories of current_category_dialog
                subcategories={subcategories}
                selectedIds={selectedIds}
                
                
                
                // values:
                value={value}
                onChange={onChange}
                
                
                
                // classes:
                className='subcategories'
                
                
                
                // handlers:
                onModelSelect={onModelSelect}
            />
        </ListItem>
    );
}
