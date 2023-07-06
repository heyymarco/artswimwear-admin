// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'                   // writes css in react hook

// reusable-ui components:
import {
    // react components:
    ContentProps,
    Content,
}                           from '@reusable-ui/content'                 // a base component

// plugins:
import {
    defaultPlugins,
}                           from '../defaultPlugins'

// resources:
// import
//     // auto converts link-like-texts to links.
//     AutoLinkPlugin
//                             from './plugins/AutoLinkPlugin'

// codes:
// import
//     CodeHighlightPlugin
//                             from './plugins/CodeHighlightPlugin'



// styles:
export const useViewerPluginStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ '../styles/editorStyles')
, { id: 'ns8sc46yp4' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:
export interface ViewerPluginProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ContentProps<TElement>,
            // children:
            |'children' // not supported
        >
{
}
const ViewerPlugin = <TElement extends Element = HTMLElement>(props: ViewerPluginProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet     = useViewerPluginStyleSheet();
    
    
    
    // jsx:
    return (
        <Content<TElement>
            // other props:
            {...props}
            
            
            
            // variants:
            mild={props.mild ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {...useMemo(() => React.Children.toArray(defaultPlugins()), [])}
        </Content>
    );
};
export {
    ViewerPlugin,
    ViewerPlugin as default,
}
