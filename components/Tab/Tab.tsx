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
    GenericProps,
    Generic,
    
    BasicProps,
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
export const useTabStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'qjlmg10jy4' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export interface TabProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        Omit<GenericProps<HTMLElement>,         // the *wrapper* component of <Generic<HTMLElement> >
            // refs:
            |'elmRef'       // the elmRef is moved to <TabHeader>
            
            // values:
            |'onChange'     // converted to TValue
        >,
        Omit<TabHeaderProps<TElement, TValue>,  // the *main* component of <List<TElement> >
            // <Generic>:
            |keyof Omit<GenericProps<HTMLElement>,
                // refs:
                |'elmRef'   // the elmRef is moved to <TabHeader>
                
                // values:
                |'onChange' // converted to TValue
            >
        >,
        Omit<TabBodyProps<HTMLElement, TValue>, // the *complement* component of <Content<HTMLElement> >
            |keyof BasicProps<HTMLElement>
        >
{
    // values:
    defaultValue ?: TValue
}
const Tab = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styles = useTabStyleSheet();
    
    
    
    // rest props:
    const {
        // semantics:
        tag = 'div',
        
        
        
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
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
        /* the *wrapper* component of <Generic<HTMLElement> > */
        <Generic<HTMLElement>
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
            {/* the *main* component of <List<TElement> > */}
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
            
            {/* the *complement* component of <Content<HTMLElement> > */}
            <TabBody<HTMLElement, TValue>
                // variants:
                {...basicVariantProps}
                
                
                
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
