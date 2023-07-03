// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// lexical functions:
import {
    // hooks:
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $getNodeByKey,
    
    
    
    // commands:
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
}                           from 'lexical'
import {
    // hooks:
    $getNearestNodeOfType,
    
    
    
    // utilities:
    mergeRegister,
}                           from '@lexical/utils'
import {
    // hooks:
    useLexicalComposerContext,
}                           from '@lexical/react/LexicalComposerContext'

import type {
    // react components:
    ButtonProps,
    
    ButtonComponentProps,
}                           from '@reusable-ui/button'          // a button component for initiating an action
import {
    // react components:
    ButtonIcon,
}                           from '@reusable-ui/button-icon'     // a button component with a nice icon



// constants:
const LOW_PRIORITY = 1;



// react components:
export interface ToolbarPluginProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        React.HTMLAttributes<TElement>
{
    // accessibilities:
    labelUndo           ?: string
    labelRedo           ?: string
    
    
    
    // components:
    undoButtonComponent ?: ButtonComponentProps['buttonComponent']
    redoButtonComponent ?: ButtonComponentProps['buttonComponent']
    toolbarComponent    ?: React.ReactComponentElement<any, React.HTMLAttributes<TElement>>
}
const ToolbarPlugin = <TElement extends Element = HTMLElement>(props: ToolbarPluginProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // accessibilities:
        labelUndo,
        labelRedo,
        
        
        
        // components:
        toolbarComponent    = (<div /> as React.ReactComponentElement<any, React.HTMLAttributes<TElement>>),
        undoButtonComponent = (<ButtonIcon icon='undo' /> as React.ReactComponentElement<any, ButtonProps>),
        redoButtonComponent = (<ButtonIcon icon='redo' /> as React.ReactComponentElement<any, ButtonProps>),
    ...restElementProps} = props;
    
    
    
    // contexts:
    const [editor] = useLexicalComposerContext();
    
    
    
    // states:
    const [canUndo, setCanUndo] = useState<boolean>(false);
    const [canRedo, setCanRedo] = useState<boolean>(false);
    
    
    
    // dom effects:
    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LOW_PRIORITY
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LOW_PRIORITY
            ),
        );
    }, [editor]);
    
    
    
    // handlers:
    const handleUndo = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
    });
    const handleRedo = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
    });
    
    
    
    // jsx:
    return React.cloneElement<React.HTMLAttributes<TElement>>(toolbarComponent,
        // props:
        {
            // other props:
            ...restElementProps,
            ...toolbarComponent.props, // overwrites restElementProps (if any conflics)
        },
        
        
        
        // children:
        React.cloneElement<ButtonProps>(undoButtonComponent,
            // props:
            {
                // accessibilities:
                enabled : undoButtonComponent.props.enabled ?? canUndo,
                title   : undoButtonComponent.props.title   ?? labelUndo,
                
                
                
                // handlers:
                onClick : useMergeEvents(undoButtonComponent.props.onClick, handleUndo),
            },
        ),
        React.cloneElement<ButtonProps>(redoButtonComponent,
            // props:
            {
                // accessibilities:
                enabled : redoButtonComponent.props.enabled ?? canRedo,
                title   : redoButtonComponent.props.title   ?? labelRedo,
                
                
                
                // handlers:
                onClick : useMergeEvents(redoButtonComponent.props.onClick, handleRedo),
            },
        ),
    );
};
export {
    ToolbarPlugin,
    ToolbarPlugin as default,
}
