// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Generic,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    // react components:
    TabControlHeaderProps,
    TabControlHeader,
}                           from './TabControlHeader'
import {
    // react components:
    TabControlBodyProps,
    TabControlBody,
}                           from './TabControlBody'



export interface TabControlProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        TabControlHeaderProps<TElement, TValue>,
        TabControlBodyProps<TElement, TValue>
{
    // values:
    defaultValue ?: TValue
}
const TabControl = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabControlProps<TElement, TValue>): JSX.Element|null => {
    // rest props:
    const {
        // semantics:
        tag = 'div',
        
        
        
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // variants:
        nude,
        
        
        
        // classes:
        mainClass,
        classes,
        variantClasses,
        stateClasses,
        className,
        
        
        
        // styles:
        style,
        
        
        
        // values:
        children : options,
        defaultValue,
        value,
        onChange,
    ...restTabControlHeaderProps} = props;
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // fn states:
    const isControllableValue = (value !== undefined);
    const [valueDn, setValueDn] = useState<TValue|undefined>(defaultValue);
    const valueFn : TValue|undefined = (
        (value !== undefined)
        ? value   /*controllable*/
        : valueDn /*uncontrollable*/
    );
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<TValue>>((value) => {
        // update state:
        if (!isControllableValue) setValueDn(value);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    
    
    // jsx:
    return (
        <Generic
            // semantics:
            tag={tag}
            
            
            
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            <TabControlHeader
                // other props:
                {...restTabControlHeaderProps}
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // values:
                value={valueFn}
                onChange={handleChange}
            >
                {options}
            </TabControlHeader>
            <TabControlBody
                // variants:
                {...basicVariantProps}
                nude={nude}
                
                
                
                // values:
                value={valueFn}
            >
                {options}
            </TabControlBody>
        </Generic>
    );
};
export {
    TabControl,
    TabControl as default,
}
