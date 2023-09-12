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
    PaginationModelList,
}                           from './PaginationModelList'

// internals:
import type {
    Pagination,
    Model,
}                           from '@/libs/types'
import {
    // states:
    usePaginationModelState,
    
    
    
    // react components:
    PaginationModelStateProps,
    PaginationModelStateProvider,
}                           from './states/paginationModelState'
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
export type CloseEventHandler = () => void
export interface CreateItemUiProps {
    // handlers:
    onClose : CloseEventHandler
}
export interface ModelCreateProps {
    // accessibilities:
    createItemText       ?: React.ReactNode
    
    
    
    // components:
    modelCreateComponent  : React.ReactComponentElement<any, CreateItemUiProps>
}
const ModelCreate = (props: ModelCreateProps) => {
    // styles:
    const styles = useSectionModelEditorStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        createItemText,
        
        
        
        // components:
        modelCreateComponent,
    } = props;
    
    
    
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
        <ListItem className={styles.createData}>
            <ButtonIcon icon='create' onClick={() => setShowAddNew(true)}>
                {createItemText ?? 'Add New Item'}
            </ButtonIcon>
            {/* add_new_data dialog: */}
            <ModalStatus theme='primary' modalCardStyle='scrollable' backdropStyle='static' onExpandedChange={({expanded}) => !expanded && setShowAddNew(false)}>
                {showAddNew && React.cloneElement<CreateItemUiProps>(modelCreateComponent,
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

export interface SectionModelEditorProps<TModel extends Model>
    extends
        // bases:
        SectionModelEditorInternalProps<TModel>
{
    // data:
    page       : number
    perPage    : number
    setPage    : (page: number) => void
    setPerPage : (perPage: number) => void
    dataSource : PaginationModelStateProps<TModel>['dataSource']
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
        dataSource,
    ...restSectionModelEditorProps} = props;
    
    
    
    // handlers:
    const handleNavigateTo = useEvent((page: number) => {
        setPage(page);
    });
    
    
    
    // jsx:
    return (
        <PaginationModelStateProvider dataSource={dataSource}>
            <Section className={`fill-self ${styles.sectionData}`}>
                <PaginationModelList<TModel>
                    // paginations:
                    page={page}
                    perPage={perPage}
                    
                    
                    
                    // classes:
                    className={styles.paginTop}
                    
                    
                    
                    // handlers:
                    onNavigateTo={handleNavigateTo}
                />
                <SectionModelEditorInternal<TModel> {...restSectionModelEditorProps} />
                <PaginationModelList<TModel>
                    // paginations:
                    page={page}
                    perPage={perPage}
                    
                    
                    
                    // classes:
                    className={styles.paginBtm}
                    
                    
                    
                    // handlers:
                    onNavigateTo={handleNavigateTo}
                />
            </Section>
        </PaginationModelStateProvider>
    );
}

export interface ModelPreviewProps<TModel extends Model, TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>
{
    // data:
    model : Pagination<TModel>['entities'][number]
}
interface SectionModelEditorInternalProps<TModel extends Model>
    extends
        // data:
        Partial<ModelCreateProps>
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
    } = usePaginationModelState<TModel>();
    
    
    
    // refs:
    const dataListRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <Basic className={styles.listData} theme='primary' mild={true} elmRef={dataListRef}>
            <ModalLoadingError
                // data:
                isFetching={isFetching}
                isError={isError}
                refetch={refetch}
                
                
                
                // global stackable:
                viewport={dataListRef}
            />
            
            <ModalDataEmpty
                // data:
                data={data}
                
                
                
                // global stackable:
                viewport={dataListRef}
            />
            
            {!!data && <List listStyle='flush' className={styles.listDataInner}>
                {/* <ModelCreate> */}
                {!!modelCreateComponent && <ModelCreate createItemText={createItemText} modelCreateComponent={modelCreateComponent} />}
                
                {!!modelPreviewComponent && Object.values(data?.entities).filter((model): model is Exclude<typeof model, undefined> => !!model).map((model, index) =>
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
            </List>}
        </Basic>
    );
};
export {
    SectionModelEditor,
    SectionModelEditor as default,
}