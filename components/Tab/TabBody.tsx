// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeClasses,
    useMergeStyles,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    BasicProps,
    Content,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // features:
    usesTab,
}                           from './features/tab'
import {
    // variants:
    TabPanelVariant,
    useTabPanelVariant,
}                           from './variants/TabPanelVariant'
import {
    // states:
    TabExpandedChangeEvent,
    useTabState,
}                           from './states/tabState'
import {
    // react components:
    TabPanelWithState,
}                           from './TabPanelWithState'
import type {
    // react components:
    TabPanelProps,
}                           from './TabPanel'



// react components:
export interface TabBodyProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<BasicProps<TElement>,
            // values:
            |'defaultValue'            // not supported
            |'value'                   // not supported
            |'onChange'                // not supported
            
            // children:
            |'children'                // replaced `children` with `tabPanels`
            |'dangerouslySetInnerHTML' // not supported
        >,
        
        // variants:
        TabPanelVariant
{
    // components:
    bodyComponent ?: React.ReactComponentElement<any, BasicProps<TElement>>
}
const TabBody = <TElement extends Element = HTMLElement>(props: TabBodyProps<TElement>): JSX.Element|null => {
    // variants:
    const tabPanelVariant = useTabPanelVariant(props);
    
    
    
    // rest props:
    const {
        // variants:
        tabPanelStyle : _tabPanelStyle, // remove
        
        
        
        // components:
        bodyComponent = (<Content<TElement> /> as React.ReactComponentElement<any, BasicProps<TElement>>),
    ...restBasicProps} = props;
    
    
    
    // classes:
    const classes = useMergeClasses(
        // preserves the original `classes` from `bodyComponent`:
        bodyComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        'tabBody',
    );
    const variantClasses = useMergeClasses(
        // preserves the original `variantClasses`:
        props.variantClasses,
        
        
        
        // variants:
        tabPanelVariant.class,
    );
    
    
    
    // states:
    const {
        // states:
        expandedTabIndex,
        
        
        
        // data:
        tabPanels,
        tabId,
    } = useTabState();
    const collapsedTabIndexRef = useRef<number>(expandedTabIndex);
    
    
    
    // features:
    const {tabVars} = usesTab();
    
    
    
    // styles:
    const expandedTabIndexStyle = useMemo<React.CSSProperties>(() => ({
        // values:
        [
            tabVars.collapsedTabIndex
            .slice(4, -1) // fix: var(--customProp) => --customProp
        ] : collapsedTabIndexRef.current,
        
        [
            tabVars.expandedTabIndex
            .slice(4, -1) // fix: var(--customProp) => --customProp
        ] : expandedTabIndex,
    }), [tabVars.expandedTabIndex, expandedTabIndex]);
    const mergedStyle           = useMergeStyles(
        // values:
        expandedTabIndexStyle,
        
        
        
        // preserves the original `style` from `props` (can overwrite the `expandedTabIndexStyle`):
        props.style,
        
        
        
        // preserves the original `style` from `bodyComponent` (can overwrite the `style` and/or the `expandedTabIndexStyle`):
        bodyComponent.props.style,
    );
    
    
    
    // jsx:
    /* <TabBody> */
    return React.cloneElement<BasicProps<TElement>>(bodyComponent,
        // props:
        {
            // other props:
            ...restBasicProps,
            ...bodyComponent.props, // overwrites restBasicProps (if any conflics)
            
            
            
            // variants:
         // outlined       : bodyComponent.props.outlined ?? props.outlined ?? false, // kill outlined variant // to appear as *selected*, so it *looks* the same as *tab*
            mild           : bodyComponent.props.mild     ?? props.mild     ?? false, // kill mild     variant // to appear as *selected*, so it *looks* the same as *tab*
            
            
            
            // classes:
            classes        : classes,
            variantClasses : variantClasses,
            
            
            
            // styles:
            style          : mergedStyle,
        },
        
        
        
        // children:
        React.Children.map(bodyComponent.props.children ?? tabPanels, (tabPanel, tabIndex) => {
            // conditions:
            if (!React.isValidElement<TabPanelProps<Element, TabExpandedChangeEvent>>(tabPanel)) return tabPanel; // not a <TabPanel> => ignore
            
            
            
            // fn props:
            const tabHeaderId = `${tabId}h${tabIndex}`;
            const tabPanelId  = `${tabId}p${tabIndex}`;
            
            
            
            // props:
            const tabPanelProps = tabPanel.props;
            
            
            
            // jsx:
            return (
                <TabPanelWithState<Element, TabExpandedChangeEvent>
                    // other props:
                    {...tabPanelProps} // steals all tabPanel's props, so the <Owner> can recognize the <TabPanelWithState> as <TheirChild>
                    
                    
                    
                    // positions:
                    tabIndex={tabIndex}
                    
                    
                    
                    // components:
                    tabPanelComponent={
                        // clone tabPanel element with (almost) blank props:
                        <tabPanel.type
                            // identifiers:
                            key={tabPanel.key}
                            id={tabPanelProps.id ?? tabPanelId}
                            
                            
                            
                            // semantics:
                            aria-labelledby={tabPanelProps['aria-labelledby'] ?? tabHeaderId}
                            
                            
                            
                            //#region restore conflicting props
                            {...{
                                ...(('tabIndex'          in tabPanelProps) ? { tabIndex          : tabPanelProps.tabIndex          } : undefined),
                                ...(('tabPanelComponent' in tabPanelProps) ? { tabPanelComponent : tabPanelProps.tabPanelComponent } : undefined),
                            }}
                            //#endregion restore conflicting props
                        />
                    }
                />
            );
        })
    );
};
export {
    TabBody,
    TabBody as default,
}
