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

// styles:
import {
    useProfilePageStyleSheet,
}                           from './styles/loader'

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
    type AdminPreview,
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



export function ProfilePageContent() {
    // styles:
    const styleSheet = useProfilePageStyleSheet();
    
    
    
    // sessions:
    const { data: session, update: updateSession } = useSession();
    const admin = session?.user;
    const adminUsername = session?.credentials?.username ?? null;
    const adminModel = useMemo<AdminPreview|null>(() => {
        if (!admin) return null;
        
        
        
        return {
            id       : admin.id,
            name     : admin.name,
            email    : admin.email,
            image    : admin.image,
            username : adminUsername,
        } satisfies AdminPreview;
    }, [admin, adminUsername]);
    const { name: adminName, email: adminEmail, image: adminImage } = adminModel ?? {};
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // handlers:
    const handleEdit = useEvent(async (edit: 'image'|'name'|'username') => {
        const updatedAdminModel = await showDialog<SimpleEditModelDialogResult<AdminPreview>>(
            (edit === 'image')
            ? <SimpleEditAdminImageDialog
                // data:
                model={adminModel!}
                edit={edit}
                
                
                
                // stores:
                useUpdateModel={useUpdateAdmin as any}
            />
            : <SimpleEditModelDialog<AdminPreview>
                // data:
                model={adminModel!}
                edit={edit}
                
                
                
                // stores:
                useUpdateModel={useUpdateAdmin as any}
                
                
                
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
                            
                            
                            
                            // classes:
                            className='floatingEdit'
                            
                            
                            
                            // floatable:
                            floatingPlacement='left-start'
                            floatingShift={0}
                            floatingOffset={0}
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
                            mild={true}
                            // profileImageStyle='circle'
                            
                            
                            
                            // classes:
                            className='preview'
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
