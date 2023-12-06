import React, { useEffect, useState } from "react";

const PropertyAdd = ({
   canAdd,
   canSubtract,
   isOpen,
   onAdd,
   onSubtract,
   children,
   label,
}: {
   canAdd: boolean;
   canSubtract: boolean;
   isOpen: boolean;
   onAdd: Function;
   onSubtract: Function;
   children: React.ReactNode;
   label: string;
}) => {
   return (
      <div className=" flex flex-col gap-2 border-neutral-700 border-t py-2 ">
         <div className="flex flex-row items-center justify-between px-2">
            <p className=" font-medium text-xs">{label}</p>
            <div className="flex flex-row items-center gap-2">
               {canSubtract ? (
                  <button onClick={() => onSubtract()} className="  md:text-xs text-[10px] hover:bg-neutral-800 p-1  cursor-default ">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                     </svg>
                  </button>
               ) : null}

               {canAdd ? (
                  <button onClick={() => onAdd()} className="hover:bg-neutral-800 p-1 cursor-default">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                     </svg>
                  </button>
               ) : null}
            </div>
         </div>

         {isOpen ? <>{children}</> : null}
      </div>
   );
};

export default PropertyAdd;
