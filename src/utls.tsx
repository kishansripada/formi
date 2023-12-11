import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import debounce from "lodash.debounce";
import React, { useDebugValue, useEffect, useState, useRef, useCallback } from "react";
import { formation } from "./types/types";
const supabase = createClientComponentClient();
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
      if (typeof window !== "undefined") {
         const userAgent = window.navigator.userAgent;
         const isTraditionalIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
         // Attempt to detect iPadOS 13 and later
         const isModerniPad = /Macintosh/.test(userAgent) && "ontouchend" in document;
         setIsIOS(isTraditionalIOS || isModerniPad);
      }
   }, []);

   return isIOS;
}

export const useUploadToSupabase = (dataKey: string, dataValue: any, danceId: string, enabled: boolean) => {
   const [saved, setSaved] = useState(true);
   // If viewOnlyInitial is true, immediately exit from the hook

   const upload = useCallback(
      debounce(async (dataValue) => {
         console.log(`uploading ${dataKey}`);
         const { data, error } = await supabase
            .from("dances")
            .update({ [dataKey]: dataValue, last_edited: new Date() })
            .eq("id", danceId);
         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 4000),
      [danceId]
   );

   useEffect(() => {
      if (!enabled) return;

      setSaved(false);
      upload(dataValue);
   }, [dataValue]);
   return saved;
};

export const useTimedPopup = (duration: number) => {
   const [showPopup, setShowPopup] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => {
         setShowPopup(true);
      }, duration);

      return () => clearTimeout(timer);
   }, [duration]);

   return [showPopup, setShowPopup];
};

export default useTimedPopup;

export function convertToCentimeters(feet: number, inches: number): number {
   const inchesToCentimeters = inches * 2.54;
   const feetToCentimeters = feet * 12 * 2.54;
   const totalCentimeters = inchesToCentimeters + feetToCentimeters;
   return Math.round(totalCentimeters * 10) / 10;
}

export function convertToFeetAndInches(centimeters: number): {
   feet: number;
   inches: number;
} {
   const inchesToCentimeters = 2.54;
   const inches = Math.round(centimeters / inchesToCentimeters);
   const feet = Math.floor(inches / 12);
   return { feet, inches: inches % 12 };
}

export function hexToRgba(hex: string, opacity: number): string {
   // Ensure the hex code starts with a '#'
   if (hex.charAt(0) !== "#") {
      hex = "#" + hex;
   }

   // Parse the r, g, b values
   let bigint = parseInt(hex.slice(1), 16);
   let r = (bigint >> 16) & 255;
   let g = (bigint >> 8) & 255;
   let b = bigint & 255;

   // Ensure opacity is between 0 and 1
   if (opacity < 0) {
      opacity = 0;
   }
   if (opacity > 1) {
      opacity = 1;
   }

   // Convert opacity from 0-1 to 0-255
   const alpha = Math.round(opacity * 255);

   // Convert alpha value to hex
   const alphaHex = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();

   // Return the rgba color
   return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}${alphaHex}`;
}

export function roundToHundredth(value: number): number {
   return Math.round(value * 100) / 100;
}

export const whereInFormation = (formations: formation[], position: number) => {
   let sum = 0;
   let currentFormationIndex = null;

   let percentThroughTransition;
   for (let i = 0; i < formations.length; i++) {
      sum = sum + formations[i].durationSeconds + (i === 0 ? 0 : formations[i]?.transition.durationSeconds);
      if (position < sum) {
         currentFormationIndex = i;
         if (currentFormationIndex === 0) break;
         let durationThroughTransition = position - (sum - formations[i]?.transition?.durationSeconds - formations[i].durationSeconds);

         if (durationThroughTransition < formations[i]?.transition?.durationSeconds) {
            percentThroughTransition = durationThroughTransition / formations[i]?.transition?.durationSeconds;
         }
         break;
      }
   }
   return { currentFormationIndex, percentThroughTransition };
};

type CookiesType = { [key: string]: string };

const getAllCookies = (): CookiesType => {
   return document.cookie.split(";").reduce((cookies, cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      if (name && value) {
         cookies[name] = value;
      }
      return cookies;
   }, {} as CookiesType);
};

const setAllCookies = (cookies: CookiesType): void => {
   for (const [name, value] of Object.entries(cookies)) {
      document.cookie = `${name}=${value}; path=/`;
   }
};

const useCookies = <T extends CookiesType>(initialCookies: T = {} as T): [T, React.Dispatch<React.SetStateAction<T>>] => {
   const [cookies, setCookies] = useState<T>(() => {
      return { ...initialCookies, ...getAllCookies() } as T;
   });

   useEffect(() => {
      setAllCookies(cookies);
   }, [cookies]);

   return [cookies, setCookies];
};

export default useCookies;

export const useSupabaseQuery = (supabaseQueryFn) => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   async function invalidate() {
      try {
         setLoading(true);

         // Call passed in Supabase query function
         const { data, error } = await supabaseQueryFn();
         console.log({ data });
         setData(data);
         setError(error);
      } catch (error) {
         setError(error);
      } finally {
         setLoading(false);
      }
   }
   useEffect(() => {
      invalidate();
   }, []);

   return {
      data: data || [],
      loading,
      error,
      invalidate,
   };
};
