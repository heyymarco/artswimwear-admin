// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // react components:
    Icon,
    Label,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // react components:
    TextEditorProps,
    TextEditor,
}                           from '@/components/editors/TextEditor'



export interface PathEditorProps<TElement extends Element = HTMLSpanElement>
    extends
        // bases:
        TextEditorProps<TElement>
{
    // appearances:
    homeUrl ?: string
}
const PathEditor = <TElement extends Element = HTMLSpanElement>(props: PathEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // appearances:
        homeUrl,
        
        
        
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
    ...restTextEditorProps} = props;
    
    
    
    // jsx:
    return (
        <Group
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // variants:
            size={size}
            theme={theme}
            gradient={gradient}
            outlined={outlined}
            mild={mild}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            <Label
                // classes:
                className='solid'
                
                
                
                // accessibilities:
                title={homeUrl}
            >
                <Icon icon='home' />
            </Label>
            <Label
                // classes:
                className='solid'
            >
                /products/
            </Label>
            <TextEditor<TElement>
                // other props:
                {...restTextEditorProps}
                
                
                
                // refs:
                elmRef={elmRef}
                
                
                
                // classes:
                className='fluid'
                
                
                
                // validations:
                required={props.required ?? true}
                minLength={props.minLength ?? 1}
            />
        </Group>
    );
};
export {
    PathEditor,
    PathEditor as default,
}
