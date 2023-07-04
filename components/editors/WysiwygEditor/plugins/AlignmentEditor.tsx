// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useCallback,
}                           from 'react'

// internals:
import {
    // react components:
    SelectEditorProps,
    SelectEditor,
}                           from './SelectEditor'



// types:
export type AlignmentOption =
    |'left'
    |'center'
    |'right'
    |'justify'
const possibleValues : (AlignmentOption|null)[] = [
    null,
    'left',
    'center',
    'right',
    'justify',
];



// react components:
export interface AlignmentEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<SelectEditorProps<TElement, AlignmentOption>,
            // values:
            |'possibleValues' // overriden internally
            |'valueToText'    // overriden internally
        >
{
    // options:
    alignmentAuto    ?: string
    alignmentLeft    ?: string
    alignmentCenter  ?: string
    alignmentRight   ?: string
    alignmentJustify ?: string
}
const AlignmentEditor = <TElement extends Element = HTMLElement>(props: AlignmentEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // options:
        alignmentAuto    = 'Auto',
        alignmentLeft    = 'Left',
        alignmentCenter  = 'Center',
        alignmentRight   = 'Right',
        alignmentJustify = 'Justify',
    ...restSelectEditorProps} = props;
    
    
    
    // utilities:
    const valueToText = useCallback((value: AlignmentOption|null): string => {
        return ({
            left    : alignmentLeft,
            center  : alignmentCenter,
            right   : alignmentRight,
            justify : alignmentJustify,
        } as any)[value ?? ''] ?? alignmentAuto;
    }, [
        alignmentAuto,
        alignmentLeft,
        alignmentCenter,
        alignmentRight,
        alignmentJustify,
    ]);
    
    
    
    // jsx:
    return (
        <SelectEditor<TElement, AlignmentOption>
            // other props:
            {...restSelectEditorProps}
            
            
            
            // values:
            possibleValues={possibleValues}
            valueToText={valueToText}
        />
    );
};
export {
    AlignmentEditor,
    AlignmentEditor as default,
}
