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
export type BlockOption =
    |'h1'
    |'h2'
    |'h3'
    |'h4'
    |'h5'
    |'h6'
const valueOptions : (BlockOption|null)[] = [
    null,
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
];



// react components:
export interface HeadingEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<SelectEditorProps<TElement, BlockOption>,
            // values:
            |'valueOptions' // overriden internally
            |'valueToText'  // overriden internally
        >
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
        // options:
        headingNone = 'Normal',
        heading1    = 'Heading 1',
        heading2    = 'Heading 2',
        heading3    = 'Heading 3',
        heading4    = 'Heading 4',
        heading5    = 'Heading 5',
        heading6    = 'Heading 6',
    ...restSelectEditorProps} = props;
    
    
    
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
        <SelectEditor<TElement, BlockOption>
            // other props:
            {...restSelectEditorProps}
            
            
            
            // values:
            valueOptions={valueOptions}
            valueToText={valueToText}
        />
    );
};
export {
    HeadingEditor,
    HeadingEditor as default,
}
