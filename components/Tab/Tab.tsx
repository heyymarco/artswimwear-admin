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
        Omit<GenericProps<Element>,             // the *wrapper* component of <Generic<Element> >
            // refs:
            |'elmRef'                           // the elmRef is moved to <TabHeader>
            
            // values:
            |'onChange'                         // converted to TValue
            
            // children:
            |'children'                         // replaced `children` with `options.label`
            |'dangerouslySetInnerHTML'          // not supported
        >,
        Omit<TabHeaderProps<TElement, TValue>,  // the *main* component of <List<TElement> >
            // <Generic>:
            |keyof Omit<GenericProps<Element>,
                // refs:
                |'elmRef'                       // the elmRef is moved to <TabHeader>
                
                // values:
                |'onChange'                     // converted to TValue
                
                // children:
                |'children'                     // replaced `children` with `options.label`
                |'dangerouslySetInnerHTML'      // not supported
            >
        >,
        Omit<TabBodyProps<Element, TValue>,     // the *complement* component of <Content<Element> >
            |keyof BasicProps<Element>
        >
{
    // values:
    defaultValue ?: TValue
}
const Tab = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styles = useTabStyleSheet();
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // variants:
        size     : _size,     // remove
        theme    : _theme,    // remove
        gradient : _gradient, // remove
        outlined : _outlined, // remove
        mild     : _mild,     // remove
        
        orientation,
        listStyle,
        
        
        
        // accessibilities:
        label,
        
        
        
        // values:
        children : options,
        defaultValue,
        value,
        onChange,
        
        
        
        // behaviors:
        actionCtrl,
        
        
        
        // states:
        enabled,
        inheritEnabled,
        active,
        inheritActive,
        readOnly,
        inheritReadOnly,
        
        
        
        // components:
        listComponent,
        listItemComponent,
        bodyComponent,
    ...restGenericProps} = props;
    
    
    
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
        /* the *wrapper* component of <Generic<Element> > */
        <Generic<Element>
            // other props:
            {...restGenericProps}
            
            
            
            // semantics:
            tag={props.tag ?? 'div'}
            
            
            
            // refs:
            outerRef={outerRef}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styles.main}
        >
            {/* the *main* component of <List<TElement> > */}
            <TabHeader<TElement, TValue>
                // refs:
                elmRef={elmRef}
                
                
                
                // variants:
                {...basicVariantProps}
                
                orientation={orientation}
                listStyle={listStyle}
                
                
                
                // accessibilities:
                label={label}
                
                
                
                // values:
                value={valueFn}
                onChange={handleChange}
                
                
                
                // behaviors:
                actionCtrl={actionCtrl}
                
                
                
                // states:
                enabled={enabled}
                inheritEnabled={inheritEnabled}
                active={active}
                inheritActive={inheritActive}
                readOnly={readOnly}
                inheritReadOnly={inheritReadOnly}
                
                
                
                // components:
                listComponent={listComponent}
                listItemComponent={listItemComponent}
            >
                {options}
            </TabHeader>
            
            {/* the *complement* component of <Content<Element> > */}
            <TabBody<Element, TValue>
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
