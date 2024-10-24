// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useRef,
}                           from 'react'

// reusable-ui core:
import {
    // a set of React node utility functions:
    flattenChildren,
    isTruthyNode,
    
    
    
    // react helper hooks:
    useMergeRefs,
    useIsRtl,
}                           from '@reusable-ui/core'            // a set of reusable-ui packages which are responsible for building any component

// reusable-ui components:
import {
    // react components:
    ImperativeScroll,
    CarouselProps,
    Carousel,
}                           from '@reusable-ui/carousel'        // a slideshow component for cycling through images, slides, or another elements
import {
    // react components:
    List,
}                           from '@reusable-ui/list'            // represents a series of content
import {
    // react components:
    NavscrollProps,
    Navscroll,
}                           from '@reusable-ui/navscroll'       // a navigation component to navigate within current page, based on scroll position
import {
    // react components:
    ListItem,
    Pagination,
    NavPrevItem,
    NavNextItem,
}                           from '@reusable-ui/pagination'      // a list of huge page numbers with limited displayed list



const MiniCarousel = (props: CarouselProps) => {
    // cultures:
    const [isRtl, setCarouselElmRef] = useIsRtl();
    
    
    
    // children:
    const childrenArray = flattenChildren(props.children).filter(isTruthyNode);
    
    
    
    // rest props:
    const {
        // refs:
        elmRef,
        scrollRef,
        
        
        
        // components:
        prevButtonComponent = null,
        nextButtonComponent = null,
        navscrollComponent  = (<Navscroll<Element>
            // variants:
            size='sm'
            
            
            
            // components:
            navComponent={
                (childrenArray.length > 1)
                ? <Pagination
                    itemsLimit={3}
                    prevItems={
                        <NavPrevItem
                            onClick={() => scrollRefInternal.current?.scrollPrev()}
                        />
                    }
                    nextItems={
                        <NavNextItem
                            onClick={() => scrollRefInternal.current?.scrollNext()}
                        />
                    }
                />
                : <List actionCtrl={childrenArray.length > 1} />
            }
        >
            {childrenArray.map((child, index: number) =>
                <ListItem
                    // identifiers:
                    key={index}
                    
                    
                    
                    // semantics:
                    tag='button'
                    
                    
                    
                    // variants:
                    size='sm'
                >
                    {index + 1}
                </ListItem>
            )}
        </Navscroll> as React.ReactComponentElement<any, NavscrollProps<Element>>),
    ...restCarouselProps} = props;
    
    
    
    // refs:
    const mergedCarouselRef = useMergeRefs<HTMLElement>(
        // preserves the original `elmRef`:
        elmRef,
        
        
        
        setCarouselElmRef,
    );
    
    const scrollRefInternal = useRef<(HTMLElement & ImperativeScroll)|null>(null);
    const mergedScrollRef = useMergeRefs<HTMLElement>(
        // preserves the original `scrollRef`:
        scrollRef,
        
        
        
        scrollRefInternal,
    );
    
    
    
    // jsx:
    return (
        <Carousel
            // other props:
            {...restCarouselProps}
            
            
            
            // refs:
            elmRef={mergedCarouselRef}
            scrollRef={mergedScrollRef}
            
            
            
            // components:
            prevButtonComponent={prevButtonComponent}
            nextButtonComponent={nextButtonComponent}
            navscrollComponent ={navscrollComponent }
        >
            {...childrenArray}
        </Carousel>
    )
};
export {
    MiniCarousel,
    MiniCarousel as default,
}
