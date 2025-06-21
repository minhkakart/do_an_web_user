import {useCallback, useRef, useEffect} from "react";

export const useDebounce = ({fn, delay = 1000}: {fn: () => void, delay?: number}) => {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fnRef = useRef(fn);

    fnRef.current = fn;

    const debouncedFn = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            fnRef.current();
        }, delay);
    }, [delay]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return debouncedFn;
};
