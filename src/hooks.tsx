import React, { useDebugValue, useEffect, useState, useRef } from "react";

export const useLocalStorage = <S,>(key: string, initialState?: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>] => {
   const [state, setState] = useState<S>(initialState as S);
   useDebugValue(state);

   useEffect(() => {
      const item = localStorage.getItem(key);
      if (item) setState(parse(item));
   }, []);

   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
   }, [state]);

   return [state, setState];
};

const parse = (value: string) => {
   try {
      return JSON.parse(value);
   } catch {
      return value;
   }
};

export function useHorizontalScrollInfo(dependency) {
   const ref = useRef(null);
   const [scrollInfo, setScrollInfo] = useState({
      scrollLeft: 0,
      scrollWidth: 0,
      clientWidth: 0,
   });

   useEffect(() => {
      const updateScrollInfo = () => {
         if (ref.current) {
            const element = ref.current;
            setScrollInfo({
               scrollLeft: element.scrollLeft,
               scrollWidth: element.scrollWidth,
               clientWidth: element.clientWidth,
            });
         }
      };

      const handleScroll = () => {
         requestAnimationFrame(updateScrollInfo);
      };

      if (ref.current) {
         ref.current.addEventListener("scroll", handleScroll);
      }

      updateScrollInfo(); // Trigger update on dependency change

      return () => {
         if (ref.current) {
            ref.current.removeEventListener("scroll", handleScroll);
         }
      };
   }, [ref, dependency]);

   return [ref, scrollInfo];
}
