'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // status-components:
    Badge,
    
    
    
    // utility-components:
    useDialogMessage,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Main,
    Section,
}                           from '@heymarco/section'
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    ProfileImage,
}                           from '@/components/ProfileImage'
import {
    EditButton,
}                           from '@/components/EditButton'
import {
    CompoundWithBadge,
}                           from '@/components/CompoundWithBadge'
import {
    UniqueUsernameEditor,
}                           from '@/components/editors/UniqueUsernameEditor'
import {
    SimpleEditModelDialogResult,
    SimpleEditModelDialog,
}                           from '@/components/dialogs/SimpleEditModelDialog'
import {
    SimpleEditAdminImageDialog,
}                           from '@/components/dialogs/SimpleEditAdminImageDialog'

// models:
import {
    type AdminDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateAdmin,
}                           from '@/store/features/api/apiSlice'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'



// styles:
const useProfilePageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './page-styles')
, { id: 'pmmu5ep2va' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export function ProfilePageContent() {
    // styles:
    const styleSheet = useProfilePageStyleSheet();
    
    
    
    // sessions:
    const { data: session, update: updateSession } = useSession();
    const admin = session?.user;
    const adminUsername = session?.credentials?.username ?? null;
    const adminModel = useMemo<Omit<AdminDetail, 'adminRoleId'>|null>(() => {
        if (!admin) return null;
        
        
        
        return {
            id       : admin.id,
            name     : admin.name,
            email    : admin.email,
            image    : admin.image,
            username : adminUsername,
        } satisfies Omit<AdminDetail, 'adminRoleId'>;
    }, [admin, adminUsername]);
    const { name: adminName, email: adminEmail, image: adminImage } = adminModel ?? {};
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleEdit = useEvent(async (edit: 'image'|'name'|'username') => {
        const updatedAdminModel = await showDialog<SimpleEditModelDialogResult<Omit<AdminDetail, 'adminRoleId'>>>(
            (edit === 'image')
            ? <SimpleEditAdminImageDialog
                // data:
                model={adminModel!}
                edit={edit}
                
                
                
                // stores:
                updateModelApi={useUpdateAdmin as any}
            />
            : <SimpleEditModelDialog<Omit<AdminDetail, 'adminRoleId'>>
                // data:
                model={adminModel!}
                edit={edit}
                
                
                
                // stores:
                updateModelApi={useUpdateAdmin as any}
                
                
                
                // components:
                editorComponent={(() => {
                    switch (edit) {
                        case 'name'     : return <NameEditor
                            // validations:
                            required={true}
                        />;
                        case 'username' : return <UniqueUsernameEditor currentValue={adminModel!['username'] ?? ''} />;
                        default         : throw Error('app error');
                    } // switch
                })()}
            />
        );
        if (updatedAdminModel === undefined) return;
        updateSession();
    });
    
    
    
    // jsx:
    return (
        <Main className={styleSheet.main}>
            <Section className='fill-self'>
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
                            floatingShift={8}
                            floatingOffset={-26}
                        >
                            <EditButton className='edit overlay' onClick={() => handleEdit('image')}>
                                <></>
                            </EditButton>
                        </Badge>
                    }
                    elementComponent={
                        <ProfileImage
                            // appearances:
                            src={resolveMediaUrl(adminImage ?? undefined)}
                            
                            
                            
                            // variants:
                            theme='primary'
                            // profileImageStyle='circle'
                            
                            
                            
                            // classes:
                            className='image'
                        />
                    }
                />
                
                <h3 className='name'>
                    <span className='label'>
                        Name:
                    </span>
                    {adminName}
                    <EditButton onClick={() => handleEdit('name')} />
                </h3>
                
                <p className='username'>
                    <span className='label'>
                        Username:
                    </span>
                    {adminUsername || <span className='noValue'>No Username</span>}
                    <EditButton onClick={() => handleEdit('username')} />
                </p>
                
                <p className='email'>
                    <span className='label'>
                        Email:
                    </span>
                    {adminEmail}
                </p>
            </Section>
        </Main>
    );
}
