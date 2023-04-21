// react:
import {
    // react:
    default as React,
    
    
    
    // contexts:
    createContext,
    
    
    
    // hooks:
    useContext,
    useState,
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// internals:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'



// contexts:
export interface TabState<TValue extends any = string> {
    // values:
    options        : React.ReactNode // required
    defaultValue  ?: TValue
    value         ?: TValue
    onChange      ?: EditorChangeEventHandler<TValue>
}
const TabStateContext = createContext<TabState<any>>({
    options        : undefined,
});
TabStateContext.displayName  = 'TabState';



// hooks:
export const useTabState = <TValue extends any = string>(): TabState<TValue> => {
    return useContext(TabStateContext) as TabState<TValue>;
}



// react components:
export interface TabStateProps<TValue extends any = string>
    extends
        TabState<TValue>
{
    // children:
    children ?: React.ReactNode
}
const TabStateProvider = <TValue extends any = string>(props: TabStateProps<TValue>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        options,
        defaultValue,
        value,
        onChange,
        
        
        
        // children:
        children,
    } = props;
    
    
    
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
    
    
    
    // contexts:
    const tabState = useMemo<TabState<TValue>>(() => ({
        options      : options,
        defaultValue : defaultValue,
        value        : valueFn,
        onChange     : handleChange,
    }), [options, defaultValue, valueFn, handleChange]);
    
    
    
    // jsx:
    return (
        <TabStateContext.Provider value={tabState}>
            {children}
        </TabStateContext.Provider>
    );
};
export {
    TabStateProvider,
    TabStateProvider as default,
}
