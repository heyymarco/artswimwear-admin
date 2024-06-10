'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useMemo,
}                           from 'react'

// next-auth:
import {
    useSession,
}                           from 'next-auth/react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheets,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

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
    NameEditor,
}                           from '@/components/editors/NameEditor'
import {
    ShippingRateEditor,
}                           from '@/components/editors/ShippingRateEditor'
import {
    CoverageCountryEditor,
}                           from '@/components/editors/CoverageCountryEditor'
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

// models:
import {
    // types:
    type CoverageCountry,
    type ShippingRate,
    type CoverageZone,
}                           from '@/models'

// configs:
import {
    PAGE_SHIPPING_TAB_INFORMATIONS,
    PAGE_SHIPPING_TAB_DEFAULT_RATES,
    PAGE_SHIPPING_TAB_SPECIFIC_RATES,
    PAGE_SHIPPING_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditCoverageCountryDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditCoverageCountryDialogStyles')
, { id: 'rcv9mxdjhi' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditCoverageCountryDialogStyles';



// react components:
export interface EditCoverageCountryDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<CoverageCountry & { id: string }>
{
}
const EditCoverageCountryDialog = (props: EditCoverageCountryDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditCoverageCountryDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModified     , setIsModified     ] = useState<boolean>(false);
    
    const [country        , setCountry        ] = useState<string        >(model?.country         ?? ''     );
    
    const [estimate       , setEstimate       ] = useState<string        >(model?.estimate        ?? ''     );
    const [shippingRates  , setShippingRates  ] = useState<ShippingRate[]>(() => {
        const shippingRates = model?.shippingRates;
        if (!shippingRates) return [];
        return (
            shippingRates
            .map((shippingRate) => ({
                ...shippingRate, // clone => immutable => mutable
            }))
        );
    });
    
    const [useSpecificArea, setUseSpecificArea] = useState<boolean       >(model?.useSpecificArea ?? true);
    const [zones          , setZones          ] = useState<CoverageZone[]>(() => {
        const zones = model?.zones;
        if (!zones) return [];
        return (
            zones
            .map((zone) => ({
                ...zone, // clone => immutable => mutable
            }))
        );
    });
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // handlers:
    const handleUpdate               = useEvent<UpdateHandler<CoverageCountry & { id: string }>>(({id, whenAdd, whenUpdate}) => {
        return {
            id              : id ?? '',
            
            country         : (whenUpdate.description || whenAdd) ? country            : undefined,
            
            estimate        : (whenUpdate.description || whenAdd) ? (estimate || null) : undefined,
            shippingRates   : (whenUpdate.price       || whenAdd) ? shippingRates      : undefined,
            
            useSpecificArea : (whenUpdate.price       || whenAdd) ? useSpecificArea    : undefined,
            zones           : (whenUpdate.price       || whenAdd) ? zones              : undefined,
        } satisfies Partial<CoverageCountry & { id: string }>;
    });
    
    const handleConfirmDelete        = useEvent<ConfirmDeleteHandler<(CoverageCountry & { id: string })>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete <strong>{model.country}</strong>?
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved       = useEvent<ConfirmUnsavedHandler<(CoverageCountry & { id: string })>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // privileges:
    const privilegeAdd    = !!role?.shipping_c;
    const privilegeUpdate = useMemo(() => ({
        description : !!role?.shipping_ud,
        price       : !!role?.shipping_up,
        visibility  : !!role?.shipping_uv,
    }), [role]);
    const privilegeDelete = !!role?.shipping_d;
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<CoverageCountry & { id: string }>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Country'
            modelEntryName={model?.country}
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
                    <NameEditor
                        // refs:
                        elmRef={(defaultExpandedTabIndex === 0) ? firstEditorRef : undefined}
                        
                        
                        
                        // classes:
                        className='name editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.description || whenAdd}
                        
                        
                        
                        // values:
                        value={country}
                        onChange={(value) => {
                            setCountry(value);
                            setIsModified(true);
                        }}
                    />
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
            <TabPanel label={PAGE_SHIPPING_TAB_SPECIFIC_RATES} panelComponent={<Generic className={styleSheet.specificRatesTab} />}>
                <Check
                    // classes:
                    className='useArea editor'
                    
                    
                    
                    // accessibilities:
                    enabled={whenUpdate.price || whenAdd}
                    
                    
                    
                    // values:
                    active={useSpecificArea}
                    onActiveChange={({active}) => {
                        setUseSpecificArea(active);
                        setIsModified(true);
                    }}
                >
                    Use specific zones:
                </Check>
            </TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditCoverageCountryDialog,
    EditCoverageCountryDialog as default,
}
