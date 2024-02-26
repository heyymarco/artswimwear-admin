// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

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
    const styleSheet   = useGripStyleSheet();
    
    
    
    // refs:
    const gripRef      = useRef<TElement|null>(null);
    const mergedElmRef = useMergeRefs(
        // preserves the original `elmRef`:
        props.elmRef,
        
        
        
        gripRef,
    );
    
    
    
    // states:
    const [requiredDots, setRequiredDots] = useState<number>(0);
    
    
    
    // effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const gripElm = gripRef.current;
        if (!gripElm) return;
        
        
        
        // setups:
        const observer = new ResizeObserver((entries) => {
            const style = getComputedStyle(gripElm);
            const gridTemplateColumns = style.gridTemplateColumns.split(/\s+/g).length;
            const gridTemplateRows    = style.gridTemplateRows.split(/\s+/g).length;
            setRequiredDots(gridTemplateColumns * gridTemplateRows);
        });
        observer.observe(gripElm, { box: 'content-box' });
        
        
        
        // cleanups:
        return () => {
            observer.disconnect();
        };
    }, []);
    
    
    
    // jsx:
    return (
        <Indicator<TElement>
            // other props:
            {...props}
            
            
            
            // refs:
            elmRef={mergedElmRef}
            
            
            
            // variants:
            nude={props.nude ?? true}
            mild={props.mild ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {(new Array(requiredDots)).fill(null).map((_item, index) =>
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
