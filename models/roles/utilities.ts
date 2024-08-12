// models:
import {
    type Prisma,
}                           from '@/models'



// utilities:
export const roleDetailSelect = {
    id          : true,
    
    name        : true,
    
    product_r   : true,
    product_c   : true,
    product_ud  : true,
    product_ui  : true,
    product_up  : true,
    product_us  : true,
    product_uv  : true,
    product_d   : true,
    
    order_r     : true,
    order_us    : true,
    order_usa   : true,
    order_upmu  : true,
    order_upmp  : true,
    
    shipping_r  : true,
    shipping_c  : true,
    shipping_ud : true,
    shipping_up : true,
    shipping_uv : true,
    shipping_d  : true,
    
    admin_r     : true,
    admin_c     : true,
    admin_un    : true,
    admin_uu    : true,
    admin_ue    : true,
    admin_up    : true,
    admin_ui    : true,
    admin_ur    : true,
    admin_d     : true,
    
    role_c      : true,
    role_u      : true,
    role_d      : true,
} satisfies Prisma.AdminRoleSelect;