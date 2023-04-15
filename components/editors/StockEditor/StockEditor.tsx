// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
    useEffect,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useMergeRefs,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    Generic,
    Content,
    Label,
    List,
    ListItem,
    Group,
}                           from '@reusable-ui/components'      // a set of official Reusable-UI components

// internals:
import {
    // react components:
    QuantityEditorProps,
    QuantityEditor,
}                           from '@/components/editors/QuantityEditor'

// app configs:
import {
    PAGE_PRODUCTS_STOCK_UNLIMITED,
    PAGE_PRODUCTS_STOCK_LIMITED,
}                           from '@/website.config'



// styles:
export const useTabBodyStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'zgn1x8dxdi', specificityWeight: 2 }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names



export interface StockEditorProps<TElement extends Element = HTMLElement>
    extends
        // bases:
        QuantityEditorProps<TElement>
{
}
const StockEditor = <TElement extends Element = HTMLElement>(props: StockEditorProps<TElement>): JSX.Element|null => {
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
        size     = 'md',
        theme    = 'secondary',
        gradient,
        outlined,
        mild     = true,
        
        
        
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
        value,
        onChange,
    ...restNumberEditorProps} = props;
    
    
    
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
    
    
    
    // dom effects:
    useEffect(() => {
        // conditions:
        if (!selectedTabLimited) return;
        
        
        
        // actions:
        numberEditorRefInternal.current?.focus({ preventScroll: true });
    }, [selectedTabLimited]);
    
    
    
    // jsx:
    return (
        <Generic<TElement>
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
                {['unlimited', 'limited'].map((option) =>
                    <ListItem key={option}
                        // accessibilities:
                        active={selectedTabLimited === (option === 'limited')}
                        
                        
                        
                        // handlers:
                        onClick={() => {
                            const isSelectedTabLimited = (option === 'limited');
                            setSelectedTabLimited(isSelectedTabLimited);
                            
                            onChange?.(
                                isSelectedTabLimited
                                ? (numberEditorRefInternal.current?.value ? numberEditorRefInternal.current?.valueAsNumber : null)
                                : null
                            );
                        }}
                    >
                        {{
                            unlimited : PAGE_PRODUCTS_STOCK_UNLIMITED,
                            limited   : PAGE_PRODUCTS_STOCK_LIMITED,
                        }[option]}
                    </ListItem>
                )}
            </List>
            <Content
                // variants:
                size={size}
                theme={
                    (theme === 'secondary')
                    ? 'secondary'
                    : (theme === 'primary')
                    ? 'primary'
                    : theme
                }
                gradient='inherit'
                outlined='inherit'
                mild={!mild}
                
                
                
                // classes:
                className={styles.main}
            >
                <p className={!selectedTabLimited ? undefined : 'hidden'}>
                    The product stock is <em>always available</em>.
                </p>
                <Group
                    // variants:
                    size={size}
                    theme={
                        (theme === 'secondary')
                        ? 'primary'
                        : (theme === 'primary')
                        ? 'secondary'
                        : theme
                    }
                    gradient='inherit'
                    outlined='inherit'
                    mild={mild}
                    
                    
                    
                    // classes:
                    className={selectedTabLimited ? undefined : 'hidden'}
                >
                    <Label className='solid'>
                        Current stock:
                    </Label>
                    <QuantityEditor<TElement>
                        // other props:
                        {...restNumberEditorProps}
                        
                        
                        
                        // refs:
                        elmRef={numberInputRef}
                        
                        
                        
                        // classes:
                        className='fluid'
                        
                        
                        
                        // values:
                        defaultValue={value ?? defaultValue} // force as UNCONTROLLED, so the last value when switching tab back & forth is NOT LOST
                        onChange={onChange}
                        
                        
                        
                        // validations:
                        isValid={props.isValid ?? (selectedTabLimited ? undefined : true)}
                        required={props.required ?? true}
                        min={props.min ?? 0   }
                        max={props.max ?? 9999}
                    />
                </Group>
            </Content>
        </Generic>
    );
};
export {
    StockEditor,
    StockEditor as default,
}
