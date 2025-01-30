// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
    useState,
}                           from 'react'

// reusable-ui core:
import {
    // a collection of TypeScript type utilities, assertions, and validations for ensuring type safety in reusable UI components:
    type NoForeignProps,
    
    
    
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeRefs,
    
    
    
    // an accessibility management system:
    usePropAccessibility,
    AccessibilityProvider,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// heymarco:
import {
    // utilities:
    useControllableAndUncontrollable,
}                           from '@heymarco/events'

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    // react components:
    type NumberUpDownEditorProps,
    NumberUpDownEditor,
}                           from '@heymarco/number-updown-editor'

// reusable-ui components:
import {
    // simple-components:
    Label,
    
    
    
    // composite-components:
    Group,
    
    TabExpandedChangeEvent,
    TabProps,
    Tab,
    TabPanel,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// configs:
import {
    PAGE_PRODUCT_STOCK_UNLIMITED,
    PAGE_PRODUCT_STOCK_LIMITED,
}                           from '@/website.config'



// react components:
export interface StockEditorProps<out TElement extends Element = HTMLDivElement, TValue extends number|null = number|null, in TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>
    extends
        // bases:
        Pick<TabProps<TElement>,
            // refs:
            |'outerRef'       // moved to <Tab>
            
            // identifiers:
            |'id'             // moved to <Tab>
            
            // variants:
            |'size'           // moved to <Tab>
            |'theme'          // moved to <Tab>
            |'gradient'       // moved to <Tab>
            |'outlined'       // moved to <Tab>
            |'mild'           // moved to <Tab>
            
            // classes:
            |'mainClass'      // moved to <Tab>
            |'classes'        // moved to <Tab>
            |'variantClasses' // moved to <Tab>
            |'stateClasses'   // moved to <Tab>
            |'className'      // moved to <Tab>
            
            // styles:
            |'style'          // moved to <Tab>
            
            // components:
            |'listComponent'  // moved to <Tab>
        >,
        Omit<NumberUpDownEditorProps<Element, TValue, TChangeEvent>,
            // refs:
            |'outerRef'       // moved to <Tab>
            
            // identifiers:
            |'id'             // moved to <Tab>
            
            // variants:
            |'size'           // moved to <Tab>
            |'theme'          // moved to <Tab>
            |'gradient'       // moved to <Tab>
            |'outlined'       // moved to <Tab>
            |'mild'           // moved to <Tab>
            
            // classes:
            |'mainClass'      // moved to <Tab>
            |'classes'        // moved to <Tab>
            |'variantClasses' // moved to <Tab>
            |'stateClasses'   // moved to <Tab>
            |'className'      // moved to <Tab>
            
            // styles:
            |'style'          // moved to <Tab>
        >
{
}
const StockEditor = <TElement extends Element = HTMLDivElement, TValue extends number|null = number|null, TChangeEvent extends React.SyntheticEvent<unknown, Event> = React.ChangeEvent<HTMLInputElement>>(props: StockEditorProps<TElement, TValue, TChangeEvent>): JSX.Element|null => {
    // props:
    const {
        // refs:
        elmRef,                                            // take, moved to <NumberUpDownEditor>
        outerRef,                                          // take, moved to <Tab>
        
        
        
        // identifiers:
        id,                                                // take, moved to <Tab>
        
        
        
        // variants:
        size,                                              // take, moved to <Tab>
        theme = 'primary',                                 // take, moved to <Tab>
        gradient,                                          // take, moved to <Tab>
        outlined,                                          // take, moved to <Tab>
        mild,                                              // take, moved to <Tab>
        
        
        
        // classes:
        mainClass,                                         // take, moved to <Tab>
        classes,                                           // take, moved to <Tab>
        variantClasses,                                    // take, moved to <Tab>
        stateClasses,                                      // take, moved to <Tab>
        className,                                         // take, moved to <Tab>
        
        
        
        // styles:
        style,                                             // take, moved to <Tab>
        
        
        
        // values:
        defaultValue            : defaultUncontrollableValue = (null as TValue), // defaults to unlimited stock
        value                   : controllableValue,
        onChange                : onValueChange,
        
        
        
        // components:
        listComponent,                                     // take, moved to <Tab>
        
        
        
        // other props:
        ...restNumberUpDownEditorProps
    } = props;
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // states:
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<TValue, TChangeEvent>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : onValueChange,
    });
    
    const isStockLimited = (value !== null);
    
    // preserves the last non-null `value` with initially `0` if the `value` is `null`:
    const [lastLimitedValue, setLastLimitedValue] = useState<Exclude<TValue, null>>((value ?? 0) as Exclude<TValue, null>);
    // syncs the `lastLimitedValue` with the `value` if the `value` is not `null`:
    useEffect(() => {
        if (value !== null) setLastLimitedValue(value as Exclude<TValue, null>);
    }, [value]);
    
    
    
    // refs:
    const inputRefInternal = useRef<HTMLInputElement|null>(null);
    const mergedInputRef   = useMergeRefs(
        // preserves the original `elmRef` from `props`:
        elmRef,
        
        
        
        inputRefInternal,
    );
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<TabExpandedChangeEvent>>(({tabIndex}) => {
        triggerValueChange(
            (tabIndex === 0)
            ? (null as TValue) // The selected tab is unlimited => set the value to null
            : lastLimitedValue // The selected tab is limited   => set the value to the last non-null value
        , { triggerAt: 'immediately', event: undefined as any /* TODO: fix this */ });
    });
    const handleInputChange    = useEvent<EditorChangeEventHandler<TValue, TChangeEvent>>((newValue, event) => {
        triggerValueChange(
            newValue
        , { triggerAt: 'immediately', event: event });
    });
    
    
    
    // effects:
    // auto focus to <NumberUpDownEditor> when the tab is active:
    useEffect(() => {
        // conditions:
        if (!isStockLimited) return; // not in the limited stock tab => no need to focus the input
        
        
        
        // actions:
        inputRefInternal.current?.focus();
    }, [isStockLimited]);
    
    
    
    // accessibilities:
    const propAccess = usePropAccessibility(props);
    const {enabled: propEnabled, readOnly: propReadOnly} = propAccess;
    const isDisabledOrReadOnly = (!propEnabled || propReadOnly);
    
    
    
    // jsx:
    return (
        // can't switch the `<Tab>` nor change the `<NumberUpDownEditor>` if disabled or readonly
        <AccessibilityProvider {...propAccess}>
            <Tab<TElement>
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
                
                
                
                // states:
                enabled={!isDisabledOrReadOnly} // can't switch the `<Tab>` if disabled or readonly
                
                expandedTabIndex={isStockLimited ? 1 : 0} // internally controllable
                onExpandedChange={handleExpandedChange}   // internally controllable
                
                
                
                // components:
                listComponent={listComponent}
            >
                <TabPanel label={PAGE_PRODUCT_STOCK_UNLIMITED}>
                    <p>
                        The product stock is <em>always available</em>.
                    </p>
                </TabPanel>
                <TabPanel label={PAGE_PRODUCT_STOCK_LIMITED}>
                    <Group
                        // variants:
                        {...basicVariantProps}
                        // theme={
                        //     // swap the primary and secondary themes:
                        //     (theme === 'secondary')
                        //     ? 'primary'
                        //     : (theme === 'primary')
                        //     ? 'secondary'
                        //     // or use the current theme if not primary nor secondary:
                        //     : theme
                        // }
                        
                        
                        
                        // // classes:
                        // className={isStockLimited ? undefined : 'hidden'}
                    >
                        <Label
                            // classes:
                            className='solid'
                        >
                            Current stock:
                        </Label>
                        <NumberUpDownEditor<Element, TValue, TChangeEvent>
                            // other props:
                            {...restNumberUpDownEditorProps satisfies NoForeignProps<typeof restNumberUpDownEditorProps, NumberUpDownEditorProps<Element, TValue, TChangeEvent>>}
                            
                            
                            
                            // refs:
                            elmRef={mergedInputRef}
                            
                            
                            
                            // variants:
                            theme={
                                // swap the primary and primaryAlt themes:
                                (theme === 'primary')
                                ? 'primaryAlt'
                                :   (theme === 'primaryAlt')
                                    ? 'primary'
                                    : undefined
                            }
                            
                            
                            
                            // classes:
                            className='fluid'
                            
                            
                            
                            // values:
                            value={lastLimitedValue}     // internally controllable
                            onChange={handleInputChange} // internally controllable
                        />
                    </Group>
                </TabPanel>
            </Tab>
        </AccessibilityProvider>
    );
};
export {
    StockEditor,            // named export for readibility
    StockEditor as default, // default export to support React.lazy
}
