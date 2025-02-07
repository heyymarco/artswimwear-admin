'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
    useState,
    useMemo,
    useEffect,
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
    Label,
    Check,
    
    
    
    // menu-components:
    Collapse,
    
    
    
    // composite-components:
    Group,
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    // utilities:
    getCountryNameByCode,
    
    
    
    // react components:
    SelectCountryEditor,
}                           from '@heymarco/select-country-editor'
import {
    SelectStateEditor,
}                           from '@heymarco/select-state-editor'
import {
    SelectCityEditor,
}                           from '@heymarco/select-city-editor'
import {
    NameEditor,
}                           from '@heymarco/name-editor'
import {
    NumberEditor,
}                           from '@heymarco/number-editor'

// internal components:
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    ShippingWeightEditor,
}                           from '@/components/editors/ShippingWeightEditor'
import {
    ShippingRateEditor,
}                           from '@/components/editors/ShippingRateEditor'
import {
    CoverageZoneEditor,
}                           from '@/components/editors/CoverageZoneEditor'
import {
    // react components:
    ShippingStateProvider,
}                           from '@/components/editors/CoverageZoneEditor/states/shippingState'
import {
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// models:
import type {
    ShippingVisibility,
}                           from '@prisma/client'
import {
    // types:
    type ModelConfirmUnsavedEventHandler,
    type ModelConfirmDeleteEventHandler,
    type ModelUpsertingEventHandler,
    type ModelDeletingEventHandler,
    
    type ShippingDetail,
    type ShippingRate,
    type CoverageCountryDetail,
    type CoverageStateDetail,
    type CoverageCityDetail,
    type ShippingEta,
}                           from '@/models'

// stores:
import {
    // hooks:
    useUpdateShipping,
    useDeleteShipping,
    
    useGetStateList,
    useGetCityList,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_SHIPPING_TAB_INFORMATIONS,
    PAGE_SHIPPING_TAB_DEFAULT_RATES,
    PAGE_SHIPPING_TAB_SPECIFIC_RATES,
    PAGE_SHIPPING_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditShippingDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditShippingDialogStyles')
, { id: 'kpxedelumf' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditShippingDialogStyles';



// utilities:
const emptyStringPromise = Promise.resolve<string[]>([]);
const systemShippings : string[] = [
    'jne reguler',
    'jne yes',
    'jne oke',
    
    'pos reguler',
    'pos nextday',
    
    'tiki reguler',
    'tiki ons',
    'tiki economy',
];



// react components:
export interface EditShippingDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<ShippingDetail>
{
}
const EditShippingDialog = (props: EditShippingDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditShippingDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModified, setIsModified] = useState<boolean>(false);
    
    const [visibility, setVisibility] = useState<ShippingVisibility       >(model?.visibility ?? 'DRAFT');
    const [name      , setName      ] = useState<string                   >(model?.name       ?? ''     );
    
    const [autoUpdate, setAutoUpdate] = useState<boolean                  >(model?.autoUpdate ?? false  );
    
    const [weightStep, setWeightStep] = useState<number                   >(model?.weightStep ?? 1      );
    const [eta       , setEta       ] = useState<ShippingEta|null         >(model?.eta        ?? null   );
    const [rates     , setRates     ] = useState<ShippingRate[]           >(() => {
        const rates = model?.rates;
        if (!rates) return [];
        return (
            rates
            .map((rate) => ({
                ...rate, // clone => immutable => mutable
            }))
        );
    });
    
    const [useZones      , setUseZones     ] = useState<boolean                 >(model?.useZones   ?? true   );
    const [countries     , setCountries    ] = useState<CoverageCountryDetail[] >((): CoverageCountryDetail[] => {
        const countries = model?.zones;
        if (!countries) return [];
        
        
        
        return (
            countries
            .map((coverageCountry: CoverageCountryDetail) => ({
                ...coverageCountry,       // clone => immutable => mutable
                zones : coverageCountry.zones.map((coverageState: CoverageStateDetail) => ({
                    ...coverageState,     // clone => immutable => mutable
                    zones : coverageState.zones.map((coverageCity: CoverageCityDetail) => ({
                        ...coverageCity,  // clone => immutable => mutable
                    } satisfies CoverageCityDetail)),
                } satisfies CoverageStateDetail)),
            } satisfies CoverageCountryDetail))
        );
    });
    
    const isSystemShipping = systemShippings.includes(name.trim().toLowerCase());
    
    
    
    // RTK Query hooks:
    const [getStateList, { data: stateListData  , isFetching: stateListFetching  , isError: stateListError   }] = useGetStateList();
    const [getCityList , { data: cityListData   , isFetching: cityListFetching   , isError: cityListError    }] = useGetCityList();
    
    
    
    // states:
    const [country, setCountry] = useState<string>('');
    const [state  , setState  ] = useState<string>('');
    
    const stateListPromiseRef    = useRef<Promise<string[]>>(emptyStringPromise);
    const stateListResolverRef   = useRef<((value: string[]) => void)|undefined>(undefined);
    const cityListPromiseRef     = useRef<Promise<string[]>>(emptyStringPromise);
    const cityListResolverRef    = useRef<((value: string[]) => void)|undefined>(undefined);
    
    // Set stateListPromise when country changes:
    useEffect(() => {
        // Initialize a new unresolved promise:
        const { promise, resolve } = Promise.withResolvers<string[]>();
        stateListPromiseRef.current  = promise;
        stateListResolverRef.current = resolve;
        
        
        
        if (!country) {
            resolve([]); // no selected country => the states cannot be determined => empty result
        }
        else {
            // fire a request and we will take care of the result later:
            getStateList({ countryCode: country });
        } // if
    }, [country, getStateList]);
    
    // Set cityListPromise when country or state changes:
    useEffect(() => {
        // Initialize a new unresolved promise:
        const { promise, resolve } = Promise.withResolvers<string[]>();
        cityListPromiseRef.current  = promise;
        cityListResolverRef.current = resolve;
        
        
        
        if (!country || !state) {
            resolve([]); // no selected country or state => the cities cannot be determined => empty result
        }
        else {
            // fire a request and we will take care of the result later:
            getCityList({ countryCode: country, state: state });
        } // if
    }, [country, state, getCityList]);
    
    // Listen for stateListData and stateListError:
    useEffect(() => {
        const resolve = stateListResolverRef.current;
        if (!resolve) return;
        if (stateListError) {
            resolve([]); // the states cannot be resolved => empty result
        }
        else if (stateListFetching) {
            // do nothing, just wait until the data is ready
        }
        else if (stateListData) {
            resolve(stateListData);
        } // if
    }, [stateListData, stateListError, stateListFetching]);
    
    // Listen for cityListData and cityListError:
    useEffect(() => {
        const resolve = cityListResolverRef.current;
        if (!resolve) return;
        if (cityListError) {
            resolve([]); // the cities cannot be resolved => empty result
        }
        else if (cityListFetching) {
            // do nothing, just wait until the data is ready
        }
        else if (cityListData) {
            resolve(cityListData);
        } // if
    }, [cityListData, cityListError, cityListFetching]);
    
    
    
    // sessions:
    const { data: session } = useSession();
    const role = session?.role;
    
    
    
    // privileges:
    const privilegeAdd    = !!role?.shipping_c;
    const privilegeUpdate = useMemo(() => ({
        description : !!role?.shipping_ud,
        price       : !!role?.shipping_up,
        visibility  : !!role?.shipping_uv,
    }), [role]);
    const privilegeDelete = !!role?.shipping_d;
    // const privilegeWrite  = (
    //     /* privilegeAdd */ // except for add
    //     privilegeUpdate.description
    //     || privilegeUpdate.price
    //     || privilegeUpdate.visibility
    //     || privilegeDelete
    // );
    
    
    
    // stores:
    const [updateShipping    , {isLoading : isLoadingUpdate           }] = useUpdateShipping();
    const [deleteShipping    , {isLoading : isLoadingDelete           }] = useDeleteShipping();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // handlers:
    const handleModelConfirmUnsaved = useEvent<ModelConfirmUnsavedEventHandler<ShippingDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    const handleModelConfirmDelete  = useEvent<ModelConfirmDeleteEventHandler<ShippingDetail>>(({ draft }) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete shipping <strong>{draft.name}</strong>?
                </p>
                <p>
                    The associated shipping in existing orders will be marked as <strong>DELETED SHIPPING</strong>.
                </p>
            </>,
        };
    });
    
    const handleModelUpserting      = useEvent<ModelUpsertingEventHandler<ShippingDetail>>(async ({ id, options: { addPermission, updatePermissions } }) => {
        return await updateShipping({
            id         : id ?? '',
            
            visibility : (updatePermissions.visibility  || addPermission) ? visibility    : undefined,
            name       : (updatePermissions.description || addPermission) ? name          : undefined,
            
            autoUpdate : (updatePermissions.price       || addPermission) ? autoUpdate    : undefined,
            
            weightStep : (updatePermissions.price       || addPermission) ? weightStep    : undefined,
            eta        : (updatePermissions.description || addPermission) ? (eta || null) : undefined,
            rates      : (updatePermissions.price       || addPermission) ? rates         : undefined,
            
            useZones   : (updatePermissions.price       || addPermission) ? useZones      : undefined,
            zones      : (updatePermissions.price       || addPermission) ? countries     : undefined,
        }).unwrap();
    });
    const handleModelDeleting       = useEvent<ModelDeletingEventHandler<ShippingDetail>>(async ({ draft: { id } }) => {
        await deleteShipping({
            id : id,
        }).unwrap();
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<ShippingDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Shipping'
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {privilegeAdd   }
            privilegeUpdate = {privilegeUpdate}
            privilegeDelete = {privilegeDelete}
            
            
            
            // stores:
            isModified  = {isModified}
            
            isCommiting = {isLoadingUpdate}
            isDeleting  = {isLoadingDelete}
            
            
            
            // tabs:
            tabDelete={PAGE_SHIPPING_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onModelConfirmUnsaved={handleModelConfirmUnsaved}
            onModelConfirmDelete={handleModelConfirmDelete}
            
            onModelUpserting={handleModelUpserting}
            onModelDeleting={handleModelDeleting}
            
            // onModelDelete={undefined}
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
                        value={name}
                        onChange={(value) => {
                            setName(value);
                            setIsModified(true);
                        }}
                        
                        
                        
                        // validations:
                        required={true}
                    />
                    
                    <span className='visibility label'>Visibility:</span>
                    <VisibilityEditor
                        // variants:
                        theme='primaryAlt'
                        
                        
                        
                        // classes:
                        className='visibility editor'
                        
                        
                        
                        // accessibilities:
                        modelName='shipping'
                        enabled={whenUpdate.visibility || whenAdd}
                        
                        
                        
                        // values:
                        optionHidden={false}
                        value={visibility}
                        onChange={(value) => {
                            setVisibility(value);
                            setIsModified(true);
                        }}
                    />
                    
                    <Collapse
                        // variants:
                        className='autoUpdate section'
                        
                        
                        
                        // states:
                        expanded={isSystemShipping}
                    >
                        <Check
                            // classes:
                            className='autoUpdate label'
                            
                            
                            
                            // variants:
                            theme='primary'
                            
                            
                            
                            // accessibilities:
                            enabled={whenUpdate.price || whenAdd}
                            
                            
                            
                            // states:
                            active={autoUpdate}
                            onActiveChange={({active}) => {
                                setAutoUpdate(active);
                                setIsModified(true);
                            }}
                        >
                            Enable auto update
                        </Check>
                    </Collapse>
                </form>
            </TabPanel>
            <TabPanel label={PAGE_SHIPPING_TAB_DEFAULT_RATES} panelComponent={<Generic className={styleSheet.defaultRatesTab} />}>
                <form>
                    <span className='weightStep label'>Weight Step:</span>
                    <ShippingWeightEditor
                        // classes:
                        className='weightStep editor'
                        
                        
                        
                        // accessibilities:
                        aria-label='Weight Step'
                        min={0.01}
                        max={20}
                        enabled={whenUpdate.price || whenAdd}
                        
                        
                        
                        // validations:
                        required={true}
                        
                        
                        
                        // values:
                        value={weightStep}
                        onChange={(value) => {
                            setWeightStep(value || 1); // zero -or- null is not allowed => defaults to 1
                            setIsModified(true);
                        }}
                    />
                    
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
            <TabPanel label={PAGE_SHIPPING_TAB_SPECIFIC_RATES} panelComponent={<Generic className={styleSheet.specificRatesTab} />}>
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
                    Use specific countries:
                </Check>
                <ShippingStateProvider
                        // privileges:
                        privilegeAdd    = {privilegeAdd   }
                        privilegeUpdate = {privilegeUpdate}
                        privilegeDelete = {privilegeDelete}
                >
                    <CoverageZoneEditor<CoverageCountryDetail, CoverageStateDetail>
                        // data:
                        modelName='Country'
                        modelNamePlural='Countries'
                        parentModelId={model?.id ?? ' newId' /* a dummy id starting with empty space */}
                        
                        
                        
                        // classes:
                        className='zone editor'
                        
                        
                        
                        // accessibilities:
                        enabled={useZones}
                        readOnly={!(whenUpdate.price || whenAdd)}
                        
                        
                        
                        // values:
                        value={countries}
                        onChange={(value) => {
                            setCountries(value);
                            setIsModified(true);
                        }}
                        
                        
                        
                        // components:
                        zoneNameEditor={
                            <SelectCountryEditor
                                // values:
                                onChange={setCountry}
                            />
                        }
                        zoneNameOverride={getCountryNameByCode}
                        subzoneEditor={
                            <CoverageZoneEditor<CoverageStateDetail, CoverageCityDetail>
                                // data:
                                modelName='State'
                                modelNamePlural='States'
                                
                                
                                
                                // components:
                                zoneNameEditor={
                                    <SelectStateEditor
                                        // data:
                                        valueOptions={stateListPromiseRef}
                                        onChange={setState}
                                    />
                                }
                                subzoneEditor={
                                    <CoverageZoneEditor<CoverageCityDetail & { useZones: never, zones: never }, never>
                                        // data:
                                        modelName='City'
                                        modelNamePlural='Cities'
                                        
                                        
                                        
                                        // components:
                                        zoneNameEditor={
                                            <SelectCityEditor
                                                // data:
                                                valueOptions={cityListPromiseRef}
                                            />
                                        }
                                        subzoneEditor={undefined} // no more nested subZones
                                    />
                                }
                            />
                        }
                    />
                </ShippingStateProvider>
            </TabPanel>
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditShippingDialog,
    EditShippingDialog as default,
}
