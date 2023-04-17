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
    useMergeRefs,
    
    
    
    // basic variants of UI:
    useBasicVariantProps,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Label,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import type {
    // types:
    EditorChangeEventHandler,
}                           from '@/components/editors/Editor'
import {
    // react components:
    QuantityEditorProps,
    QuantityEditor,
}                           from '@/components/editors/QuantityEditor'
import {
    // react components:
    TabOptionProps,
    TabOption,
}                           from '@/components/editors/TabOption'

// app configs:
import {
    PAGE_PRODUCTS_STOCK_UNLIMITED,
    PAGE_PRODUCTS_STOCK_LIMITED,
}                           from '@/website.config'



export interface StockEditorProps<TElement extends Element = HTMLElement>
    extends
        Omit<TabOptionProps<TElement, number|null>,
            // refs:
            |'elmRef'
            
            // values:
            |'options' // already defined
            
            // formats:
            |'autoCapitalize'
        >,
        QuantityEditorProps<TElement>
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
        
        
        
        // forms:
        name,
        form,
        
        
        
        // values:
        defaultValue,
        value,
        onChange,
    ...restTabOptionProps} = props;
    type T1 = typeof restTabOptionProps
    type T2 = Omit<T1, keyof TabOptionProps>
    
    
    
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
    const handleTabChange = useEvent<EditorChangeEventHandler<boolean>>((selectedTabLimited) => {
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
        <TabOption<TElement, boolean>
            // other props:
            {...restTabOptionProps}
            
            
            
            // variants:
            theme={theme}
            
            
            
            // values:
            options={[
                { value: false, label: PAGE_PRODUCTS_STOCK_UNLIMITED, description: <p>
                    The product stock is <em>always available</em>.
                </p> },
                
                { value: true , label: PAGE_PRODUCTS_STOCK_LIMITED  , description: <Group
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
                        
                        
                        
                        // accessibilities:
                        {...{
                            autoFocus,
                            tabIndex,
                            enterKeyHint,
                        }}
                        
                        
                        
                        // forms:
                        {...{
                            name,
                            form,
                        }}
                        
                        
                        
                        // classes:
                        className='fluid'
                        
                        
                        
                        // values:
                        defaultValue={value ?? defaultValue ?? 0} // force as UNCONTROLLED, so the last value when switching tab back & forth is NOT LOST
                        onChange={onChange}
                        
                        
                        
                        // validations:
                        isValid={props.isValid ?? (selectedTabLimited ? undefined : true)}
                        required={props.required ?? true}
                        min={props.min ?? 0   }
                        max={props.max ?? 9999}
                    />
                </Group> },
            ]}
            value={selectedTabLimited}
            onChange={handleTabChange}
        />
    );
};
export {
    StockEditor,
    StockEditor as default,
}
