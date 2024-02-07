import { comment, initials } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useStore } from "../../store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DoubleClickInput } from "../../../../../../@/components/ui/double-click-input";
import { Button } from "../../../../../../@/components/ui/button";
import { AutoGrowTextArea } from "../../../../../../@/components/ui/auto-grow-text-area";
import { HDivider } from "../../../../../../@/components/ui/hdivider";
import { VStack } from "../../../../../../@/components/ui/stacks";
import { ObjectControls } from "../ObjectControls";

export const CurrentFormation: React.FC<{ setMenuOpen: Function; setLocalSettings: Function; setAssetsOpen: Function }> = ({
   setMenuOpen,
   setLocalSettings,
   setAssetsOpen,
}) => {
   const { formations, setFormations, viewOnly, selectedFormations, isUsingPenTool } = useStore();

   const thisFormation = useStore((state) => state.getFirstSelectedFormation());

   if (!thisFormation) return <></>;
   return (
      <div className=" flex    flex-col h-full w-full  justify-between  dark:text-neutral-200  ">
         <div className="flex flex-row items-center border-b dark:border-neutral-700  border-neutral-300  h-[40px]  ">
            <input
               style={{
                  minHeight: 39,
               }}
               className="font-medium w-full   h-full px-2  focus:border-pink-600 border-transparent border  transition text-lg dark:bg-transparent  outline-none  "
               onChange={(e) =>
                  setFormations(
                     formations.map((formation) => {
                        if (selectedFormations.includes(formation.id)) {
                           return {
                              ...formation,
                              name: e.target.value,
                           };
                        }
                        return formation;
                     })
                  )
               }
               disabled={viewOnly}
               value={thisFormation.name || ""}
            />
         </div>

         <div className="overflow-y-scroll removeScrollBar mb-auto h-full">
            <div className=" min-h-fit ">
               <ObjectControls setLocalSettings={setLocalSettings} setAssetsOpen={setAssetsOpen} setMenuOpen={setMenuOpen} />
            </div>
         </div>

         <div
            style={{
               minHeight: 200,
               height: 200,
            }}
         >
            {/* <HDivider /> */}
            <textarea
               value={thisFormation?.notes || ""}
               onChange={(e) => {
                  setFormations(
                     formations.map((formation) => {
                        if (selectedFormations.includes(formation.id)) {
                           return {
                              ...formation,
                              notes: e.target.value,
                           };
                        }
                        return formation;
                     })
                  );
               }}
               readOnly={viewOnly}
               style={{
                  minHeight: 200,
                  height: 200,
               }}
               className="dark:bg-neutral-900 transition bg-neutral-50 mt-auto w-full focus:outline-none p-3 text-sm border-t border-neutral-300 focus:border-pink-300 dark:border-neutral-600 dark:focus:border-pink-600 resize-none "
               cols={30}
               rows={9}
               placeholder="Formation notes..."
            ></textarea>
         </div>
      </div>
   );
};
