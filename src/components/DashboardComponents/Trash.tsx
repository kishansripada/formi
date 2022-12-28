import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { Dropdown } from "./Dropdown";

export const Trash: React.FC<{ trash: any; deleteDance: Function; removeFromTrash: Function }> = ({ trash, deleteDance, removeFromTrash }) => {
   return (
      <>
         <h1 className="mt-16 text-2xl">performance trash</h1>
         <div className="w-full flex flex-row overflow-x-scroll mt-7 removeScrollBar h-full overscroll-contain">
            {trash.length ? (
               trash
                  .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                  .map((dance) => {
                     return (
                        <>
                           <div className="flex flex-col items-center text-gray-700 mr-5 relative  ">
                              <div className="">
                                 <div className="bg-gray-200 rounded-xl h-[200px] w-[350px] flex flex-row justify-between items-center p-3  ">
                                    <button
                                       onClick={() => {
                                          deleteDance(dance.id);
                                       }}
                                       className="w-[48%] flex flex-col items-center justify-center rounded-xl bg-gray-300 h-full"
                                    >
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="w-6 h-6"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                          />
                                       </svg>
                                       <p>delete permanently</p>
                                    </button>

                                    <button
                                       onClick={() => {
                                          removeFromTrash(dance.id);
                                       }}
                                       className="w-[48%] flex flex-col items-center justify-center rounded-xl bg-gray-300 h-full"
                                    >
                                       <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="w-6 h-6"
                                       >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                       </svg>

                                       <p>remove from trash</p>
                                    </button>
                                 </div>
                                 <div className="flex flex-row justify-between w-full items-center">
                                    <div className="flex flex-col items-start  w-full">
                                       <p className="mt-1 font-semibold">{dance.name}</p>
                                       <p className=" text-xs text-gray-400">{timeSince(dance.last_edited)} ago</p>
                                    </div>
                                 </div>
                              </div>

                              {/* <svg
                                    onClick={() => {
                                       deleteDance(dance.id);
                                       setMyDances((dances) => {
                                          return dances.filter((mapDance) => mapDance.id !== dance.id);
                                       });
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                 </svg> */}
                              {/* {openPerformanceMenu === dance.id ? <Dropdown></Dropdown> : null} */}
                           </div>
                        </>
                     );
                  })
            ) : (
               <p>nothing here 🤷🏽‍♂️</p>
            )}
         </div>
      </>
   );
};

var timeSince = function (date: string) {
   if (typeof date !== "object") {
      date = new Date(date);
   }

   var seconds = Math.floor((new Date() - date) / 1000);
   var intervalType;

   var interval = Math.floor(seconds / 31536000);
   if (interval >= 1) {
      intervalType = "year";
   } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
         intervalType = "month";
      } else {
         interval = Math.floor(seconds / 86400);
         if (interval >= 1) {
            intervalType = "day";
         } else {
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
               intervalType = "hour";
            } else {
               interval = Math.floor(seconds / 60);
               if (interval >= 1) {
                  intervalType = "minute";
               } else {
                  interval = seconds;
                  intervalType = "second";
               }
            }
         }
      }
   }

   if (interval > 1 || interval === 0) {
      intervalType += "s";
   }

   return interval + " " + intervalType;
};
