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
    
    
    
    // composite-components:
    TabPanel,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Image,
}                           from '@heymarco/image'
import {
    NameEditor,
}                           from '@heymarco/name-editor'

// internal components:
import {
    PriceEditor,
}                           from '@/components/editors/PriceEditor'
import {
    ShippingWeightEditor,
}                           from '@/components/editors/ShippingWeightEditor'
import {
    VisibilityEditor,
}                           from '@/components/editors/VisibilityEditor'
import {
    GalleryEditor,
}                           from '@/components/editors/GalleryEditor'
import type {
    // types:
    VariantState,
}                           from '@/components/editors/VariantEditor'
import {
    // react components:
    ImplementedComplexEditModelDialogProps,
    ComplexEditModelDialog,
}                           from '@/components/dialogs/ComplexEditModelDialog'

// internals:
import {
    resolveMediaUrl,
}                           from '@/libs/mediaStorage.client'

// others:
import {
    customAlphabet,
}                           from 'nanoid/async'

// models:
import type {
    VariantVisibility,
}                           from '@prisma/client'

// models:
import {
    // types:
    type ModelConfirmUnsavedEventHandler,
    type ModelConfirmDeleteEventHandler,
    type ModelUpsertingEventHandler,
    
    type VariantDetail,
}                           from '@/models'

// stores:
import {
    // hooks:
    usePostImage,
    useDeleteImage,
    useMoveImage,
}                           from '@/store/features/api/apiSlice'

// configs:
import {
    PAGE_VARIANT_TAB_INFORMATIONS,
    PAGE_VARIANT_TAB_IMAGES,
    PAGE_VARIANT_TAB_DELETE,
}                           from '@/website.config'



// styles:
const useEditVariantDialogStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */'./EditVariantDialogStyles')
, { id: 'b4kzha6i3y' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './EditVariantDialogStyles';



// react components:
export interface EditVariantDialogProps
    extends
        // bases:
        ImplementedComplexEditModelDialogProps<VariantDetail>,
        
        // privileges & states:
        VariantState
{
}
const EditVariantDialog = (props: EditVariantDialogProps): JSX.Element|null => {
    // styles:
    const styleSheet = useEditVariantDialogStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        model = null,
        
        
        
        // privileges:
        privilegeAdd,
        privilegeUpdate,
        privilegeDelete,
        
        
        
        // images:
        registerAddedImage,
        registerDeletedImage,
        
        
        
        // states:
        defaultExpandedTabIndex = 0,
    ...restComplexEditModelDialogProps} = props;
    
    
    
    // states:
    const [isModified, setIsModified]         = useState<boolean>(false);
    
    const [visibility    , setVisibility    ] = useState<VariantVisibility>(model?.visibility     ?? 'PUBLISHED');
    const [name          , setName          ] = useState<string           >(model?.name           ?? ''         );
    const [price         , setPrice         ] = useState<number      |null>(model?.price          || null       ); // converts 0 to empty
    const [shippingWeight, setShippingWeight] = useState<number      |null>(model?.shippingWeight ?? null       ); // optional field
    const [images        , setImages        ] = useState<string[]         >(model?.images         ?? []         );
    
    
    
    // stores:
    const [postImage                                                  ] = usePostImage();
    const [commitDeleteImage, {isLoading : isLoadingCommitDeleteImage}] = useDeleteImage();
    const [commitMoveImage  , {isLoading : isLoadingCommitMoveImage  }] = useMoveImage();
    
    
    
    // refs:
    const firstEditorRef = useRef<HTMLInputElement|null>(null); // TODO: finish this
    
    
    
    // handlers:
    const handleModelUpserting       = useEvent<ModelUpsertingEventHandler<VariantDetail>>(async ({ id, options: { addPermission, updatePermissions } }) => {
        const immigratedImages : string[] = [];
        let updatedImages = images;
        if (updatedImages.length) {
            try {
                const movedResponse = await commitMoveImage({
                    imageId : updatedImages,
                    // folder  : 'testing/helloh',
                    folder  : `products/${name || '__unnamed__'}/variants`,
                }).unwrap();
                const movedMap = new Map<string, string>(
                    movedResponse.map(({from, to}) => [from, to])
                );
                
                
                
                if (movedMap.size) {
                    updatedImages = updatedImages.map((image) => {
                        // conditions:
                        const movedImage = movedMap.get(image);
                        if (movedImage === undefined) return image;
                        
                        
                        
                        // actions:
                        immigratedImages.push(image);
                        return movedImage;
                    });
                } // if
            }
            catch {
                // ignore any moveImages error
            } // try
        } // if
        
        
        
        try {
            return {
                ...model,
                
                id             : id ?? await (async () => {
                    const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
                    return ` ${await nanoid()}`; // starts with space{random-temporary-id}
                })(),
                
                visibility     : (updatePermissions.visibility  || addPermission) ? visibility     : model?.visibility,
                name           : (updatePermissions.description || addPermission) ? name           : model?.name,
                price          : (updatePermissions.price       || addPermission) ? price          : model?.price,
                shippingWeight : (updatePermissions.price       || addPermission) ? shippingWeight : model?.shippingWeight,
                images         : (updatePermissions.images      || addPermission) ? updatedImages  : model?.images,
            };
        }
        finally {
            if (immigratedImages.length) {
                try {
                    await commitDeleteImage({
                        imageId : immigratedImages,
                    }).unwrap();
                }
                catch {
                    // ignore any deleteImages error
                } // try
            } // if
        } // try
    });
    
    const handleModelConfirmDelete   = useEvent<ModelConfirmDeleteEventHandler<VariantDetail>>(({ draft }) => {
        return {
            title   : <h1>Delete Confirmation</h1>,
            message : <>
                <p>
                    Are you sure to delete variant <strong>{draft.name}</strong>?
                </p>
                <p>
                    The associated product variant in existing orders will be marked as <strong>DELETED VARIANT</strong>.
                </p>
            </>,
        };
    });
    const handleConfirmUnsaved       = useEvent<ModelConfirmUnsavedEventHandler<VariantDetail>>(() => {
        return {
            title   : <h1>Unsaved Data</h1>,
            message : <p>
                Do you want to save the changes?
            </p>,
        };
    });
    
    
    
    // jsx:
    return (
        <ComplexEditModelDialog<VariantDetail>
            // other props:
            {...restComplexEditModelDialogProps}
            
            
            
            // data:
            modelName='Variant'
            modelEntryName={model?.name}
            model={model}
            
            
            
            // privileges:
            privilegeAdd    = {privilegeAdd   }
            privilegeUpdate = {privilegeUpdate}
            privilegeDelete = {privilegeDelete}
            
            
            
            // stores:
            isModified  = {isModified}
            
            isCommiting = {/*isLoadingUpdate ||*/ isLoadingCommitDeleteImage || isLoadingCommitMoveImage}
            // isReverting = {                       /*isLoadingRevertDeleteImage*/}
            isDeleting  = {/*isLoadingDelete ||*/ isLoadingCommitDeleteImage}
            
            
            
            // tabs:
            tabDelete={PAGE_VARIANT_TAB_DELETE}
            
            
            
            // states:
            defaultExpandedTabIndex={defaultExpandedTabIndex}
            
            
            
            // auto focusable:
            autoFocusOn={props.autoFocusOn ?? firstEditorRef}
            
            
            
            // handlers:
            onModelUpserting={handleModelUpserting}
            // onModelUpsert={handleModelUpsert}
            
            // onModelDeleting={handleModelDeleting}
            // onModelDelete={undefined}
            
            // onSideModelCommitting={handleSideModelCommitting}
            // onSideModelDiscarding={handleSideModelDiscarding}
            
            onModelConfirmDelete={handleModelConfirmDelete}
            onConfirmUnsaved={handleConfirmUnsaved}
        >{({whenAdd, whenUpdate}) => <>
            <TabPanel label={PAGE_VARIANT_TAB_INFORMATIONS} panelComponent={<Generic className={styleSheet.infoTab} />}>
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
                    
                    <span className='price label'>Additional Price:</span>
                    <span className='price label optional'>(Optional: will be added to base price)</span>
                    <PriceEditor
                        // classes:
                        className='price editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.price || whenAdd}
                        
                        
                        
                        // validations:
                        required={false}
                        
                        
                        
                        // values:
                        value={price}
                        onChange={(value) => {
                            setPrice(value || null); // converts 0 to empty
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='sWeight label'>Additional Shipping Weight:</span>
                    <span className='sWeight label optional'>(Optional: will be added to base weight)</span>
                    <ShippingWeightEditor
                        // classes:
                        className='sWeight editor'
                        
                        
                        
                        // accessibilities:
                        enabled={whenUpdate.price || whenAdd}
                        
                        
                        
                        // values:
                        value={shippingWeight}
                        onChange={(value) => {
                            setShippingWeight(value);
                            setIsModified(true);
                        }}
                    />
                    
                    <span className='visibility label'>Visibility:</span>
                    <VisibilityEditor
                        // variants:
                        theme='primaryAlt'
                        
                        
                        
                        // classes:
                        className='visibility editor'
                        
                        
                        
                        // accessibilities:
                        modelName='variant'
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
            {!!registerAddedImage && !!registerDeletedImage && <TabPanel label={PAGE_VARIANT_TAB_IMAGES}       panelComponent={<Generic className={styleSheet.imagesTab} />}>
                <GalleryEditor<HTMLElement, string>
                    // variants:
                    nude={true}
                    
                    
                    
                    // accessibilities:
                    readOnly={!(whenUpdate.images || whenAdd)}
                    
                    
                    
                    // values:
                    value={images}
                    onChange={(value) => {
                        setImages(value);
                        setIsModified(true);
                    }}
                    
                    
                    
                    // components:
                    imageComponent={
                        // @ts-ignore
                        <Image
                            priority={true}
                        />
                    }
                    
                    
                    
                    // handlers:
                    onUploadImage={async ({ imageFile, reportProgress, abortSignal }) => {
                        try {
                            const imageId = await postImage({
                                image            : imageFile,
                                folder           : `products/${name || '__unnamed__'}/variants`,
                                onUploadProgress : reportProgress,
                                abortSignal      : abortSignal,
                            }).unwrap();
                            
                            // register to actual_delete the new_image when reverted:
                            registerAddedImage(imageId);
                            
                            return imageId;
                        }
                        catch (error : any) {
                            if (error.status === 0) { // non_standard HTTP status code: a request was aborted
                                // TODO: try to cleanup a prematurely image (if any)
                                
                                return null; // prevents showing error
                            } // if
                            
                            throw error;     // shows the error detail
                        } // try
                    }}
                    onDeleteImage={async ({ imageData: imageId }) => {
                        // register to actual_delete the deleted_image when committed:
                        registerDeletedImage(imageId);
                        
                        return true;
                    }}
                    onResolveImageUrl={resolveMediaUrl<never>}
                />
            </TabPanel>}
        </>}</ComplexEditModelDialog>
    );
};
export {
    EditVariantDialog,
    EditVariantDialog as default,
}
