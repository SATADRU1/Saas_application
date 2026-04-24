import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  status: "CanLoadMore" | "LoadingMore" | "Exhausted" | "LoadingFirstPage",
  LoadMore: (numItems: number) => void;
  LoadSize?: number; 
  observerEnable?: boolean;
}

export const useInfiniteScroll = ({
    status,
    LoadMore,
    LoadSize = 10,
    observerEnable = true
}: UseInfiniteScrollProps) => {
    const topElementRef = useRef<HTMLDivElement>(null);

    const handleLoadMore = useCallback(() => {
        if (status === "CanLoadMore") {
            LoadMore(LoadSize);
        }
    }, [status, LoadMore, LoadSize]);

    useEffect(() => {
        const topElement = topElementRef.current;
        if (!topElement) return;
        if (!observerEnable) return;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting ) {
                    handleLoadMore();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(topElement);

        return () => observer.disconnect();
    }, [observerEnable, status, handleLoadMore]);


    return{
        topElementRef,
        handleLoadMore,
        canLoadMore: status === "CanLoadMore",
        isLoadingMore: status === "LoadingMore",
        isLoadingFirstPage: status === "LoadingFirstPage",
        isExhausted: status === "Exhausted",
    }

}