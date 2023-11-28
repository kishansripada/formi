import React, { useState } from "react";

const NumberToggle = ({ count, setCount, min, max, label }) => {
   const [newVal, setNewVal] = useState(count);

   const decrement = () => {
      if (count > min) {
         setCount(count - 1);
         setNewVal(count - 1);
      }
   };

   const increment = () => {
      if (count < max) {
         setCount(count + 1);
         setNewVal(count + 1);
      }
   };

   return (
      <div className="flex flex-row justify-between items-center text-black gap-2 w-min">
         <button onClick={decrement} className=" border-white rounded-md w-6 h-6 grid place-items-center cursor-default text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
         </button>
         <div className="flex flex-col items-center justify-center">
            <input
               value={newVal}
               onChange={(e) => {
                  setNewVal(e.target.value);
                  const test = parseFloat(e.target.value);
                  if (test > min && test < max) {
                     setCount(test);
                  }
               }}
               onBlur={() => {
                  const newValue = parseFloat(newVal);
                  if (!newValue || newValue < min || newValue > max) {
                     setNewVal(count.toString());
                     return;
                  }
                  setCount(newValue);
               }}
               className="text-xl font-medium text-white w-10 focus:outline-none bg-transparent text-center cursor-default "
            />
            <p className="text-[10px] text-neutral-400">{label}</p>
         </div>
         <button onClick={increment} className=" border-white rounded-md w-6 h-6 grid place-items-center cursor-default text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
         </button>
      </div>
   );
};

export default NumberToggle;
