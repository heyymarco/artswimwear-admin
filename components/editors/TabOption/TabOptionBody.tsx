// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui components:
import {
    // react components:
    BasicProps,
    Content,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // types:
    TabOptionItem,
}                           from './types'



// styles:
export const useTabOptionBodyStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'qjlmg10jy4', specificityWeight: 2 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export interface TabOptionBodyProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        Omit<BasicProps<TElement>,
            // values:
            |'defaultValue' // converted to TValue
            |'value'        // converted to TValue
            |'onChange'     // converted to TValue
            
            // children:
            |'children'     // replaced `children` with `options.description`
        >
{
    // values:
    options       : TabOptionItem<TValue>[] // required
    value        ?: TValue
}
const TabOptionBody = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabOptionBodyProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styles = useTabOptionBodyStyleSheet();
    
    
    
    // rest props:
    const {
        // values:
        options,
        value,
    ...restContentProps} = props;
    
    
    
    // jsx:
    return (
        <Content
            // other props:
            {...restContentProps}
            
            
            
            // classes:
            className={styles.main}
        >
            {options.map(({value: optionValue, description: optionDescription}) =>
                <div className={`toggleContent ${Object.is(value, optionValue) ? 'expanded' : ''}`}>
                    {optionDescription}
                </div>
            )}
        </Content>
    );
};
export {
    TabOptionBody,
    TabOptionBody as default,
}
