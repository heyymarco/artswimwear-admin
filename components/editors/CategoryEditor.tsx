// react:
import {
    // react:
    default as React,
}                           from 'react'

// internal components:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    ModelCreateOuterProps,
    
    PaginationListProps,
    PaginationList,
}                           from '@/components/explorers/PaginationList'
import type {
    CategoryPreviewProps,
}                           from '@/components/views/CategoryPreview'

// models:
import {
    type CategoryDetail,
}                           from '@/models'



// react components:
interface CategoryEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Pick<EditorProps<TElement, string|null>,
            // values:
            |'defaultValue' // not supported, controllable only
            |'value'
            |'onChange'
        >,
        Omit<PaginationListProps<CategoryDetail, TElement>,
            // values:
            |'defaultValue' // already taken over
            |'value'        // already taken over
            |'onChange'     // already taken over
            
            
            
            // children:
            |'children'     // already taken over
        >,
        // data:
        Partial<Pick<ModelCreateOuterProps<CategoryDetail>,
            // components:
            |'modelCreateComponent'
            
            
            
            // handlers:
            |'onModelCreate'
        >>
{
    // components:
    modelPreviewComponent  : React.ReactComponentElement<any, CategoryPreviewProps>
}
const CategoryEditor = <TElement extends Element = HTMLElement>(props: CategoryEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // values:
        defaultValue,
        value,
        onChange,
        
        
        
        // components:
        modelPreviewComponent,
        
        
        
        // handlers:
        onModelCreate,
        
        
        
        // other props:
        ...restPaginationListProps
    } = props;
    
    
    
    // jsx:
    return (
        <PaginationList<CategoryDetail, TElement>
            // other props:
            {...restPaginationListProps}
            
            
            
            // components:
            modelPreviewComponent={
                /* <ModelPreview> */
                React.cloneElement<CategoryPreviewProps>(modelPreviewComponent,
                    // props:
                    {
                        // TODO:
                        // // identifiers:
                        // key           : modelPreviewComponent.key          ?? modelOption.id,
                        // 
                        // 
                        // 
                        // // data:
                        // model         : modelPreviewComponent.props.model  ?? modelOption,
                        // 
                        // 
                        // 
                        // // states:
                        // active        : modelPreviewComponent.props.active ?? ((value ?? '') === modelOption.id),
                        
                        
                        
                        // handlers:
                        // onModelChange : onChange,
                    },
                )
            }
        />
    );
};
export {
    CategoryEditor,
    CategoryEditor as default,
}
