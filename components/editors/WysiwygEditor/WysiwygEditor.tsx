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
    useEvent,
    useMountedFlag,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// lexical functions:
import {
    // types:
    EditorThemeClasses,
    
    
    
    // hooks:
    $getRoot,
}                           from 'lexical'
import {
    $generateHtmlFromNodes,
    $generateNodesFromDOM,
}                           from '@lexical/html'

// texts:
import {
    ParagraphNode,
}                           from 'lexical'
import {
    HeadingNode,
    QuoteNode,
}                           from '@lexical/rich-text'

// resources:
import {
    LinkNode,
    AutoLinkNode,
}                           from '@lexical/link'

// layouts:
import {
    ListNode,
    ListItemNode,
}                           from '@lexical/list'
import {
    TableNode,
    TableRowNode,
    TableCellNode,
}                           from '@lexical/table'

// codes:
import {
    CodeNode,
    CodeHighlightNode,
}                           from '@lexical/code'

// lexical functions:
import {
    // types:
    InitialConfigType,
    
    
    
    // react components:
    LexicalComposer,
}                           from '@lexical/react/LexicalComposer'
import {
    useLexicalComposerContext,
}                           from '@lexical/react/LexicalComposerContext'
import {
    // calls onChange whenever Lexical state is updated.
    OnChangePlugin,
}                           from '@lexical/react/LexicalOnChangePlugin'
import {
    // adds support for history stack management and undo / redo commands.
    HistoryPlugin,
}                           from '@lexical/react/LexicalHistoryPlugin'

// behaviors:
import {
    AutoFocusPlugin,
}                           from '@lexical/react/LexicalAutoFocusPlugin'

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

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'

// behaviors:
import {
    // setups the initial value for the editor.
    InitialValuePlugin,
}                           from './plugins/InitialValuePlugin'

// UIs:
import {
    // react components:
    PlaceholderProps,
    Placeholder,
}                           from './Placeholder'
// import
//     ToolbarPlugin
//                             from'./plugins/ToolbarPlugin'

// resources:
// import
//     // auto converts link-like-texts to links.
//     AutoLinkPlugin
//                             from './plugins/AutoLinkPlugin'

// codes:
// import
//     CodeHighlightPlugin
//                             from './plugins/CodeHighlightPlugin'



// react components:
export interface WysiwygEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, string>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            |'onChangeAsText'
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
const WysiwygEditor = <TElement extends Element = HTMLElement>(props: WysiwygEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        placeholder,
        
        
        
        // values:
        defaultValue,
        value,
        onChange,
        onChangeAsText,
        
        
        
        // components:
        placeholderComponent,
    ...restEditorProps} = props;
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const prevValueCache = useRef<string|undefined>(undefined);
    const handleValueChange = useEvent<Parameters<typeof OnChangePlugin>[0]['onChange']>((editorState, editor) => {
        // conditions:
        if (!onChange && !onChangeAsText) return; // onChange|onChangeAsText handler is not set => ignore
        
        
        
        editorState.read(() => {
            // conditions:
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            
            
            
            // actions:
            const isInit = (prevValueCache.current === undefined);
            const htmlString = $generateHtmlFromNodes(editor);
            prevValueCache.current = htmlString; // sync
            if (!isInit) {
                onChange?.(htmlString);
                onChangeAsText?.(htmlString);
            } // if
        });
    });
    const handleError       = useEvent<InitialConfigType['onError']>((error, editor) => {
        // nothing to handle yet
    });
    
    
    
    // configs:
    const theme = useMemo<EditorThemeClasses>(() => ({
        ltr                        : 'ltr',
        rtl                        : 'rtl',
        
        placeholder                : 'placeholder',
        
        // texts:
        text: {
            bold                   : 'textBold',
            italic                 : 'textItalic',
            underline              : 'textUnderline',
            strikethrough          : 'textStrikethrough',
            underlineStrikethrough : 'textUnderlineStrikethrough',
            
            subscript              : 'textSubscript',
            superscript            : 'textSuperscript',
            
            code                   : 'code',
        },
        paragraph                  : 'p',
        heading: {
            h1                     : 'h1',
            h2                     : 'h2',
            h3                     : 'h3',
            h4                     : 'h4',
            h5                     : 'h5',
            h6                     : 'h6',
        },
        quote                      : 'quote',
        
        // resources:
        link                       : 'link',
        image                      : 'image',
        
        // layouts:
        list: {
            nested: {
                listitem           : 'nested-listitem',
            },
            ol                     : 'list-ol',
            ul                     : 'list-ul',
            listitem               : 'listItem',
            listitemChecked        : 'listItemChecked',
            listitemUnchecked      : 'listItemUnchecked',
        },
        table                      : 'table',
        
        // identifiers:
        hashtag                    : 'hashtag',
        
        // codes:
        code                       : 'code block',
        codeHighlight: {
            atrule                 : 'codeAttr',
            attr                   : 'codeAttr',
            boolean                : 'codeProperty',
            builtin                : 'codeSelector',
            cdata                  : 'codeComment',
            char                   : 'codeSelector',
            class                  : 'codeFunction',
            'class-name'           : 'codeFunction',
            comment                : 'codeComment',
            constant               : 'codeProperty',
            deleted                : 'codeProperty',
            doctype                : 'codeComment',
            entity                 : 'codeOperator',
            function               : 'codeFunction',
            important              : 'codeVariable',
            inserted               : 'codeSelector',
            keyword                : 'codeAttr',
            namespace              : 'codeVariable',
            number                 : 'codeProperty',
            operator               : 'codeOperator',
            prolog                 : 'codeComment',
            property               : 'codeProperty',
            punctuation            : 'codePunctuation',
            regex                  : 'codeVariable',
            selector               : 'codeSelector',
            string                 : 'codeSelector',
            symbol                 : 'codeProperty',
            tag                    : 'codeProperty',
            url                    : 'codeOperator',
            variable               : 'codeVariable',
        },
    }), []);
    
    const initialConfig : InitialConfigType = useMemo(() => ({
        namespace   : 'WysiwygEditor', 
        theme,
        onError     : handleError,
        
        // causes hydration error:
        // editorState : (editor) => {
        //     // conditions:
        //     const htmlString = value ?? defaultValue;
        //     if (!htmlString) return;
        //     
        //     
        //     
        //     // actions:
        //     const htmlDom = (new DOMParser()).parseFromString(htmlString, 'text/html');
        //     const node    = $generateNodesFromDOM(editor, htmlDom);
        //     $getRoot().append(...node);
        // },
        
        nodes       : [
            // texts:
            ParagraphNode,
            HeadingNode,
            QuoteNode,
            
            
            
            // resources:
            LinkNode,
            AutoLinkNode,
            // ImageNode,
            
            // layouts:
            ListNode,
            ListItemNode,
            TableNode,
            TableRowNode,
            TableCellNode,
            
            
            
            // identifiers:
            // HashTagNode,
            
            
            
            // codes:
            CodeNode,
            CodeHighlightNode,
        ],
    }), []);
    
    
    
    // jsx:
    return (
        <LexicalComposer initialConfig={initialConfig}>
            {/* functions: */}
            
            {/* setups the initial value for the editor. */}
            <InitialValuePlugin initialValue={value} defaultValue={defaultValue} />
            
            {/* calls onChange whenever Lexical state is updated. */}
            <OnChangePlugin
                // behaviors:
                ignoreHistoryMergeTagChange={true}
                ignoreSelectionChange={true}
                
                
                
                // handlers:
                onChange={handleValueChange}
            />
            
            {/* adds support for history stack management and undo / redo commands. */}
            <HistoryPlugin />
            
            
            
            {/* elements: */}
            <div className='editorContainer'>
                {/* <ToolbarPlugin /> */}
                <div className='editorInner'>
                    <AutoFocusPlugin />
                    
                    
                    
                    {/* texts: */}
                    
                    {/* plain text editing, including typing, deletion and copy/pasting. */}
                    {/* <PlainTextPlugin
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
                    /> */}
                    
                    {/* rich text editing, including typing, deletion, copy/pasting, indent/outdent and bold/italic/underline/strikethrough text formatting. */}
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
                    />
                    
                    {/* allows tab indentation in combination with `<RichTextPlugin>`. */}
                    <TabIndentationPlugin />
                    
                    
                    
                    {/* resources: */}
                    
                    {/* adds support for links, including toggleLink command support that toggles link for selected text. */}
                    <LinkPlugin />
                    
                    {/* auto converts link-like-texts to links. */}
                    {/* <AutoLinkPlugin /> */}
                    
                    
                    
                    {/* layouts: */}
                    
                    {/* adds support for lists (ordered and unordered). */}
                    <ListPlugin />
                    
                    {/* adds support for tables. */}
                    <TablePlugin />
                    
                    
                    
                    {/* identifiers: */}
                    
                    {/* codes: */}
                    {/* <CodeHighlightPlugin /> */}
                </div>
            </div>
        </LexicalComposer>
    );
};
export {
    WysiwygEditor,
    WysiwygEditor as default,
}
