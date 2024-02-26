// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui components:
import {
    // react components:
    IndicatorProps,
    Indicator,
}                           from '@reusable-ui/indicator'       // a base component



// styles:
import './styles/styles';
export const useGripStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { specificityWeight: 2, id: 'ea59ydp5qf' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:
export interface GripProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<IndicatorProps<TElement>,
            |'children' // no nested children
        >
{
}
const Grip = <TElement extends Element = HTMLElement>(props: GripProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet = useGripStyleSheet();
    
    
    
    // jsx:
    return (
        <Indicator<TElement>
            // other props:
            {...props}
            
            
            
            // variants:
            nude={props.nude ?? true}
            mild={props.mild ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {(new Array(9)).fill(null).map((_item, index) =>
                <span key={index} />
            )}
        </Indicator>
    );
};
export {
    Grip,
    Grip as default,
}



export interface GripComponentProps<TElement extends Element = HTMLElement>
{
    // components:
    gripComponent ?: React.ReactComponentElement<any, GripProps<TElement>>
}
