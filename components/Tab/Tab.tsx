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

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// internals:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    // react components:
    TabHeaderProps,
    TabHeader,
}                           from './TabHeader'
import {
    // react components:
    TabBodyProps,
    TabBody,
}                           from './TabBody'



// styles:
export const useTabBodyStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'qjlmg10jy4' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export interface TabProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        TabHeaderProps<TElement, TValue>,
        TabBodyProps<TElement, TValue>
{
    // values:
    defaultValue ?: TValue
}
const Tab = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styles = useTabBodyStyleSheet();
    
    
    
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
        
        
        
        // components:
        bodyComponent,
    ...restTabHeaderProps} = props;
    
    
    
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
        <Generic<TElement>
            // semantics:
            tag={tag}
            
            
            
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // classes:
            mainClass={mainClass ?? styles.main}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            <TabHeader<TElement, TValue>
                // other props:
                {...restTabHeaderProps}
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // values:
                value={valueFn}
                onChange={handleChange}
            >
                {options}
            </TabHeader>
            <TabBody<TElement, TValue>
                // variants:
                {...basicVariantProps}
                nude={nude}
                
                
                
                // values:
                value={valueFn}
                
                
                
                // components:
                bodyComponent={bodyComponent}
            >
                {options}
            </TabBody>
        </Generic>
    );
};
export {
    Tab,
    Tab as default,
}
