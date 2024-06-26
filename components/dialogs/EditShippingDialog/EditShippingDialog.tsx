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
import type {
    ShippingVisibility,
}                           from '@prisma/client'
import {
    // types:
    type ShippingDetail,
    type ShippingRate,
    type CoverageCountry,
    type CoverageCountryWithId,
    type CoverageState,
    type CoverageStateWithId,
    type CoverageCity,
    type CoverageCityWithId,
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
const useEditShippingDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditShippingDialogStyles')
, { id: 'kpxedelumf' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditShippingDialogStyles';



// utilities:
const emptyStringPromise = Promise.resolve<string[]>([]);



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
    
    const [visibility, setVisibility] = useState<ShippingVisibility>(model?.visibility ?? 'DRAFT');
    const [name      , setName      ] = useState<string            >(model?.name       ?? ''     );
    
    const [weightStep, setWeightStep] = useState<number            >(model?.weightStep ?? 1      );
    const [eta       , setEta       ] = useState<ShippingEta|null  >(model?.eta        ?? null   );
    const [rates     , setRates     ] = useState<ShippingRate[]    >(() => {
        const rates = model?.rates;
        if (!rates) return [];
        return (
            rates
            .map((rate) => ({
                ...rate, // clone => immutable => mutable
            }))
        );
    });
    
    const [useZones      , setUseZones     ] = useState<boolean                >(model?.useZones   ?? true   );
    const [countries     , setCountries    ] = useState<CoverageCountryWithId[]>((): CoverageCountryWithId[] => {
        const countries = model?.zones;
        if (!countries) return [];
        
        
        
        const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
        return (
            countries
            .map((coverageCountry: CoverageCountry) => ({
                ...coverageCountry,       // clone => immutable => mutable
                id    : nanoid(),         // add a temporary id
                zones : coverageCountry.zones.map((coverageState: CoverageState) => ({
                    ...coverageState,     // clone => immutable => mutable
                    id    : nanoid(),     // add a temporary id
                    zones : coverageState.zones.map((coverageCity: CoverageCity) => ({
                        ...coverageCity,  // clone => immutable => mutable
                        id    : nanoid(), // add a temporary id
                    } satisfies CoverageCityWithId)),
                } satisfies CoverageStateWithId)),
            } satisfies CoverageCountryWithId))
        );
    });
    
    
    
    // stores:
    const [country, setCountry] = useState<string>('');
    const [state  , setState  ] = useState<string>('');
    
    const [getStateList] = useGetStateList();
    const [getCityList ] = useGetCityList();
    const stateListRef   = useRef<Promise<string[]>>(emptyStringPromise);
    const cityListRef    = useRef<Promise<string[]>>(emptyStringPromise);
    useEffect(() => {
        if (!country) {
            stateListRef.current = emptyStringPromise; // clear
        }
        else {
            stateListRef.current = getStateList({ countryCode: country }).unwrap();
        } // if
    }, [country]);
    useEffect(() => {
        if (!country || !state) {
            cityListRef.current = emptyStringPromise; // clear
        }
        else {
            cityListRef.current = getCityList({ countryCode: country, state: state }).unwrap();
        } // if
    }, [country, state]);
    
    
    
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
    const handleUpdate         = useEvent<UpdateHandler<ShippingDetail>>(async ({id, whenAdd, whenUpdate}) => {
        return await updateShipping({
            id         : id ?? '',
            
            visibility : (whenUpdate.visibility  || whenAdd) ? visibility    : undefined,
            name       : (whenUpdate.description || whenAdd) ? name          : undefined,
            
            weightStep : (whenUpdate.price       || whenAdd) ? weightStep    : undefined,
            eta        : (whenUpdate.description || whenAdd) ? (eta || null) : undefined,
            rates      : (whenUpdate.price       || whenAdd) ? rates         : undefined,
            
            useZones   : (whenUpdate.price       || whenAdd) ? useZones      : undefined,
            zones      : (whenUpdate.price       || whenAdd) ? ((): CoverageCountry[] =>
                // remove id(s) from nested zone(s):
                countries
                .map(({id : _id, ...coverageCountry}: CoverageCountryWithId) => ({
                    ...coverageCountry,
                    zones : coverageCountry.zones.map(({id : _id, ...coverageState}: CoverageStateWithId) => ({
                        ...coverageState,
                        zones : coverageState.zones.map(({id : _id, ...coverageCity}: CoverageCityWithId) => ({
                            ...coverageCity,
                        } satisfies CoverageCity)),
                    } satisfies CoverageState)),
                } satisfies CoverageCountry))
            )() : undefined,
        }).unwrap();
    });
    
    const handleDelete         = useEvent<DeleteHandler<ShippingDetail>>(async ({id}) => {
        await deleteShipping({
            id : id,
        }).unwrap();
    });
    
    const handleConfirmDelete  = useEvent<ConfirmDeleteHandler<ShippingDetail>>(({model}) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete shipping <strong>{model.name}</strong>?
                </p>
                <p>
                    The associated shipping in existing orders will be marked as <strong>DELETED SHIPPING</strong>.
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved = useEvent<ConfirmUnsavedHandler<ShippingDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
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
            onUpdate={handleUpdate}
            // onAfterUpdate={handleAfterUpdate}
            
            onDelete={handleDelete}
            // onAfterDelete={undefined}
            
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
                        <Group>
                            <Label>
                                Min:
                            </Label>
                            <NumberEditor
                                // accessibilities:
                                aria-label='Estimated Delivery Time (Min)'
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
                        </Group>
                        <Label>
                            -
                        </Label>
                        <Group>
                            <Label>
                                Max:
                            </Label>
                            <NumberEditor
                                // classes:
                                className='eta editor'
                                
                                
                                
                                // accessibilities:
                                aria-label='Estimated Delivery Time (Max)'
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
                    <CoverageZoneEditor<CoverageCountryWithId, CoverageStateWithId>
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
                            <CoverageZoneEditor<CoverageStateWithId, CoverageCityWithId>
                                // data:
                                modelName='State'
                                modelNamePlural='States'
                                
                                
                                
                                // components:
                                zoneNameEditor={
                                    <SelectStateEditor
                                        // data:
                                        valueOptions={stateListRef}
                                        onChange={setState}
                                    />
                                }
                                subzoneEditor={
                                    <CoverageZoneEditor<CoverageCityWithId & { useZones: never, zones: never }, never>
                                        // data:
                                        modelName='City'
                                        modelNamePlural='Cities'
                                        
                                        
                                        
                                        // components:
                                        zoneNameEditor={
                                            <SelectCityEditor
                                                // data:
                                                valueOptions={cityListRef}
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
