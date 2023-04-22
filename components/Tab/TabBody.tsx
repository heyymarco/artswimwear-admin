// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeClasses,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    BasicProps,
    Content,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // states:
    TabExpandedChangeEvent,
    useTabState,
}                           from './states/tabState'
import type {
    // react components:
    TabPanelProps,
}                           from './TabPanel'



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
        >
{
    // components:
    bodyComponent ?: React.ReactComponentElement<any, BasicProps<TElement>>
}
const TabBody = <TElement extends Element = HTMLElement>(props: TabBodyProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
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
    
    
    
    // states:
    const {
        // states:
        expandedTabIndex,
        
        
        
        // data:
        tabPanels,
    } = useTabState();
    
    
    
    // jsx:
    /* <TabBody> */
    return React.cloneElement<BasicProps<TElement>>(bodyComponent,
        // props:
        {
            // other props:
            ...restBasicProps,
            ...bodyComponent.props, // overwrites restBasicProps (if any conflics)
            
            
            
            // variants:
         // outlined : bodyComponent.props.outlined ?? props.outlined ?? false, // kill outlined variant // to appear as *selected*, so it *looks* the same as *tab*
            mild     : bodyComponent.props.mild     ?? props.mild     ?? false, // kill mild     variant // to appear as *selected*, so it *looks* the same as *tab*
            
            
            
            // classes:
            classes  : classes,
        },
        
        
        
        // children:
        bodyComponent.props.children ?? React.Children.map(tabPanels, (tabPanel, tabIndex) => {
            // conditions:
            const isActive = (expandedTabIndex === tabIndex);
            if (!isActive) return tabPanel;
            if (!React.isValidElement<TabPanelProps<Element, TabExpandedChangeEvent>>(tabPanel)) return tabPanel;
            
            
            
            // jsx:
            return React.cloneElement<TabPanelProps<Element, TabExpandedChangeEvent>>(tabPanel,
                // props:
                {
                    expanded : tabPanel.props.expanded ?? true,
                },
            );
        })
    );
};
export {
    TabBody,
    TabBody as default,
}
