// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
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
import {
    // contexts:
    TabState,
    
    
    
    // react components:
    TabStateProvider,
}                           from './states/tabState'
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
        Omit<GenericProps<TElement>,            // the *wrapper* component of <Generic<TElement> >
            // refs:
            |'elmRef'                           // the elmRef is moved to <TabHeader>
            
            // values:
            |'onChange'                         // converted to TValue
            
            // children:
            |'children'                         // aliased `children` to `options`
            |'dangerouslySetInnerHTML'          // not supported
        >,
        Omit<TabHeaderProps<Element, TValue>,   // the *main* component of <List<Element> >
            // <Generic>:
            |keyof Omit<GenericProps<TElement>,
                // refs:
                |'elmRef'                       // the elmRef is moved to <TabHeader>
                
                // values:
                |'onChange'                     // converted to TValue
                
                // children:
                |'children'                     // aliased `children` to `options`
                |'dangerouslySetInnerHTML'      // not supported
            >
        >,
        Omit<TabBodyProps<Element, TValue>,     // the *complement* component of <Content<Element> >
            |keyof BasicProps<Element>
        >,
        Omit<TabState<TValue>,
            |'options'                          // already aliased by `children`
        >
{
    // children:
    children : TabState<TValue>['options']
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
    
    
    
    // jsx:
    return (
        /* the *wrapper* component of <Generic<TElement> > */
        <Generic<TElement>
            // other props:
            {...restGenericProps}
            
            
            
            // semantics:
            tag={props.tag ?? 'div'}
            
            
            
            // refs:
            outerRef={outerRef}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styles.main}
        >
            <TabStateProvider<TValue>
                // values:
                options={options}
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}
            >
                {/* the *main* component of <List<Element> > */}
                <TabHeader<Element, TValue>
                    // refs:
                    elmRef={elmRef}
                    
                    
                    
                    // variants:
                    {...basicVariantProps}
                    
                    orientation={orientation}
                    listStyle={listStyle}
                    
                    
                    
                    // accessibilities:
                    label={label}
                    
                    
                    
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
                />
                
                {/* the *complement* component of <Content<Element> > */}
                <TabBody<Element, TValue>
                    // variants:
                    {...basicVariantProps}
                    
                    
                    
                    // components:
                    bodyComponent={bodyComponent}
                />
            </TabStateProvider>
        </Generic>
    );
};
export {
    Tab,
    Tab as default,
}
