// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui components:
import {
    // react components:
    Generic,
    Basic,
    List,
    ListItem,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'

// app configs:
import {
    PAGE_PRODUCTS_VISIBILITY_PUBLISHED,
    PAGE_PRODUCTS_VISIBILITY_HIDDEN,
    PAGE_PRODUCTS_VISIBILITY_DRAFT,
}                           from '@/website.config'



// types:
export type ProductVisibility = 'published'|'hidden'|'draft'



// styles:
export const useTabBodyStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'vsfjwyjyxt', specificityWeight: 2 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



interface VisibilityEditorProps<TElement extends Element = HTMLElement>
    extends
        EditorProps<TElement, ProductVisibility>
{
}
const VisibilityEditor = <TElement extends Element = HTMLElement>(props: VisibilityEditorProps<TElement>): JSX.Element|null => {
    // styles:
    const styles = useTabBodyStyleSheet();
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        outerRef,
        
        
        
        // identifiers:
        id,
        
        
        
        // variants:
        size  = 'md',
        theme = 'secondary',
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
        
        
        
        // values:
        defaultValue,
        value = defaultValue,
        onChange,
    ...restEditorProps} = props;
    type T1 = typeof restEditorProps
    type T2 = Omit<T1, keyof HTMLElement>
    
    
    
    // jsx:
    return (
        <Generic
            // semantics:
            tag='div'
            
            
            
            // refs:
            outerRef={outerRef}
            
            
            
            // identifiers:
            id={id}
            
            
            
            // classes:
            mainClass={mainClass}
            classes={classes}
            variantClasses={variantClasses}
            stateClasses={stateClasses}
            className={className}
            
            
            
            // styles:
            style={style}
        >
            <List
                // variants:
                size={size}
                theme={theme}
                gradient={gradient}
                outlined={outlined}
                mild={mild}
                
                listStyle='tab'
                orientation='inline'
                
                
                
                // behaviors:
                actionCtrl={true}
            >
                {(['published', 'hidden', 'draft'] as ProductVisibility[]).map((option) =>
                    <ListItem key={option}
                        // accessibilities:
                        active={value === option}
                        
                        
                        
                        // handlers:
                        onClick={() => onChange?.(option)}
                    >
                        {{
                            published : PAGE_PRODUCTS_VISIBILITY_PUBLISHED,
                            hidden    : PAGE_PRODUCTS_VISIBILITY_HIDDEN,
                            draft     : PAGE_PRODUCTS_VISIBILITY_DRAFT,
                        }[option]}
                    </ListItem>
                )}
            </List>
            <Basic
                // variants:
                size={
                    (size === 'sm')
                    ? 'md'
                    : (size === 'md')
                    ? 'lg'
                    : size
                }
                theme={
                    (theme === 'secondary')
                    ? 'secondary'
                    : (theme === 'primary')
                    ? 'primary'
                    : theme
                }
                gradient={gradient}
                outlined={outlined}
                mild={mild}
                
                
                
                // classes:
                className={styles.main}
            >
                <p className={(value === 'published') ? undefined : 'hidden'}>The product is <em>shown</em> on the webiste.</p>
                <p className={(value === 'hidden'   ) ? undefined : 'hidden'}>The product can only be viewed via <em>a (bookmarked) link</em>.</p>
                <p className={(value === 'draft'    ) ? undefined : 'hidden'}>The product <em>cannot be viewed</em> on the entire website.</p>
            </Basic>
        </Generic>
    );
};
export {
    VisibilityEditor,
    VisibilityEditor as default,
}
