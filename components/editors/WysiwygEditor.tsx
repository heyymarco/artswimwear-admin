// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useMemo,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// lexical functions:
import {
    // types:
    EditorThemeClasses,
    
    
    
    // hooks:
    $getRoot,
    $getSelection,
}                           from 'lexical'

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
    // react components:
    OnChangePlugin,
}                           from '@lexical/react/LexicalOnChangePlugin'
import {
    // react components:
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
import {
    PlainTextPlugin,
}                           from '@lexical/react/LexicalPlainTextPlugin'
import {
    RichTextPlugin,
}                           from '@lexical/react/LexicalRichTextPlugin'

// resources:
import {
    LinkPlugin,
}                           from '@lexical/react/LexicalLinkPlugin'

// layouts:
import {
    ListPlugin,
}                           from '@lexical/react/LexicalListPlugin'
// import
//     ToolbarPlugin
//                             from'./plugins/ToolbarPlugin'
// import
//     AutoLinkPlugin
//                             from './plugins/AutoLinkPlugin'
// import
//     CodeHighlightPlugin
//                             from './plugins/CodeHighlightPlugin'

// internals:
import {
    // react components:
    EditorProps,
    Editor,
}                           from '@/components/editors/Editor'



// react components:
interface PlaceholderProps {
    // accessibilities:
    placeholder ?: string
}
const Placeholder = (props: PlaceholderProps): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        placeholder,
    } = props;
    
    
    
    // jsx:
    return (
        <div>
            {placeholder}
        </div>
    );
};
export interface WysiwygEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, string>,
            // accessibilities:
            |'placeholder'
            
            
            
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
            |'onChangeAsText'
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
    ...restInputProps} = props;
    
    
    
    // handlers:
    const handleValueChange = useEvent<Parameters<typeof OnChangePlugin>[0]['onChange']>((editorState) => {
        editorState.read(() => {
            // read the contents of the EditorState here
            const root      = $getRoot();
            const selection = $getSelection();
            // onChange?.(value);
            // onChangeAsText?.(value);
            console.log({root, selection});
        });
    });
    const handleError       = useEvent<InitialConfigType['onError']>((error, editor) => {
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
        namespace : 'WysiwygEditor', 
        theme,
        onError   : handleError,
        nodes     : [
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
            <OnChangePlugin onChange={handleValueChange} />
            <HistoryPlugin />
            
            
            
            {/* elements: */}
            <div className='editor-container'>
                {/* <ToolbarPlugin /> */}
                <div className='editor-inner'>
                    <AutoFocusPlugin />
                    
                    {/* texts: */}
                    {/* <PlainTextPlugin
                        // UIs:
                        ErrorBoundary   = {LexicalErrorBoundary}
                        contentEditable = {<ContentEditable />}
                        placeholder     = {<Placeholder placeholder={placeholder} />}
                    /> */}
                    <RichTextPlugin
                        // UIs:
                        ErrorBoundary   = {LexicalErrorBoundary}
                        contentEditable = {<ContentEditable className="editor-input" />}
                        placeholder     = {<Placeholder placeholder={placeholder} />}
                    />
                    
                    {/* resources: */}
                    <LinkPlugin />
                    {/* <AutoLinkPlugin /> */}
                    
                    {/* layouts: */}
                    <ListPlugin />
                    
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
