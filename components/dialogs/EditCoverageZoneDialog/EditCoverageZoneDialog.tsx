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
    useEvent,
}                           from '@reusable-ui/core'                // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Generic,
    
    
    
    // simple-components:
    Check,
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internal components:
import {
    TextEditor,
}                           from '@/components/editors/TextEditor'
import {
    type NameEditorProps,
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    ShippingRateEditor,
}                           from '@/components/editors/ShippingRateEditor'
import {
    // types:
    UpdateHandler,
    
    DeleteHandler,
    
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

// types:
import {
    type PartialModel,
}                           from '@/libs/types'

// models:
import {
    // types:
    type CoverageZoneWithId,
    type CoverageSubzone,
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
export interface EditCoverageZoneDialogProps<TCoverageZoneWithId extends CoverageZoneWithId<TCoverageSubzone>, TCoverageSubzone extends CoverageSubzone>
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<TCoverageZoneWithId>,
        
        // privileges & states:
        ShippingState,
        
        // components:
        SubzoneCoverageZoneEditorProps
{
    // data:
    modelName         : string
    
    
    
    // components:
    zoneNameEditor   ?: React.ReactElement<NameEditorProps>
}
const EditCoverageZoneDialog = <TCoverageZoneWithId extends CoverageZoneWithId<TCoverageSubzone>, TCoverageSubzone extends CoverageSubzone>(props: EditCoverageZoneDialogProps<TCoverageZoneWithId, TCoverageSubzone>): JSX.Element|null => {
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
        subzoneCoverageZoneEditor,
        zoneNameEditor = <NameEditor /> as React.ReactElement<NameEditorProps>,
        
        
        
        // other props:
        ...restComplexEditModelDialogProps
    } = props;
    const hasSubzones = !!subzoneCoverageZoneEditor;
    
    
    
    // states:
    const [isModified    , setIsModified   ] = useState<boolean>(false);
    
    const [name          , setName         ] = useState<string            >(model?.name     ?? '');
    
    const [estimate      , setEstimate     ] = useState<string            >(model?.estimate ?? '');
    const [shippingRates , setShippingRates] = useState<ShippingRate[]    >(() => {
        const shippingRates = model?.shippingRates;
        if (!shippingRates) return [];
        return (
            shippingRates
            .map((shippingRate) => ({
                ...shippingRate, // clone => immutable => mutable
            }))
        );
    });
    
    const [useZones      , setUseZones     ] = useState<boolean           >(hasSubzones && (model?.useZones ?? true /* default to true for no model (create new) */));
    const [zones         , setZones        ] = useState<TCoverageSubzone[]>(() => {
        if (!hasSubzones) return [];
        const zones = model?.zones;
        if (!zones) return [];
        return (
            zones
            .map((zone) => ({
                ...zone, // clone => immutable => mutable
            } as TCoverageSubzone))
        );
    });
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // handlers:
    const handleUpdate         = useEvent<UpdateHandler<TCoverageZoneWithId>>(({id, whenAdd, whenUpdate}) => {
        return {
            id            : id ?? (() => {
                const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
                return ` ${nanoid()}`; // starts with space{random-temporary-id}
            })(),
            
            name          :                 (whenUpdate.description || whenAdd)  ? name               : undefined,
            
            estimate      :                 (whenUpdate.description || whenAdd)  ? (estimate || null) : undefined,
            shippingRates :                 (whenUpdate.price       || whenAdd)  ? shippingRates      : undefined,
            
            useZones      : (hasSubzones && (whenUpdate.price       || whenAdd)) ? useZones           : undefined,
            zones         : (hasSubzones && (whenUpdate.price       || whenAdd)) ? zones              : undefined,
        } as PartialModel<TCoverageZoneWithId>;
    });
    
    const handleConfirmDelete  = useEvent<ConfirmDeleteHandler<TCoverageZoneWithId>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete <strong>{model.name}</strong>?
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved = useEvent<ConfirmUnsavedHandler<TCoverageZoneWithId>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<TCoverageZoneWithId>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName={startsCapitalized(modelName)}
            modelEntryName={model?.name}
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
                    {React.cloneElement<NameEditorProps>(zoneNameEditor,
                        // props:
                        {
                            // refs:
                            elmRef    : (defaultExpandedTabIndex === 0) ? firstEditorRef : undefined,
                            
                            
                            
                            // variants:
                            theme     : 'primary',
                            
                            
                            
                            // classes:
                            className : 'name editor',
                            
                            
                            
                            // accessibilities:
                            enabled   : whenUpdate.description || whenAdd,
                            
                            
                            
                            // validations:
                            required  : true,
                            
                            
                            
                            // values:
                            value     : name,
                            onChange  : (value) => {
                                setName(value);
                                setIsModified(true);
                            }
                        },
                    )}
                </form>
            </TabPanel>
            <TabPanel label={PAGE_SHIPPING_TAB_DEFAULT_RATES} panelComponent={<Generic className={styleSheet.defaultRatesTab} />}>
                <form>
                    <span className='estimate label'>Estimated Delivery Time:</span>
                    <TextEditor
                        // classes:
                        className='estimate editor'
                        
                        
                        
                        // accessibilities:
                        aria-label='Estimated Delivery Time'
                        enabled={whenUpdate.description || whenAdd}
                        
                        
                        
                        // validations:
                        required={false}
                        
                        
                        
                        // values:
                        value={estimate}
                        onChange={(value) => {
                            setEstimate(value);
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='rate label'>Rate:</span>
                    <ShippingRateEditor
                        // classes:
                        className='rate editor'
                        
                        
                        
                        // accessibilities:
                        readOnly={!(whenUpdate.price || whenAdd)}
                        
                        
                        
                        // values:
                        value={shippingRates}
                        onChange={(value) => {
                            setShippingRates(value);
                            setIsModified(true);
                        }}
                    />
                </form>
            </TabPanel>
            {!!subzoneCoverageZoneEditor && <TabPanel label={PAGE_SHIPPING_TAB_SPECIFIC_RATES} panelComponent={<Generic className={styleSheet.specificRatesTab} />}>
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
                    Use specific {startsDecapitalized(subzoneCoverageZoneEditor.subzoneNamePlural)}:
                </Check>
                <ShippingStateProvider
                        // privileges:
                        privilegeAdd    = {privilegeAdd   }
                        privilegeUpdate = {privilegeUpdate}
                        privilegeDelete = {privilegeDelete}
                >
                    {React.cloneElement<CoverageZoneEditorProps<CoverageZoneWithId<CoverageSubzone>, CoverageSubzone>>(subzoneCoverageZoneEditor.subzoneEditorComponent,
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
                            value         : zones as TCoverageSubzone[] as unknown as CoverageZoneWithId<CoverageSubzone>[],
                            onChange      : ((value) => {
                                setZones(value as CoverageZoneWithId<CoverageSubzone>[] as unknown as TCoverageSubzone[]);
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
