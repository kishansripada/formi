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

export const useClickOutside = (ref, handler) => {
   useEffect(() => {
      let startedInside = false;
      let startedWhenMounted = false;

      const listener = (event) => {
         // Do nothing if `mousedown` or `touchstart` started inside ref element
         if (startedInside || !startedWhenMounted) return;
         // Do nothing if clicking ref's element or descendent elements
         if (!ref.current || ref.current.contains(event.target)) return;

         handler(event);
      };

      const validateEventStart = (event) => {
         startedWhenMounted = ref.current;
         startedInside = ref.current && ref.current.contains(event.target);
      };

      document.addEventListener("mousedown", validateEventStart);
      document.addEventListener("touchstart", validateEventStart);
      document.addEventListener("click", listener);

      return () => {
         document.removeEventListener("mousedown", validateEventStart);
         document.removeEventListener("touchstart", validateEventStart);
         document.removeEventListener("click", listener);
      };
   }, [ref, handler]);
};

export const useIsDesktop = () => {
   if (typeof window === "undefined") return;
   const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

   const checkScreenSize = () => {
      if (typeof window === "undefined") return;
      setIsDesktop(window.innerWidth > 1024);
   };

   useEffect(() => {
      checkScreenSize();
      if (typeof window === "undefined") return;
      window.addEventListener("resize", checkScreenSize);

      // Clean up event listener on component unmount
      return () => window.removeEventListener("resize", checkScreenSize);
   }, []);

   return isDesktop;
};

export function useIsIOS() {
   const [isIOS, setIsIOS] = useState(false);

   useEffect(() => {
      // Check if the platform is iOS by examining the user agent
      if (typeof window !== "undefined") {
         const userAgent = window.navigator.userAgent;
         const isiPhoneOriPad = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
         setIsIOS(isiPhoneOriPad);
      }
   }, []);

   return isIOS;
}
