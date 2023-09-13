'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useRef,
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
    useMergeEvents,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // base-components:
    Basic,
    
    
    
    // simple-components:
    ButtonIcon,
    
    
    
    // layout-components:
    ListItemProps,
    ListItem,
    List,
    
    
    
    // utility-components:
    ModalStatus,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'

// internals components:
import {
    ModelPagination,
}                           from './ModelPagination'

// internals:
import type {
    Pagination,
    Model,
}                           from '@/libs/types'
import {
    // states:
    useModelPaginationState,
    
    
    
    // react components:
    ModelPaginationStateProps,
    ModelPaginationStateProvider,
}                           from '@/states/modelPaginationState'
import {
    ModalLoadingError,
}                           from '@/components/ModalLoadingError'
import {
    ModalDataEmpty,
}                           from '@/components/ModalDataEmpty'



// styles:
export const useSectionModelEditorStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'lm1zazz2r7' });
import './styles/styles';



// react components:

/* <ModelCreate> */
export type CloseEventHandler = () => void
export interface ModelCreateProps {
    // handlers:
    onClose : CloseEventHandler
}

/* <ModelCreateOuter> */
export interface ModelCreateOuterProps
    extends
        // bases:
        ListItemProps
{
    // accessibilities:
    createItemText       ?: React.ReactNode
    
    
    
    // components:
    modelCreateComponent  : React.ReactComponentElement<any, ModelCreateProps>
}
const ModelCreateOuter = (props: ModelCreateOuterProps) => {
    // styles:
    const styles = useSectionModelEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        createItemText,
        
        
        
        // components:
        modelCreateComponent,
    ...restListItemProps} = props;
    
    
    
    // states:
    const [showAddNew, setShowAddNew] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleCloseInternal = useEvent<CloseEventHandler>(() => {
        // actions:
        setShowAddNew(false);
    });
    const handleClose         = useMergeEvents<void>(
        // preserves the original `onClose` from `modelCreateComponent`:
        modelCreateComponent.props.onClose,
        
        
        
        // actions:
        handleCloseInternal,
    );
    
    
    
    // jsx:
    return (
        <ListItem
            // other props:
            {...restListItemProps}
            
            
            
            // classes:
            className={`${styles.createData} ${props.className}`}
        >
            <ButtonIcon icon='create' onClick={() => setShowAddNew(true)}>
                {createItemText ?? 'Add New Item'}
            </ButtonIcon>
            {/* add_new_data dialog: */}
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setShowAddNew(false)}>
                {showAddNew && React.cloneElement<ModelCreateProps>(modelCreateComponent,
                    // props:
                    {
                        // handlers:
                        onClose : handleClose,
                    },
                )}
            </ModalStatus>
        </ListItem>
    );
};

/* <ModelPreview> */
export interface ModelPreviewProps<TModel extends Model, TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>
{
    // data:
    model : Pagination<TModel>['entities'][number]
}

/* <ModelEmpty> */
const ModelEmpty = () => {
    // refs:
    const statusEmptyListRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <ListItem elmRef={statusEmptyListRef} className='statusEmpty'>
            <ModalDataEmpty
                // global stackable:
                viewport={statusEmptyListRef}
            />
        </ListItem>
    );
};

/* <SectionModelEditor> */
export interface SectionModelEditorProps<TModel extends Model>
    extends
        // bases:
        SectionModelEditorInternalProps<TModel>
{
    // data:
    page                  : number
    perPage               : number
    setPage               : (page: number) => void
    setPerPage            : (perPage: number) => void
    getModelPaginationApi : ModelPaginationStateProps<TModel>['getModelPaginationApi']
}
const SectionModelEditor         = <TModel extends Model>(props: SectionModelEditorProps<TModel>): JSX.Element|null => {
    // styles:
    const styles = useSectionModelEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        page,
        perPage,
        setPage,
        setPerPage,
        getModelPaginationApi,
    ...restSectionModelEditorProps} = props;
    
    
    
    // handlers:
    const handleNavigateTo = useEvent((page: number) => {
        setPage(page);
    });
    
    
    
    // jsx:
    return (
        <ModelPaginationStateProvider
            // data:
            getModelPaginationApi={getModelPaginationApi}
        >
            <Section className={`fill-self ${styles.sectionModel}`}>
                <ModelPagination<TModel>
                    // paginations:
                    page={page}
                    perPage={perPage}
                    
                    
                    
                    // classes:
                    className={styles.paginTop}
                    
                    
                    
                    // handlers:
                    onNavigateTo={handleNavigateTo}
                />
                <SectionModelEditorInternal<TModel> {...restSectionModelEditorProps} />
                <ModelPagination<TModel>
                    // paginations:
                    page={page}
                    perPage={perPage}
                    
                    
                    
                    // classes:
                    className={styles.paginBtm}
                    
                    
                    
                    // handlers:
                    onNavigateTo={handleNavigateTo}
                />
            </Section>
        </ModelPaginationStateProvider>
    );
};
export {
    SectionModelEditor,
    SectionModelEditor as default,
}

/* <SectionModelEditorInternal> */
interface SectionModelEditorInternalProps<TModel extends Model>
    extends
        // data:
        Partial<ModelCreateOuterProps>
{
    // components:
    modelPreviewComponent : React.ReactComponentElement<any, ModelPreviewProps<TModel, Element>>
}
const SectionModelEditorInternal = <TModel extends Model>(props: SectionModelEditorInternalProps<TModel>): JSX.Element|null => {
    // styles:
    const styles = useSectionModelEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        createItemText,
        
        
        
        // components:
        modelCreateComponent,
        modelPreviewComponent,
    } = props;
    
    
    
    // states:
    const {
        // data:
        data,
        isFetching,
        isError,
        refetch,
    } = useModelPaginationState<TModel>();
    const isDataEmpty = !!data && !data.total;
    
    
    
    // refs:
    const dataListRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <Basic className={`${styles.listData}${isDataEmpty ? ' empty' : ''}`} theme='primary' mild={true} elmRef={dataListRef}>
            <ModalLoadingError
                // data:
                isFetching={isFetching}
                isError={isError}
                refetch={refetch}
                
                
                
                // global stackable:
                viewport={dataListRef}
            />
            
            <List listStyle='flush' className={styles.listDataInner}>
                {/* <ModelCreate> */}
                {!!modelCreateComponent  && <ModelCreateOuter className='solid' createItemText={createItemText} modelCreateComponent={modelCreateComponent} />}
                
                {!!data && !data.total && <ModelEmpty />}
                
                {!!data?.total && Object.values(data?.entities).filter((model): model is Exclude<typeof model, undefined> => !!model).map((model, index) =>
                    /* <ModelPreview> */
                    React.cloneElement<ModelPreviewProps<TModel, Element>>(modelPreviewComponent,
                        // props:
                        {
                            // identifiers:
                            key   : modelPreviewComponent.key         ?? model.id,
                            
                            
                            
                            // data:
                            model : modelPreviewComponent.props.model ?? model,
                        },
                    )
                )}
            </List>
        </Basic>
    );
};