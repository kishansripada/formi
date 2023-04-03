import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";

export const OrganizationPerformances: React.FC<{}> = ({}) => {
   let [openPerformanceMenu, setOpenPerformanceMenu] = useState<string | null>(null);
   let [myDances, setMyDances] = useState<[]>([]);
   let session = useSession();
   const supabase = useSupabaseClient();
   useEffect(() => {
      if (!session) {
         return;
      }

      supabase
         .rpc("all_organization_performances", {
            idd: session.user.id,
         })
         .select("*")
         .range(0, 9)
         .then((r) => {
            setMyDances(r?.data || []);
         });
   }, [session]);

   const clickHandler = (e) => {
      let isDropdown = e
         .composedPath()
         .map((elem) => elem.id)
         .includes("dropdown");

      if (!isDropdown) {
         setOpenPerformanceMenu(null);
      }
   };
   useEffect(() => {
      window.addEventListener("click", clickHandler);

      return () => {
         window.removeEventListener("click", clickHandler);
      };
   }, [openPerformanceMenu]);

   return (
      <>
         <h1 className="mt-16 text-2xl">Performances in your organization</h1>
         <p className=" font-medium lg:hidden">Create dances on your laptop and view them here</p>
         <div className="w-full flex flex-col lg:items-start lg:flex-row overflow-x-scroll mt-7 removeScrollBar h-full overscroll-contain items-center">
            {myDances.length ? (
               myDances
                  .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                  .map((dance) => {
                     return (
                        <>
                           <div key={dance.id} className="flex flex-col items-center text-gray-700 mr-5 relative cursor-pointer  ">
                              <Link key={dance.id} href={`/${dance.id}/edit`}>
                                 <div className="">
                                    <div className="bg-white rounded-xl h-[200px] w-[300px] relative border-gray-300 border  ">
                                       {dance.formations[0].positions.map((position) => {
                                          return (
                                             <>
                                                <div
                                                   className="absolute w-3 h-3 rounded-full border-2 border-pink-600 pointer-events-none"
                                                   style={{
                                                      left: `${
                                                         ((position.position.x + dance.settings.stageDimensions.width / 2) /
                                                            dance.settings.stageDimensions.width) *
                                                         100
                                                      }%`,
                                                      top: `${
                                                         ((position.position.y + dance.settings.stageDimensions.height / 2) /
                                                            dance.settings.stageDimensions.height) *
                                                         100
                                                      }%`,
                                                   }}
                                                ></div>
                                             </>
                                          );
                                       })}
                                       {/* {JSON.stringify(dance.settings.stageDimensions)} */}
                                    </div>
                                    <div className="flex flex-row justify-between w-full items-center">
                                       <div className="flex flex-col items-start  w-full">
                                          <p className="mt-1 font-semibold">{dance.name}</p>
                                          <p className=" text-xs text-gray-400">{timeSince(dance.last_edited)} ago</p>
                                       </div>
                                    </div>
                                 </div>
                              </Link>

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
                              {openPerformanceMenu === dance.id ? (
                                 <Dropdown
                                    setOpenPerformanceMenu={setOpenPerformanceMenu}
                                    invalidateDances={invalidateDances}
                                    dance={dance}
                                 ></Dropdown>
                              ) : null}
                           </div>
                        </>
                     );
                  })
            ) : (
               <p>looks like you don't have any dances</p>
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
