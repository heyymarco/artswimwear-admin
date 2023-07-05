// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'                   // writes css in react hook

// reusable-ui components:
import {
    // react components:
    ControlProps,
    Control,
    
    ControlComponentProps,
}                           from '@reusable-ui/control'                 // a base component

// plugins:
import {
    defaultPlugins,
}                           from '../defaultPlugins'

// UIs:
import {
    // react components:
    PlaceholderProps,
    Placeholder,
}                           from './Placeholder'

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
export const useEditorPluginStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ '../styles/editorStyles')
, { id: 'ns8sc46yp4' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:
export interface EditorPluginProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ControlProps<TElement>,
            // children:
            |'children' // not supported
        >,
        
        // components:
        ControlComponentProps<TElement>,
        Pick<PlaceholderProps,
            // accessibilities:
            |'placeholder'
            
            
            
            // components:
            |'placeholderComponent'
        >
{
}
const EditorPlugin = <TElement extends Element = HTMLElement>(props: EditorPluginProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet     = useEditorPluginStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        placeholder,
        
        
        
        // components:
        controlComponent = (<Control<TElement> /> as React.ReactComponentElement<any, ControlProps<TElement>>),
        placeholderComponent,
    ...restBasicProps} = props;
    
    
    
    // jsx:
    return React.cloneElement<ControlProps<Element>>(controlComponent,
        // props:
        {
            // other props:
            ...restBasicProps,
            ...controlComponent.props, // overwrites restBasicProps (if any conflics)
            
            
            
            // variants:
            mild      : controlComponent.props.mild      ?? props.mild      ?? true,
            
            
            
            // classes:
            mainClass : controlComponent.props.mainClass ?? props.mainClass ?? styleSheet.main,
        },
        
        
        
        // children:
        ...defaultPlugins(
            <Placeholder
                // classes:
                className='placeholder'
                
                
                
                // accessibilities:
                placeholder={placeholder}
                
                
                
                // components:
                placeholderComponent={placeholderComponent}
            />
        )
    );
};
export {
    EditorPlugin,
    EditorPlugin as default,
}
