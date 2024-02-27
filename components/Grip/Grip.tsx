// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

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
import {
    useGripStyleSheet,
}                           from './styles/loader'



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
    // props:
    const {
        // refs:
        elmRef,
        
        
        
        // other props:
        ...restGripProps
    } = props;
    
    
    
    // styles:
    const styleSheet   = useGripStyleSheet();
    
    
    
    // refs:
    const gripRef      = useRef<TElement|null>(null);
    const mergedElmRef = useMergeRefs(
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
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
    
    
    
    // default props:
    const {
        // variants:
        nude      = true,            // defaults to nude
        mild      = true,            // defaults to mild
        
        
        
        // classes:
        mainClass = styleSheet.main, // defaults to internal styleSheet
        
        
        
        // children:
        children  = (new Array(requiredDots)).fill(null).map((_item, index) =>
            <span key={index} />
        ),                           // defaults to dotted children
        
        
        
        // other props:
        ...restIndicatorProps
    } = restGripProps as (typeof restGripProps & React.PropsWithChildren<{}>);
    
    
    
    // jsx:
    return (
        <Indicator<TElement>
            // other props:
            {...restIndicatorProps}
            
            
            
            // refs:
            elmRef={mergedElmRef}
            
            
            
            // variants:
            nude={nude}
            mild={mild}
            
            
            
            // classes:
            mainClass={mainClass}
        >
            {children}
        </Indicator>
    );
};
export {
    Grip,            // named export for readibility
    Grip as default, // default export to support React.lazy
}



export interface GripComponentProps<TElement extends Element = HTMLElement>
{
    // components:
    gripComponent ?: React.ReactComponentElement<any, GripProps<TElement>>
}
