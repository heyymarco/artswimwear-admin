// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
    useMergeClasses,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    type IconProps,
    Icon,
    type LabelProps,
    Label,
    
    
    
    // composite-components:
    type GroupProps,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// heymarco components:
import {
    type EditorProps,
    type EditorComponentProps,
}                           from '@heymarco/editor'



// react components:
export interface EditorWithLabelProps<out TElement extends Element = HTMLElement, TValue extends unknown = string, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        EditorProps<TElement, TValue, TChangeEvent>,
        
        // components:
        Required<EditorComponentProps<TElement, TValue, TChangeEvent>>
{
    // appearances:
    icon                  : IconProps<Element>['icon']
    
    
    
    // accessibilities:
    title                ?: string
    
    
    
    // components:
    groupComponent       ?: React.ReactElement<GroupProps<Element>>
    labelComponent       ?: React.ReactElement<LabelProps<Element>>
    labelBeforeComponent ?: React.ReactElement<LabelProps<Element>>|null
    labelAfterComponent  ?: React.ReactElement<LabelProps<Element>>|null
    iconComponent        ?: React.ReactElement<IconProps<Element>>
}
const EditorWithLabel = <TElement extends Element = HTMLElement, TValue extends unknown = string, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: EditorWithLabelProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // appearances:
        icon,
        
        
        
        // variants:
        size,
        theme,
        gradient,
        outlined,
        mild,
        
        
        
        // classes:
        mainClass,
        classes,
        variantClasses,
        stateClasses,
        className,
        
        
        
        // styles:
        style,
        
        
        
        // accessibilities:
        title,
        
        
        
        // components:
        editorComponent,
        groupComponent        = (<Group            /> as React.ReactElement<GroupProps<Element>>),
        labelComponent        = (<Label            /> as React.ReactElement<LabelProps<Element>>),
        labelBeforeComponent,
        labelAfterComponent,
        iconComponent         = (<Icon icon={icon} /> as React.ReactElement<IconProps<Element>>),
    ...restEditorProps} = props;
    
    
    
    // refs:
    const mergedElmRef = useMergeRefs(
        // preserves the original `elmRef` from `editorComponent`:
        editorComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
    );
    
    
    
    // classes:
    const allClasses     = [
        ...(editorComponent.props.className ?? '').split(' '),
        ...(editorComponent.props.classes   ?? []),
    ];
    const isSolidOrFluid = allClasses.includes('solid') || allClasses.includes('fluid');
    const mergedClasses  = useMergeClasses(
        // preserves the original `classes` from `editorComponent`:
        editorComponent.props.classes,
        
        
        
        // preserves the original `classes` from `props`:
        props.classes,
        
        
        
        // classes:
        (isSolidOrFluid ? null : 'fluid'), // defaults to 'fluid'
    );
    
    
    
    // jsx:
    /* <Group> */
    return React.cloneElement<GroupProps<Element>>(groupComponent,
        // props:
        {
            // refs:
            outerRef,
            
            
            
            // identifiers:
            id,
            
            
            
            // variants:
            size,
            theme,
            gradient,
            outlined,
            mild,
            
            
            
            // classes:
            mainClass,
            classes,
            variantClasses,
            stateClasses,
            className,
            
            
            
            // styles:
            style,
        },
        
        
        
        // children:
        /* <Label> */
        React.cloneElement<LabelProps<Element>>(labelComponent,
            // props:
            {
                // classes:
                className : labelComponent.props.className ?? 'solid',
                
                
                
                // accessibilities:
                title     : labelComponent.props.title     ?? title,
            },
            
            
            
            // children:
            /* <Icon> */
            React.cloneElement<IconProps<Element>>(iconComponent,
                // props:
                {
                    // appearances:
                    icon : iconComponent.props.icon ?? icon,
                },
            ),
        ),
        /* <LabelBefore> */
        (!!labelBeforeComponent && React.cloneElement<LabelProps<Element>>(labelBeforeComponent,
            // props:
            {
                // classes:
                className : labelBeforeComponent.props.className ?? 'solid',
            },
        )),
        /* <Editor> */
        React.cloneElement<EditorProps<TElement, TValue, TChangeEvent>>(editorComponent,
            // props:
            {
                // other props:
                ...restEditorProps,
                ...editorComponent.props, // overwrites restEditorProps (if any conflics)
                
                
                
                // refs:
                elmRef  : mergedElmRef,
                
                
                
                // classes:
                classes : mergedClasses,
            },
        ),
        /* <LabelAfter> */
        (!!labelAfterComponent && React.cloneElement<LabelProps<Element>>(labelAfterComponent,
            // props:
            {
                // classes:
                className : labelAfterComponent.props.className ?? 'solid',
            },
        )),
    );
};
export {
    EditorWithLabel,
    EditorWithLabel as default,
};
