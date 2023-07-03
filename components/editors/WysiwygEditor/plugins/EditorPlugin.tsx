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
    BasicProps,
    
    BasicComponentProps,
}                           from '@reusable-ui/basic'           // a base component
import {
    // react components:
    Content,
}                           from '@reusable-ui/content'         // a complement component

// UIs:
import
    // react components:
    LexicalErrorBoundary
                            from '@lexical/react/LexicalErrorBoundary'
import {
    // react components:
    ContentEditable,
}                           from '@lexical/react/LexicalContentEditable'

// texts:
// import {
//     // plain text editing, including typing, deletion and copy/pasting.
//     PlainTextPlugin,
// }                           from '@lexical/react/LexicalPlainTextPlugin'
import {
    // rich text editing, including typing, deletion, copy/pasting, indent/outdent and bold/italic/underline/strikethrough text formatting.
    RichTextPlugin,
}                           from '@lexical/react/LexicalRichTextPlugin'
import {
    // allows tab indentation in combination with `<RichTextPlugin>`.
    TabIndentationPlugin,
}                           from '@lexical/react/LexicalTabIndentationPlugin'

// resources:
import {
    // adds support for links, including toggleLink command support that toggles link for selected text.
    LinkPlugin,
}                           from '@lexical/react/LexicalLinkPlugin'

// layouts:
import {
    // adds support for lists (ordered and unordered).
    ListPlugin,
}                           from '@lexical/react/LexicalListPlugin'
import {
    // adds support for tables.
    TablePlugin,
}                           from '@lexical/react/LexicalTablePlugin'

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
        Omit<BasicProps<TElement>,
            // children:
            |'children' // not supported
        >,
        
        // components:
        BasicComponentProps<TElement>,
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
    const styleSheet = useEditorPluginStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        placeholder,
        
        
        
        // components:
        basicComponent = (<Content<TElement> /> as React.ReactComponentElement<any, BasicProps<TElement>>),
        placeholderComponent,
    ...restBasicProps} = props;
    
    
    
    // jsx:
    return React.cloneElement<BasicProps<Element>>(basicComponent,
        // props:
        {
            // other props:
            ...restBasicProps,
            ...basicComponent.props, // overwrites restBasicProps (if any conflics)
            
            
            
            // classes:
            mainClass : basicComponent.props.mainClass ?? styleSheet.main,
        },
        
        
        
        // children:
        
        // texts:
        
        // plain text editing, including typing, deletion and copy/pasting.
        /* <PlainTextPlugin
            // UIs:
            ErrorBoundary   = {LexicalErrorBoundary}
            contentEditable = {<ContentEditable />}
            placeholder     = {
                <Placeholder
                    // accessibilities:
                    placeholder={placeholder}
                    
                    
                    
                    // components:
                    placeholderComponent={placeholderComponent}
                />
            }
        /> */
        
        // rich text editing, including typing, deletion, copy/pasting, indent/outdent and bold/italic/underline/strikethrough text formatting.
        <RichTextPlugin
            // UIs:
            ErrorBoundary   = {LexicalErrorBoundary}
            contentEditable = {<ContentEditable className='editorInput' />}
            placeholder     = {
                <Placeholder
                    // classes:
                    className='editorPlaceholder'
                    
                    
                    
                    // accessibilities:
                    placeholder={placeholder}
                    
                    
                    
                    // components:
                    placeholderComponent={placeholderComponent}
                />
            }
        />,
        
        // allows tab indentation in combination with `<RichTextPlugin>`.
        <TabIndentationPlugin />,
        
        
        
        // resources:
        
        // adds support for links, including toggleLink command support that toggles link for selected text.
        <LinkPlugin />,
        
        // auto converts link-like-texts to links.
        /* <AutoLinkPlugin />, */
        
        
        
        // layouts:
        
        // adds support for lists (ordered and unordered).
        <ListPlugin />,
        
        // adds support for tables.
        <TablePlugin />,
        
        
        
        // identifiers:
        
        // codes:
        /* <CodeHighlightPlugin />, */
    );
};
export {
    EditorPlugin,
    EditorPlugin as default,
}
