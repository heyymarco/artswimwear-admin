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
    TabOptionHeaderProps,
    TabOptionHeader,
}                           from './TabOptionHeader'
import {
    // react components:
    TabOptionBodyProps,
    TabOptionBody,
}                           from './TabOptionBody'



export interface TabOptionProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        TabOptionHeaderProps<TElement, TValue>,
        TabOptionBodyProps<TElement, TValue>
{
    // values:
    defaultValue ?: TValue
}
const TabOption = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabOptionProps<TElement, TValue>): JSX.Element|null => {
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
        options,
        defaultValue,
        value,
        onChange,
    ...restTabOptionHeaderProps} = props;
    
    
    
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
            <TabOptionHeader
                // other props:
                {...restTabOptionHeaderProps}
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // values:
                options={options}
                value={valueFn}
                onChange={handleChange}
            />
            <TabOptionBody
                // variants:
                {...basicVariantProps}
                nude={nude}
                
                
                
                // values:
                options={options}
                value={valueFn}
            />
        </Generic>
    );
};
export {
    TabOption,
    TabOption as default,
}
