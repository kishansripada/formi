import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { Dropdown } from "./Dropdown";

export const AudioFiles: React.FC<{ audioFiles: any }> = ({ audioFiles }) => {
   return (
      <>
         <h1 className="mt-16 text-2xl">my uploaded audio files</h1>
         <div className="w-full flex flex-row overflow-x-scroll mt-7 removeScrollBar h-full overscroll-contain">
            {audioFiles.data
               .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
               .map((audioFile) => {
                  return (
                     <div>
                        <div className="bg-gray-200 rounded-xl w-[200px] h-[100px] mr-3 grid place-items-center">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-10 h-10 stroke-gray-500"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                              />
                           </svg>
                        </div>
                        <p className="font-bold">{audioFile.name}</p>
                        <p className="text-sm text-gray-500">{timeSince(audioFile.created_at)} ago</p>
                     </div>
                  );
               })}
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
