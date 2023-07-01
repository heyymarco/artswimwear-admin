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

// lexical:
import {
    $getRoot,
    $getSelection,
}                           from 'lexical'
import {
    InitialConfigType,
    LexicalComposer,
}                           from '@lexical/react/LexicalComposer'
import {
    PlainTextPlugin,
}                           from '@lexical/react/LexicalPlainTextPlugin'
import {
    ContentEditable,
}                           from '@lexical/react/LexicalContentEditable'
import {
    HistoryPlugin,
}                           from '@lexical/react/LexicalHistoryPlugin'
import {
    OnChangePlugin,
}                           from '@lexical/react/LexicalOnChangePlugin'
import {
    useLexicalComposerContext,
}                           from '@lexical/react/LexicalComposerContext'
import
    LexicalErrorBoundary
                            from '@lexical/react/LexicalErrorBoundary'

// internals:
import {
    // react components:
    EditorProps,
    Editor,
}                           from '@/components/editors/Editor'



// react components:
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
        });
    });
    const handleError       = useEvent<InitialConfigType['onError']>((error, editor) => {
    });
    
    
    
    // configs:
    const theme = useMemo(() => ({
        ltr                        : 'ltr',
        rtl                        : 'rtl',
        
        placeholder                : 'placeholder',
        
        text: {
            bold                   : 'textBold',
            italic                 : 'textItalic',
            underline              : 'textUnderline',
            strikethrough          : 'textStrikethrough',
            underlineStrikethrough : 'textUnderlineStrikethrough',
            
            subscript              : 'textSubscript',
            superscript            : 'textSuperscript',
            code                   : 'textCode',
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
        
        link                       : 'link',
        image                      : 'image',
        
        quote                      : 'quote',
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
        
        hashtag                    : 'hashtag',
        
        code                       : 'code',
        codeHighlight: {
            atrule                 : 'tokenAttr',
            attr                   : 'tokenAttr',
            boolean                : 'tokenProperty',
            builtin                : 'tokenSelector',
            cdata                  : 'tokenComment',
            char                   : 'tokenSelector',
            class                  : 'tokenFunction',
            'class-name'           : 'tokenFunction',
            comment                : 'tokenComment',
            constant               : 'tokenProperty',
            deleted                : 'tokenProperty',
            doctype                : 'tokenComment',
            entity                 : 'tokenOperator',
            function               : 'tokenFunction',
            important              : 'tokenVariable',
            inserted               : 'tokenSelector',
            keyword                : 'tokenAttr',
            namespace              : 'tokenVariable',
            number                 : 'tokenProperty',
            operator               : 'tokenOperator',
            prolog                 : 'tokenComment',
            property               : 'tokenProperty',
            punctuation            : 'tokenPunctuation',
            regex                  : 'tokenVariable',
            selector               : 'tokenSelector',
            string                 : 'tokenSelector',
            symbol                 : 'tokenProperty',
            tag                    : 'tokenProperty',
            url                    : 'tokenOperator',
            variable               : 'tokenVariable',
        },
    }), []);
    
    const initialConfig : InitialConfigType = useMemo(() => ({
        namespace : 'WysiwygEditor', 
        theme,
        onError   : handleError,
    }), []);
    
    
    
    // jsx:
    return (
        <LexicalComposer initialConfig={initialConfig}>
            {/* functions: */}
            <OnChangePlugin onChange={handleValueChange} />
            <HistoryPlugin />
            
            
            
            {/* elements: */}
            <PlainTextPlugin
                contentEditable={<ContentEditable />}
                placeholder={<div>{placeholder}</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
        </LexicalComposer>
    );
};
export {
    WysiwygEditor,
    WysiwygEditor as default,
}
