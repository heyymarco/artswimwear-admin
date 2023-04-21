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
    EventHandler,
    useMergeEvents,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component



// hooks:

// states:

//#region tabState
export interface TabExpandedChangeEvent extends ExpandedChangeEvent {
    // positions:
    tabIndex : number
}



export interface TabState
{
    // states:
    tabPanels                : React.ReactNode // required
    expandedTabIndex        ?: number
    triggerExpandedChange    : (tabIndex: number) => void
}

const TabStateContext = createContext<TabState>({
    tabPanels                : undefined,
    triggerExpandedChange    : () => {},
});
TabStateContext.displayName  = 'TabState';

export const useTabState = (): TabState => {
    return useContext(TabStateContext);
}



// react components:
export interface TabStateProps<TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>
{
    // states:
    tabPanels                : React.ReactNode // required
    defaultExpandedTabIndex ?: number
    expandedTabIndex        ?: number
    onExpandedChange        ?: EventHandler<TTabExpandedChangeEvent>
    
    
    
    // children:
    children                ?: React.ReactNode
}
const TabStateProvider = <TTabExpandedChangeEvent extends TabExpandedChangeEvent = TabExpandedChangeEvent>(props: TabStateProps<TTabExpandedChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // states:
        tabPanels,
        defaultExpandedTabIndex,
        expandedTabIndex,
        onExpandedChange,
        
        
        
        // children:
        children,
    } = props;
    
    
    
    // fn states:
    const isControllableExpanded = (expandedTabIndex !== undefined);
    const [expandedTabIndexDn, setExpandedTabIndexDn] = useState<number>(defaultExpandedTabIndex ?? 0);
    const expandedTabIndexFn : number = (expandedTabIndex /*controllable*/ ?? expandedTabIndexDn /*uncontrollable*/);
    
    
    
    // handlers:
    const handleExpandedChangeInternal = useEvent<EventHandler<TTabExpandedChangeEvent>>(({tabIndex}) => {
        // update state:
        if (!isControllableExpanded) setExpandedTabIndexDn(tabIndex);
    });
    const handleExpandedChange         = useMergeEvents(
        // preserves the original `onExpandedChange` from `props`:
        onExpandedChange,
        
        
        
        // actions:
        handleExpandedChangeInternal,
    );
    const triggerExpandedChange        = useEvent((tabIndex: number): void => {
        handleExpandedChange?.({ expanded: true, tabIndex } as TTabExpandedChangeEvent)
    });
    
    
    
    // jsx:
    return (
        <TabStateContext.Provider value={{
            tabPanels             : tabPanels,
            expandedTabIndex      : expandedTabIndexFn,
            triggerExpandedChange : triggerExpandedChange,
        }}>
            {children}
        </TabStateContext.Provider>
    );
};
export {
    TabStateProvider,
    TabStateProvider as default,
}
//#endregion tabState
