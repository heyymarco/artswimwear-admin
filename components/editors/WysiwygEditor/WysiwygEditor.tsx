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
    
    
    
    // an accessibility management system:
    usePropEnabled,
    usePropReadOnly,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // react components:
    IndicatorProps,
}                           from '@reusable-ui/indicator'       // a base component
import {
    // react components:
    Group,
}                           from '@reusable-ui/group'           // a base component

// lexical functions:
import {
    // types:
    EditorThemeClasses,
}                           from 'lexical'
import {
    $generateHtmlFromNodes,
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
import {
    // dynamically setups the editable prop.
    DynamicEditablePlugin,
}                           from './plugins/DynamicEditablePlugin'

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
        Omit<IndicatorProps<TElement>,
            // values:
            |'defaultValue' // taken over by EditorProps
            |'value'        // taken over by EditorProps
            |'onChange'     // taken over by EditorProps
        >,
        Pick<EditorProps<TElement, string>,
            // accessibilities:
            |'autoFocus'
            
            
            
            // values:
            |'defaultValue' // take
            |'value'        // take
            |'onChange'     // take
        >
{
    // plugins:
    children ?: React.ReactNode
}
const WysiwygEditor = <TElement extends Element = HTMLElement>(props: WysiwygEditorProps<TElement>): JSX.Element|null => {
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // rest props:
    const {
        // accessibilities:
        autoFocus,
        
        
        
        // values:
        defaultValue,
        value,
        onChange,
        
        
        
        // plugins:
        children : plugins,
    ...restIndicatorProps} = props;
    
    
    
    // accessibilities:
    const propEnabled          = usePropEnabled(props);
    const propReadOnly         = usePropReadOnly(props);
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // dom effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const prevValueCache = useRef<string|undefined>(undefined);
    const handleValueChange = useEvent<Parameters<typeof OnChangePlugin>[0]['onChange']>((editorState, editor) => {
        // conditions:
        if (!onChange) return; // onChange handler is not set => ignore
        
        
        
        editorState.read(() => {
            // conditions:
            if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
            
            
            
            // actions:
            const isInit = (prevValueCache.current === undefined);
            const htmlString = $generateHtmlFromNodes(editor);
            prevValueCache.current = htmlString; // sync
            if (!isInit) {
                onChange(htmlString);
            } // if
        });
    });
    const handleError       = useEvent<InitialConfigType['onError']>((error, editor) => {
        // nothing to handle yet
    });
    
    
    
    // configs:
    const theme = useMemo<EditorThemeClasses>(() => ({
     // ltr                        : 'ltr',
     // rtl                        : 'rtl',
        
     // placeholder                : 'placeholder',
        
        // texts:
        text: {
     //     bold                   : 'b',
     //     italic                 : 'i',
            underline              : 'insert',
            strikethrough          : 'delete',
            underlineStrikethrough : 'insert delete',
            
            subscript              : 'subscript',   // TODO: update style
            superscript            : 'superscript', // TODO: update style
            
     //     code                   : 'code',
        },
     // paragraph                  : 'p',
     // heading: {
     //     h1                     : 'h1',
     //     h2                     : 'h2',
     //     h3                     : 'h3',
     //     h4                     : 'h4',
     //     h5                     : 'h5',
     //     h6                     : 'h6',
     // },
     // quote                      : 'quote',
        
        // resources:
        link                       : 'link',  // TODO: update style
        image                      : 'image', // TODO: update style
        
        // layouts:
     // list: {
     //     nested: {
     //         listitem           : 'nested-listitem',
     //     },
     //     ol                     : 'list-ol',
     //     ul                     : 'list-ul',
     //     listitem               : 'listItem',
     //     listitemChecked        : 'listItemChecked',
     //     listitemUnchecked      : 'listItemUnchecked',
     // },
     // table                      : 'table',
        
        // identifiers:
     // hashtag                    : 'hashtag',
        
        // codes:
        code                       : 'block',
     // codeHighlight: {
     //     atrule                 : 'codeAttr',
     //     attr                   : 'codeAttr',
     //     boolean                : 'codeProperty',
     //     builtin                : 'codeSelector',
     //     cdata                  : 'codeComment',
     //     char                   : 'codeSelector',
     //     class                  : 'codeFunction',
     //     'class-name'           : 'codeFunction',
     //     comment                : 'codeComment',
     //     constant               : 'codeProperty',
     //     deleted                : 'codeProperty',
     //     doctype                : 'codeComment',
     //     entity                 : 'codeOperator',
     //     function               : 'codeFunction',
     //     important              : 'codeVariable',
     //     inserted               : 'codeSelector',
     //     keyword                : 'codeAttr',
     //     namespace              : 'codeVariable',
     //     number                 : 'codeProperty',
     //     operator               : 'codeOperator',
     //     prolog                 : 'codeComment',
     //     property               : 'codeProperty',
     //     punctuation            : 'codePunctuation',
     //     regex                  : 'codeVariable',
     //     selector               : 'codeSelector',
     //     string                 : 'codeSelector',
     //     symbol                 : 'codeProperty',
     //     tag                    : 'codeProperty',
     //     url                    : 'codeOperator',
     //     variable               : 'codeVariable',
     // },
    }), []);
    
    const initialConfig : InitialConfigType = useMemo(() => ({
        namespace   : 'WysiwygEditor', 
        theme,
        editable    : !isDisabledOrReadOnly,
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
            {!!autoFocus ? <AutoFocusPlugin /> : <></>}
            
            {/* setups the initial value for the editor. */}
            <InitialValuePlugin initialValue={value} defaultValue={defaultValue} />
            
            {/* dynamically setups the editable prop. */}
            <DynamicEditablePlugin editable={!isDisabledOrReadOnly} />
            
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
            <Group<TElement>
                // other props:
                {...restIndicatorProps}
                
                
                
                // variants:
                orientation='block'
            >
                {React.Children.map(plugins, (plugin) => {
                    if (!React.isValidElement(plugin)) return plugin; // not an <element> => no modify
                    
                    
                    
                    // jsx:
                    return React.cloneElement(plugin,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            
                            
                            
                            // other props:
                            ...plugin.props,
                        },
                    );
                })}
            </Group>
        </LexicalComposer>
    );
};
export {
    WysiwygEditor,
    WysiwygEditor as default,
}
