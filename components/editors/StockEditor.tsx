// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
}                           from 'react'

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
    EventHandler,
    useMergeRefs,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Label,
    InputProps,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // react components:
    QuantityEditorProps,
    QuantityEditor,
}                           from '@/components/editors/QuantityEditor'
import {
    // react components:
    TabExpandedChangeEvent,
    TabProps,
    Tab,
    TabPanel,
}                           from '@/components/Tab'

// app configs:
import {
    PAGE_PRODUCTS_STOCK_UNLIMITED,
    PAGE_PRODUCTS_STOCK_LIMITED,
}                           from '@/website.config'



// react components:
export interface StockEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<QuantityEditorProps<TElement>,
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
            |'elmRef'                  // taken by <QuantityEditor>
            
            // states:
            |'tabPanels'               // already taken over
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
        customValidator,
        
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
        defaultValue,
        value,
        onChange,
        onChangeAsText,
        
        
        
        // states:
        focused,
        assertiveFocusable,
        arrived,
        
        
        
        // components:
        decreaseButtonComponent,
        increaseButtonComponent,
        inputComponent,
        
        
        
        // children:
        childrenBeforeButton,
        childrenBeforeInput,
        childrenAfterInput,
        childrenAfterButton,
    ...restTabProps} = props;
    type T1 = typeof restTabProps
    type T2 = Omit<T1, keyof TabProps>
    
    
    
    // basic variant props:
    const basicVariantProps = useBasicVariantProps(props);
    
    
    // states:
    const [selectedTabLimited, setSelectedTabLimited] = useState<boolean>(
        (value !== undefined)
        ? (typeof(value)        === 'number') /*controllable*/
        : (typeof(defaultValue) === 'number') /*uncontrollable*/
    );
    
    
    // refs:
    const numberEditorRefInternal = useRef<HTMLInputElement|null>(null);
    const numberInputRef = useMergeRefs(
        elmRef,
        numberEditorRefInternal,
    );
    
    
    
    // handlers:
    const handleExpandedChange = useEvent<EventHandler<TabExpandedChangeEvent>>(({tabIndex}) => {
        const selectedTabLimited = (tabIndex === 1);
        setSelectedTabLimited(selectedTabLimited);
        onChange?.(
            selectedTabLimited
            ? (numberEditorRefInternal.current?.value ? numberEditorRefInternal.current?.valueAsNumber : null)
            : null
        );
    });
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        if (!selectedTabLimited) return;
        
        
        
        // actions:
        numberEditorRefInternal.current?.focus({ preventScroll: true });
    }, [selectedTabLimited]);
    
    
    
    // jsx:
    return (
        <Tab<TElement>
            // other props:
            {...restTabProps}
            
            
            
            // variants:
            theme={theme}
            
            
            
            // states:
            expandedTabIndex={selectedTabLimited ? 1 : 0}
            onExpandedChange={handleExpandedChange}
        >
            <TabPanel label={PAGE_PRODUCTS_STOCK_UNLIMITED}>
                <p>
                    The product stock is <em>always available</em>.
                </p>
            </TabPanel>
            <TabPanel label={PAGE_PRODUCTS_STOCK_LIMITED}>
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
                    <Label className='solid'>
                        Current stock:
                    </Label>
                    <QuantityEditor<TElement>
                        // refs:
                        elmRef={numberInputRef}
                        
                        
                        
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
                            customValidator,
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
                        defaultValue={value ?? defaultValue ?? 0} // force as UNCONTROLLED, so the last value when switching tab back & forth is NOT LOST
                        onChange={onChange}
                        onChangeAsText={onChangeAsText}
                        
                        
                        
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
                            inputComponent,
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
