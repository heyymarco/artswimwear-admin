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
    ListItem,
    
    
    
    // status-components:
    Badge,
    
    
    
    // utility-components:
    useDialogMessage,
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
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
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
    type CategoryPreview,
    type CategoryDetail,
}                           from '@/models'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// defaults:
const minImageWidth = 88;  // 88px === (100px + (2* paddingBlock)) * aspectRatio === (100px + (2* 16px)) * 2/3



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
        ...restListItemProps
    } = props;
    const {
        id,
        visibility,
        name,
        images,
        subcategories,
    } = model;
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
 // const privilegeAdd               = !!role?.category_c;
    const privilegeUpdateDescription = !!role?.category_ud;
    const privilegeUpdateImages      = !!role?.category_ui;
    const privilegeUpdateVisibility  = !!role?.category_uv;
    const privilegeDelete            = !!role?.category_d;
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
    type EditMode = Exclude<keyof CategoryDetail, 'id'>|'images'|'full'
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
                    <MiniCarousel
                        // variants:
                        theme='danger'
                        
                        
                        
                        // classes:
                        className='images'
                        
                        
                        
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
                
                {(visibility !== 'PUBLISHED') && <Basic tag='span' theme='secondary' size='sm' className='visibility'>DRAFT</Basic>}
            </h3>
            
            <SubcategoryList className='subcategories' subcategories={subcategories} selectedIds={selectedIds} onModelSelect={onModelSelect} />
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
        React.HTMLAttributes<HTMLUListElement>
{
    // data:
    subcategories : CategoryPreview[]
    selectedIds   ?: Set<string>
    
    
    
    // handlers:
    onModelSelect ?: EditorChangeEventHandler<ModelSelectEvent>
}
const SubcategoryList = (props: SubcategoryListProps): JSX.Element|null => {
    // props:
    const {
        // data:
        subcategories,
        selectedIds,
        
        
        
        // handlers:
        onModelSelect,
        
        
        
        // other props:
        ...restUlProps
    } = props;
    
    
    
    // jsx:
    if (!subcategories.length) return null;
    return (
        <ul
            // other props:
            {...restUlProps}
        >
            {subcategories.map((subcategory, index) =>
                <SubcategoryListItem key={index} model={subcategory} selectedIds={selectedIds} onModelSelect={onModelSelect} />
            )}
        </ul>
    );
}

interface SubcategoryListItemProps
    extends
        // bases:
        React.HTMLAttributes<HTMLLIElement>
{
    // data:
    model: CategoryPreview
    selectedIds   ?: Set<string>
    
    
    
    // handlers:
    onModelSelect ?: EditorChangeEventHandler<ModelSelectEvent>
}
const SubcategoryListItem = (props: SubcategoryListItemProps): JSX.Element|null => {
    // props:
    const {
        // data:
        model,
        selectedIds,
        
        
        
        // handlers:
        onModelSelect,
        
        
        
        // other props:
        ...restLIProps
    } = props;
    const {
        id,
        visibility,
        name,
        image,
        subcategories,
    } = model;
    
    
    
    // handlers:
    const handleCheckActiveChange = useEvent<EventHandler<ActiveChangeEvent>>(({ active }) => {
        onModelSelect?.({ id: id, selected: active });
    });
    
    
    
    // jsx:
    return (
        <li
            // other props:
            {...restLIProps}
        >
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
            </h4>
            <SubcategoryList subcategories={subcategories} />
        </li>
    );
}
