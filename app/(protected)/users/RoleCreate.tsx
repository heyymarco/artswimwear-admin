'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import type {
    // react components:
    ModelCreateProps,
}                           from '@/components/SectionModelEditor'

// private components:
import {
    EditRoleDialog,
}                           from './EditRoleDialog'



// react components:
interface RoleCreateProps extends ModelCreateProps {}
const RoleCreate = (props: RoleCreateProps): JSX.Element|null => {
    // jsx:
    return (
        <EditRoleDialog
            // other props:
            {...props}
            
            
            
            // data:
            model={null} // create a new model
        />
    );
};
export {
    RoleCreate,
    RoleCreate as default,
}
