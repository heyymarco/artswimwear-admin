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

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

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
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    UniqueUsernameEditor,
}                           from '@/components/editors/UniqueUsernameEditor'
import {
    UniqueEmailEditor,
}                           from '@/components/editors/UniqueEmailEditor'
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
    PAGE_USER_TITLE,
    PAGE_USER_DESCRIPTION,
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
    const styleSheet = usePageStyleSheet();
    
    
    
    // rest props:
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
    type EditMode = Exclude<keyof UserDetail, 'id'>|'full'
    const [editMode, setEditMode] = useState<EditMode|null>(null);
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    const privilegeAdd               = !!role?.user_c;
    const privilegeUpdateName        = !!role?.user_un;
    const privilegeUpdateUsername    = !!role?.user_uu;
    const privilegeUpdateEmail       = !!role?.user_ue;
    const privilegeUpdatePassword    = !!role?.user_up;
    const privilegeUpdateImage       = !!role?.user_ui;
    const privilegeUpdateRole        = !!role?.user_ur;
    const privilegeDelete            = !!role?.user_d;
    const privilegeWrite             = (
        /* privilegeAdd */ // except for add
        privilegeUpdateName
        || privilegeUpdateUsername
        || privilegeUpdateEmail
        || privilegeUpdatePassword
        || privilegeUpdateImage
        || privilegeUpdateRole
        || privilegeDelete
    );
    
    
    
    // stores:
    const {
        data       : roles,
        isLoading  : isRoleLoadingAndNoData,
        isFetching : isRoleFetching,
        isError    : isRoleError,
        refetch    : refetchRole,
    } = getRolePaginationApi;
    const isErrorAndNoData = isRoleError && !roles;
    
    
    
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
            className={styleSheet.userItem}
        >
            <div className={styleSheet.userItemWrapper}>
                {/* profile image + edit button */}
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
                            <EditButton className='edit overlay' onClick={() => setEditMode('image')} />
                        </Badge>
                    }
                    elementComponent={
                        !!image
                        ? <Basic
                            tag='span'
                            className='userImg'
                            
                            style={{
                                background: `no-repeat center/cover url("${resolveMediaUrl(image)}")`,
                            }}
                        />
                        : <Generic className='userImg empty'><Icon icon='person' size='xl' /></Generic>
                    }
                />
                
                <h3 className='name'>
                    {name}
                    {privilegeUpdateName     && <EditButton onClick={() => setEditMode('name')} />}
                </h3>
                <p className='username'>
                    {username || <span className='noValue'>No Username</span>}
                    {privilegeUpdateUsername && <EditButton onClick={() => setEditMode('username')} />}
                </p>
                <p className='email'>
                    {email}
                    {privilegeUpdateEmail    && <EditButton onClick={() => setEditMode('email')} />}
                </p>
                <p className='role'>
                    { isRoleLoadingAndNoData && <Busy />}
                    {!isRoleLoadingAndNoData && !!roleId && roles?.entities?.[roleId]?.name || <span className='noValue'>No Access</span>}
                    {privilegeUpdateRole     && <EditButton onClick={() => setEditMode('roleId')} />}
                </p>
                <p className='fullEditor'>
                    {privilegeWrite          && <EditButton buttonStyle='regular' onClick={() => setEditMode('full')}>
                        Open Full Editor
                    </EditButton>}
                </p>
            </div>
            {/* edit dialog: */}
            <ModalStatus theme='primary' viewport={listItemRef} backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && (editMode !== 'full') && <>
                    {(editMode === 'name'      ) && <SimpleEditModelDialog<UserDetail> model={model} updateModelApi={useUpdateUser} edit={editMode} onClose={handleEditDialogClose} editorComponent={<NameEditor />} />}
                    {(editMode === 'username'  ) && <SimpleEditModelDialog<UserDetail> model={model} updateModelApi={useUpdateUser} edit={editMode} onClose={handleEditDialogClose} editorComponent={<UniqueUsernameEditor currentValue={username ?? ''} />} />}
                    {(editMode === 'email'     ) && <SimpleEditModelDialog<UserDetail> model={model} updateModelApi={useUpdateUser} edit={editMode} onClose={handleEditDialogClose} editorComponent={<UniqueEmailEditor    currentValue={email} />} />}
                </>}
            </ModalStatus>
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setEditMode(null)}>
                {!!editMode && ((editMode === 'image') || (editMode === 'roleId') || (editMode === 'full')) && <EditUserDialog user={model} onClose={handleEditDialogClose} defaultExpandedTabIndex={((): number|undefined => {
                    // switch (editMode === 'roleId') ? 2 : undefined
                    switch (editMode) {
                        case 'image' : return 1;
                        case 'roleId': return 2;
                        default      : return undefined;
                    } // switch
                })()} />}
            </ModalStatus>
        </ListItem>
    );
};

/* <UserPage> */
export default function UserPage(): JSX.Element|null {
    // styles:
    const styleSheet = usePageStyleSheet();
    
    
    
    // states:
    const [page   , setPage   ] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);
    
    
    
    // sessions:
    const { data: session, status: sessionStatus } = useSession();
    const role = session?.role;
    const privilegeAdd = !!role?.user_c;
    
    
    
    // stores:
    const getModelPaginationApi = useGetUserPage({ page, perPage });
    const {data, isLoading: isLoadingAndNoData, isError, refetch } = getModelPaginationApi;
    const isErrorAndNoData = isError && !data;
    
    const getRolePaginationApi  = useGetRoleList();
    
    
    
    // jsx:
    if (isLoadingAndNoData || (sessionStatus === 'loading'        )) return <PageLoading />;
    if (isErrorAndNoData   || (sessionStatus === 'unauthenticated')) return <PageError onRetry={refetch} />;
    return (
        <Main className={styleSheet.page}>
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
                    privilegeAdd
                    ? <UserCreate onClose={undefined as any} />
                    : undefined
                }
            />
        </Main>
    )
}



// export const metadata : Metadata = {
//     title       : PAGE_USER_TITLE,
//     description : PAGE_USER_DESCRIPTION,
// };
