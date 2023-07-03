// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useCallback,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import type {
    // react components:
    GenericProps,
}                           from '@reusable-ui/generic'         // an unstyled basic building block of Reusable-UI components
import type {
    // react components:
    BasicProps,
}                           from '@reusable-ui/basic'           // a styled basic building block of Reusable-UI components
import type {
    // react components:
    ButtonProps,
}                           from '@reusable-ui/button'          // a button component for initiating an action
import {
    // react components:
    ButtonIcon,
}                           from '@reusable-ui/button-icon'     // a button component with a nice icon

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // react components:
    DropdownListButtonProps,
    DropdownListButton,
    ListItem,
}                           from '@reusable-ui/dropdown-list-button'



// types:
export type BlockOption =
    |'h1'
    |'h2'
    |'h3'
    |'h4'
    |'h5'
    |'h6'
const possibleValues : (BlockOption|null)[] = [
    null,
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
];



// defaults:
const _defaultValue : BlockOption|null = null;



// react components:
export type BasicHeadingEditorProps<TElement extends Element = HTMLElement> =
    &Pick<EditorProps<TElement, BlockOption|null>,
        // values:
        |'defaultValue'
        |'value'
        |'onChange'
    >
    &Omit<BasicProps<TElement>,
        |keyof GenericProps
    >
export interface HeadingEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<DropdownListButtonProps,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        BasicHeadingEditorProps<TElement>
{
    // options:
    headingNone ?: string
    heading1    ?: string
    heading2    ?: string
    heading3    ?: string
    heading4    ?: string
    heading5    ?: string
    heading6    ?: string
}
const HeadingEditor = <TElement extends Element = HTMLElement>(props: HeadingEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,
        value,
        onChange,
        
        
        
        // options:
        headingNone = 'Normal',
        heading1    = 'Heading 1',
        heading2    = 'Heading 2',
        heading3    = 'Heading 3',
        heading4    = 'Heading 4',
        heading5    = 'Heading 5',
        heading6    = 'Heading 6',
        
        
        
        // components:
        buttonComponent = (<ButtonIcon icon='view_headline' /> as React.ReactComponentElement<any, ButtonProps>),
    ...restDropdownListButtonProps} = props;
    
    
    
    // states:
    const isControllableValue = (value !== undefined);
    const [valueDn, setValueDn] = useState<BlockOption|null>(defaultValue ?? _defaultValue);
    const valueFn : BlockOption|null = ((value !== undefined) /*controllable*/ ? value : valueDn /*uncontrollable*/);
    
    
    
    // handlers:
    const handleChangeInternal = useEvent((value: BlockOption|null) => {
        // update state:
        if (!isControllableValue) setValueDn(value);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `props`:
        onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    
    
    // events:
    const triggerChange = useEvent((value: BlockOption|null): void => {
        // fire `onChange` react event:
        handleChange?.(value);
    });
    
    
    
    // utilities:
    const valueToText = useCallback((value: BlockOption|null): string => {
        return ({
            h1 : heading1,
            h2 : heading2,
            h3 : heading3,
            h4 : heading4,
            h5 : heading5,
            h6 : heading6,
        } as any)[value ?? ''] ?? headingNone;
    }, [
        headingNone,
        heading1,
        heading2,
        heading3,
        heading4,
        heading5,
        heading6,
    ]);
    
    
    
    // jsx:
    return (
        <DropdownListButton
            // other props:
            {...restDropdownListButtonProps}
            
            
            
            // children:
            buttonChildren={valueToText(valueFn)}
        >
            {possibleValues.map((possibleValue, index) =>
                <ListItem
                    // identifiers:
                    key={index}
                    
                    
                    
                    // accessibilities:
                    active={(possibleValue === valueFn)}
                    
                    
                    
                    // handlers:
                    onClick={() => triggerChange(possibleValue)}
                >
                    {valueToText(possibleValue)}
                </ListItem>
            )}
        </DropdownListButton>
    );
};
export {
    HeadingEditor,
    HeadingEditor as default,
}
