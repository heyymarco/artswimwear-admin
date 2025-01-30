// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'                    // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // menu-components:
    type DropdownListExpandedChangeEvent,
}                           from '@reusable-ui/dropdown-list-button'

// heymarco components:
import {
    type SelectDropdownEditorProps,
    SelectDropdownEditor,
}                           from '@heymarco/select-dropdown-editor'



// types:
export type BlockOption =
    |'h1'
    |'h2'
    |'h3'
    |'h4'
    |'h5'
    |'h6'
const defaultValueOptions : (BlockOption|null)[] = [
    null,
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
];



// react components:
export interface HeadingEditorProps<out TElement extends Element = HTMLButtonElement, TValue extends BlockOption|null = BlockOption|null, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
    extends
        // bases:
        Omit<SelectDropdownEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>,
            // values:
            |'valueOptions' // converted to optional
        >,
        Partial<Pick<SelectDropdownEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>,
            // values:
            |'valueOptions' // converted to optional
        >>
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
const HeadingEditor = <TElement extends Element = HTMLButtonElement, TValue extends BlockOption|null = BlockOption|null, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: HeadingEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // options:
        headingNone = 'Normal',
        heading1    = 'Heading 1',
        heading2    = 'Heading 2',
        heading3    = 'Heading 3',
        heading4    = 'Heading 4',
        heading5    = 'Heading 5',
        heading6    = 'Heading 6',
        
        
        
        // other props:
        ...restHeadingEditorProps
    } = props;
    
    
    
    // utilities:
    const defaultValueToUi = useEvent((value: TValue|null): string => {
        return ({
            h1 : heading1,
            h2 : heading2,
            h3 : heading3,
            h4 : heading4,
            h5 : heading5,
            h6 : heading6,
        } as any)[value ?? ''] ?? headingNone;
    });
    
    
    
    // default props:
    const {
        // values:
        valueOptions = defaultValueOptions as TValue[],
        valueToUi    = defaultValueToUi,
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = restHeadingEditorProps satisfies NoForeignProps<typeof restHeadingEditorProps,
        &Omit<SelectDropdownEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>,
            // values:
            |'valueOptions' // converted to optional
        >
        &Partial<Pick<SelectDropdownEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>,
            // values:
            |'valueOptions' // converted to optional
        >>
    >;
    
    
    
    // jsx:
    return (
        <SelectDropdownEditor<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>
            // other props:
            {...restSelectDropdownEditorProps}
            
            
            
            // values:
            valueOptions={valueOptions}
            valueToUi={valueToUi}
        />
    );
};
export {
    HeadingEditor,            // named export for readibility
    HeadingEditor as default, // default export to support React.lazy
}
