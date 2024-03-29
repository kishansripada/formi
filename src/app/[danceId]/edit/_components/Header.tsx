import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { formation, localSettings, dancer, initials, COLORS, dancerPosition } from "../../../../types/types";
import { useRouter } from "next/navigation";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useStore } from "../store";
import styles from "./Status.module.css";
import { AuthSession } from "@supabase/supabase-js";
import { useIsDesktop, useIsIOS } from "../../../../utls";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import { revalidatePath } from "next/cache";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { usePostHog } from "posthog-js/react";
import { useTheme } from "next-themes";
import { Input } from "../../../../../@/components/ui/input";
import { Button } from "../../../../../@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Share } from "./Modals/Share";
import { Toggle } from "../../../../../@/components/ui/toggle";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuPortal,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HStack, VStack } from "../../../../../@/components/ui/stacks";
import LearnKeyboardShortcut from "../../../../../@/components/LearnKeyboardShortcut";
import { KeyboardShortcuts } from "./Modals/KeyboardShortcuts";
import { sleep } from "../../../../utils/sleep";

export const Header: React.FC<{
   saved: boolean;
   undo: Function;
   folder: any;

   localSettings: localSettings;
   setLocalSettings: Function;
   setSelectedFormation: Function;
   viewOnlyInitial: boolean;
   setIsCommenting: Function;
   selectedDancers: string[];
   selectedFormation: number | null;
   pushChange: Function;
   isCommenting: boolean;

   dropDownToggle: Function;
   dancers: dancer[];
   danceId: string;
   session: AuthSession | null;
   exportThree: Function;
   fullscreenContainer: any;
   plan: string | null;
   permissions: any;
   setPermissions: Function;
   anyoneCanView: boolean;
   setAnyoneCanView: Function;
}> = ({
   saved,
   undo,

   localSettings,
   setLocalSettings,
   viewOnlyInitial,
   setIsCommenting,
   selectedDancers,
   isCommenting,
   folder,
   dancers,
   danceId,
   session,
   exportThree,
   fullscreenContainer,
   plan,
   permissions,
   setPermissions,
   anyoneCanView,
   setAnyoneCanView,
   scene,
}) => {
   const {
      formations,
      viewOnly,
      danceName,
      setDanceName,
      liveblocks: { status },
      isMobileView,
      selectedFormations,
      setSelectedDancers,
      copiedPositions,
      liveblocks,
      copySelectedPositions,
      pasteCopiedPositions,
      setSelectedFormations,
   } = useStore();

   const { setTheme, theme } = useTheme();
   const isIOS = useIsIOS();
   const supabase = createClientComponentClient();
   const router = useRouter();
   const others = useStore((state) => state.liveblocks.others);
   const redo = liveblocks.room?.history.redo;
   const isDesktop = useIsDesktop();
   const [rosterName, setRosterName] = useState("");

   const createNewRoster = async () => {
      if (!session) return;
      const response = await supabase.from("rosters").insert([
         {
            name: rosterName,
            user_id: session?.user?.id,
            roster: JSON.parse(JSON.stringify(dancers)).map((dancer: any) => {
               delete dancer.id;
               return dancer;
            }),
         },
      ]);

      if (!response.error) {
         toast.success("Roster saved");
      }
   };

   const [folders, setFolders] = useState([]);
   useEffect(() => {
      if (session) {
         getProjects(session, supabase).then((projects) => {
            if (projects.length) {
               setFolders(projects);
            }
         });
      }
   }, []);

   const exportPdf = async () => {
      // setPdfLoading(true);
      setLocalSettings({ ...localSettings, viewingTwo: true, viewingThree: false });

      const canvases = [];

      // dynamically import html2canvas and jspdf
      const [html2canvasinit, jsPDFinit] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const html2canvas = html2canvasinit.default;
      const jsPDF = jsPDFinit.default;

      const stageElement = document.getElementById("stage");
      for (let index = 0; index < formations.length; index++) {
         setSelectedFormations([formations[index]?.id]);

         // Wait for the formation to be rendered in the DOM
         await sleep(1000); // Delay in milliseconds. Adjust as needed.

         const canvas = await html2canvas(stageElement);
         // canvases.push(canvas);

         // const formationContainer = document.createElement("div");

         const label = document.createElement("p");
         label.textContent = `${formations[index].name} (${index + 1} of ${formations.length})`;
         label.style.textAlign = "center";

         // label.style.width = "100%";

         const notes = document.createElement("p");
         notes.textContent = `${formations[index].notes || ""}`;
         notes.style.textAlign = "left";
         // notes.style.width = "100%";
         // formationContainer.appendChild(canvas);
         // formationContainer.appendChild(label);
         // formationContainer.appendChild(notes);
         // formationContainer.appendChild(formationContainer);
         canvases.push({ canvas, label, notes });
         // document.body.appendChild(canvas);
      }

      // Now export the canvases to a PDF
      const pdf = new jsPDF({
         orientation: "landscape",
         unit: "px",
         format: [stageElement?.clientWidth, stageElement?.clientHeight + 100],
      });

      for (let i = 0; i < canvases.length; i++) {
         const imgData = canvases[i].canvas.toDataURL("image/png");
         // pdf.addImage(imgData, "PNG", 0, 0);
         pdf.addImage(imgData, "PNG", 0, 0, stageElement?.clientWidth, stageElement?.clientHeight);
         pdf.text(canvases[i].label.textContent, 10, stageElement?.clientHeight + 20);
         pdf.text(canvases[i].notes.textContent, 10, stageElement?.clientHeight + 40);
         if (i < canvases.length - 1) {
            pdf.addPage(); // Add new page for next image if there is one
         }
      }

      pdf.save(`${danceName}.pdf`);
      // setPdfLoading(false);
   };

   async function getProjects(session: Session, supabase: SupabaseClient) {
      let data = await supabase.from("projects").select("*").eq("parent_id", session.user.id);

      return data?.data || [];
   }
   return (
      <>
         <div className=" min-h-[50px] dark:bg-neutral-900 bg-neutral-50  flex flex-row items-center w-full text-neutral-800 border-b  dark:text-white  dark:border-neutral-700 border-neutral-300 ">
            <div className="flex flex-row items-center justify-start w-2/5 h-full">
               <div className="w-[70px] min-w-[70px] border-r border-neutral-300 h-full dark:border-neutral-700 grid place-items-center relative">
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
                     <svg className="w-6 fill-neutral-700 dark:fill-neutral-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 387 516">
                        <path d="M0 130C0 58.203 58.203 0 130 0v386c0 71.797-58.203 130-130 130V130Z" />
                        <path d="M114 130V0l272.355-.0000119C386.355 71.797 328.152 130 256.355 130H114Z" />
                        <circle cx="248.301" cy="259.94" r="77.594" />
                     </svg>
                  </a>
                  <p className="text-[10px] dark:text-neutral-300 text-neutral-700 font-medium absolute right-[6px] bottom-1">Beta</p>
               </div>
               <div className="md:px-1 h-full">
                  <Menubar className="dark:bg-neutral-900 h-full border-none bg-neutral-50 ">
                     {session ? (
                        <>
                           <MenubarMenu>
                              <MenubarTrigger className="dark:hover:bg-neutral-800 hover:bg-neutral-200 h-full">File</MenubarTrigger>

                              <MenubarContent className="dark:bg-black w-[200px]">
                                 <Dialog className="">
                                    <MenubarItem
                                       onClick={() => {
                                          window.location.href = "/dashboard";
                                       }}
                                       className="py-1 hover:bg-neutral-200 flex flex-row items-center"
                                    >
                                       Back to files
                                    </MenubarItem>
                                    <MenubarSeparator className="h-[1px] bg-neutral-300" />

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

                                    <DialogTrigger
                                       onClick={(e) => {
                                          if (!plan) {
                                             e.preventDefault();
                                             router.push("/upgrade");
                                          }
                                       }}
                                       asChild
                                    >
                                       <MenubarItem onSelect={(e) => e.preventDefault()} className="py-1 hover:bg-neutral-200 w-full">
                                          Save roster
                                          {!plan ? <MenubarShortcut>⚡️</MenubarShortcut> : null}
                                       </MenubarItem>
                                    </DialogTrigger>

                                    <DialogContent className="dark:bg-neutral-950/80 ">
                                       <DialogHeader>
                                          <DialogTitle>Name your roster</DialogTitle>
                                          <DialogDescription className="my-3">
                                             Save your roster to easily create new performances with an existing roster. Performer height, color, and
                                             shape will all be saved
                                          </DialogDescription>
                                       </DialogHeader>
                                       <Input
                                          value={rosterName}
                                          onChange={(e) => {
                                             setRosterName(e.target.value);
                                          }}
                                          className=""
                                          type="text"
                                          placeholder="Roster name"
                                       />
                                       <DialogClose className="ml-auto">
                                          <Button
                                             onClick={async (e) => {
                                                createNewRoster();
                                             }}
                                             className="     "
                                          >
                                             Save
                                          </Button>
                                       </DialogClose>
                                    </DialogContent>

                                    <MenubarItem onClick={() => undo()} className="py-1 hover:bg-neutral-200 md:hidden">
                                       Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                                    </MenubarItem>
                                 </Dialog>
                              </MenubarContent>
                           </MenubarMenu>

                           <MenubarMenu className="">
                              <MenubarTrigger className="hidden md:block dark:hover:bg-neutral-800 hover:bg-neutral-200 h-full">Edit</MenubarTrigger>
                              <MenubarContent className="dark:bg-black">
                                 <MenubarItem
                                    onClick={() => {
                                       if (!selectedFormations.length) return;
                                       // e.preventDefault();
                                       setSelectedDancers([...formations?.[0]?.positions?.map((position) => position.id)] || []);
                                    }}
                                    className="py-1 hover:bg-neutral-200 "
                                 >
                                    Select all positions <MenubarShortcut>⌘A</MenubarShortcut>
                                 </MenubarItem>
                                 <MenubarItem
                                    onClick={() => {
                                       if (!selectedFormations.length) return;

                                       copySelectedPositions();
                                    }}
                                    className="py-1 hover:bg-neutral-200 "
                                 >
                                    Copy {!selectedDancers.length ? "all" : ""} positions <MenubarShortcut>⌘C</MenubarShortcut>
                                 </MenubarItem>
                                 <MenubarItem
                                    style={{
                                       opacity: !copiedPositions?.length ? 0.5 : 1,
                                    }}
                                    onClick={() => {
                                       pasteCopiedPositions();
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
                                 </MenubarItem>
                              </MenubarContent>
                           </MenubarMenu>
                        </>
                     ) : null}

                     <MenubarMenu className="">
                        <MenubarTrigger className="hidden md:block dark:hover:bg-neutral-800 hover:bg-neutral-200 h-full">View</MenubarTrigger>
                        <MenubarContent>
                           <MenubarItem
                              onClick={() => {
                                 if (fullscreenContainer.current) {
                                    if (fullscreenContainer.current.requestFullscreen) {
                                       fullscreenContainer.current.requestFullscreen();
                                    } else if (fullscreenContainer.current.mozRequestFullScreen) {
                                       /* Firefox */
                                       fullscreenContainer.current.mozRequestFullScreen();
                                    } else if (fullscreenContainer.current.webkitRequestFullscreen) {
                                       /* Chrome, Safari and Opera */
                                       fullscreenContainer.current.webkitRequestFullscreen();
                                    } else if (fullscreenContainer.current.msRequestFullscreen) {
                                       /* IE/Edge */
                                       fullscreenContainer.current.msRequestFullscreen();
                                    }
                                 }
                                 setLocalSettings((localSettings: localSettings) => {
                                    return { ...localSettings, fullScreen: false };
                                 });
                              }}
                              className="py-1 hover:bg-neutral-200"
                           >
                              Presentation mode
                              <MenubarShortcut>F</MenubarShortcut>
                           </MenubarItem>
                           <MenubarItem
                              onClick={() => {
                                 setLocalSettings((localSettings: localSettings) => {
                                    return { ...localSettings, fullScreen: !localSettings.fullScreen };
                                 });
                              }}
                              className="py-1 hover:bg-neutral-200"
                           >
                              Fullscreen
                              <MenubarShortcut> ⌘ \</MenubarShortcut>
                           </MenubarItem>

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
                           <MenubarItem
                              onClick={() => {
                                 if (theme === "dark") {
                                    setTheme("light");
                                 } else {
                                    setTheme("dark");
                                 }
                              }}
                              className="py-1 hover:bg-neutral-200"
                           >
                              Switch to {theme === "light" ? "dark" : "light"} mode
                           </MenubarItem>
                        </MenubarContent>
                     </MenubarMenu>

                     {isDesktop && (
                        <MenubarMenu className="">
                           <MenubarTrigger className="hidden md:block dark:hover:bg-neutral-800 hover:bg-neutral-200 h-full">Help</MenubarTrigger>

                           <MenubarContent>
                              <Dialog>
                                 <DialogTrigger>
                                    <MenubarItem onSelect={(e) => e.preventDefault()} className="py-1 hover:bg-neutral-200 w-full">
                                       Keyboard shortcuts
                                    </MenubarItem>
                                 </DialogTrigger>
                                 <DialogContent className="min-w-[75%]">
                                    <DialogHeader>
                                       <DialogTitle>Keyboard shortcuts</DialogTitle>
                                    </DialogHeader>
                                    <KeyboardShortcuts />
                                 </DialogContent>
                              </Dialog>
                           </MenubarContent>
                        </MenubarMenu>
                     )}
                  </Menubar>
               </div>

               <Toggle
                  onPressedChange={(pressed) => {
                     setLocalSettings((localSettings: localSettings) => {
                        return { ...localSettings, viewingTwo: !pressed, viewingThree: pressed };
                     });
                  }}
                  pressed={localSettings.viewingThree}
                  size="lg"
                  // variant={"outline"}
                  className="px-3 py-1 rounded-sm"
                  aria-label="Toggle 3D"
               >
                  {/* <p className="">{localSettings.viewingTwo ? "3D" : "2D"}</p> */}
                  <p className="">3D</p>
               </Toggle>

               {/* <button
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
                  onClick={() => {
                     setLocalSettings((localSettings: localSettings) => {
                        return { ...localSettings, viewingTwo: false, viewingThree: true };
                     });
                     // posthog.capture("3D view enabled", {
                     //    performanceId: danceId,
                     // });
                  }}
                  className={` ${
                     localSettings.viewingThree ? "dark:bg-pink-600 bg-pink-300" : ""
                  }  group   h-full  text-sm font-bold place-items-center  min-w-[48px] `}
               >
                  <p className="">{"3D"}</p>
               </button> */}

               {isIOS && localSettings.viewingThree ? (
                  <button onClick={() => exportThree(scene)} className="min-w-[48px] grid place-items-center">
                     <svg className="w-6 h-6 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path d="M440-181 240-296q-19-11-29.5-29T200-365v-230q0-22 10.5-40t29.5-29l200-115q19-11 40-11t40 11l200 115q19 11 29.5 29t10.5 40v230q0 22-10.5 40T720-296L520-181q-19 11-40 11t-40-11Zm0-92v-184l-160-93v185l160 92Zm80 0 160-92v-185l-160 93v184ZM80-680v-120q0-33 23.5-56.5T160-880h120v80H160v120H80ZM280-80H160q-33 0-56.5-23.5T80-160v-120h80v120h120v80Zm400 0v-80h120v-120h80v120q0 33-23.5 56.5T800-80H680Zm120-600v-120H680v-80h120q33 0 56.5 23.5T880-800v120h-80ZM480-526l158-93-158-91-158 91 158 93Zm0 45Zm0-45Zm40 69Zm-80 0Z" />
                     </svg>
                  </button>
               ) : null}

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
                  placeholder={"Performance name"}
                  disabled={viewOnly}
                  className={`h-6 text-center  px-3 py-4 w-full  mx-auto text-sm hidden bg-transparent rounded-md  lg:block   outline-none   `}
               />
            </div>

            <div className=" flex flex-row items-center justify-end mr-3 w-2/5 gap-3 ">
               {!plan && session ? (
                  <Link href={"/upgrade"} className="text-sm mr-3 hidden md:flex dark:text-neutral-200 text-neutral-800 ">
                     Upgrade <span className="ml-1">⚡️</span>
                  </Link>
               ) : null}

               <DropdownMenu>
                  {!viewOnly && (
                     <DropdownMenuTrigger asChild>
                        <div className="text-sm border dark:border-neutral-600 border-neutral-300 text-neutral-800 dark:text-neutral-300 rounded-md py-1 gap-2  px-2 md:flex flex-row items-center hidden">
                           <button className="flex flex-row items-center gap-2 ">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                 <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                              </svg>
                              <p className="text-xs">{folder?.name}</p>
                           </button>
                        </div>
                     </DropdownMenuTrigger>
                  )}
                  <DropdownMenuContent className="">
                     <DropdownMenuGroup>
                        {folder?.name && (
                           <>
                              <DropdownMenuItem>
                                 <Link href={`/dashboard/project/${folder.id}`} className="">
                                    {" "}
                                    <span className="mr-1">In </span> <span className="font-bold ">{folder?.name}</span>
                                 </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator></DropdownMenuSeparator>
                           </>
                        )}
                        <DropdownMenuSub>
                           <DropdownMenuSubTrigger>
                              <span className="">{folder?.name ? "Move to" : "Add to"}</span>
                           </DropdownMenuSubTrigger>
                           <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                 {folders
                                    .filter((f) => f?.id !== folder?.id)
                                    .map((folder) => {
                                       return (
                                          <DropdownMenuItem
                                             key={folder.id}
                                             onClick={async () => {
                                                const { data, error } = await supabase
                                                   .from("dances")
                                                   .update({ project_id: folder?.id })
                                                   .eq("id", danceId);
                                                if (!error) {
                                                   toast.success("Added to project");
                                                } else {
                                                   toast.error("There was an error adding to project");
                                                }
                                             }}
                                          >
                                             <span>{folder?.name}</span>
                                          </DropdownMenuItem>
                                       );
                                    })}
                              </DropdownMenuSubContent>
                           </DropdownMenuPortal>
                        </DropdownMenuSub>
                     </DropdownMenuGroup>
                  </DropdownMenuContent>
               </DropdownMenu>

               {status ? (
                  <div className="">
                     <div className={`${styles.status} hidden lg:block`} data-status={status}>
                        <div className={styles.statusCircle} />
                        {/* <div className={`${styles.statusText} hidden lg:block`}>{status}</div> */}
                     </div>
                  </div>
               ) : null}
               <div className="lg:flex gap-2 hidden">
                  <TooltipProvider className="">
                     {others.length
                        ? others
                             .filter((other) => other.presence.nameOrEmail)
                             .map((person, i) => {
                                return (
                                   <Tooltip>
                                      <TooltipTrigger>
                                         <div
                                            key={person.connectionId}
                                            //   onClick={() => {
                                            //      setSelectedFormation(userPositions?.[id]?.selectedFormation || 0);
                                            //   }}
                                            style={{
                                               border: "2px solid",
                                               borderColor: COLORS[person.connectionId % COLORS.length],
                                               backgroundColor: COLORS[person.connectionId % COLORS.length],
                                            }}
                                            className=" grid place-items-center w-9 select-none cursor-pointer  h-9 rounded-full"
                                         >
                                            <p className="text-white text-xs font-bold">{initials(person.presence.nameOrEmail || "") || "An"}</p>
                                         </div>
                                      </TooltipTrigger>
                                      <TooltipContent
                                         style={{
                                            backgroundColor: COLORS[person.connectionId % COLORS.length],
                                         }}
                                         className="py-1 border-none"
                                      >
                                         <p className="text-xs text-white">{person.presence.nameOrEmail}</p>
                                      </TooltipContent>
                                   </Tooltip>
                                );
                             })
                        : null}
                  </TooltipProvider>
               </div>

               {!viewOnlyInitial ? (
                  <Dialog>
                     <DialogTrigger suppressHydrationWarning={true} r>
                        <Button className="px-3 h-8 text-xs">Share</Button>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogTitle>Permission settings</DialogTitle>

                        <Share
                           danceId={danceId}
                           permissions={permissions}
                           setPermissions={setPermissions}
                           anyoneCanView={anyoneCanView}
                           setAnyoneCanView={setAnyoneCanView}
                           plan={plan}
                        ></Share>
                     </DialogContent>
                  </Dialog>
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

function calculateDistance(point1: Point, point2: Point) {
   const xDistance = point1.x - point2.x;
   const yDistance = point1.y - point2.y;
   return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
