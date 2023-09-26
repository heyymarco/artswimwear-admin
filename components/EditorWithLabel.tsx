// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // simple-components:
    IconProps,
    Icon,
    LabelProps,
    Label,
    
    
    
    // composite-components:
    GroupProps,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'



// react components:
export interface EditorWithLabelProps<TElement extends Element = HTMLElement, TValue extends any = string>
    extends
        // bases:
        EditorProps<TElement, TValue>
{
    // appearances:
    icon            : IconProps<Element>['icon']
    
    
    
    // components:
    /**
     * The underlying `<Editor>` to be labeled.
     */
    editorComponent       : React.ReactComponentElement<any, EditorProps<TElement, TValue>>
    groupComponent       ?: React.ReactComponentElement<any, GroupProps<Element>>
    labelComponent       ?: React.ReactComponentElement<any, LabelProps<Element>>
    labelBeforeComponent ?: React.ReactComponentElement<any, LabelProps<Element>>|null
    labelAfterComponent  ?: React.ReactComponentElement<any, LabelProps<Element>>|null
    iconComponent        ?: React.ReactComponentElement<any, IconProps<Element>>
}
const EditorWithLabel = <TElement extends Element = HTMLElement, TValue extends any = string>(props: EditorWithLabelProps<TElement, TValue>): JSX.Element|null => {
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
        
        
        
        // components:
        editorComponent,
        groupComponent        = (<Group            /> as React.ReactComponentElement<any, GroupProps<Element>>),
        labelComponent        = (<Label            /> as React.ReactComponentElement<any, LabelProps<Element>>),
        labelBeforeComponent,
        labelAfterComponent,
        iconComponent         = (<Icon icon={icon} /> as React.ReactComponentElement<any, IconProps<Element>>),
    ...restEditorProps} = props;
    
    
    
    // refs:
    const mergedElmRef = useMergeRefs(
        // preserves the original `elmRef` from `editorComponent`:
        editorComponent.props.elmRef,
        
        
        
        // preserves the original `elmRef` from `props`:
        elmRef,
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
        React.cloneElement<EditorProps<TElement, TValue>>(editorComponent,
            // props:
            {
                // other props:
                ...restEditorProps,
                ...editorComponent.props, // overwrites restEditorProps (if any conflics)
                
                
                
                // refs:
                elmRef : mergedElmRef,
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
