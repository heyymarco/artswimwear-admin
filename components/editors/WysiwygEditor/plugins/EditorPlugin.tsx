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

// lexical functions:
import {
    // hooks:
    useLexicalComposerContext,
}                           from '@lexical/react/LexicalComposerContext'

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    EditableControlProps,
    EditableControl,
}                           from '@reusable-ui/editable-control'        // a base component

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

// internals:
import {
    // react components:
    useWysiwygEditorState,
}                           from '../states/xxxWysiwygEditorState'



// styles:
export const useEditorPluginStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ '../styles/editorStyles')
, { id: 'ns8sc46yp4' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



// react components:
export interface EditorPluginProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<EditableControlProps<TElement>,
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
    ...restControlProps} = props;
    
    
    
    // states:
    const {
        editorRef,
    } = useWysiwygEditorState();
    
    
    
    // contexts:
    const [editor] = useLexicalComposerContext();
    
    
    
    // dom effects:
    useIsomorphicLayoutEffect(() => {
        // conditions:
        if (!editorRef) return;
        
        
        
        // setups:
        if (typeof(editorRef) === 'function') {
            editorRef(editor.getRootElement());
        }
        else {
            (editorRef as React.MutableRefObject<Element|null>).current = editor.getRootElement();
        } // if
        
        
        
        // cleanups:
        return () => {
            if (typeof(editorRef) === 'function') {
                editorRef(null);
            }
            else {
                (editorRef as React.MutableRefObject<Element|null>).current = null;
            } // if
        };
    }, []);
    
    
    
    // jsx:
    return (
        <EditableControl<TElement>
            // other props:
            {...restControlProps}
            
            
            
            // variants:
            mild={props.mild ?? true}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
            
            
            
            // accessibilities:
            tabIndex={-1} // negative [tabIndex] => act as *wrapper* element, if <Placeholder> is `:focus-visible-within` (pseudo) => the wrapper is also `.focus` (synthetic)
        >
            {...useMemo(() => defaultPlugins({
                placeholder : <Placeholder
                    // classes:
                    className='placeholder'
                    
                    
                    
                    // accessibilities:
                    placeholder={placeholder}
                    
                    
                    
                    // components:
                    placeholderComponent={placeholderComponent}
                />,
            }), [])}
        </EditableControl>
    );
};
export {
    EditorPlugin,
    EditorPlugin as default,
}
