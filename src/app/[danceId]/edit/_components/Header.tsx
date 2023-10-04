import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formation, localSettings, dancer, initials, COLORS, dancerPosition } from "../../../../types/types";
import { useRouter } from "next/navigation";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import Dropdown from "./Dropdown";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useStore } from "../store";
import styles from "./Status.module.css";
import { AuthSession } from "@supabase/supabase-js";
import { useIsDesktop, useIsIOS } from "../../../../hooks";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { revalidatePath } from "next/cache";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const Header: React.FC<{
   saved: boolean;

   undo: Function;
   setShareIsOpen: Function;
   // viewOnly: boolean;
   folder: any;
   exportPdf: Function;

   localSettings: localSettings;
   setLocalSettings: Function;
   setSelectedFormation: Function;

   viewOnlyInitial: boolean;
   setIsCommenting: Function;
   selectedDancers: string[];
   selectedFormation: number | null;
   pushChange: Function;
   isCommenting: boolean;
   isChangingCollisionRadius: boolean;
   setIsChangingCollisionRadius: Function;
   // formations: formation[];
   dropDownToggle: Function;
   dancers: dancer[];
   danceId: string;
   session: AuthSession | null;
   exportThree: Function;
   fullscreenContainer: any;
   plan: string | null;
}> = ({
   saved,

   setShareIsOpen,
   // viewOnly,

   undo,
   exportPdf,

   localSettings,
   setLocalSettings,
   setSelectedFormation,
   viewOnlyInitial,
   setIsCommenting,
   selectedDancers,
   selectedFormation,
   pushChange,
   isCommenting,
   isChangingCollisionRadius,
   setIsChangingCollisionRadius,
   // formations,
   dropDownToggle,
   folder,
   dancers,
   danceId,
   session,
   exportThree,
   fullscreenContainer,
   plan,
}) => {
   const router = useRouter();
   const {
      formations,
      viewOnly,
      danceName,
      setDanceName,
      liveblocks: { status },
      isMobileView,
      selectedFormations,
      setSelectedDancers,
      setCopiedPositions,
      getFirstSelectedFormation,
      setFormations,
      copiedPositions,
      liveblocks,
   } = useStore();
   const isIOS = useIsIOS();
   const supabase = createClientComponentClient();

   const redo = liveblocks.room?.history.redo;

   const [templatesIsOpen, setTemplatesIsOpen] = useState(false);
   const others = useStore((state) => state.liveblocks.others);
   const isDesktop = useIsDesktop();
   // console.log(folder);
   return (
      <>
         <div className=" min-h-[50px] dark:bg-black bg-neutral-100  flex flex-row items-center w-full text-neutral-800 border-b  dark:text-white  dark:border-neutral-700 border-neutral-300 ">
            <div className="flex flex-row items-center justify-start w-2/5 h-full">
               <div className="w-20 min-w-[80px] border-r border-neutral-300 h-full dark:border-neutral-700 grid place-items-center relative">
                  <a
                     // onClick={async () => {
                     //    // revalidatePath("/dashboard");
                     //    if (!session) {
                     //       router.push("/login");
                     //       return;
                     //    }
                     //    if (viewOnly && session) {
                     //       router.push("/dashboard");
                     //       return;
                     //    }
                     //    if (!saved) {
                     //       let updateDancers = supabase.from("dances").update({ dancers: dancers, last_edited: new Date() }).eq("id", danceId);

                     //       let updateFormations = supabase
                     //          .from("dances")
                     //          .update({ formations: formations, last_edited: new Date() })
                     //          .eq("id", danceId);
                     //       Promise.all([updateDancers, updateFormations]).then((results) => {
                     //          router.push(`/dashboard`);
                     //       });
                     //    } else {
                     //       router.push(`/dashboard`);
                     //    }
                     // }}
                     href="/dashboard"
                     className=""
                  >
                     {/* <svg
                        className="w-10 h-10 ml-5 mr-3 cursor-pointer flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 59 125"
                     >
                        <path className="dark:fill-pink-600 fill-pink-300" d="M0 90h59v24H0z" />
                        <path
                           className="fill-neutral-700 dark:fill-white"
                           d="M6.63707 102V25.6364H57.1982v13.3114H22.7823v18.196h31.06v13.3115h-31.06V102H6.63707Z"
                        />
                     </svg> */}
                     {/* <img className="  w-6" src="/logo.png" alt="" /> */}
                     <svg className="w-6 fill-neutral-700 dark:fill-neutral-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 387 516">
                        <path d="M0 130C0 58.203 58.203 0 130 0v386c0 71.797-58.203 130-130 130V130Z" />
                        <path d="M114 130V0l272.355-.0000119C386.355 71.797 328.152 130 256.355 130H114Z" />
                        <circle cx="248.301" cy="259.94" r="77.594" />
                     </svg>
                  </a>
                  <p className="text-[10px] dark:text-neutral-300 text-neutral-700 font-medium absolute right-[6px] bottom-1">Beta</p>
               </div>
               <div className="md:px-1 h-full">
                  {/* {isDesktop ? ( */}
                  <Menubar className="dark:bg-black h-full border-none bg-neutral-100 ">
                     <MenubarMenu>
                        <MenubarTrigger className="dark:hover:bg-neutral-800 hover:bg-neutral-200 h-full">File</MenubarTrigger>
                        <MenubarContent className="dark:bg-black w-[200px]">
                           <MenubarItem
                              onClick={() => {
                                 // window.location.href = "/dashboard";
                                 window.location.href = "/dashboard";
                              }}
                              className="py-1 hover:bg-neutral-200 flex flex-row items-center"
                           >
                              Back to files
                           </MenubarItem>
                           <MenubarSeparator className="h-[1px] bg-neutral-300" />

                           <MenubarItem
                              onClick={() => {
                                 setLocalSettings((localSettings: localSettings) => {
                                    return { ...localSettings, isDarkMode: !localSettings.isDarkMode };
                                 });
                              }}
                              className="py-1 hover:bg-neutral-200"
                           >
                              Switch to {localSettings.isDarkMode ? "light" : "dark"} mode
                           </MenubarItem>
                           <MenubarSeparator />
                           <MenubarItem
                              onClick={() => {
                                 fullscreenContainer.current.requestFullscreen();
                                 setLocalSettings((localSettings: localSettings) => {
                                    return { ...localSettings, fullScreen: false };
                                 });
                              }}
                              className="py-1 hover:bg-neutral-200"
                           >
                              Enter full screen
                              <MenubarShortcut>F</MenubarShortcut>
                           </MenubarItem>
                           <MenubarSeparator />
                           <MenubarItem
                              onClick={() => {
                                 setLocalSettings((localSettings: localSettings) => {
                                    return { ...localSettings, stageFlipped: !localSettings.stageFlipped };
                                 });
                              }}
                              className="py-1 hover:bg-neutral-200"
                           >
                              {!localSettings.stageFlipped ? "View from back" : "View from front"}
                              <MenubarShortcut>R</MenubarShortcut>
                           </MenubarItem>
                           <MenubarSeparator />
                           <MenubarItem
                              onClick={() => {
                                 if (!plan) {
                                    router.push("/upgrade");
                                 } else {
                                    exportPdf();
                                 }
                              }}
                              className="py-1 hover:bg-neutral-200"
                           >
                              Export PDF
                              {!plan ? <MenubarShortcut>⚡️</MenubarShortcut> : null}
                           </MenubarItem>
                           <MenubarItem onClick={() => undo()} className="py-1 hover:bg-neutral-200 md:hidden">
                              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                           </MenubarItem>
                        </MenubarContent>
                     </MenubarMenu>

                     <MenubarMenu className="">
                        <MenubarTrigger className="hidden md:block dark:hover:bg-neutral-800 hover:bg-neutral-200 h-full">Edit</MenubarTrigger>
                        <MenubarContent className="w-[200px]">
                           <MenubarItem
                              onClick={() => {
                                 // if (!selectedFormations.length) return;
                                 // e.preventDefault();
                                 setSelectedDancers([...formations?.[0]?.positions?.map((position) => position.id)] || []);
                              }}
                              className="py-1 hover:bg-neutral-200 "
                           >
                              Select all positions <MenubarShortcut>⌘A</MenubarShortcut>
                           </MenubarItem>
                           <MenubarItem
                              style={{
                                 opacity: !selectedDancers?.length ? 0.5 : 1,
                              }}
                              onClick={() => {
                                 if (!selectedFormations.length) return;

                                 setCopiedPositions(
                                    getFirstSelectedFormation()?.positions?.filter((dancerPosition: dancerPosition) =>
                                       selectedDancers.includes(dancerPosition.id)
                                    ) || []
                                 );
                              }}
                              className="py-1 hover:bg-neutral-200 "
                           >
                              Copy positions <MenubarShortcut>⌘C</MenubarShortcut>
                           </MenubarItem>
                           <MenubarItem
                              style={{
                                 opacity: !copiedPositions?.length ? 0.5 : 1,
                              }}
                              onClick={() => {
                                 if (!selectedFormations.length) return;
                                 if (!copiedPositions) return;
                                 setFormations(
                                    formations.map((formation, i) => {
                                       if (selectedFormations.includes(formation.id)) {
                                          return {
                                             ...formation,
                                             positions: [
                                                ...formation.positions.filter((dancerPosition) => {
                                                   return !copiedPositions
                                                      .map((dancerPositionCopy: dancerPosition) => dancerPositionCopy.id)
                                                      .includes(dancerPosition.id);
                                                }),
                                                ...copiedPositions,
                                             ],
                                          };
                                       }
                                       return formation;
                                    })
                                 );
                              }}
                              className="py-1 hover:bg-neutral-200 "
                           >
                              Paste positions <MenubarShortcut>⌘V</MenubarShortcut>
                           </MenubarItem>
                           <MenubarSeparator className="h-[1px] bg-neutral-300" />
                           <MenubarItem onClick={() => undo()} className="py-1 hover:bg-neutral-200">
                              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                           </MenubarItem>
                           <MenubarItem onClick={() => (redo ? redo() : null)} className="py-1 hover:bg-neutral-200 ">
                              Redo
                              {/* <MenubarShortcut>⇧⌘Z</MenubarShortcut> */}
                           </MenubarItem>
                        </MenubarContent>
                     </MenubarMenu>
                  </Menubar>
                  {/* ) : null} */}
               </div>

               <button
                  onClick={() =>
                     setLocalSettings((localSettings: localSettings) => {
                        return { ...localSettings, viewingTwo: true, viewingThree: false };
                     })
                  }
                  className={` ${
                     localSettings.viewingTwo ? "dark:bg-pink-600 bg-pink-300" : ""
                  } group grid h-full  text-sm  font-bold  place-items-center min-w-[48px] `}
               >
                  <p className="">2D</p>
               </button>
               <button
                  onClick={() =>
                     setLocalSettings((localSettings: localSettings) => {
                        return { ...localSettings, viewingTwo: false, viewingThree: true };
                     })
                  }
                  className={` ${
                     localSettings.viewingThree ? "dark:bg-pink-600 bg-pink-300" : ""
                  }  group   h-full  text-sm font-bold place-items-center  min-w-[48px] `}
               >
                  <p className="">{"3D"}</p>
               </button>

               {isIOS && localSettings.viewingThree ? (
                  <button onClick={() => exportThree()} className="min-w-[48px] grid place-items-center">
                     <svg className="w-6 h-6 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M440-181 240-296q-19-11-29.5-29T200-365v-230q0-22 10.5-40t29.5-29l200-115q19-11 40-11t40 11l200 115q19 11 29.5 29t10.5 40v230q0 22-10.5 40T720-296L520-181q-19 11-40 11t-40-11Zm0-92v-184l-160-93v185l160 92Zm80 0 160-92v-185l-160 93v184ZM80-680v-120q0-33 23.5-56.5T160-880h120v80H160v120H80ZM280-80H160q-33 0-56.5-23.5T80-160v-120h80v120h120v80Zm400 0v-80h120v-120h80v120q0 33-23.5 56.5T800-80H680Zm120-600v-120H680v-80h120q33 0 56.5 23.5T880-800v120h-80ZM480-526l158-93-158-91-158 91 158 93Zm0 45Zm0-45Zm40 69Zm-80 0Z" />
                     </svg>
                  </button>
               ) : null}

               {/* {isChangingCollisionRadius ? (
                  <div
                     className="w-[200px] left-12 h-[80px] bg-neutral-800 absolute top-14 flex flex-col z-[50] text-sm shadow-2xl"
                     id="dropdown-menu"
                  >
                     <p className="font-semibold ml-2 mt-1">Collision Radius</p>
                     <div className="flex flex-row items-center  border border-neutral-200 mt-auto m-1">
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
               ) : null} */}

               {!viewOnlyInitial && !isMobileView ? (
                  <button
                     title="Comment on stage"
                     className={`min-w-[48px]  hidden lg:grid h-full  place-items-center ${
                        isCommenting ? "dark:bg-pink-600 bg-pink-300" : "bg-transparent"
                     }`}
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
               ) : null}

               <a
                  href="https://linktr.ee/formistudio.app"
                  target={"_blank"}
                  className="text-xs mr-6  whitespace-nowrap ml-3  hidden lg:block border-pink-600 border p-2 rounded-md"
               >
                  Beta feedback
               </a>

               {/* {!viewOnlyInitial ? (
                  <button
                     title="Formation templates"
                     onClick={() => {
                        setTemplatesIsOpen((x: boolean) => !x);
                     }}
                     className="min-w-[48px]   h-full grid place-items-center"
                  >
                     <svg className="w-6 fill-white h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
                        <path d="M340.118 766Q361 766 375.5 751.382q14.5-14.617 14.5-35.5Q390 695 375.382 680.5q-14.617-14.5-35.5-14.5Q319 666 304.5 680.618q-14.5 14.617-14.5 35.5Q290 737 304.618 751.5q14.617 14.5 35.5 14.5Zm0-280Q361 486 375.5 471.382q14.5-14.617 14.5-35.5Q390 415 375.382 400.5q-14.617-14.5-35.5-14.5Q319 386 304.5 400.618q-14.5 14.617-14.5 35.5Q290 457 304.618 471.5q14.617 14.5 35.5 14.5Zm280 280Q641 766 655.5 751.382q14.5-14.617 14.5-35.5Q670 695 655.382 680.5q-14.617-14.5-35.5-14.5Q599 666 584.5 680.618q-14.5 14.617-14.5 35.5Q570 737 584.618 751.5q14.617 14.5 35.5 14.5Zm0-280Q641 486 655.5 471.382q14.5-14.617 14.5-35.5Q670 415 655.382 400.5q-14.617-14.5-35.5-14.5Q599 386 584.5 400.618q-14.5 14.617-14.5 35.5Q570 457 584.618 471.5q14.617 14.5 35.5 14.5ZM180 936q-24 0-42-18t-18-42V276q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600V276H180v600Zm0-600v600-600Z" />
                     </svg>
                  </button>
               ) : null} */}

               {/* {templatesIsOpen ? (
                  <div
                     className="w-[300px] left-[200px] h-[500px] bg-neutral-800 absolute top-12 flex flex-col  text-sm shadow-2xl z-[50]"
                     id="dropdown-menu"
                  >
                     <p className="font-semibold ml-2 mt-1">Formation Templates</p>
                     <div className="flex flex-row items-center mt-auto m-1">
                        <div className=" grid   flex-col mt-6  grid-cols-2  gap-2 h-full w-full p-2 ">
                           <button
                              className=" w-full h-24 border border-gray-200 shadow-sm ml-auto mr-auto rounded-xl grid place-items-center"
                              onClick={() => {
                                 if (pricingTier === "basic") {
                                    setUpgradeIsOpen(true);
                                 }
                                 // addToStack();
                                 setFormations(horizontalLineFormation(formations, selectedFormation));
                                 pushChange();
                              }}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-10 h-10"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                 />
                              </svg>
                           </button>
                           <button
                              className=" w-full h-24 border border-gray-200 shadow-sm ml-auto mr-auto rounded-xl grid place-items-center"
                              onClick={() => {
                                 setFormations(verticalLineFormation(formations, selectedFormation));
                                 pushChange();
                              }}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-10 h-10"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                                 />
                              </svg>
                           </button>
                        </div>
                     </div>
                  </div>
               ) : null} */}

               {!viewOnly ? (
                  <>
                     {saved ? (
                        <></>
                     ) : (
                        <div className=" flex-row items-center  ml-3 lg:flex hidden">
                           <p className="dark:text-neutral-300 text-neutral-700 text-xs">saving...</p>
                        </div>
                     )}
                  </>
               ) : (
                  <p className="dark:text-neutral-300 text-neutral-700 text-sm lg:block hidden ml-3">View only</p>
               )}
            </div>
            <div className="w-1/5">
               <input
                  value={danceName}
                  onChange={(e) => setDanceName(e.target.value)}
                  onClick={(e) => {
                     e.target.select();
                  }}
                  placeholder={"Performance name"}
                  disabled={viewOnly}
                  className={`h-6 text-center  px-3 py-4 w-full  mx-auto text-sm hidden bg-transparent rounded-md  lg:block   outline-none   `}
               />
            </div>

            <div className=" flex flex-row items-center justify-end mr-3 w-2/5 gap-3 ">
               <Link href={"/upgrade"} className="text-sm mr-3 hidden md:flex dark:text-neutral-200 text-neutral-800 ">
                  Upgrade <span className="ml-1">⚡️</span>
               </Link>
               {folder?.name && (
                  <Link
                     href={`/dashboard/project/${folder.id}`}
                     className="text-xs border dark:border-neutral-600 border-neutral-300 text-neutral-800 dark:text-neutral-300 rounded-full py-1  px-2 md:flex flex-row items-center hidden"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2">
                        <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                     </svg>

                     <p>{folder?.name}</p>
                  </Link>
               )}
               {/* {!viewOnly && !isDesktop ? (
                  <button onClick={() => undo()} className="ml-auto mr-4">
                     <svg className="w-6 h-6 dark:fill-white fill-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
                     </svg>
                  </button>
               ) : null} */}
               {status ? (
                  <div className="">
                     <div className={`${styles.status} hidden lg:block`} data-status={status}>
                        <div className={styles.statusCircle} />
                        {/* <div className={`${styles.statusText} hidden lg:block`}>{status}</div> */}
                     </div>
                  </div>
               ) : null}
               <div className="lg:flex hidden">
                  {" "}
                  {others.length
                     ? others
                          .filter((other) => other.presence.nameOrEmail)
                          .map((person, i) => {
                             return (
                                <div
                                   key={person.connectionId}
                                   //   onClick={() => {
                                   //      setSelectedFormation(userPositions?.[id]?.selectedFormation || 0);
                                   //   }}
                                   style={{
                                      border: "2px solid white",
                                      backgroundColor: COLORS[person.connectionId % COLORS.length],
                                   }}
                                   className=" grid place-items-center w-9 select-none cursor-pointer  h-9 rounded-full mr-2"
                                >
                                   {/* <img className="rounded-full" src={otherInitials} alt="" />{" "} */}
                                   <p className="text-white text-xs font-bold">{initials(person.presence.nameOrEmail) || "An"}</p>
                                </div>
                             );
                          })
                     : null}
               </div>
               

               {!viewOnly ? (

                  <>
                     <button
                        onClick={() => setShareIsOpen((state: boolean) => !state)}
                        className="dark:bg-pink-600 bg-pink-300  text-xs rounded-md px-3 py-2 ml-2"
                     >
                        <div className="flex flex-row items-center text-black dark:text-white ">
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

const horizontalLineFormation = (formations: formation[], selectedFormation: number | null) => {
   let previousFormation = selectedFormation === 0 ? formations[selectedFormation] : formations[selectedFormation - 1];

   let numberOfDancers = previousFormation.positions.length;
   let possiblePositions = previousFormation.positions.map((position, i) => {
      return { x: i - Math.round(numberOfDancers / 2), y: 0 };
   });

   let newPositions = previousFormation?.positions.map((position) => {
      let distances = possiblePositions.map((possiblePosition) => {
         return calculateDistance(position.position, possiblePosition);
      });
      let positionIndex = distances.indexOf(Math.min(...distances));
      let newPosition = possiblePositions.splice(positionIndex, 1);
      return { ...position, position: newPosition[0] };
   });

   return formations.map((formation, i) => {
      if (i === selectedFormation) {
         return { ...formation, positions: newPositions };
      }
      return formation;
   });
};

const verticalLineFormation = (formations: formation[], selectedFormation: number | null) => {
   let previousFormation = selectedFormation === 0 ? formations[selectedFormation] : formations[selectedFormation - 1];

   let numberOfDancers = previousFormation.positions.length;
   let possiblePositions = previousFormation.positions.map((position, i) => {
      return { y: i - Math.round(numberOfDancers / 2), x: 0 };
   });

   let newPositions = previousFormation?.positions.map((position) => {
      let distances = possiblePositions.map((possiblePosition) => {
         return calculateDistance(position.position, possiblePosition);
      });
      let positionIndex = distances.indexOf(Math.min(...distances));
      let newPosition = possiblePositions.splice(positionIndex, 1);
      return { ...position, position: newPosition[0] };
   });

   return formations.map((formation, i) => {
      if (i === selectedFormation) {
         return { ...formation, positions: newPositions };
      }
      return formation;
   });
};

function calculateDistance(point1: Point, point2: Point) {
   const xDistance = point1.x - point2.x;
   const yDistance = point1.y - point2.y;
   return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
