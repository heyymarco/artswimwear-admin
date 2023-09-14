'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// next-js:
import type {
    Metadata,
}                           from 'next'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    Basic,
    
    
    
    // base-content-components:
    Content,
    
    
    
    // simple-components:
    Icon,
    
    
    
    // layout-components:
    ListItem,
    
    
    
    // status-components:
    Badge,
    Busy,
    
    
    
    // utility-components:
    ModalStatus,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'
import {
    Main,
}                           from '@heymarco/section'

// internal components:
import {
    PageLoading,
}                           from '@/components/PageLoading'
import {
    PageError,
}                           from '@/components/PageError'
import {
    ModelCreateProps,
    ModelPreviewProps,
    SectionModelEditor,
}                           from '@/components/SectionModelEditor'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    TextEditor,
}                           from '@/components/editors/TextEditor'
import {
    CurrencyEditor,
}                           from '@/components/editors/CurrencyEditor'
import {
    StockEditor,
}                           from '@/components/editors/StockEditor'
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    MiniCarousel,
}                           from '@/components/MiniCarousel'
import {
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'

// private components:
import {
    EditUserDialog,
}                           from './EditUserDialog'

// stores:
import {
    // types:
    UserDetail,
    
    
    
    // hooks:
    useGetUserPage,
    useUpdateUser,
    
    useGetRoleList,
    useGetRolePage,
    useUpdateRole,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    formatCurrency,
    getCurrencySign,
}                           from '@/libs/formatters'
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// configs:
import {
    PAGE_PRODUCT_TITLE,
    PAGE_PRODUCT_DESCRIPTION,
}                           from '@/website.config' // TODO: will be used soon
import {
    COMMERCE_CURRENCY_FRACTION_MAX,
}                           from '@/commerce.config'



// defaults:
const imageSize = 128;  // 128px



// styles:
const usePageStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./pageStyles')
, { id: 'y1d8f9k6xl' });
import './pageStyles';



// react components:

/* <UserCreate> */
interface UserCreateProps extends ModelCreateProps {}
const UserCreate = (props: UserCreateProps): JSX.Element|null => {
    // jsx:
    return (
        <EditUserDialog user={undefined} onClose={props.onClose} />
    );
};

/* <UserPreview> */
interface UserPreviewProps extends ModelPreviewProps<UserDetail> {
    getRolePaginationApi : ReturnType<typeof useGetRoleList>
}
const UserPreview = (props: UserPreviewProps): JSX.Element|null => {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    const {
        model,
        getRolePaginationApi,
    ...restListItemProps} = props;
    const {
        name,
        email,
        image,
        
        roleId,
        
        username,
    } = model;
    
    
    
    // states:
    const {
        data       : roles,
        isLoading  : isRoleLoadingAndNoData,
        isFetching : isRoleFetching,
        isError    : isRoleError,
        refetch    : refetchRole,
    } = getRolePaginationApi;
    const isErrorAndNoData = isRoleError && !roles;
    
    
    
    // states:
    type EditMode = Exclude<keyof UserDetail, 'id'>|'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // refs:
    const listItemRef = useRef<HTMLElement|null>(null);
    
    
    
    // handlers:
    const handleEditDialogClose = useEvent((): void => {
        setEditMode(null);
    });
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // refs:
            elmRef={listItemRef}
            
            
            
            // classes:
            className={styles.userItem}
        >
            <div className={styles.userItemWrapper}>
                {/* carousel + edit button */}
                <CompoundWithBadge
                    // components:
                    wrapperComponent={<React.Fragment />}
                    badgeComponent={
                        <Badge
                            // variants:
                            nude={true}
                            
                            
                            
                            // floatable:
                            floatingPlacement='left-start'
                            floatingShift={10}
                            floatingOffset={-30}
                        >
                            <EditButton onClick={() => setEditMode('image')} />
                        </Badge>
                    }
                    elementComponent={
                        !!image
                        ? <Basic
                            tag='span'
                            className='userImg'
                            
                            style={{
                                backgroundImage : `url(${image})`,
                            }}
                        />
                        : <Icon className='userImg' icon='person' />
                    }
                />
                
                <h3 className='name'>
                    {name}
                    <EditButton onClick={() => setEditMode('name')} />
                </h3>
                <p className='username'>
                    {username || <span className='noValue'>No Username</span>}
                    <EditButton onClick={() => setEditMode('username')} />
                </p>
                <p className='email'>
                    {email}
                    <EditButton onClick={() => setEditMode('email')} />
                </p>
                <p className='role'>
                    {isRoleLoadingAndNoData && <Busy />}
                    {!!roleId && roles?.entities?.[roleId]?.name || <span className='noValue'>No Access User</span>}
                    <EditButton onClick={() => setEditMode('roleId')} />
                </p>
                <p className='fullEditor'>
                    <EditButton buttonStyle='regular' onClick={() => setEditMode('full')}>
                        Open Full Editor
                    </EditButton>
                </p>
            </div>
            {/* edit dialog: */}
            <ModalStatus theme='primary' viewport={listItemRef} backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode !== 'full') && <>
                    {(editMode === 'name'      ) && <SimpleEditModelDialog<UserDetail> model={model} updateModelApi={useUpdateUser} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor       type='text'  required={true } autoCapitalize='words' />} />}
                    {(editMode === 'email'     ) && <SimpleEditModelDialog<UserDetail> model={model} updateModelApi={useUpdateUser} edit={editMode} onClose={handleEditDialogClose} editorComponent={<TextEditor       type='email' required={true } />} />}
                </>}
            </ModalStatus>
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && ((editMode === 'image') || (editMode === 'roleId') || (editMode === 'username') || (editMode === 'full')) && <EditUserDialog user={model} onClose={handleEditDialogClose} defaultExpandedTabIndex={(editMode === 'roleId') ? 1 : undefined} />}
            </ModalStatus>
        </ListItem>
    );
}

/* <UserPage> */
export default function UserPage(): JSX.Element|null {
    // styles:
    const styles = usePageStyleSheet();
    
    
    
    // states:
    const [page   , setPage   ] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    const getModelPaginationApi = useGetUserPage({ page, perPage });
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = getModelPaginationApi;
    const isErrorAndNoData = isError && !data;
    
    const getRolePaginationApi  = useGetRoleList();
    
    
    
    // jsx:
    if (isLoadingAndNoData) return <PageLoading />;
    if (isErrorAndNoData  ) return <PageError onRetry={refetch} />;
    return (
        <Main className={styles.page}>
            <SectionModelEditor<UserDetail>
                // accessibilities:
                createItemText='Add New User'
                
                
                
                // data:
                page={page}
                perPage={perPage}
                setPage={setPage}
                setPerPage={setPerPage}
                getModelPaginationApi={getModelPaginationApi}
                
                
                
                // components:
                modelPreviewComponent={
                    <UserPreview model={undefined as any} getRolePaginationApi={getRolePaginationApi} />
                }
                modelCreateComponent={
                    <UserCreate onClose={undefined as any} />
                }
            />
        </Main>
    )
}



// export const metadata : Metadata = {
//     title       : PAGE_PRODUCT_TITLE,
//     description : PAGE_PRODUCT_DESCRIPTION,
// };
