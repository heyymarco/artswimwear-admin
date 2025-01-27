'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
}                           from 'react'

// cssfn:
import {
    startsCapitalized,
    startsDecapitalized,
}                           from '@cssfn/core'                      // writes css in javascript
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // simple-components:
    Label,
    Check,
    
    
    
    // composite-components:
    Group,
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    type EditorChangeEventHandler,
}                           from '@heymarco/editor'
import {
    type NameEditorProps,
    NameEditor,
}                           from '@heymarco/name-editor'
import {
    NumberEditor,
}                           from '@heymarco/number-editor'
import {
    type TextDropdownEditorProps,
}                           from '@heymarco/text-dropdown-editor'

// internal components:
import {
    ShippingRateEditor,
}                           from '@/components/editors/ShippingRateEditor'
import {
    // types:
    UpdateHandler,
    
    ConfirmDeleteHandler,
    ConfirmUnsavedHandler,
    
    
    
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'
import {
    type SubzoneCoverageZoneEditorProps,
    type CoverageZoneEditorProps,
}                           from '@/components/editors/CoverageZoneEditor'
import {
    // types:
    type ShippingState,
    
    
    
    // react components:
    ShippingStateProvider,
}                           from '@/components/editors/CoverageZoneEditor/states/shippingState'

// models:
import {
    // types:
    type PartialModel,
    type CoverageZoneDetail,
    type CoverageSubzoneDetail,
    type ShippingEta,
    type ShippingRate,
}                           from '@/models'

// others:
import {
    customAlphabet,
}                           from 'nanoid'

// configs:
import {
    PAGE_SHIPPING_TAB_INFORMATIONS,
    PAGE_SHIPPING_TAB_DEFAULT_RATES,
    PAGE_SHIPPING_TAB_SPECIFIC_RATES,
    PAGE_SHIPPING_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditCoverageZoneDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditCoverageZoneDialogStyles')
, { id: 'rcv9mxdjhi' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditCoverageZoneDialogStyles';



// react components:
export interface EditCoverageZoneDialogProps<TCoverageZoneDetail extends CoverageZoneDetail<TCoverageSubzoneDetail>, TCoverageSubzoneDetail extends CoverageSubzoneDetail>
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<TCoverageZoneDetail>,
        
        // privileges & states:
        ShippingState,
        
        // components:
        SubzoneCoverageZoneEditorProps
{
    // data:
    modelName         : string
    
    
    
    // components:
    zoneNameEditor   ?: React.ReactElement<TextDropdownEditorProps>
    zoneNameOverride ?: (zoneName: string|null|undefined) => string|null|undefined
}
const EditCoverageZoneDialog = <TCoverageZoneDetail extends CoverageZoneDetail<TCoverageSubzoneDetail>, TCoverageSubzoneDetail extends CoverageSubzoneDetail>(props: EditCoverageZoneDialogProps<TCoverageZoneDetail, TCoverageSubzoneDetail>): JSX.Element|null => {
    // styles:
    const styleSheet = useEditCoverageZoneDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        modelName,
        
        
        
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
        
        
        
        // components:
        zoneNameEditor,
        zoneNameOverride,
        subzoneEditor,
        
        
        
        // other props:
        ...restComplexEditModelDialogProps
    } = props;
    const hasSubzones = !!subzoneEditor;
    
    
    
    // states:
    const [isModified, setIsModified] = useState<boolean>(false);
    
    const [name      , setName      ] = useState<string                  >(model?.name       ?? ''     );
    
    const [eta       , setEta       ] = useState<ShippingEta|null        >(model?.eta        ?? null   );
    const [rates     , setRates     ] = useState<ShippingRate[]          >(() => {
        const rates = model?.rates;
        if (!rates) return [];
        return (
            rates
            .map((rate) => ({
                ...rate, // clone => immutable => mutable
            }))
        );
    });
    
    const [useZones  , setUseZones  ] = useState<boolean                 >(hasSubzones && (model?.useZones ?? true /* default to true for no model (create new) */));
    const [zones     , setZones     ] = useState<TCoverageSubzoneDetail[]>(() => {
        if (!hasSubzones) return [];
        const zones = model?.zones;
        if (!zones) return [];
        return (
            zones
            .map((zone) => ({
                ...zone, // clone => immutable => mutable
            } as TCoverageSubzoneDetail))
        );
    });
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateHandler<TCoverageZoneDetail>>(({id, whenAdd, whenUpdate}) => {
        return {
            id       : id ?? (() => {
                const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
                return ` ${nanoid()}`; // starts with space{random-temporary-id}
            })(),
            
            name     :                 (whenUpdate.description || whenAdd)  ? name          : undefined,
            
            eta      :                 (whenUpdate.description || whenAdd)  ? (eta || null) : undefined,
            rates    :                 (whenUpdate.price       || whenAdd)  ? rates         : undefined,
            
            useZones : (hasSubzones && (whenUpdate.price       || whenAdd)) ? useZones      : undefined,
            zones    : (hasSubzones && (whenUpdate.price       || whenAdd)) ? zones         : undefined,
        } as PartialModel<TCoverageZoneDetail>;
    });
    
    const handleConfirmDelete  = useEvent<ConfirmDeleteHandler<TCoverageZoneDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete <strong>{zoneNameOverride ? zoneNameOverride(model.name) : model.name}</strong>?
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved = useEvent<ConfirmUnsavedHandler<TCoverageZoneDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<TCoverageZoneDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName={startsCapitalized(modelName)}
            modelEntryName={zoneNameOverride ? zoneNameOverride(model?.name) : model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {privilegeAdd   }
            privilegeUpdate = {privilegeUpdate}
            privilegeDelete = {privilegeDelete}
            
            
            
            // stores:
            isModified  = {isModified}
            
            
            
            // tabs:
            tabDelete={PAGE_SHIPPING_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onUpdate={handleUpdate}
            
            onConfirmDelete={handleConfirmDelete}
            onConfirmUnsaved={handleConfirmUnsaved}
        >{({whenAdd, whenUpdate}) => <>
            <TabPanel label={PAGE_SHIPPING_TAB_INFORMATIONS} panelComponent={<Generic className={styleSheet.infoTab} />}>
                <form>
                    <span className='name label'>Name:</span>
                    <NameEditorWithHandler
                        // privileges:
                        whenAdd={whenAdd}
                        whenUpdate={whenUpdate}
                        
                        
                        
                        // refs:
                        firstEditorRef={firstEditorRef}
                        
                        
                        
                        // states:
                        name={name}
                        setName={setName}
                        setIsModified={setIsModified}
                        defaultExpandedTabIndex={defaultExpandedTabIndex}
                        
                        
                        
                        // components:
                        zoneNameEditor={zoneNameEditor}
                    />
                </form>
            </TabPanel>
            <TabPanel label={PAGE_SHIPPING_TAB_DEFAULT_RATES} panelComponent={<Generic className={styleSheet.defaultRatesTab} />}>
                <form>
                    <span className='eta label'>Estimated Delivery Time:</span>
                    <Group
                        // classes:
                        className='eta editor'
                    >
                        <Group className='fluid'>
                            <Label className='solid'>
                                Min
                            </Label>
                            <NumberEditor
                                // classes:
                                className='editor fluid'
                                
                                
                                
                                // accessibilities:
                                aria-label='Min'
                                enabled={whenUpdate.description || whenAdd}
                                
                                
                                
                                // validations:
                                required={false}
                                min={0}
                                max={999}
                                
                                
                                
                                // values:
                                value={eta?.min ?? null}
                                onChange={(newMin) => {
                                    setEta((current) => {
                                        if (newMin === null) return null;
                                        return {
                                            min : newMin,
                                            max : ((current === null) || (current.max < newMin)) ? newMin : current.max,
                                        };
                                    });
                                    setIsModified(true);
                                }}
                            />
                            <Label className='solid'>
                                Days
                            </Label>
                        </Group>
                        <Label className='solid'>
                            -
                        </Label>
                        <Group className='fluid'>
                            <NumberEditor
                                // classes:
                                className='editor fluid'
                                
                                
                                
                                // accessibilities:
                                aria-label='Max'
                                enabled={whenUpdate.description || whenAdd}
                                
                                
                                
                                // validations:
                                required={eta?.min !== undefined}
                                min={eta?.min ?? 0}
                                max={999}
                                
                                
                                
                                // values:
                                value={eta?.max ?? eta?.min ?? null}
                                onChange={(newMax) => {
                                    setEta((current) => {
                                        if (current === null) return null;
                                        return {
                                            min : current.min,
                                            max : ((newMax === null) || (current.min > newMax)) ? current.min : newMax,
                                        };
                                    });
                                    setIsModified(true);
                                }}
                            />
                            <Label className='solid'>
                                Days
                            </Label>
                            <Label className='solid'>
                                Max
                            </Label>
                        </Group>
                    </Group>
                    
                    <span className='rate label'>Rate:</span>
                    <ShippingRateEditor
                        // classes:
                        className='rate editor'
                        
                        
                        
                        // accessibilities:
                        readOnly={!(whenUpdate.price || whenAdd)}
                        
                        
                        
                        // values:
                        value={rates}
                        onChange={(value) => {
                            setRates(value);
                            setIsModified(true);
                        }}
                    />
                </form>
            </TabPanel>
            {!!subzoneEditor && <TabPanel label={PAGE_SHIPPING_TAB_SPECIFIC_RATES} panelComponent={<Generic className={styleSheet.specificRatesTab} />}>
                <Check
                    // classes:
                    className='useArea editor'
                    
                    
                    
                    // accessibilities:
                    enabled={whenUpdate.price || whenAdd}
                    
                    
                    
                    // values:
                    active={useZones}
                    onActiveChange={({active}) => {
                        setUseZones(active);
                        setIsModified(true);
                    }}
                >
                    Use specific {startsDecapitalized(subzoneEditor.props.modelNamePlural)}:
                </Check>
                <ShippingStateProvider
                        // privileges:
                        privilegeAdd    = {privilegeAdd   }
                        privilegeUpdate = {privilegeUpdate}
                        privilegeDelete = {privilegeDelete}
                >
                    {React.cloneElement<CoverageZoneEditorProps<CoverageZoneDetail<CoverageSubzoneDetail>, CoverageSubzoneDetail>>(subzoneEditor,
                        // props:
                        {
                            // data:
                            parentModelId : model?.id ?? ' newId' /* a dummy id starting with empty space */,
                            
                            
                            
                            // classes:
                            className     : 'zone editor',
                            
                            
                            
                            // accessibilities:
                            enabled       : useZones,
                            readOnly      : !(whenUpdate.price || whenAdd),
                            
                            
                            
                            // values:
                            value         : zones as TCoverageSubzoneDetail[] as unknown as CoverageZoneDetail<CoverageSubzoneDetail>[],
                            onChange      : ((value) => {
                                setZones(value as CoverageZoneDetail<CoverageSubzoneDetail>[] as unknown as TCoverageSubzoneDetail[]);
                                setIsModified(true);
                            }),
                        },
                    )}
                </ShippingStateProvider>
            </TabPanel>}
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditCoverageZoneDialog,
    EditCoverageZoneDialog as default,
}



// nested components:
interface NameEditorWithHandlerProps {
    // privileges:
    whenAdd                 : boolean
    whenUpdate              : Record<string, boolean>
    
    
    
    // refs:
    firstEditorRef          : React.MutableRefObject<HTMLInputElement|null>
    
    
    
    // states:
    name                    : string
    setName                 : (value: string) => void
    setIsModified           : (value: boolean) => void
    defaultExpandedTabIndex : number
    
    
    
    // components:
    zoneNameEditor          : React.ReactElement<TextDropdownEditorProps>|undefined
}
const NameEditorWithHandler = (props: NameEditorWithHandlerProps): JSX.Element|null => {
    // props:
    const {
        // privileges:
        whenAdd,
        whenUpdate,
        
        
        
        // refs:
        firstEditorRef,
        
        
        
        // states:
        name,
        setName,
        setIsModified,
        defaultExpandedTabIndex,
        
        
        
        // components:
        zoneNameEditor,
    } = props;
    
    
    
    // handlers:
    const handleChangeInternal = useEvent<EditorChangeEventHandler<string, React.ChangeEvent<HTMLInputElement>>>((value) => {
        setName(value);
        setIsModified(true);
    });
    const handleChange         = useMergeEvents(
        // preserves the original `onChange` from `zoneNameEditor`:
        zoneNameEditor?.props.onChange,
        
        
        
        // actions:
        handleChangeInternal,
    );
    
    
    
    // effects:
    // informs the __initial_value__ of the zone name to <Parent>:
    useIsomorphicLayoutEffect(() => {
        zoneNameEditor?.props.onChange?.(name, undefined as any /* TODO: fix this */);
    }, []);
    
    
    
    // default props:
    const {
        // refs:
        elmRef    = (defaultExpandedTabIndex === 0) ? firstEditorRef : undefined,
        
        
        
        // variants:
        theme     = 'primary',
        
        
        
        // classes:
        className = 'name editor',
        
        
        
        // accessibilities:
        enabled   = whenUpdate.description || whenAdd,
        
        
        
        // validations:
        required  = true,
        
        
        
        // values:
        value     = name,
    } = (zoneNameEditor?.props ?? {}) as (TextDropdownEditorProps & NameEditorProps);
    
    
    
    // jsx:
    return React.cloneElement<TextDropdownEditorProps|NameEditorProps>(zoneNameEditor ?? <NameEditor />,
        // props:
        {
            // refs:
            elmRef    : elmRef,
            
            
            
            // variants:
            theme     : theme,
            
            
            
            // classes:
            className : className,
            
            
            
            // accessibilities:
            enabled   : enabled,
            
            
            
            // validations:
            required  : required,
            
            
            
            // values:
            value     : value,
            onChange  : handleChange,
        },
    );
};
