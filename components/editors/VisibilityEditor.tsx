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
    type EventHandler,
    useMergeEvents,
    
    
    
    // an accessibility management system:
    usePropAccessibility,
    AccessibilityProvider,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// heymarco components:
import {
    type EditorChangeEventHandler,
    type EditorProps,
}                           from '@heymarco/editor'

// internals:
import {
    // composite-components:
    TabExpandedChangeEvent,
    TabProps,
    Tab,
    TabPanel,
}                           from '@reusable-ui/components'

// configs:
import {
    PAGE_PRODUCT_VISIBILITY_PUBLISHED,
    PAGE_PRODUCT_VISIBILITY_HIDDEN,
    PAGE_PRODUCT_VISIBILITY_DRAFT,
}                           from '@/website.config'

// models:
import {
    ProductVisibility,
    VariantVisibility,
}                           from '@prisma/client'



// types:
const valueOptions        : ProductVisibility[] = ['PUBLISHED', 'HIDDEN', 'DRAFT']; // with hidden
const reducedValueOptions : VariantVisibility[] = ['PUBLISHED',           'DRAFT']; // without hidden



// react components:
interface BaseVisibilityEditorProps<out TElement extends Element = HTMLDivElement, TValue extends unknown = unknown, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>>
    extends
        // bases:
        Omit<TabProps<TElement>,
            // children:
            |'children'                // not supported
        >,
        // Pick<EditorProps<TElement, TValue, TChangeEvent>,
        //     // values:
        //     |'defaultValue'
        //     |'value'
        //     |'onChange'
        // >
        Omit<EditorProps<TElement, TValue, TChangeEvent>,
            // refs:
            |'elmRef'                  // moved to <TabHeader>
            
            // variants:
            |'nude'                    // not supported
            
            // accessibilities:
            |'autoFocus'               // not supported
            
            // forms:
            |'name'|'form'             // not supported
            
            // values:
            |'notifyValueChange'       // not supported
            
            // validations:
            |'enableValidation'        // not supported
            |'isValid'                 // not supported
            |'inheritValidation'       // not supported
            |'validationDeps'          // not supported
            |'onValidation'            // not supported
            |'customValidator'         // not supported
            
            |'validDelay'              // not supported
            |'invalidDelay'            // not supported
            |'noValidationDelay'       // not supported
            
            |'required'                // not supported
            
            // states:
            |'focused'                 // not supported
            |'assertiveFocusable'      // not supported
            |'arrived'                 // not supported
            
            // children:
            |'children'                // not supported
            |'dangerouslySetInnerHTML' // not supported
        >
{
    // values:
    modelName    ?: string
}
interface CompletedVisibilityEditorProps<out TElement extends Element = HTMLDivElement, TValue extends ProductVisibility = ProductVisibility, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>>
    extends
        // bases:
        BaseVisibilityEditorProps<TElement, TValue, TChangeEvent>
{
    // values:
    optionHidden ?: undefined|true
}
interface ReducedVisibilityEditorProps<out TElement extends Element = HTMLDivElement, TValue extends VariantVisibility = VariantVisibility, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>>
    extends
        // bases:
        BaseVisibilityEditorProps<TElement, TValue, TChangeEvent>
{
    // values:
    optionHidden  : false
}
type VisibilityEditorProps<TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>> =
    |CompletedVisibilityEditorProps<TElement, ProductVisibility, TChangeEvent>
    |ReducedVisibilityEditorProps<TElement, VariantVisibility, TChangeEvent>
const VisibilityEditor = <TElement extends Element = HTMLDivElement, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.MouseEvent<Element, MouseEvent>>(props: VisibilityEditorProps<TElement, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // values:
        modelName     = 'product',
        
        optionHidden  = true,
        
        defaultValue  : defaultUncontrollableValue = 'DRAFT',
        value         : controllableValue,
        onChange      : onValueChange,
        
        
        
        // handlers:
        onExpandedChange,
        
        
        
        // other props:
        ...restVisibilityEditorProps
    } = props;
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<ProductVisibility | VariantVisibility, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onValueChange as (EditorChangeEventHandler<ProductVisibility, TChangeEvent> & EditorChangeEventHandler<VariantVisibility, TChangeEvent>),
    });
    
    
    
    // handlers:
    const handleExpandedChangeInternal = useEvent<EventHandler<TabExpandedChangeEvent>>(({tabIndex}) => {
        triggerValueChange(
            (
                optionHidden                    // if including hidden
                ? valueOptions[tabIndex]        // with hidden
                : reducedValueOptions[tabIndex] // without hidden
            ) as (ProductVisibility & VariantVisibility)
        , { triggerAt: 'immediately', event: undefined as any /* TODO: fix this */ });
    });
    const handleExpandedChange         = useMergeEvents(
        // preserves the original `onExpandedChange` from `props`:
        onExpandedChange,
        
        
        
        // actions:
        handleExpandedChangeInternal,
    );
    
    
    
    // accessibilities:
    const propAccess = usePropAccessibility(props);
    const {enabled: propEnabled, readOnly: propReadOnly} = propAccess;
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // default props:
    const {
        // accessibilities:
        'aria-label' : ariaLabel = 'Visibility',
        
        
        
        // states:
        enabled                  = !isDisabledOrReadOnly, // can't switch the `<Tab>` if disabled or readonly
        expandedTabIndex         = (                      // internally controllable
            (
                optionHidden          // if including hidden
                ? valueOptions        // with hidden
                : reducedValueOptions // without hidden
            )
            .findIndex((valueOption) => (valueOption === value))
        ),
        
        
        
        // other props:
        ...restTabProps
    } = restVisibilityEditorProps satisfies NoForeignProps<typeof restVisibilityEditorProps, Omit<TabProps<TElement>, 'children'>>;
    
    
    
    // jsx:
    return (
        // can't switch the `<Tab>` nor change the `<NumberUpDownEditor>` if disabled or readonly
        <AccessibilityProvider {...propAccess}>
            <Tab<TElement>
                // other props:
                {...restTabProps}
                
                
                
                // accessibilities:
                aria-label={ariaLabel}
                
                
                
                // states:
                enabled={enabled}
                
                expandedTabIndex={expandedTabIndex}     // internally controllable
                onExpandedChange={handleExpandedChange} // internally controllable
            >
                <TabPanel label={PAGE_PRODUCT_VISIBILITY_PUBLISHED}>
                    <p>
                        The {modelName} is <em>shown</em> on the webiste.
                    </p>
                </TabPanel>
                {optionHidden && <TabPanel label={PAGE_PRODUCT_VISIBILITY_HIDDEN}>
                    <p>
                        The {modelName} can only be viewed via <em>a (bookmarked) link</em>.
                    </p>
                </TabPanel>}
                <TabPanel label={PAGE_PRODUCT_VISIBILITY_DRAFT}>
                    <p>
                        The {modelName} <em>cannot be viewed</em> on the entire website.
                    </p>
                </TabPanel>
            </Tab>
        </AccessibilityProvider>
    );
};
export {
    VisibilityEditor,            // named export for readibility
    VisibilityEditor as default, // default export to support React.lazy
}
