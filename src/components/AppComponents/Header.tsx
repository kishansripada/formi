import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formation, localSettings } from "../../types/types";
import { useRouter } from "next/router";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import Dropdown from "../AppComponents/Dropdown";
export const Header: React.FC<{
   saved: boolean;
   danceName: string;
   setDanceName: Function;
   undo: Function;
   setShareIsOpen: Function;
   viewOnly: boolean;
   setFormations: Function;
   onlineUsers: any;

   pricingTier: string;
   setUpgradeIsOpen: Function;
   localSettings: localSettings;
   setLocalSettings: Function;
   userPositions: any;
   setSelectedFormation: Function;
   setViewOnly: Function;
   viewOnlyInitial: boolean;
   setIsCommenting: Function;
   selectedDancers: string[];
   selectedFormation: number | null;
   pushChange: Function;
   isCommenting: boolean;
   isChangingCollisionRadius: boolean;
   setIsChangingCollisionRadius: Function;
}> = ({
   saved,
   danceName,
   setDanceName,
   setShareIsOpen,
   viewOnly,
   setFormations,
   onlineUsers,
   undo,

   pricingTier,
   setUpgradeIsOpen,
   localSettings,
   setLocalSettings,
   userPositions,
   setSelectedFormation,
   setViewOnly,
   viewOnlyInitial,
   setIsCommenting,
   selectedDancers,
   selectedFormation,
   pushChange,
   isCommenting,
   isChangingCollisionRadius,
   setIsChangingCollisionRadius,
}) => {
   const router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();

   return (
      <>
         <div className=" min-h-[50px] bg-neutral-800 flex flex-row items-center w-full  text-white border-b border-neutral-700 ">
            <div className="flex flex-row items-center justify-start w-1/3 h-full">
               <Link className="" href={`/${session ? "dashboard" : "login"}`}>
                  <svg className="w-10 h-10 ml-5 mr-3 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 59 125">
                     <path fill="#DB2777" d="M0 90h59v24H0z" />
                     <path fill="#F5F5F5" d="M6.63707 102V25.6364H57.1982v13.3114H22.7823v18.196h31.06v13.3115h-31.06V102H6.63707Z" />
                  </svg>
               </Link>
               <button
                  onClick={() =>
                     setLocalSettings((localSettings: localSettings) => {
                        return { ...localSettings, viewingTwo: true, viewingThree: false };
                     })
                  }
                  className={` ${localSettings.viewingTwo ? "bg-pink-600" : ""} group grid h-full  text-sm   place-items-center  w-12 `}
               >
                  <p className="">2D</p>
               </button>
               <button
                  onClick={() =>
                     setLocalSettings((localSettings: localSettings) => {
                        return { ...localSettings, viewingTwo: false, viewingThree: true };
                     })
                  }
                  className={` ${localSettings.viewingThree ? "bg-pink-600" : ""}  group hidden lg:grid h-full  text-sm   place-items-center  w-12 `}
               >
                  <p className="">{"3D"}</p>
               </button>

               <button
                  onClick={() => {
                     setLocalSettings((localSettings: localSettings) => {
                        return {
                           ...localSettings,
                           viewCollisions: !localSettings.viewCollisions,
                        };
                     });
                     if (!localSettings.viewCollisions) {
                        setIsChangingCollisionRadius(true);
                     }
                  }}
                  style={{
                     backgroundColor: localSettings.viewCollisions ? "#db2777" : "transparent",
                  }}
                  className=" h-full w-12 grid place-items-center relative"
               >
                  <svg className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 457.68 457.68">
                     <path d="m453.822 195.374-58.311-44.323 45.737-40.447c3.195-2.825 4.189-7.396 2.455-11.292-1.733-3.896-5.779-6.215-10.03-5.738l-61.163 6.943 26.917-68.152c1.591-4.027.341-8.622-3.07-11.288-3.412-2.665-8.17-2.77-11.696-.254L318.889 67.78l-14.022-54.566c-1.041-4.05-4.543-6.989-8.712-7.311-4.157-.317-8.081 2.044-9.731 5.886L262.659 67.11l-66.396-34.183c-4.117-2.12-9.157-1.059-12.068 2.541-2.913 3.599-2.901 8.748.031 12.333l42.625 52.133-45.023 21.367c-3.829 1.817-6.05 5.895-5.499 10.098.551 4.203 3.748 7.571 7.916 8.34l46.369 8.554s10.757 1.677 16.309 10.642c.044.072.116.122.175.181l9.481-10.928c2.297-2.648 3-6.324 1.841-9.633s-4.002-5.744-7.449-6.38l-33.463-6.174 28.999-13.762c2.714-1.288 4.685-3.753 5.345-6.684.659-2.932-.067-6.003-1.97-8.329l-20.773-25.407 33.922 17.464c2.408 1.24 5.227 1.425 7.776.508 2.551-.916 4.606-2.85 5.675-5.34l16.59-38.618 10.435 40.61c.802 3.121 3.09 5.645 6.117 6.749s6.403.643 9.025-1.228l50.452-36.021-20.746 52.529c-1.26 3.191-.754 6.81 1.332 9.533 2.087 2.723 5.456 4.155 8.858 3.766l46.548-5.284-31.451 27.814c-2.193 1.939-3.401 4.758-3.292 7.682.108 2.925 1.522 5.646 3.851 7.418l30.374 23.087-31.878-7.801c-3.224-.787-6.633.114-9.044 2.399-2.41 2.284-3.496 5.637-2.882 8.901l6.75 35.854-27.148-33.493c-2.056-2.537-5.248-3.886-8.497-3.576-3.252.302-6.138 2.209-7.69 5.082l-20.833 38.531-8.793-52.25c-.463-2.753-2.081-5.175-4.445-6.658-2.33-1.46-5.208-1.895-7.931-1.101l-25.402 7.419c.817 3.021 1.263 6.163 1.303 9.372l.133 10.569 18.893-5.518 11.684 69.435c.692 4.114 3.92 7.335 8.036 8.018 4.118.685 8.211-1.322 10.195-4.993l27.384-50.648 42.275 52.154c2.817 3.475 7.636 4.595 11.697 2.714 4.06-1.88 6.325-6.278 5.497-10.675l-11.098-58.949 62.802 15.369c4.493 1.097 9.151-1.107 11.143-5.286 1.996-4.178.782-9.182-2.904-11.983z" />
                     <circle cx="115.693" cy="200.763" r="35.901" />
                     <path d="m320.305 412.487-69.806-35.484c-2.952-1.502-6.236-2.284-9.609-2.257l-103.278.945 78.446-17.485 13.552-13.011 3.346 9.424 7.753-.071c6.8-.029 13.217 1.536 18.943 4.449l23.151 11.768-24.996-70.408c-2.383-6.712-8.037-11.737-14.983-13.315-6.944-1.577-14.216.51-19.266 5.533l-30.721 30.561c-7.876-32.024-5.631-22.898-11.418-46.429l44.549-12.322c7.584-2.098 12.802-9.045 12.703-16.914l-.782-62.048c-.12-9.563-7.97-17.222-17.539-17.103-9.563.121-17.224 7.97-17.103 17.54l.613 48.694-36.492 10.094c-5.532-3.879-12.643-5.444-19.719-3.704-45.884 11.284-43.007 10.473-45.305 11.4l17.54 8.809-64.43-13.751-22.017-55.728c-3.524-8.917-13.646-13.234-22.475-9.746-8.89 3.511-13.262 13.573-9.746 22.475l25.429 64.366c2.12 5.366 6.79 9.358 12.495 10.576l71.148 15.184-18.879.384c5.13 20.86 20.61 83.804 26.398 107.341l.031-.041c2.497 8.697 10.492 15.049 19.96 15.049.064 0 .128 0 .192-.001l98.198-.9 65.277 33.182c10.257 5.212 22.759 1.101 27.95-9.11 5.203-10.231 1.124-22.744-9.11-27.946z" />
                  </svg>
               </button>
               {isChangingCollisionRadius ? (
                  <div className="w-[200px] left-12 h-[80px] bg-neutral-800 absolute top-12 flex flex-col  text-sm" id="dropdown-menu">
                     <p className="font-semibold ml-2 mt-1">Collision Radius</p>
                     <div className="flex flex-row items-center border border-neutral-200 mt-auto m-1">
                        <input
                           value={localSettings.collisionRadius}
                           type="number"
                           step="0.1"
                           onChange={(e) => {
                              if (parseFloat(e.target.value) > 3 || parseFloat(e.target.value) < 0) return;
                              setLocalSettings((localSettings: localSettings) => {
                                 return { ...localSettings, collisionRadius: parseFloat(e.target.value) };
                              });
                           }}
                           style={{
                              borderRadius: 0,
                           }}
                           className="w-full p-1 focus:outline-none rounded-none text-center text-white bg-transparent  "
                        />
                        <p className="mx-1">Squares</p>
                     </div>
                  </div>
               ) : null}

               <button
                  onClick={() =>
                     setLocalSettings((settings: localSettings) => {
                        return { ...settings, stageFlipped: !localSettings.stageFlipped };
                     })
                  }
                  className=" hidden lg:block h-full text-xs  w-12  py-2 "
               >
                  <div className="flex flex-row items-center justify-center ">
                     <svg className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                        <path d="M480 976q-140 0-248-86T93 667h61q30 111 120.5 180T480 916q98 0 180.5-50.5T788 728H657v-61h223v229h-59V787q-57 88-147 138.5T480 976Zm1-299q-42 0-72-30t-30-72q0-42 30-72t72-30q42 0 72 30t30 72q0 42-30 72t-72 30ZM80 484V256h60v107q57-88 146.5-137.5T480 176q140 0 248.5 85.5T868 484h-61q-30-111-121-180t-206-69q-97 0-179 51T173 423h131v61H80Z" />
                     </svg>
                  </div>
               </button>

               {!viewOnlyInitial ? (
                  <div
                     onClick={() => {
                        setViewOnly((x: boolean) => !x);
                     }}
                     style={{
                        backgroundColor: viewOnly ? "#db2777" : "transparent",
                     }}
                     className=" w-12 grid place-items-center h-full    cursor-pointer "
                  >
                     {viewOnly ? (
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
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                           />
                        </svg>
                     ) : (
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
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                           />
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                     )}
                  </div>
               ) : null}
               <button
                  style={{
                     backgroundColor: isCommenting ? "#db2777" : "transparent",
                  }}
                  className="w-12   h-full grid place-items-center"
                  onClick={() => {
                     setIsCommenting((isCommenting: boolean) => {
                        if (!isCommenting && !localSettings.viewingTwo) {
                           toast.error("You must be in 2D mode to comment");
                           return isCommenting;
                        }

                        return !isCommenting;
                     });
                  }}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth={1.5}
                     stroke="currentColor"
                     className="w-6 h-6 "
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                     />
                  </svg>
               </button>
            </div>
            {/* 
            {!viewOnly ? (
               <>
                  {saved ? (
                     <></>
                  ) : (
                     <div className="flex flex-row items-center  ml-3">
                        <p className="text-neutral-500 text-sm">saving...</p>
                     </div>
                  )}
               </>
            ) : (
               <p className="text-neutral-500 ml-6 lg:ml-0">viewing</p>
            )} */}

            <input
               value={danceName}
               onChange={(e) => setDanceName(e.target.value)}
               onClick={(e) => {
                  e.target.select();
               }}
               placeholder={"Performance name"}
               className={`h-6 text-center  px-3 py-4 w-1/3 bg-neutral-800 mx-auto text-xs  rounded-md   text-white  outline-none  ${
                  viewOnly ? "pointer-events-none" : ""
               } `}
            />

            <div className=" flex flex-row items-center justify-end mr-3 w-1/3 ">
               <a href="https://forms.gle/qTo1MAenHpguvsXW7" target={"_blank"} className="text-xs mr-6 text-neutral-100 hidden lg:block">
                  Send Feedback/Report Bug
               </a>

               {onlineUsers
                  ? Object.keys(onlineUsers).map((id, i) => {
                       return (
                          <>
                             <div
                                key={id}
                                onClick={() => {
                                   setSelectedFormation(userPositions?.[id]?.selectedFormation || 0);
                                }}
                                style={{
                                   border: "3px solid",
                                   borderColor: onlineUsers[id][0].color,
                                }}
                                className="bg-white grid place-items-center w-9 select-none cursor-pointer  h-9 rounded-full mr-2"
                             >
                                <img className="rounded-full" src={onlineUsers[id][0]?.profilePicUrl} alt="" />{" "}
                             </div>
                          </>
                       );
                    })
                  : null}
               {!viewOnly ? (
                  <>
                     <button
                        onClick={() => setShareIsOpen((state: boolean) => !state)}
                        className="bg-pink-600 hidden lg:block text-xs rounded-md px-3 py-2 ml-2"
                     >
                        <div className="flex flex-row items-center ">
                           <p className="">Share</p>
                        </div>
                     </button>
                  </>
               ) : null}
            </div>
         </div>

         <Toaster />
      </>
   );
};
