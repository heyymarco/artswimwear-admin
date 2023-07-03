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
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// lexical functions:
import {
    // hooks:
    $getSelection,
    $isRangeSelection,
    $isRootNode,
    $applyNodeReplacement,
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
    $isParentElementRTL,
    $wrapNodes,
    $isAtNodeEnd
}                           from '@lexical/selection'
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode
}                           from '@lexical/rich-text'
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
}                           from '@lexical/list'
import {
    $createCodeNode,
    $isCodeNode,
    getDefaultCodeLanguage,
    getCodeLanguages,
}                           from '@lexical/code'
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

// reusable-ui components:
import {
    // react components:
    BasicProps,
}                           from '@reusable-ui/basic'           // a base component
import type {
    // react components:
    ButtonProps,
    
    ButtonComponentProps,
}                           from '@reusable-ui/button'          // a button component for initiating an action
import {
    // react components:
    ButtonIcon,
}                           from '@reusable-ui/button-icon'     // a button component with a nice icon
import {
    // react components:
    GroupProps,
    Group,
}                           from '@reusable-ui/group'           // groups a list of components as a single component

// internals:
import {
    // react components:
    BasicHeadingEditorProps,
    HeadingEditor,
}                           from './HeadingEditor'



// constants:
const LOW_PRIORITY = 1;



// react components:
export interface ToolbarPluginProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        BasicProps<TElement>,
        Omit<React.HTMLAttributes<TElement>,
            // semantics:
            |'role' // we redefined [role] in <Generic>
        >
{
    // components:
    component                    ?: React.ReactComponentElement<any, React.HTMLAttributes<TElement>>
    undoRedoGroupComponent       ?: React.ReactComponentElement<any, GroupProps<Element>>
    undoButtonComponent          ?: ButtonComponentProps['buttonComponent']
    redoButtonComponent          ?: ButtonComponentProps['buttonComponent']
    headingEditor                ?: React.ReactComponentElement<any, BasicHeadingEditorProps<Element>>
    formatGroupComponent         ?: React.ReactComponentElement<any, GroupProps<Element>>
    boldButtonComponent          ?: ButtonComponentProps['buttonComponent']
    italicButtonComponent        ?: ButtonComponentProps['buttonComponent']
    underlineButtonComponent     ?: ButtonComponentProps['buttonComponent']
    strikethroughButtonComponent ?: ButtonComponentProps['buttonComponent']
}
const ToolbarPlugin = <TElement extends Element = HTMLElement>(props: ToolbarPluginProps<TElement>): JSX.Element|null => {
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // rest props:
    const {
        // components:
        component                    = (<div />                                                          as React.ReactComponentElement<any, React.HTMLAttributes<TElement>>),
        undoRedoGroupComponent       = (<Group />                                                        as React.ReactComponentElement<any, GroupProps<Element>>),
        undoButtonComponent          = (<ButtonIcon icon='undo'                 title='undo' />          as React.ReactComponentElement<any, ButtonProps>),
        redoButtonComponent          = (<ButtonIcon icon='redo'                 title='redo' />          as React.ReactComponentElement<any, ButtonProps>),
        headingEditor                = (<HeadingEditor />                                                as React.ReactComponentElement<any, BasicHeadingEditorProps<Element>>),
        formatGroupComponent         = (<Group />                                                        as React.ReactComponentElement<any, GroupProps<Element>>),
        boldButtonComponent          = (<ButtonIcon icon='format_bold'          title='bold' />          as React.ReactComponentElement<any, ButtonProps>),
        italicButtonComponent        = (<ButtonIcon icon='format_italic'        title='italic' />        as React.ReactComponentElement<any, ButtonProps>),
        underlineButtonComponent     = (<ButtonIcon icon='format_underline'     title='underline' />     as React.ReactComponentElement<any, ButtonProps>),
        strikethroughButtonComponent = (<ButtonIcon icon='format_strikethrough' title='strikethrough' /> as React.ReactComponentElement<any, ButtonProps>),
    ...restElementProps} = props;
    
    
    
    // contexts:
    const [editor] = useLexicalComposerContext();
    
    
    
    // states:
    const [canUndo           , setCanUndo           ] = useState<boolean>(false);
    const [canRedo           , setCanRedo           ] = useState<boolean>(false);
    
    const [blockType         , setBlockType         ] = useState<string>('paragraph');
    const [selectedElementKey, setSelectedElementKey] = useState<string|null>(null);
    
    const [isBold            , setIsBold            ] = useState<boolean>(false);
    const [isItalic          , setIsItalic          ] = useState<boolean>(false);
    const [isUnderline       , setIsUnderline       ] = useState<boolean>(false);
    const [isStrikethrough   , setIsStrikethrough   ] = useState<boolean>(false);
    
    
    
    // dom effects:
    const $refreshUi = useEvent((): void => {
        // conditions:
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        
        
        
        const anchorNode = selection.anchor.getNode();
        const element =
            anchorNode.getKey() === 'root'
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        const elementDOM = editor.getElementByKey(elementKey);
        if (elementDOM !== null) {
            setSelectedElementKey(elementKey);
            
            if ($isListNode(element)) {
                const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                const type = parentList ? parentList.getTag() : element.getTag();
                setBlockType(type);
            }
            else if(!$isRootNode(element)) {
                const type = $isHeadingNode(element)
                    ? element.getTag()
                    : element.getType();
                setBlockType(type);
                // if ($isCodeNode(element)) {
                //     setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
                // } // if
            } // if
        } // if
        
        
        
        // actions:
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
    });
    
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
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (payload) => {
                    $refreshUi();
                    return false;
                },
                LOW_PRIORITY
            ),
            editor.registerUpdateListener(({editorState}) => {
                editorState.read(() => {
                    $refreshUi();
                });
            }),
        );
    }, [editor]);
    
    useEffect(() => {
        console.log({blockType});
    }, [blockType]);
    
    
    
    // handlers:
    
    const handleUndo          = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
    });
    const handleRedo          = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
    });
    const handleChangeHeading = useEvent<NonNullable<BasicHeadingEditorProps<Element>['onChange']>>((value) => {
        editor.update(() => {
            // conditions:
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            
            
            
            // actions:
            if (!value) {
                $wrapNodes(selection, () => $createParagraphNode());
                setBlockType('paragraph');
            }
            else {
                $wrapNodes(selection, () => $createHeadingNode(value));
                setBlockType(value);
            } // if
        });
    });
    const handleBold          = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    });
    const handleItalic        = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    });
    const handleUnderline     = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
    });
    const handleStrikethrough = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    });
    
    
    
    // jsx:
    return React.cloneElement<React.HTMLAttributes<TElement>>(component,
        // props:
        {
            // other props:
            ...restElementProps,
            ...component.props, // overwrites restElementProps (if any conflics)
        },
        
        
        
        // children:
        React.cloneElement<GroupProps<Element>>(undoRedoGroupComponent,
            // props:
            {
                // basic variant props:
                ...basicVariantProps,
            },
            
            
            
            // children:
            React.cloneElement<ButtonProps>(undoButtonComponent,
                // props:
                {
                    // accessibilities:
                    enabled : undoButtonComponent.props.enabled ?? canUndo,
                    
                    
                    
                    // handlers:
                    onClick : useMergeEvents(undoButtonComponent.props.onClick, handleUndo),
                },
            ),
            React.cloneElement<ButtonProps>(redoButtonComponent,
                // props:
                {
                    // accessibilities:
                    enabled : redoButtonComponent.props.enabled ?? canRedo,
                    
                    
                    
                    // handlers:
                    onClick : useMergeEvents(redoButtonComponent.props.onClick, handleRedo),
                },
            ),
        ),
        React.cloneElement<BasicHeadingEditorProps<Element>>(headingEditor,
            // props:
            {
                // basic variant props:
                ...basicVariantProps,
                
                
                
                // values:
                value    : headingEditor.props.value ?? blockType as any,
                onChange : useMergeEvents(headingEditor.props.onChange, handleChangeHeading),
            },
        ),
        React.cloneElement<GroupProps<Element>>(formatGroupComponent,
            // props:
            {
                // basic variant props:
                ...basicVariantProps,
            },
            
            
            
            // children:
            React.cloneElement<ButtonProps>(boldButtonComponent,
                // props:
                {
                    // accessibilities:
                    active : boldButtonComponent.props.active ?? isBold,
                    
                    
                    
                    // handlers:
                    onClick : useMergeEvents(boldButtonComponent.props.onClick, handleBold),
                },
            ),
            React.cloneElement<ButtonProps>(italicButtonComponent,
                // props:
                {
                    // accessibilities:
                    active : italicButtonComponent.props.active ?? isItalic,
                    
                    
                    
                    // handlers:
                    onClick : useMergeEvents(italicButtonComponent.props.onClick, handleItalic),
                },
            ),
            React.cloneElement<ButtonProps>(underlineButtonComponent,
                // props:
                {
                    // accessibilities:
                    active : underlineButtonComponent.props.active ?? isUnderline,
                    
                    
                    
                    // handlers:
                    onClick : useMergeEvents(underlineButtonComponent.props.onClick, handleUnderline),
                },
            ),
            React.cloneElement<ButtonProps>(strikethroughButtonComponent,
                // props:
                {
                    // accessibilities:
                    active : strikethroughButtonComponent.props.active ?? isStrikethrough,
                    
                    
                    
                    // handlers:
                    onClick : useMergeEvents(strikethroughButtonComponent.props.onClick, handleStrikethrough),
                },
            ),
        ),
    );
};
export {
    ToolbarPlugin,
    ToolbarPlugin as default,
}
