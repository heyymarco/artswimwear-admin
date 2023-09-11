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


// reusable-ui components:
import {
    // layout-components:
    CardBody,
    
    
    
    // dialog-components:
    ModalExpandedChangeEvent,
    ModalCardProps,
    ModalCard,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components

// internals:
import type {
    Pagination,
    Model,
}                           from '@/libs/types'
import {
    MessageDataEmpty,
}                           from '@/components/MessageDataEmpty'



// styles:
export const useModalDataEmptyStyleSheet = dynamicStyleSheet(
    () => import(/* webpackPrefetch: true */ './styles/styles')
, { id: 'rjlvdfgr7h' , specificityWeight: 2});



// react components:
export interface ModalDataEmptyProps<TModel extends Model, TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>
    extends
        // bases:
        ModalCardProps<TElement, TModalExpandedChangeEvent>
{
    // data:
    data: Pagination<TModel>|undefined
}
export const ModalDataEmpty = <TModel extends Model, TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent = ModalExpandedChangeEvent>(props: ModalDataEmptyProps<TModel, TElement, TModalExpandedChangeEvent>): JSX.Element|null => {
    // styles:
    const styles = useModalDataEmptyStyleSheet();
    
    
    
    // rest props:
    const {
        // data:
        data,
    ...restModalCardProps} = props;
    const isDataEmpty = !!data && !data.total;
    
    
    
    // jsx:
    if (!isDataEmpty) return null;
    return (
        <ModalCard<TElement, TModalExpandedChangeEvent>
            // other props:
            {...restModalCardProps}
            
            
            
            // variants:
            theme={props.theme ?? 'secondary'}
            backdropStyle={props.backdropStyle ?? 'interactive'}
            
            
            
            // states:
            expanded={props.expanded ?? true}
        >
            <CardBody className={styles.main}>
                <MessageDataEmpty />
            </CardBody>
        </ModalCard>
    );
};