'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// cssfn:
import {
    // style sheets:
    dynamicStyleSheet,
}                           from '@cssfn/cssfn-react'               // writes css in react hook

// reusable-ui core:
import {
    // react helper hooks:
    useEvent,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // layout-components:
    ListItem,
    
    
    
    // composite-components:
    PaginationProps,
    Pagination as PaginationControl,
    NavPrevItem,
    NavNextItem,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// heymarco components:
import {
    LoadingBar,
}                           from '@heymarco/loading-bar'

// internals:
import type {
    Model,
}                           from './types'
// internals:
import {
    // states:
    usePaginationDataState,
}                           from './states/paginationDataState'



// styles:
export const usePaginationDataListStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/paginationDataListStyles')
, { id: 'k1h5chza4a' });
import './styles/paginationDataListStyles';



// react components:
export interface PaginationDataListProps<TElement extends Element = HTMLElement>
    extends
        PaginationProps<TElement>
{
    // paginations:
    page           : number,
    perPage        : number,
    
    
    
    // handlers:
    onNavigateTo   : (page: number) => void
}
const PaginationDataList = <TModel extends Model, TElement extends Element = HTMLElement>(props: PaginationDataListProps<TElement>): JSX.Element|null => {
    // styles:
    const styles = usePaginationDataListStyleSheet();
    
    
    
    // rest props:
    const {
        // paginations:
        page,
        perPage,
        
        
        
        // handlers:
        onNavigateTo,
    ...restPaginationProps} = props;
    
    
    
    // states:
    const {
        // data:
        data,
        isFetching,
        isError,
    } = usePaginationDataState<TModel>();
    const pages = Math.ceil((data?.total ?? 0) / perPage);
    
    
    
    // handlers:
    const handleNavigatePrev = useEvent((): void => {
        onNavigateTo(1); // goto first page
    });
    const handleNavigateNext = useEvent((): void => {
        onNavigateTo(pages); // goto last page
    });
    
    
    
    // jsx:
    return (
        <PaginationControl<TElement>
            // other props:
            {...restPaginationProps}
            
            
            
            // paginations:
            itemsLimit={props.itemsLimit ?? 20}
            
            
            
            // variants:
            size={props.size ?? 'sm'}
            theme={props.theme ?? 'primary'}
            
            
            
            // components:
            prevItems={
                <NavPrevItem
                    onClick={handleNavigatePrev}
                />
            }
            nextItems={
                <NavNextItem
                    onClick={handleNavigateNext}
                />
            }
        >
            {!data && <ListItem actionCtrl={false} nude={true}><LoadingBar className={styles.main}
                nude={true}
                running={isFetching}
                theme={isError ? 'danger' : undefined}
            /></ListItem>}
            
            {[...Array(pages)].map((_, index) =>
                <ListItem
                    key={index}
                    
                    active={(index + 1) === page}
                    onClick={() => onNavigateTo(index + 1)}
                >
                    {index + 1}
                </ListItem>
            )}
        </PaginationControl>
    );
};
export {
    PaginationDataList,
    PaginationDataList as default,
}
