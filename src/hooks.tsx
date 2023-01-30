// import { useState, useEffect } from "react";

// export function useLocalStorage<T>(key: string, fallbackValue: T) {
//    const [value, setValue] = useState(fallbackValue);
//    useEffect(() => {
//       const stored = localStorage.getItem(key);
//       setValue(stored ? JSON.parse(stored) : fallbackValue);
//    }, [fallbackValue, key]);

//    useEffect(() => {
//       localStorage.setItem(key, JSON.stringify(value));
//    }, [key, value]);

//    return [value, setValue] as const;
// }

import React, { useDebugValue, useEffect, useState } from "react";

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
