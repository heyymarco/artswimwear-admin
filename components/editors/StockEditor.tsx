// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeEvents,
    useMergeRefs,
    
    
    
    // an accessibility management system:
    usePropReadOnly,
    
    
    
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
    
    
    
    // layout-components:
    ListProps,
    List,
    
    
    
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
export interface StockEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<NumberUpDownEditorProps<TElement>,
            // refs:
            |'outerRef'                // taken by <Tab>
            
            // variants:
            |'nude'                    // not supported
            
            // children:
            |'children'                // not supported
            |'dangerouslySetInnerHTML' // not supported
        >,
        Omit<TabProps<TElement>,
            // refs:
            |'elmRef'                  // taken by <NumberUpDownEditor>
            
            // states:
            |'defaultExpandedTabIndex' // already taken over
            |'expandedTabIndex'        // already taken over
            |'onExpandedChange'        // already taken over
            
            // children:
            |'children'                // already taken over
        >
{
}
const StockEditor = <TElement extends Element = HTMLElement>(props: StockEditorProps<TElement>): JSX.Element|null => {
    // rest props:
    const {
        // refs:
        elmRef,
        
        
        
        // variants:
        theme = 'primary',
        
        
        
        // accessibilities:
        autoFocus,
        tabIndex,
        enterKeyHint,
        
        
        
        // validations:
        enableValidation,
        isValid,
        inheritValidation,
        onValidation,
        
        required,
        
        min = 0,
        max = 9999,
        step,
        
        
        
        // formats:
        placeholder,
        autoComplete,
        list,
        
        
        
        // forms:
        name,
        form,
        
        
        
        // values:
        defaultValue   : defaultUncontrollableValue = null,
        value          : controllableValue,
        onChange       : onControllableValueChange,
        onChangeAsText : onControllableTextChange,
        
        
        
        // states:
        focused,
        assertiveFocusable,
        arrived,
        
        
        
        // components:
        decreaseButtonComponent,
        increaseButtonComponent,
        numberEditorComponent,
        listComponent = (<List<Element> /> as React.ReactComponentElement<any, ListProps<Element>>),
        
        
        
        // children:
        childrenBeforeButton,
        childrenBeforeInput,
        childrenAfterInput,
        childrenAfterButton,
    ...restTabProps} = props;
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    
    // states:
    const handleControllableValueChangeInternal = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, number|null>>((newValue, event) => {
        // normalize: null => empty string, TValue => toString:
        onControllableTextChange?.((newValue !== null) ? `${newValue}` /* any TValue => toString */ : '' /* null => empty string */, event);
    });
    const handleControllableValueChange         = useMergeEvents(
        // preserves the original `onCollapseEnd` from `props`:
        onControllableValueChange,
        
        
        
        // actions:
        handleControllableValueChangeInternal,
    );
    const {
        value              : value,
        triggerValueChange : triggerValueChange,
    } = useControllableAndUncontrollable<number|null, React.ChangeEvent<HTMLInputElement>>({
        defaultValue       : defaultUncontrollableValue,
        value              : controllableValue,
        onValueChange      : handleControllableValueChange,
    });
    const selectedTabLimited = (value !== null);
    
    const prevLimitedValue = useRef<number|null>(value ?? 0);
    if ((value !== null) && (prevLimitedValue.current !== value)) {
        prevLimitedValue.current = value;
    } // if
    
    
    
    // refs:
    const numberEditorRefInternal = useRef<HTMLInputElement|null>(null);
    const numberInputRef = useMergeRefs(
        elmRef,
        numberEditorRefInternal,
    );
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<TabExpandedChangeEvent>>(({tabIndex}) => {
        triggerValueChange(
            (tabIndex === 0)
            ? null
            : (!!numberEditorRefInternal.current?.value ? numberEditorRefInternal.current?.valueAsNumber : null)
        , { triggerAt: 'immediately', event: undefined as any /* TODO: fix this */ });
    });
    const handleInputChange    = useEvent<EditorChangeEventHandler<React.ChangeEvent<HTMLInputElement>, number|null>>((newValue, event) => {
        triggerValueChange(
            newValue
        , { triggerAt: 'immediately', event: event });
    });
    
    
    
    // effects:
    // auto focus on <NumberUpDownEditor> when the tab is active:
    useEffect(() => {
        // conditions:
        if (!selectedTabLimited) return;
        
        
        
        // actions:
        numberEditorRefInternal.current?.focus({ preventScroll: true });
    }, [selectedTabLimited]);
    
    
    
    // accessibilities:
    const propReadOnly = usePropReadOnly(props);
    
    
    
    // jsx:
    return (
        <Tab<TElement>
            // other props:
            {...restTabProps}
            
            
            
            // variants:
            theme={theme}
            
            
            
            // accessibilities:
            aria-label={props['aria-label'] ?? 'Stock'}
            
            
            
            // states:
            expandedTabIndex={selectedTabLimited ? 1 : 0}
            onExpandedChange={handleExpandedChange}
            
            
            
            // components:
            listComponent={
                React.cloneElement<ListProps<Element>>(listComponent,
                    // props:
                    {
                        // accessibilities:
                        enabled : listComponent.props.enabled ?? !propReadOnly,
                    },
                )
            }
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
                    theme={
                        (theme === 'secondary')
                        ? 'primary'
                        : (theme === 'primary')
                        ? 'secondary'
                        : theme
                    }
                    
                    
                    
                    // classes:
                    className={selectedTabLimited ? undefined : 'hidden'}
                >
                    <Label
                        // classes:
                        className='solid'
                    >
                        Current stock:
                    </Label>
                    <NumberUpDownEditor<TElement>
                        // refs:
                        elmRef={numberInputRef}
                        
                        
                        
                        // variants:
                        theme={
                            (theme === 'primary')
                            ? 'primaryAlt'
                            :   (theme === 'primaryAlt')
                                ? 'primary'
                                : undefined
                        }
                        
                        
                        
                        // classes:
                        className='fluid'
                        
                        
                        
                        // accessibilities:
                        {...{
                            autoFocus,
                            tabIndex,
                            enterKeyHint,
                        }}
                        
                        
                        
                        // validations:
                        {...{
                            enableValidation,
                            isValid           : props.isValid ?? (selectedTabLimited ? undefined : true),
                            inheritValidation,
                            onValidation,
                        }}
                        
                        required={required}
                        min  = {min }
                        max  = {max }
                        step = {step}
                        
                        
                        
                        // formats:
                        {...{
                            placeholder,
                            autoComplete,
                            list,
                        }}
                        
                        
                        
                        // forms:
                        {...{
                            name,
                            form,
                        }}
                        
                        
                        
                        // values:
                        value={prevLimitedValue.current}
                        onChange={handleInputChange}
                        
                        
                        
                        // states:
                        {...{
                            focused,
                            assertiveFocusable,
                            arrived,
                        }}
                        
                        
                        
                        // components:
                        {...{
                            decreaseButtonComponent,
                            increaseButtonComponent,
                            numberEditorComponent,
                        }}
                        
                        
                        
                        // children:
                        {...{
                            childrenBeforeButton,
                            childrenBeforeInput,
                            childrenAfterInput,
                            childrenAfterButton,
                        }}
                    />
                </Group>
            </TabPanel>
        </Tab>
    );
};
export {
    StockEditor,
    StockEditor as default,
}
