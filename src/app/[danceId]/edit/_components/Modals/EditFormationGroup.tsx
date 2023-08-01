import toast, { Toaster } from "react-hot-toast";
import { dancer, dancerPosition, formation, formationGroup } from "../../../../../types/types";
import { CirclePicker } from "react-color";
import { useState } from "react";

export const EditFormationGroup: React.FC<{
   setFormationGroups: Function;
   setIsEditingFormationGroup: Function;
   formationGroups: formationGroup[];
   isEditingFormationGroup: string | null;
}> = ({ setFormationGroups, setIsEditingFormationGroup, formationGroups, isEditingFormationGroup }) => {
   return (
      <div
         id="outside"
         className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
         onClick={(e: any) => {
            if (e.target.id === "outside") {
               setIsEditingFormationGroup(false);
            }
         }}
      >
         <div className="flex  flex-col rounded-xl bg-white pt-10 pb-10 px-10 ">
            <input
               className="h-6 w-full   px-3 py-4 transition duration-300  rounded-md bg-gray-100 text-gray-800 outline-none"
               value={formationGroups.find((formationGroup) => formationGroup.id === isEditingFormationGroup)?.name}
               onChange={(e) => {
                  setFormationGroups((formationGroups: formationGroup[]) => {
                     return formationGroups.map((formationGroup) => {
                        if (formationGroup.id === isEditingFormationGroup) {
                           return { ...formationGroup, name: e.target.value };
                        }
                        return formationGroup;
                     });
                  });
               }}
            ></input>

            <p className="mt-10 text-gray-700 text-medium mb-3">Color</p>
            <div className=" grid place-items-center">
               <CirclePicker
                  color={formationGroups.find((formationGroup) => formationGroup.id === isEditingFormationGroup)?.color}
                  onChangeComplete={(color) => {
                     setFormationGroups((formationGroups: formationGroup[]) => {
                        return formationGroups.map((group) => {
                           if (group.id === isEditingFormationGroup) {
                              return { ...group, color: color.hex };
                           }
                           return group;
                        });
                     });
                  }}
               />
            </div>

            <div className="flex flex-row justify-between mt-6">
               <button
                  className="bg-red-600  flex flex-row mt-6 text-white px-3 py-1 rounded-md "
                  onClick={() => {
                     setIsEditingFormationGroup(false);
                     setFormationGroups((formationGroups: formationGroup[]) => {
                        return formationGroups.filter((group) => group.id !== isEditingFormationGroup);
                     });
                  }}
               >
                  Delete Category
               </button>
            </div>
         </div>
      </div>
   );
};
