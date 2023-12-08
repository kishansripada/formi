import React, { useEffect, useState } from "react";
import { Add, Subtract } from "./ui/button";

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
      <div className=" flex flex-col gap-2 py-2 ">
         <div className="flex flex-row items-center justify-between px-2">
            <p className=" font-medium text-xs">{label}</p>
            <div className="flex flex-row items-center gap-2">
               {canSubtract ? <Subtract onClick={() => onSubtract()}></Subtract> : null}
               {canAdd ? <Add onClick={() => onAdd()}></Add> : null}
            </div>
         </div>
         {isOpen ? <>{children}</> : null}
      </div>
   );
};

export default PropertyAdd;
