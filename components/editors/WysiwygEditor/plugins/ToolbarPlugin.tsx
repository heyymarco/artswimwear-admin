// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useEffect,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'                   // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
    
    
    
    // an accessibility management system:
    usePropAccessibility,
    AccessibilityProvider,
    
    
    
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
    
    
    
    // nodes:
    ElementNode,
    
    
    
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
    Basic,
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

// heymarco components:
import {
    type EditorChangeEventHandler,
    type EditorProps,
}                           from '@heymarco/editor'

// internals:
import {
    // types:
    BlockOption,
    
    
    
    // react components:
    HeadingEditor,
}                           from './HeadingEditor'
import {
    // types:
    AlignmentOption,
    
    
    
    // react components:
    AlignmentEditor,
}                           from './AlignmentEditor'



// styles:
export const useToolbarPluginStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ '../styles/toolbarStyles')
, { id: 'x92bmveoxb' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



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
    component                    ?: React.ReactElement<BasicProps<TElement>>
    undoRedoGroupComponent       ?: React.ReactElement<GroupProps<Element>>
    undoButtonComponent          ?: ButtonComponentProps['buttonComponent']
    redoButtonComponent          ?: ButtonComponentProps['buttonComponent']
    headingEditor                ?: React.ReactElement<EditorProps<Element, BlockOption, React.SyntheticEvent<unknown, Event>>>
    formatGroupComponent         ?: React.ReactElement<GroupProps<Element>>
    boldButtonComponent          ?: ButtonComponentProps['buttonComponent']
    italicButtonComponent        ?: ButtonComponentProps['buttonComponent']
    underlineButtonComponent     ?: ButtonComponentProps['buttonComponent']
    strikethroughButtonComponent ?: ButtonComponentProps['buttonComponent']
    listGroupComponent           ?: React.ReactElement<GroupProps<Element>>
    numberedButtonComponent      ?: ButtonComponentProps['buttonComponent']
    bulletedButtonComponent      ?: ButtonComponentProps['buttonComponent']
    alignmentEditor              ?: React.ReactElement<EditorProps<Element, AlignmentOption, React.SyntheticEvent<unknown, Event>>>
    quoteButtonComponent         ?: ButtonComponentProps['buttonComponent']
}
const ToolbarPlugin = <TElement extends Element = HTMLElement>(props: ToolbarPluginProps<TElement>): JSX.Element|null => {
    // styles:
    const styleSheet = useToolbarPluginStyleSheet();
    
    
    
    // rest props:
    const {
        // variants:
        mild = true,
        
        
        
        // components:
        component                    = (<Basic />                                                        as React.ReactElement<BasicProps<TElement>>),
        undoRedoGroupComponent       = (<Group />                                                        as React.ReactElement<GroupProps<Element>>),
        undoButtonComponent          = (<ButtonIcon icon='undo'                 title='undo' />          as React.ReactElement<ButtonProps>),
        redoButtonComponent          = (<ButtonIcon icon='redo'                 title='redo' />          as React.ReactElement<ButtonProps>),
        headingEditor                = (<HeadingEditor className='headingEditor' />                      as React.ReactElement<EditorProps<Element, BlockOption, React.SyntheticEvent<unknown, Event>>>),
        formatGroupComponent         = (<Group />                                                        as React.ReactElement<GroupProps<Element>>),
        boldButtonComponent          = (<ButtonIcon icon='format_bold'          title='bold' />          as React.ReactElement<ButtonProps>),
        italicButtonComponent        = (<ButtonIcon icon='format_italic'        title='italic' />        as React.ReactElement<ButtonProps>),
        underlineButtonComponent     = (<ButtonIcon icon='format_underline'     title='underline' />     as React.ReactElement<ButtonProps>),
        strikethroughButtonComponent = (<ButtonIcon icon='format_strikethrough' title='strikethrough' /> as React.ReactElement<ButtonProps>),
        listGroupComponent           = (<Group />                                                        as React.ReactElement<GroupProps<Element>>),
        numberedButtonComponent      = (<ButtonIcon icon='format_list_numbered' title='numbered' />      as React.ReactElement<ButtonProps>),
        bulletedButtonComponent      = (<ButtonIcon icon='format_list_bulleted' title='bulleted' />      as React.ReactElement<ButtonProps>),
        alignmentEditor              = (<AlignmentEditor className='alignmentEditor' />                  as React.ReactElement<EditorProps<Element, AlignmentOption, React.SyntheticEvent<unknown, Event>>>),
        quoteButtonComponent         = (<ButtonIcon icon='format_quote'         title='quote' />         as React.ReactElement<ButtonProps>),
    ...restElementProps} = props;
    
    
    
    // accessibilities:
    const propAccess           = usePropAccessibility({});
    const isDisabledOrReadOnly = (!propAccess.enabled || propAccess.readOnly);
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    basicVariantProps.mild  = mild;
    
    
    
    // contexts:
    const [editor] = useLexicalComposerContext();
    
    
    
    // states:
    const [canUndo        , setCanUndo        ] = useState<boolean>(false);
    const [canRedo        , setCanRedo        ] = useState<boolean>(false);
    
    const [blockType      , setBlockType      ] = useState<string>('paragraph');
    
    const [isBold         , setIsBold         ] = useState<boolean>(false);
    const [isItalic       , setIsItalic       ] = useState<boolean>(false);
    const [isUnderline    , setIsUnderline    ] = useState<boolean>(false);
    const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
    
    const [alignmentType  , setAlignmentType  ] = useState<string>('auto');
    
    
    
    // dom effects:
    const $refreshUi = useEvent((): void => {
        // conditions:
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        
        
        
        const anchorNode = selection.anchor.getNode();
        const element    =
            anchorNode.getKey() === 'root'
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();
        const elementKey = element.getKey();
        const elementDOM = editor.getElementByKey(elementKey);
        if (elementDOM !== null) {
            if ($isListNode(element)) {
                const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                const type       = parentList ? parentList.getTag() : element.getTag();
                setBlockType(type);
            }
            else if(!$isRootNode(element)) {
                const type = $isHeadingNode(element)
                    ? element.getTag()
                    : element.getType();
                setBlockType(type);
                
                
                
                // alignments:
                const textAlignId = element.getFormat() || 0;
                setAlignmentType(['auto', 'left', 'center', 'right', 'justify']?.[textAlignId] ?? 'auto');
                
                
                
                // if ($isCodeNode(element)) {
                //     setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
                // } // if
            } // if
        } // if
        
        
        
        // formats:
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
    
    
    
    // handlers:
    const handleUndo            = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
    });
    const handleRedo            = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
    });
    const handleChangeHeading   = useEvent<EditorChangeEventHandler<BlockOption, React.SyntheticEvent<unknown, Event>>>((value) => {
        editor.update(() => {
            // conditions:
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            
            
            
            // actions:
            if (value) {
                $wrapNodes(selection, () => $createHeadingNode(value));
                setBlockType(value);
            }
            else {
                $wrapNodes(selection, () => $createParagraphNode());
                setBlockType('paragraph');
            } // if
        });
    });
    const handleBold            = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    });
    const handleItalic          = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    });
    const handleUnderline       = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
    });
    const handleStrikethrough   = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    });
    const handleNumbered        = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        if (blockType !== 'ol') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            setBlockType('ol');
        }
        else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            setBlockType('paragraph');
        } // if
    });
    const handleBulleted        = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        if (blockType !== 'ul') {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            setBlockType('ul');
        }
        else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            setBlockType('paragraph');
        } // if
    });
    const handleChangeAlignment = useEvent<EditorChangeEventHandler<AlignmentOption, React.SyntheticEvent<unknown, Event>>>((value) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value ?? '');
        setAlignmentType(value ?? 'auto');
    });
    const handleQuote           = useEvent<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        editor.update(() => {
            // conditions:
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            
            
            
            // actions:
            if (blockType !== 'quote') {
                $wrapNodes(selection, () => $createQuoteNode());
                setBlockType('quote');
            }
            else {
                $wrapNodes(selection, () => $createParagraphNode());
                setBlockType('paragraph');
            } // if
        });
    });
    
    
    
    // jsx:
    return (
        <AccessibilityProvider
            // accessibilities:
            {...propAccess}
            enabled={!isDisabledOrReadOnly} // disabled if `enabled={false}` or `readOnly={true}`
        >
            {React.cloneElement<BasicProps<TElement>>(component,
                // props:
                {
                    // other props:
                    ...restElementProps,
                    ...component.props, // overwrites restElementProps (if any conflics)
                    
                    
                    
                    // variants:
                    mild      : component.props.mild      ?? mild,
                    
                    
                    
                    // classes:
                    mainClass : component.props.mainClass ?? styleSheet.main,
                },
                
                
                
                // children:
                React.cloneElement<GroupProps<Element>>(undoRedoGroupComponent,
                    // props:
                    {
                        // basic variant props:
                        ...basicVariantProps,
                        ...undoRedoGroupComponent.props, // overwrites basicVariantProps (if any conflics)
                    },
                    
                    
                    
                    // children:
                    React.cloneElement<ButtonProps>(undoButtonComponent,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            ...undoButtonComponent.props, // overwrites basicVariantProps (if any conflics)
                            
                            
                            
                            // accessibilities:
                            enabled : undoButtonComponent.props.enabled ?? canUndo,
                            
                            
                            
                            // handlers:
                            onClick : useMergeEvents(undoButtonComponent.props.onClick, handleUndo),
                        },
                    ),
                    React.cloneElement<ButtonProps>(redoButtonComponent,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            ...redoButtonComponent.props, // overwrites basicVariantProps (if any conflics)
                            
                            
                            
                            // accessibilities:
                            enabled : redoButtonComponent.props.enabled ?? canRedo,
                            
                            
                            
                            // handlers:
                            onClick : useMergeEvents(redoButtonComponent.props.onClick, handleRedo),
                        },
                    ),
                ),
                React.cloneElement<EditorProps<Element, BlockOption, React.SyntheticEvent<unknown, Event>>>(headingEditor,
                    // props:
                    {
                        // basic variant props:
                        ...basicVariantProps,
                        ...headingEditor.props, // overwrites basicVariantProps (if any conflics)
                        
                        
                        
                        // accessibilities:
                        active   : headingEditor.props.active ?? (blockType?.[0] === 'h'),
                        
                        
                        
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
                        ...formatGroupComponent.props, // overwrites basicVariantProps (if any conflics)
                    },
                    
                    
                    
                    // children:
                    React.cloneElement<ButtonProps>(boldButtonComponent,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            ...boldButtonComponent.props, // overwrites basicVariantProps (if any conflics)
                            
                            
                            
                            // accessibilities:
                            active  : boldButtonComponent.props.active ?? isBold,
                            
                            
                            
                            // handlers:
                            onClick : useMergeEvents(boldButtonComponent.props.onClick, handleBold),
                        },
                    ),
                    React.cloneElement<ButtonProps>(italicButtonComponent,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            ...italicButtonComponent.props, // overwrites basicVariantProps (if any conflics)
                            
                            
                            
                            // accessibilities:
                            active  : italicButtonComponent.props.active ?? isItalic,
                            
                            
                            
                            // handlers:
                            onClick : useMergeEvents(italicButtonComponent.props.onClick, handleItalic),
                        },
                    ),
                    React.cloneElement<ButtonProps>(underlineButtonComponent,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            ...underlineButtonComponent.props, // overwrites basicVariantProps (if any conflics)
                            
                            
                            
                            // accessibilities:
                            active  : underlineButtonComponent.props.active ?? isUnderline,
                            
                            
                            
                            // handlers:
                            onClick : useMergeEvents(underlineButtonComponent.props.onClick, handleUnderline),
                        },
                    ),
                    React.cloneElement<ButtonProps>(strikethroughButtonComponent,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            ...strikethroughButtonComponent.props, // overwrites basicVariantProps (if any conflics)
                            
                            
                            
                            // accessibilities:
                            active  : strikethroughButtonComponent.props.active ?? isStrikethrough,
                            
                            
                            
                            // handlers:
                            onClick : useMergeEvents(strikethroughButtonComponent.props.onClick, handleStrikethrough),
                        },
                    ),
                ),
                React.cloneElement<GroupProps<Element>>(listGroupComponent,
                    // props:
                    {
                        // basic variant props:
                        ...basicVariantProps,
                        ...listGroupComponent.props, // overwrites basicVariantProps (if any conflics)
                    },
                    
                    
                    
                    // children:
                    React.cloneElement<ButtonProps>(numberedButtonComponent,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            ...numberedButtonComponent.props, // overwrites basicVariantProps (if any conflics)
                            
                            
                            
                            // accessibilities:
                            active  : numberedButtonComponent.props.active ?? (blockType === 'ol'),
                            
                            
                            
                            // handlers:
                            onClick : useMergeEvents(numberedButtonComponent.props.onClick, handleNumbered),
                        },
                    ),
                    React.cloneElement<ButtonProps>(bulletedButtonComponent,
                        // props:
                        {
                            // basic variant props:
                            ...basicVariantProps,
                            ...bulletedButtonComponent.props, // overwrites basicVariantProps (if any conflics)
                            
                            
                            
                            // accessibilities:
                            active  : bulletedButtonComponent.props.active ?? (blockType === 'ul'),
                            
                            
                            
                            // handlers:
                            onClick : useMergeEvents(bulletedButtonComponent.props.onClick, handleBulleted),
                        },
                    ),
                ),
                React.cloneElement<EditorProps<Element, AlignmentOption, React.SyntheticEvent<unknown, Event>>>(alignmentEditor,
                    // props:
                    {
                        // basic variant props:
                        ...basicVariantProps,
                        ...alignmentEditor.props, // overwrites basicVariantProps (if any conflics)
                        
                        
                        
                        // accessibilities:
                        active   : alignmentEditor.props.active ?? (alignmentType !== 'auto'),
                        
                        
                        
                        // values:
                        value    : alignmentEditor.props.value ?? alignmentType as any,
                        onChange : useMergeEvents(alignmentEditor.props.onChange, handleChangeAlignment),
                    },
                ),
                React.cloneElement<ButtonProps>(quoteButtonComponent,
                    // props:
                    {
                        // basic variant props:
                        ...basicVariantProps,
                        ...quoteButtonComponent.props, // overwrites basicVariantProps (if any conflics)
                        
                        
                        
                        // accessibilities:
                        active  : quoteButtonComponent.props.active ?? (blockType === 'quote'),
                        
                        
                        
                        // handlers:
                        onClick : useMergeEvents(quoteButtonComponent.props.onClick, handleQuote),
                    },
                ),
            )}
        </AccessibilityProvider>
    );
};
export {
    ToolbarPlugin,
    ToolbarPlugin as default,
}
