// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useId,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'           // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useIsomorphicLayoutEffect,
    useEvent,
    useMergeEvents,
    useMountedFlag,
    useScheduleTriggerEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    BasicProps,
    Basic,
    
    
    
    // simple-components:
    Icon,
    ButtonProps,
    ButtonIcon,
    
    
    
    // composite-components:
    ProgressProps,
    Progress,
    ProgressBarProps,
    ProgressBar,
}                           from '@reusable-ui/components'

// internals:
import type {
    // types:
    EditorChangeEventHandler,
    
    
    
    // react components:
    EditorProps,
}                           from '@/components/editors/Editor'
import {
    // configs:
    uploadImages,
}                           from './styles/config'



// styles:
export const useUploadImageStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'glt9axuphe' }); // a unique salt for SSR support, ensures the server-side & client-side have the same generated class names
import './styles/styles'



// utilities:
const resolveSrc = <TValue extends ImageData = ImageData>(imageData: TValue, onResolveUrl: ((imageData: TValue) => URL|string)|undefined): string => {
    if (!onResolveUrl) return (typeof(imageData) === 'string') ? imageData : imageData.url;
    const resolved = onResolveUrl(imageData);
    return (typeof(resolved) === 'string') ? resolved : resolved.href;
};
const resolveAlt = <TValue extends ImageData = ImageData>(imageData: TValue): string => {
    return ((typeof(imageData) === 'string') ? '' : imageData.title) || '';
};



// types:
export type DetailedImageData = {
    url    : string
    title ?: string
}
export type ImageData =
    |string
    |DetailedImageData



// react components:
export interface UploadImageProps<TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>
    extends
        // bases:
        Pick<EditorProps<TElement, TValue>,
            // values:
            |'defaultValue'
            |'value'
            |'onChange'
        >,
        Omit<BasicProps<TElement>,
            // values:
            |'defaultValue' // not supported
            |'value'        // not supported
            |'onChange'     // not supported
            
            // children:
            |'children'     // already taken over
        >
{
    // actions:
    actionDelete             ?: string
    onActionDelete           ?: (imageData: TValue) => Promise<boolean>
    
    
    
    // upload images:
    uploadImageSelectImage   ?: string
    uploadImageType          ?: string
    
    
    
    // uploading images:
    uploadingImageErrorTitle ?: string
    uploadingImageRetry      ?: string
    uploadingImageCancel     ?: string
    
    
    
    // upload activities:
    onUploadImageStart       ?: (imageFile: File, reportProgress: (percentage: number) => void, abortSignal: AbortSignal) => Promise<TValue|null>
    onUploadingImageProgress ?: (percentage: number|null) => string
    
    
    
    // components:
    noImageComponent         ?: React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>
    imageComponent           ?: React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>
    
    selectButtonComponent    ?: React.ReactComponentElement<any, ButtonProps>
    deleteButtonComponent    ?: React.ReactComponentElement<any, ButtonProps>
    retryButtonComponent     ?: React.ReactComponentElement<any, ButtonProps>
    cancelButtonComponent    ?: React.ReactComponentElement<any, ButtonProps>
    
    progressComponent        ?: React.ReactComponentElement<any, ProgressProps<Element>>
    progressBarComponent     ?: React.ReactComponentElement<any, ProgressBarProps<Element>>
    
    // handlers:
    onResolveUrl             ?: (imageData: TValue) => URL|string
}
const UploadImage = <TElement extends Element = HTMLElement, TValue extends ImageData = ImageData>(props: UploadImageProps<TElement, TValue>): JSX.Element|null => {
    // styles:
    const styleSheet = useUploadImageStyleSheet();
    
    
    
    // rest props:
    const {
        // values:
        defaultValue : defaultImage,
        value        : image,
        onChange,
        
        
        
        // actions:
        actionDelete,
        onActionDelete,
        
        
        
        // upload images:
        uploadImageSelectImage   = 'Select Image',
        uploadImageType          = 'image/jpg, image/jpeg, image/png, image/svg',
        
        
        
        // uploading images:
        uploadingImageErrorTitle = 'Upload Error',
        uploadingImageRetry      = 'Retry',
        uploadingImageCancel     = 'Cancel',
        
        
        
        // upload/uploading activities:
        onUploadImageStart,
        onUploadingImageProgress,
        
        
        
        // components:
        noImageComponent       = (<Icon icon='image'                             /> as React.ReactComponentElement<any, React.HTMLAttributes<HTMLElement>>),
        imageComponent         = (<img                                           /> as React.ReactComponentElement<any, React.ImgHTMLAttributes<HTMLImageElement>>),
        
        selectButtonComponent  = (<ButtonIcon icon='upload_file' theme='primary' /> as React.ReactComponentElement<any, ButtonProps>),
        deleteButtonComponent  = (<ButtonIcon icon='clear'       theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
        retryButtonComponent   = (<ButtonIcon icon='refresh'     theme='success' /> as React.ReactComponentElement<any, ButtonProps>),
        cancelButtonComponent  = (<ButtonIcon icon='cancel'      theme='danger'  /> as React.ReactComponentElement<any, ButtonProps>),
        
        progressComponent     = (<Progress                             size='sm' /> as React.ReactComponentElement<any, ProgressProps<Element>>),
        progressBarComponent  = (<ProgressBar                                    /> as React.ReactComponentElement<any, ProgressBarProps<Element>>),
        
        
        
        // handlers:
        onResolveUrl,
    ...restBasicProps} = props;
    
    
    
    // states:
    let [imageDn, setImageDn] = useState<TValue|null>(defaultImage ?? null);
    let imageData : TValue|null = (image /*controllable*/ ?? imageDn /*uncontrollable*/);
    
    
    
    // jsx:
    return (
        <Basic<TElement>
            // other props:
            {...restBasicProps}
            
            
            
            // classes:
            mainClass={props.mainClass ?? styleSheet.main}
        >
            {/* <NoImage> */}
            { !imageData && React.cloneElement<React.HTMLAttributes<HTMLElement>>(noImageComponent,
                // props:
                {
                    // classes:
                    className : 'noImage',
                },
            )}
            
            {/* <Image> */}
            {!!imageData && React.cloneElement<React.ImgHTMLAttributes<HTMLImageElement>>(imageComponent,
                // props:
                {
                    // classes:
                    className : 'image',
                    
                    
                    
                    // images:
                    alt       : imageComponent.props.alt   ??  resolveAlt(imageData),
                    src       : imageComponent.props.src   ?? (resolveSrc(imageData, onResolveUrl) || undefined), // convert empty string to undefined
                    sizes     : imageComponent.props.sizes ?? uploadImages.imageInlineSize,
                },
            )}
        </Basic>
    );
};
export {
    UploadImage,
    UploadImage as default,
}
