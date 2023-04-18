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
    IndicatorProps,
    Indicator,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // types:
    TabControlOption,
}                           from './types'



// styles:
export const useTabControlBodyStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'qjlmg10jy4', specificityWeight: 2 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export interface TabControlBodyProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        Omit<IndicatorProps<TElement>,
            // values:
            |'defaultValue' // converted to TValue
            |'value'        // converted to TValue
            |'onChange'     // converted to TValue
            
            // children:
            |'children'     // replaced `children` with `options.content`
        >
{
    // values:
    children      : TabControlOption<TValue>[] // required
    value        ?: TValue
}
const TabControlBody = <TElement extends Element = HTMLElement, TValue extends any = string>(props: TabControlBodyProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styles = useTabControlBodyStyleSheet();
    
    
    
    // rest props:
    const {
        // values:
        children : options,
        value,
    ...restContentProps} = props;
    
    
    
    // jsx:
    return (
        <Indicator
            // other props:
            {...restContentProps}
            
            
            
            // variants:
            active={props.active ?? true} // to appear as *selected*, so it *looks* the same as *tab*
            
            
            
            // classes:
            className={styles.main}
        >
            {options.map(({value: optionValue, content: optionDescription}) =>
                <div key={`${optionValue}`} className={`toggleContent ${Object.is(value, optionValue) ? 'expanded' : ''}`}>
                    {optionDescription}
                </div>
            )}
        </Indicator>
    );
};
export {
    TabControlBody,
    TabControlBody as default,
}
