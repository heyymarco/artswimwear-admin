// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // layout-components:
    ListItemProps,
    ListItem,
    ListItemComponentProps,
}                           from '@reusable-ui/list'            // represents a series of content

// internal components:
import {
    RadioDecorator,
}                           from '@/components/RadioDecorator'

// styles:
import {
    useSelectDropdownEditorItemStyleSheet,
}                           from './styles/loader'



// react components:
interface SelectDropdownEditorItemProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>,
        ListItemComponentProps<Element>
{
}
const SelectDropdownEditorItem = <TElement extends Element = HTMLElement>(props: SelectDropdownEditorItemProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // components:
        listItemComponent = (<ListItem /> as React.ReactComponentElement<any, ListItemProps<Element>>),
        
        
        
        // other props:
        ...restSelectDropdownEditorItem
    } = props;
    
    
    
    // styles:
    const styleSheet = useSelectDropdownEditorItemStyleSheet();
    
    
    
    // default props:
    const {
        // classes:
        mainClass = styleSheet.main, // defaults to internal styleSheet
        
        
        
        // children:
        children,
        
        
        
        // other props:
        ...restListItemProps
    } = restSelectDropdownEditorItem;
    
    
    
    // jsx:
    return React.cloneElement<ListItemProps<Element>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemProps,
            
            
            
            // classes:
            mainClass : mainClass,
        },
        
        
        
        // children:
        <RadioDecorator className='indicator' />,
        children,
    );
};
export {
    SelectDropdownEditorItem,            // named export for readibility
    SelectDropdownEditorItem as default, // default export to support React.lazy
}
