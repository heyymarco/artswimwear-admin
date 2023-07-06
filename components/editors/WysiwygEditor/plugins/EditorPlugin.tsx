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
    ControlProps,
    Control,
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
        placeholderComponent,
    ...restBasicProps} = props;
    
    
    
    // jsx:
    return (
        <Control<TElement>
            // other props:
            {...restBasicProps}
            
            
            
            // variants:
            mild={props.mild ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {...useMemo(() => React.Children.toArray(defaultPlugins({
                placeholder : <Placeholder
                    // classes:
                    className='placeholder'
                    
                    
                    
                    // accessibilities:
                    placeholder={placeholder}
                    
                    
                    
                    // components:
                    placeholderComponent={placeholderComponent}
                />,
            })), [])}
        </Control>
    );
};
export {
    EditorPlugin,
    EditorPlugin as default,
}
