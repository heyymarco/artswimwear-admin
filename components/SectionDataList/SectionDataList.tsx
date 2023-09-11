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
    CardBody,
    
    
    
    // utility-components:
    ModalStatus,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    Section,
}                           from '@heymarco/section'
import {
    LoadingBar,
}                           from '@heymarco/loading-bar'

// internals components:
import {
    PaginationDataList,
}                           from './PaginationDataList'

// internals:
import type {
    Model,
}                           from './types'
import type {
    Pagination,
}                           from '@/libs/types'
import {
    // states:
    usePaginationDataState,
    
    
    
    // react components:
    PaginationDataStateProps,
    PaginationDataStateProvider,
}                           from './states/paginationDataState'



// styles:
export const useSectionDataListStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'lm1zazz2r7' });
import './styles/styles';



// react components:
export type CloseEventHandler = () => void
export interface CreateItemUiProps {
    // handlers:
    onClose : CloseEventHandler
}
export interface CreateDataProps {
    // accessibilities:
    createItemText        ?: React.ReactNode
    
    
    
    // components:
    createItemUiComponent  : React.ReactComponentElement<any, CreateItemUiProps>
}
const CreateData = (props: CreateDataProps) => {
    // styles:
    const styles = useSectionDataListStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        createItemText,
        
        
        
        // components:
        createItemUiComponent,
    } = props;
    
    
    
    // states:
    const [showAddNew, setShowAddNew] = useState<boolean>(false);
    
    
    
    // handlers:
    const handleCloseInternal = useEvent<CloseEventHandler>(() => {
        // actions:
        setShowAddNew(false);
    });
    const handleClose         = useMergeEvents<void>(
        // preserves the original `onClose` from `createItemUiComponent`:
        createItemUiComponent.props.onClose,
        
        
        
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
                {showAddNew && React.cloneElement<CreateItemUiProps>(createItemUiComponent,
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

export interface ItemDataProps<TModel extends Model, TElement extends Element = HTMLElement>
    extends
        // bases:
        ListItemProps<TElement>
{
    // data:
    itemData : Pagination<TModel>['entities'][number]
}
export interface SectionDataListProps<TModel extends Model>
    extends
        // bases:
        SectionDataListInternalProps<TModel>
{
    // data:
    page       : number
    perPage    : number
    setPage    : (page: number) => void
    setPerPage : (perPage: number) => void
    dataSource : PaginationDataStateProps<TModel>['dataSource']
}
const SectionDataList         = <TModel extends Model>(props: SectionDataListProps<TModel>): JSX.Element|null => {
    // styles:
    const styles = useSectionDataListStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        page,
        perPage,
        setPage,
        setPerPage,
        dataSource,
    ...restSectionDataListProps} = props;
    
    
    
    // handlers:
    const handleNavigateTo = useEvent((page: number) => {
        setPage(page);
    });
    
    
    
    // jsx:
    return (
        <PaginationDataStateProvider dataSource={dataSource}>
            <Section className={`fill-self ${styles.sectionData}`}>
                <PaginationDataList<TModel>
                    // paginations:
                    page={page}
                    perPage={perPage}
                    
                    
                    
                    // classes:
                    className={styles.paginTop}
                    
                    
                    
                    // handlers:
                    onNavigateTo={handleNavigateTo}
                />
                <SectionDataListInternal<TModel> {...restSectionDataListProps} />
                <PaginationDataList<TModel>
                    // paginations:
                    page={page}
                    perPage={perPage}
                    
                    
                    
                    // classes:
                    className={styles.paginBtm}
                    
                    
                    
                    // handlers:
                    onNavigateTo={handleNavigateTo}
                />
            </Section>
        </PaginationDataStateProvider>
    );
}

interface SectionDataListInternalProps<TModel extends Model>
    extends
        // data:
        Partial<CreateDataProps>
{
    // components:
    itemDataComponent : React.ReactComponentElement<any, ItemDataProps<TModel, Element>>
}
const SectionDataListInternal = <TModel extends Model>(props: SectionDataListInternalProps<TModel>): JSX.Element|null => {
    // styles:
    const styles = useSectionDataListStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        createItemText,
        
        
        
        // components:
        createItemUiComponent,
        itemDataComponent,
    } = props;
    
    
    
    // states:
    const {
        // data:
        data,
        isFetching,
        isError,
        refetch,
    } = usePaginationDataState<TModel>();
    
    
    
    // refs:
    const dataListRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <Basic className={styles.listData} theme='primary' mild={true} elmRef={dataListRef}>
            {/* loading|error dialog: */}
            <ModalStatus viewport={dataListRef} theme={isError ? 'danger' : undefined}>
                {(isFetching || isError) && <CardBody className={styles.dataFetchingStatus}>
                    {isFetching && <>
                        <p>Retrieving data from the server. Please wait...</p>
                        <LoadingBar className='loadingBar' />
                    </>}
                    
                    {isError && <>
                        <h3>Oops, an error occured!</h3>
                        <p>We were unable to retrieve data from the server.</p>
                        <ButtonIcon icon='refresh' theme='success' onClick={refetch}>
                            Retry
                        </ButtonIcon>
                    </>}
                </CardBody>}
            </ModalStatus>
            
            {!!data && <List listStyle='flush' className={styles.listDataInner}>
                {/* <CreateData> */}
                {!!createItemUiComponent && <CreateData createItemText={createItemText} createItemUiComponent={createItemUiComponent} />}
                
                {!!itemDataComponent && Object.values(data?.entities).filter((itemData): itemData is Exclude<typeof itemData, undefined> => !!itemData).map((itemData, index) =>
                    /* <ItemData> */
                    React.cloneElement<ItemDataProps<TModel, Element>>(itemDataComponent,
                        // props:
                        {
                            // identifiers:
                            key      : itemDataComponent.key            ?? itemData.id,
                            
                            
                            
                            // data:
                            itemData : itemDataComponent.props.itemData ?? itemData,
                        },
                    )
                )}
            </List>}
        </Basic>
    );
};
export {
    SectionDataList,
    SectionDataList as default,
}