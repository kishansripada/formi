import { cloudSettings, dancer, dancerPosition, formation, localSettings, stageDimensions } from "../../../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import { useStore } from "../../store";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "../../../../../../@/components/ui/dropdown-menu";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { HStack } from "../../../../../../@/components/ui/stacks";
import { Subtract } from "../../../../../../@/components/ui/button";
export const FormationIdeas: React.FC<{
   setLocalSettings: Function;
   localSettings: any;
   dropDownToggle: boolean;
   pushChange: Function;

   setHelpUrl: Function;
   setAssetsOpen: Function;
   setCurrentTemplate: Function;
   danceId: string;
}> = ({
   setLocalSettings,
   localSettings,
   dropDownToggle,
   pushChange,

   setHelpUrl,
   setAssetsOpen,
   setCurrentTemplate,
   danceId,
}) => {
   const {
      viewOnly,
      //   cloudSettings: { stageBackground, stageDimensions },
      cloudSettings,
      setCloudSettings,
      get,
      dancers,
   } = useStore();
   const [numDancers, setNumDancers] = useState(Math.min(Math.max(5, dancers.length), 15));
   const [templates, setTemplates] = useState([]);

   const supabase = createClientComponentClient();

   useEffect(() => {
      getTemplates().then((r) => setTemplates(r));
   }, [numDancers]);

   // const scalePositions = (templates: formation[], cloudSettings: cloudSettings) => {
   //    return templates.map((template) => {
   //       return {
   //          ...template,
   //          positions: template.positions.map((position) => {
   //             return {
   //                ...position,
   //                position: {
   //                   x: roundToHundredth((position.position?.x / cloudSettings.stageDimensions.width) * 2),
   //                   y: roundToHundredth((position?.position.y / cloudSettings.stageDimensions.height) * 2),
   //                },
   //             };
   //          }),
   //       };
   //    });
   // };

   const getTemplates = async () => {
      // const files = {
      //    9: "25644",
      //    10: "6008",
      // };

      // const { data } = await supabase.from("dances").select("*").eq("id", files[numDancers]).single();
      let { data, error } = await supabase.from("formation_templates").select("*").eq("number_of_performers", numDancers);
      //   console.log(data);

      data = data?.filter((template) => template.referece_performance_id !== danceId);
      return shuffle(data);
      // const templates = data.formations;
      // //   console.log();

      // return { templates, cloudSettings: data.settings };
   };
   return (
      <div className="overflow-hidden h-full flex flex-col">
         <div className="flex flex-row p-3 justify-between items-center">
            <p className="font-semibold text-xl whitespace-nowrap  ">Templates</p>

            {/* <Select
               onValueChange={(e) => {
                  setNumDancers(e);
               }}
               defaultValue={numDancers}
               className=""
            >
               <SelectTrigger className="w-[60px] h-[30px] bg-neutral-900 bg-transparent text-sm">
                  <SelectValue placeholder={dancers.length} />
               </SelectTrigger>
               <SelectContent>
                  {new Array(10).fill(null).map((val, index) => {
                     return <SelectItem value={index + 5}>{index + 5}</SelectItem>;
                  })}
               </SelectContent>
            </Select> */}
         </div>
         <HStack className="justify-between px-2">
            <DropdownMenu>
               <DropdownMenuTrigger asChild className="dark:hover:bg-neutral-600 mt-[6px] hover:bg-neutral-200 cursor-pointer rounded-md">
                  <div className=" py-1 px-3 h-[26px] w-38  flex flex-row items-center  ">
                     <p className=" text-xs ">{numDancers} dancers</p>
                  </div>
               </DropdownMenuTrigger>

               <DropdownMenuContent className=" dark:fill-white ">
                  {new Array(11).fill(null).map((val, index) => {
                     return (
                        <DropdownMenuItem
                           onClick={() => {
                              setNumDancers(index + 5);
                           }}
                           className="w-full  hover:bg-neutral-200 "
                        >
                           <div className="  py-1  text-xs   flex flex-row items-center">
                              <p>{index + 5} dancers</p>
                           </div>
                        </DropdownMenuItem>
                     );
                  })}
               </DropdownMenuContent>
            </DropdownMenu>

            <Subtract
               onClick={() => {
                  setCurrentTemplate(null);
               }}
            ></Subtract>
         </HStack>

         <div className="overflow-y-scroll h-full ">
            <div className="flex flex-col gap-3 p-3 ">
               {templates.map((template: formation) => {
                  return (
                     <button
                        style={{
                           minHeight: 100,
                        }}
                        onClick={() => {
                           setCurrentTemplate(template);
                        }}
                        className="w-full  bg-neutral-800 rounded-md relative hover:bg-neutral-700 transition"
                     >
                        <p className="text-neutral-300 text-xs font-medium left-2 top-1 absolute">{template.name}</p>
                        {template.positions.map((position) => {
                           return (
                              <div
                                 style={{
                                    left: position.left + "%",
                                    top: position.top + "%",
                                 }}
                                 className="absolute w-[6px] h-[6px] -translate-x-1/2 -translate-y-1/2 bg-neutral-300 rounded-full"
                              ></div>
                           );
                        })}
                     </button>
                  );
               })}
            </div>
         </div>
      </div>
   );
};

function shuffle(array) {
   let currentIndex = array.length,
      randomIndex;

   // While there remain elements to shuffle.
   while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
   }

   return array;
}
