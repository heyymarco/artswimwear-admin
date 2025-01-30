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
export type AlignmentOption =
    |'left'
    |'center'
    |'right'
    |'justify'
const defaultValueOptions : (AlignmentOption|null)[] = [
    null,
    'left',
    'center',
    'right',
    'justify',
];



// react components:
export interface AlignmentEditorProps<out TElement extends Element = HTMLButtonElement, TValue extends AlignmentOption|null = AlignmentOption|null, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>
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
    alignmentAuto    ?: string
    alignmentLeft    ?: string
    alignmentCenter  ?: string
    alignmentRight   ?: string
    alignmentJustify ?: string
}
const AlignmentEditor = <TElement extends Element = HTMLButtonElement, TValue extends AlignmentOption|null = AlignmentOption|null, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>, TDropdownListExpandedChangeEvent extends DropdownListExpandedChangeEvent<TValue> = DropdownListExpandedChangeEvent<TValue>>(props: AlignmentEditorProps<TElement, TValue, TChangeEvent, TDropdownListExpandedChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // options:
        alignmentAuto    = 'Auto',
        alignmentLeft    = 'Left',
        alignmentCenter  = 'Center',
        alignmentRight   = 'Right',
        alignmentJustify = 'Justify',
        
        
        
        // other props:
        ...restAlignmentEditorProps
    } = props;
    
    
    
    // utilities:
    const defaultValueToUi = useEvent((value: TValue|null): string => {
        return ({
            left    : alignmentLeft,
            center  : alignmentCenter,
            right   : alignmentRight,
            justify : alignmentJustify,
        } as any)[value ?? ''] ?? alignmentAuto;
    });
    
    
    
    // default props:
    const {
        // values:
        valueOptions = defaultValueOptions as TValue[],
        valueToUi    = defaultValueToUi,
        
        
        
        // other props:
        ...restSelectDropdownEditorProps
    } = restAlignmentEditorProps satisfies NoForeignProps<typeof restAlignmentEditorProps,
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
    AlignmentEditor,            // named export for readibility
    AlignmentEditor as default, // default export to support React.lazy
}
