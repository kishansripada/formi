import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export const MyDances: React.FC<{ myDances: any; invalidateDances: Function; createNewDance: Function; subscription: any }> = ({
   myDances,
   invalidateDances,
   createNewDance,
   subscription,
}) => {
   let [openPerformanceMenu, setOpenPerformanceMenu] = useState<string | null>(null);
   const session = useSession();
   const clickHandler = (e) => {
      let isDropdown = e
         .composedPath()
         .map((elem) => elem.id)
         .includes("dropdown");

      if (!isDropdown) {
         setOpenPerformanceMenu(null);
      }
   };
   let router = useRouter();
   useEffect(() => {
      window.addEventListener("click", clickHandler);

      return () => {
         window.removeEventListener("click", clickHandler);
      };
   }, [openPerformanceMenu]);

   return (
      <>
         <style></style>
         {/* <div className=" overflow-hidden w-full"> */}
         <div className="border-b border-b-neutral-200 w-full flex flex-col h-20 min-h-[70px] justify-center text-sm font-medium">
            <p className="  ml-8">Recently edited</p>
         </div>
         {/* <div className="w-full "> */}
         <div className="w-full px-[32px] mt-[32px] lg:block hidden">
            <div
               onClick={() => {
                  // if (!subscription.plan.product && myDances.length > 0) {
                  //    router.push("/pricing");
                  //    return;
                  // }
                  createNewDance();
               }}
               className="border border-neutral-200 w-[300px]  rounded-md p-4 hover:bg-neutral-100 transition cursor-pointer  flex flex-row h-[70px]  items-center text-sm font-medium"
            >
               <svg className="w-6 h-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 224 266">
                  <path
                     fill="#DB2777"
                     fill-rule="evenodd"
                     d="M161.245 18.1005C158.62 15.475 155.059 14 151.346 14H12C5.37258 14 0 19.3726 0 26v228c0 6.627 5.37258 12 12 12h185c6.627 0 12-5.373 12-12V65.7107c0-.0534-.065-.0801-.102-.0424-.024.0234-.062.0234-.085 0l-47.568-47.5678Z"
                     clip-rule="evenodd"
                  />
                  <path
                     fill="#E2B7CA"
                     d="M156.218 68.1928c-.588.0269-1.072-.4569-1.045-1.0447l2.349-51.3186c.04-.8681 1.092-1.2759 1.706-.6614l48.97 48.9698c.614.6145.207 1.6663-.661 1.7061l-51.319 2.3488Z"
                  />
                  <circle cx="52.5" cy="80.5" r="24.5" fill="#fff" />
                  <circle cx="152.5" cy="214.5" r="24.5" fill="#fff" />
                  <path stroke="#fff" stroke-width="4" d="m126.5 166 26 19.5 24-19.5" />
                  <path stroke="#fff" stroke-width="4" d="M74 77c34.155.9274 82.837 44.816 78.76 109" />
               </svg>
               <p className=" text-semibold   ">New performance</p>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 ml-auto"
               >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
               </svg>
            </div>
         </div>

         <div className="w-full grid grid-cols-1 gap-[32px] p-[32px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 col-span-4 overflow-y-scroll   overscroll-contain items-center">
            {myDances.length ? (
               myDances
                  .sort((a, b) => new Date(b.last_edited) - new Date(a.last_edited))
                  .map((dance) => {
                     return (
                        <>
                           <div
                              key={dance.id}
                              onContextMenu={(e) => {
                                 e.preventDefault();
                                 setOpenPerformanceMenu(dance.id);
                              }}
                              className="flex flex-col items-center  text-neutral-700 w-full relative cursor-pointer  "
                           >
                              <Link href={`/${dance.id}/edit`}>
                                 <div className="w-full border-neutral-200 border  rounded-md">
                                    <div className="bg-neutral-100 rounded-md min-h-[150px]  w-full relative  ">
                                       {dance.formations.positions.map((position) => {
                                          return (
                                             <>
                                                <div
                                                   className="absolute w-3 h-3  rounded-full border-2 bg-pink-600 pointer-events-none"
                                                   style={{
                                                      left: `${
                                                         ((position.position.x + dance.settings.stageDimensions.width / 2) /
                                                            dance.settings.stageDimensions.width) *
                                                         100
                                                      }%`,
                                                      top: `${
                                                         ((-position.position.y + dance.settings.stageDimensions.height / 2) /
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
                                    <div className="flex flex-row justify-start items-center w-full  px-3 py-1">
                                       <svg className="w-6 h-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 224 266">
                                          <path
                                             fill="#DB2777"
                                             fill-rule="evenodd"
                                             d="M161.245 18.1005C158.62 15.475 155.059 14 151.346 14H12C5.37258 14 0 19.3726 0 26v228c0 6.627 5.37258 12 12 12h185c6.627 0 12-5.373 12-12V65.7107c0-.0534-.065-.0801-.102-.0424-.024.0234-.062.0234-.085 0l-47.568-47.5678Z"
                                             clip-rule="evenodd"
                                          />
                                          <path
                                             fill="#E2B7CA"
                                             d="M156.218 68.1928c-.588.0269-1.072-.4569-1.045-1.0447l2.349-51.3186c.04-.8681 1.092-1.2759 1.706-.6614l48.97 48.9698c.614.6145.207 1.6663-.661 1.7061l-51.319 2.3488Z"
                                          />
                                          <circle cx="52.5" cy="80.5" r="24.5" fill="#fff" />
                                          <circle cx="152.5" cy="214.5" r="24.5" fill="#fff" />
                                          <path stroke="#fff" stroke-width="4" d="m126.5 166 26 19.5 24-19.5" />
                                          <path stroke="#fff" stroke-width="4" d="M74 77c34.155.9274 82.837 44.816 78.76 109" />
                                       </svg>
                                       <div>
                                          <p className="mt-1 text-sm font-semibold">{dance.name}</p>
                                          <p className=" text-xs text-neutral-500">Edited {timeSince(dance.last_edited)} ago</p>
                                          <p className=" text-xs text-neutral-500">
                                             {dance.user != session.user.id ? "Shared with me" : "Owned by me"}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </Link>

                              {openPerformanceMenu === dance.id ? (
                                 <Dropdown
                                    setOpenPerformanceMenu={setOpenPerformanceMenu}
                                    invalidateDances={invalidateDances}
                                    dance={dance}
                                    isMine={dance.user == session.user.id}
                                 ></Dropdown>
                              ) : null}
                           </div>
                        </>
                     );
                  })
            ) : (
               <p>Looks like you don't have any performances</p>
            )}
         </div>
         {/* </div> */}
         {/* </div> */}
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
