// react:
import {
    // react:
    default as React,
}                           from 'react'

// internals:
import {
    // hooks:
    useBusinessContext,
}                           from './businessDataContext'



// react components:

const BusinessName = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        model,
    } = useBusinessContext();
    
    
    
    // jsx:
    return (
        model?.name || null
    );
};
const BusinessUrl = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        model,
    } = useBusinessContext();
    const url = model?.url;
    
    
    
    // jsx:
    return (
        url || null
    );
};
const BusinessLink = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        model,
    } = useBusinessContext();
    const url = model?.url;
    
    
    
    // jsx:
    if (!url) return null;
    return (
        <a href={url}>
            {url}
        </a>
    );
};
const BusinessPayment = (): React.ReactNode => {
    // contexts:
    const {
        // data:
        model,
    } = useBusinessContext();
    
    
    
    // jsx:
    return (
        model?.payment ?? null
    );
};

export const Business = {
    Name    : BusinessName,
    Url     : BusinessUrl,
    Link    : BusinessLink,
    Payment : BusinessPayment,
};
