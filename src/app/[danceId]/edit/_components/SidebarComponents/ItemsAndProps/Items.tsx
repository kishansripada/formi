import Script from "next/script";
import { useEffect, useState, useRef, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { formation, item, prop } from "../../../../../../types/types";
// import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useStore } from "../../../store";
import { Props } from "./Props";
import { useClickOutside } from "../../../../../../utls";
import { Add } from "../../../../../../../@/components/ui/button";
export const Items: React.FC<{
   audioFiles: any;

   setAudiofiles: Function;

   setLocalSource: Function;

   // items: item[];
   // setFormations: Function;

   propUploads: any;
   // setItems: Function;
   selectedPropIds: string[];
   invalidatePropUploads: Function;
   setSelectedPropIds: Function;
   pushChange: Function;

   // formations: formation[];
   setHelpUrl: Function;
   setAssetsOpen: Function;
}> = ({ setAssetsOpen, setHelpUrl, pushChange }) => {
   const { setFormations, formations, viewOnly, items, setItems, pauseHistory, resumeHistory, imageBlobs } = useStore();

   const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
   // console.log({ items });
   const thisItem = items.find((item) => item.id === selectedItemId);

   const setPropSide = (side: "left" | "right" | "top" | "bottom") => {
      setItems(
         items.map((item) => {
            if (selectedItemId === item.id) {
               return { ...item, side };
            }
            return item;
         })
      );
      pushChange();
   };

   const ref = useRef();
   const close = useCallback(() => setSelectedItemId(null), [setSelectedItemId]);
   useClickOutside(ref, close);

   return (
      <div className="flex flex-col h-full oveflow-hidden py-2  ">
         <div className=" font-medium mb-2 flex flex-row justify-between  items-center  text-xs px-2">
            <div
               className="flex flex-row item-center gap-2"
               video-url="https://player.vimeo.com/video/891149507?badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479"
            >
               <button allow="autoplay; fullscreen; picture-in-picture">Handheld props</button>
            </div>

            {!viewOnly ? (
               <Add
                  onClick={() => {
                     if (viewOnly) return;
                     // setItems([...items, { id: newId, name: "New prop" }]);

                     // setSelectedItemId(newId);
                     setAssetsOpen({ type: "item" });
                  }}
               ></Add>
            ) : null}
         </div>

         <div
            // style={{
            //    flexGrow: 1,
            // }}
            className="  flex-col   grid grid-cols-2 w-full min-h-0  removeScrollBar overflow-auto "
         >
            {items.length ? (
               [...items].reverse().map((item: item) => {
                  return (
                     <div
                        key={item.url}
                        onClick={() => {
                           setSelectedItemId(item.id);
                        }}
                        onDoubleClick={() => {
                           if (viewOnly) return;
                           setAssetsOpen({ type: "item", id: item.id });
                        }}
                        style={{
                           border: selectedItemId === item.id ? "2px solid #f9a8d4" : "2px solid transparent",
                        }}
                        //    selectedPropIds.includes(item.id)
                        className={` h-[100px] w-[100px] relative  group cursor-default  px-2 items-center   whitespace-nowrap  `}
                     >
                        {/* <input
                           className="text-xs  focus:outline-none bg-transparent w-full "
                           onChange={(e) => {
                              setItems(
                                 items.map((itemx) => {
                                    if (itemx.id === item.id) {
                                       return {
                                          ...itemx,
                                          name: e.target.value,
                                       };
                                    }
                                    return itemx;
                                 })
                              );
                           }}
                           value={item.name}
                           type="text"
                           readOnly={viewOnly}
                        /> */}
                        <img
                           // onClick={() => {
                           //    if (viewOnly) return;
                           //    setAssetsOpen({ type: "item", id: item.id });
                           // }}
                           draggable={false}
                           className="h-[100px] w-[100px]  object-contain  cursor-default  z-10 select-none "
                           src={imageBlobs[`https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${item.url}`]}
                           alt=""
                        />
                     </div>
                  );
               })
            ) : (
               <>
                  <p className=" px-4 text-sm">No props</p>
               </>
            )}
         </div>

         {selectedItemId ? (
            <div className=" h-[300px]  min-h-[300px] mt-auto ">
               <div
                  className="px-3 mt-3 "
                  style={{
                     pointerEvents: viewOnly ? "none" : "auto",
                  }}
               >
                  <div className="flex flex-col   w-full  ">
                     <p className="   text-xs mb-2 font-medium">Default width</p>
                     <div className="flex flex-row items-center border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden pl-1">
                        <input
                           // onBlur={pushChange}
                           defaultValue={thisItem?.width || 1}
                           type="number"
                           onChange={(e) => {
                              // check to make sure it's a number
                              if (isNaN(parseFloat(e.target.value))) {
                                 toast.error("Not a valid number");
                              }

                              setItems(
                                 items.map((itemx) => {
                                    if (itemx.id === selectedItemId) {
                                       return {
                                          ...itemx,
                                          width: parseFloat(e.target.value),
                                       };
                                    }
                                    return itemx;
                                 })
                              );
                           }}
                           onBlur={(e) => {
                              // check to make sure it's a number
                              if (isNaN(parseFloat(e.target.value))) {
                                 toast.error("Not a valid number");
                              }

                              setItems(
                                 items.map((itemx) => {
                                    if (itemx.id === selectedItemId) {
                                       return {
                                          ...itemx,
                                          width: parseFloat(e.target.value),
                                       };
                                    }
                                    return itemx;
                                 })
                              );
                           }}
                           style={{
                              borderRadius: 0,
                           }}
                           className="w-[45px] p-1 focus:outline-none rounded-md text-center bg-transparent    "
                        />
                        <p className="mx-1 text-xs">squares</p>
                     </div>
                     <p className="   text-xs mb-2 font-medium mt-3">Default side</p>
                     <div className="w-[100px] h-[100px]   grid grid-cols-3 grid-rows-3">
                        <div></div>
                        <div className="grid place-items-center">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className={`w-6 h-6 cursor-default transition ${
                                 thisItem?.side === "top" || !thisItem?.side ? "dark:stroke-white " : "stroke-neutral-400 dark:stroke-neutral-600"
                              }`}
                              onClick={() => setPropSide("top")}
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                              />
                           </svg>
                        </div>
                        <div></div>
                        <div className="grid place-items-center">
                           <svg
                              className={`w-6 h-6 cursor-default transition ${
                                 thisItem?.side === "left" ? "dark:stroke-white stroke-black" : "stroke-neutral-400 dark:stroke-neutral-600"
                              }`}
                              onClick={() => setPropSide("left")}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                              />
                           </svg>
                        </div>
                        <div className="rounded-full w-1/2 h-1/2 m-auto bg-pink-600"></div>
                        <div className="grid place-items-center">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className={`w-6 h-6 cursor-default transition ${
                                 thisItem?.side === "right" ? "dark:stroke-white stroke-black" : "stroke-neutral-400 dark:stroke-neutral-600"
                              }`}
                              onClick={() => setPropSide("right")}
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                              />
                           </svg>
                        </div>
                        <div></div>
                        <div className="grid place-items-center">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className={`w-6 h-6 cursor-default transition ${
                                 thisItem?.side === "bottom" ? "dark:stroke-white stroke-black" : "stroke-neutral-400 dark:stroke-neutral-600"
                              }`}
                              onClick={() => setPropSide("bottom")}
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                              />
                           </svg>
                        </div>
                        <div></div>
                     </div>
                  </div>
               </div>
               {!viewOnly && selectedItemId ? (
                  <div className=" p-2  ">
                     <div
                        style={{
                           opacity: selectedItemId ? 1 : 0.5,
                           pointerEvents: selectedItemId ? "all" : "none",
                        }}
                        onClick={(e) => {
                           if (viewOnly) return;
                           // Remove prop
                           pauseHistory();
                           e.stopPropagation();
                           // remove prop from all formations
                           setFormations(
                              formations.map((formation, i) => {
                                 return {
                                    ...formation,
                                    positions: formation.positions.map((position) => {
                                       return {
                                          ...position,
                                          itemId: position.itemId === selectedItemId ? null : position.itemId,
                                       };
                                    }),
                                 };
                              })
                           );

                           //  // remove prop from props
                           setItems(items.filter((p) => p.id !== selectedItemId));
                           setSelectedItemId(null);
                           resumeHistory();
                        }}
                        className="  w-full text-sm shadow-sm cursor-default select-none rounded-md font-semibold  grid place-items-center  bg-opacity-20 hover:bg-opacity-50 transition py-2 bg-red-500 dark:text-red-400 text-red-600   "
                     >
                        Delete Prop
                     </div>
                  </div>
               ) : null}
            </div>
         ) : null}
      </div>
   );
};
