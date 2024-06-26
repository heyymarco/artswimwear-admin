'use client'

// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
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
    useMountedFlag,
    
    
    
    // a capability of UI to expand/reduce its size or toggle the visibility:
    ExpandedChangeEvent,
    CollapsibleProps,
    CollapsibleEventProps,
    ControllableCollapsibleProps,
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
    ListItemComponentProps,
    
    List,
    
    
    
    // menu-components:
    DropdownListButtonProps,
    
    
    
    // composite-components:
    Group,
    
    
    
    // utility-components:
    useDialogMessage,
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
    PartialModel,
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
import type {
    // types:
    ComplexEditModelDialogResult,
}                           from '@/components/dialogs/ComplexEditModelDialog'



// styles:
export const usePagedModelExplorerStyleSheet = dynamicStyleSheets(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'lm1zazz2r7' });
import './styles/styles';



// react components:

/* <ModelCreate> */
export type CloseEvent = string|false|null
export interface ModelCreateProps
    extends
        CollapsibleProps<ExpandedChangeEvent>,
        CollapsibleEventProps,
        ControllableCollapsibleProps<ExpandedChangeEvent>
{
}

export type CreateHandler<TModel extends Model> = (createdModel: PartialModel<TModel>) => void|Promise<void>

/* <ModelCreateOuter> */
export interface ModelCreateOuterProps<TModel extends Model>
    extends
        // bases:
        ListItemProps,
        
        // components:
        ListItemComponentProps<Element>
{
    // accessibilities:
    createItemText       ?: React.ReactNode
    
    
    
    // components:
    modelCreateComponent  : React.ReactComponentElement<any, ModelCreateProps> | (() => TModel|Promise<TModel>) | false
    moreButtonComponent  ?: React.ReactComponentElement<any, DropdownListButtonProps>
    
    
    
    // handlers:
    onCreated            ?: CreateHandler<TModel>
}
export const ModelCreateOuter = <TModel extends Model>(props: ModelCreateOuterProps<TModel>) => {
    // styles:
    const styleSheet = usePagedModelExplorerStyleSheet();
    
    
    
    // rest props:
    const {
        // accessibilities:
        createItemText,
        
        
        
        // components:
        modelCreateComponent,
        moreButtonComponent,
        listItemComponent = (<ListItem<Element> /> as React.ReactComponentElement<any, ListItemProps<Element>>),
        
        
        
        // handlers:
        onCreated,
    ...restListItemProps} = props;
    
    
    
    // dialogs:
    const {
        showDialog,
    } = useDialogMessage();
    
    
    
    // effects:
    const isMounted = useMountedFlag();
    
    
    
    // handlers:
    const handleShowDialog = useEvent(async (): Promise<void> => {
        // conditions:
        if (modelCreateComponent === false) return;
        
        
        
        // actions:
        const createdModel = (
            (typeof(modelCreateComponent) === 'function')
            ? await modelCreateComponent()
            : await showDialog<ComplexEditModelDialogResult<TModel>>(
                modelCreateComponent
            )
        );
        if (!isMounted.current) return; // the component was unloaded before awaiting returned => do nothing
        
        
        
        if (createdModel) { // if closed of created Model (ignores of canceled or deleted Model)
            onCreated?.(createdModel);
        } // if
    });
    
    
    
    // jsx:
    const addNewBUtton = (
        <ButtonIcon
            // appearances:
            icon='create'
            
            
            
            // classes:
            className='fluid'
            
            
            
            // states:
            enabled={
                (modelCreateComponent === false)
                ? false
                : true
            }
            
            
            
            // handlers:
            onClick={handleShowDialog}
        >
            {createItemText ?? 'Add New Item'}
        </ButtonIcon>
    );
    return React.cloneElement<ListItemProps<Element>>(listItemComponent,
        // props:
        {
            // other props:
            ...restListItemProps,
            
            
            
            // classes:
            className : `${styleSheet.createModel} ${props.className}`,
        },
        
        
        
        // children:
        (
            !moreButtonComponent
            ?
            addNewBUtton
            :
            <Group>
                {addNewBUtton}
                {moreButtonComponent}
            </Group>
        ),
    );
};

/* <ModelPreview> */
export interface ModelPreviewProps<TModel extends Model, TElement extends Element = HTMLElement>
    extends
        // bases:
        Omit<ListItemProps<TElement>,
            'draggable' // reserved for <OrderableList>
        >
{
    // data:
    model : Pagination<TModel>['entities'][number]
}

/* <ModelEmpty> */
export const ModelEmpty = () => {
    // styles:
    const styleSheet = usePagedModelExplorerStyleSheet();
    
    
    
    // refs:
    const statusEmptyListRef = useRef<HTMLElement|null>(null);
    
    
    
    // jsx:
    return (
        <ListItem
            // refs:
            elmRef={statusEmptyListRef}
            
            
            
            // classes:
            className={styleSheet.emptyModel}
        >
            <p>
                The data is empty.
            </p>
        </ListItem>
    );
};

/* <PagedModelExplorer> */
export interface PagedModelExplorerProps<TModel extends Model>
    extends
        // bases:
        PagedModelExplorerInternalProps<TModel>
{
    // data:
    page                   : number
    perPage                : number
    setPage                : (page: number) => void
    setPerPage             : (perPage: number) => void
    getModelPaginationApi  : ModelPaginationStateProps<TModel>['getModelPaginationApi']
    
    
    
    // children:
    menusBefore           ?: React.ReactNode
    menusAfter            ?: React.ReactNode
}
const PagedModelExplorer         = <TModel extends Model>(props: PagedModelExplorerProps<TModel>): JSX.Element|null => {
    // styles:
    const styleSheet = usePagedModelExplorerStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        page,
        perPage,
        setPage,
        setPerPage,
        getModelPaginationApi,
        
        
        
        // children:
        menusBefore,
        menusAfter,
    ...restPagedModelExplorerProps} = props;
    
    
    
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
            <Section className={`fill-self ${styleSheet.main}`} theme='primary'>
                <div className={`toolbar ${styleSheet.toolbar}`}>
                    <div className='toolbarBefore'>
                        {menusBefore}
                    </div>
                    <div className='toolbarMain'>
                    </div>
                    <div className='toolbarAfter'>
                        {menusAfter}
                    </div>
                </div>
                <ModelPagination<TModel>
                    // paginations:
                    page={page}
                    perPage={perPage}
                    
                    
                    
                    // classes:
                    className={styleSheet.paginTop}
                    
                    
                    
                    // handlers:
                    onNavigateTo={handleNavigateTo}
                />
                <PagedModelExplorerInternal<TModel> {...restPagedModelExplorerProps} />
                <ModelPagination<TModel>
                    // paginations:
                    page={page}
                    perPage={perPage}
                    
                    
                    
                    // classes:
                    className={styleSheet.paginBtm}
                    
                    
                    
                    // handlers:
                    onNavigateTo={handleNavigateTo}
                />
            </Section>
        </ModelPaginationStateProvider>
    );
};
export {
    PagedModelExplorer,
    PagedModelExplorer as default,
}

/* <PagedModelExplorerInternal> */
interface PagedModelExplorerInternalProps<TModel extends Model>
    extends
        // data:
        Partial<Pick<ModelCreateOuterProps<TModel>,
            // accessibilities:
            |'createItemText'
            
            
            
            // components:
            |'modelCreateComponent'
        >>
{
    // components:
    modelPreviewComponent : React.ReactComponentElement<any, ModelPreviewProps<TModel, Element>>
}
const PagedModelExplorerInternal = <TModel extends Model>(props: PagedModelExplorerInternalProps<TModel>): JSX.Element|null => {
    // styles:
    const styleSheet = usePagedModelExplorerStyleSheet();
    
    
    
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
        <Basic className={`${styleSheet.listModel}${isDataEmpty ? ' empty' : ''}`} mild={true} elmRef={dataListRef}>
            <ModalLoadingError
                // data:
                isFetching={isFetching}
                isError={isError}
                refetch={refetch}
                
                
                
                // global stackable:
                viewport={dataListRef}
            />
            
            <List listStyle='flush' className={styleSheet.listModelInner}>
                {/* <ModelCreate> */}
                {!!modelCreateComponent  && <ModelCreateOuter<TModel> className='solid' createItemText={createItemText} modelCreateComponent={modelCreateComponent} />}
                
                {!!data && !data.total && <ModelEmpty />}
                
                {!!data?.total && Object.values(data?.entities).filter((model): model is Exclude<typeof model, undefined> => !!model).map((model) =>
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