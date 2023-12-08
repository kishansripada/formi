"use client";

import { dancer, dancerPosition, formation } from "../../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthSession } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { PerformancePreview } from "./PerformancePreview";
import { useDroppable } from "@dnd-kit/core";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { NewFolderModel } from "./NewFolderModel";
import { useStore } from "../store";
import { Button } from "../../../../@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../../../../@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { NewPerformanceBuilder } from "./NewPerformanceBuilder";
import { DoubleClickInput } from "../../../../@/components/ui/double-click-input";
export const Sidebar: React.FC<{
   rosters: any;
   session: AuthSession;
   plan: string | null;
   myDances: any;
   userData: any;
}> = ({ rosters, session, plan, myDances, userData, projects: initialProjects }) => {
   const { setPlan, setNumberOfDances } = useStore();
   useEffect(() => {
      setPlan(plan);
      setNumberOfDances(myDances.length);
   }, []);

   const MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN = 3;
   const supabase = createClientComponentClient();
   const pathname = usePathname();
   const router = useRouter();

   const [newFolderName, setNewFolderName] = useState("");
   async function createNewDance(roster?: any) {
      if (!plan && myDances.length >= MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN) {
         router.push("/upgrade");
         return;
      }

      if (session === null) {
         router.push(`/login`);
         return;
      }

      if (roster?.roster?.length) {
         roster.roster = roster.roster.map((dancer) => {
            return { ...dancer, id: uuidv4() };
         });
         const { data, error } = await supabase
            .from("dances")
            .insert([
               {
                  user: session.user.id,
                  last_edited: new Date(),
                  dancers: roster.roster,
                  formations: [
                     {
                        name: "First formation",
                        id: uuidv4(),
                        positions: roster.roster.map((dancer, index) => {
                           return { id: dancer.id, position: { x: index - 18, y: 0 } };
                        }),
                        durationSeconds: 3,
                        transition: { durationSeconds: 3 },
                     },
                  ],
               },
            ])
            .select("id")
            .single();
         if (!data?.id) return;
         router.refresh();
         router.push(`/${data.id}/edit`);
         return;
      }
      const { data, error } = await supabase
         .from("dances")
         .insert([{ user: session.user.id, last_edited: new Date() }])
         .select("id")
         .single();

      if (!data?.id) return;
      router.push(`/${data.id}/edit`);
   }

   async function createNewProject() {
      if (session === null) {
         router.push(`/login`);
         return;
      }

      const { error } = await supabase
         .from("projects")
         .insert([{ parent_id: session.user.id, name: newFolderName }])
         .select("id")
         .single();

      if (!error) {
         router.push("/dashboard/myperformances");
         router.refresh();
         toast.success("New folder created");
      } else {
         toast.error("Error creating new folder");
      }
   }

   const [projects, setProjects] = useState(initialProjects);

   return (
      <>
         <div className="min-w-[250px] bg-neutral-900  w-[250px]  border-r border-neutral-700   pb-4 h-screen lg:flex hidden flex-col box-border  text-sm  ">
            {/* {JSON.stringify(plan)} */}
            <div className="flex flex-row items-center px-3  h-[72px] min-h-[72px] border-b border-neutral-700 gap-3 ">
               {session?.user.user_metadata.avatar_url ? (
                  <img
                     referrerPolicy="no-referrer"
                     className="rounded-md  w-12 h-12 pointer-events-none select-none "
                     src={
                        session?.user.user_metadata.avatar_url ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjof8tQrQxYWAJQ7ICx4AaaN9rZK_bfgKsFuqssREfxA&s"
                     }
                     alt=""
                  />
               ) : null}

               <div className="flex flex-col items-start justify-center w-full">
                  <p className="font-semibold">{userData?.name || session?.user?.user_metadata?.full_name || session?.user?.email}</p>
                  <div className="text-neutral-300 text-[10px] flex flex-row items-center justify-between w-full">
                     {plan ? "Choreographer" : null}
                  </div>
               </div>
            </div>
            <div className=" rounded-xl  py-3  text-xs font-medium px-3  ">
               <div className="flex flex-col gap-1">
                  <Link
                     href="/dashboard"
                     prefetch={true}
                     className={`flex flex-row justify-between  items-center rounded-sm  hover:bg-neutral-800 transition cursor-default ${
                        pathname === "/dashboard" ? "bg-neutral-800" : ""
                     }   w-full h-9 px-3`}
                  >
                     <p>Home</p>
                  </Link>
                  <Link
                     href="/dashboard/myperformances"
                     prefetch={true}
                     className={`flex flex-row justify-between rounded-sm items-center hover:bg-neutral-800 transition cursor-default ${
                        pathname === "/dashboard/myperformances" ? "bg-neutral-800" : ""
                     }   w-full h-9 px-3`}
                  >
                     <p>My files</p>
                  </Link>
                  <div className="pl-5">
                     {projects.map((project) => {
                        return (
                           <Link
                              href={`/dashboard/project/${project.id}`}
                              prefetch={true}
                              className={`flex flex-row justify-between rounded-sm  items-center hover:bg-neutral-800 transition cursor-default ${
                                 pathname === `/dashboard/project/${project.id}` ? "bg-neutral-800" : ""
                              }   w-full h-8 px-3`}
                           >
                              <DoubleClickInput
                                 className="text-xs text-white dark:bg-transparent  font-medium h-5 mx-1 rounded-none border-transparent border-2  px-2  outline-none w-full dark:focus:bg-neutral-900"
                                 value={project.name}
                                 onChange={(e) => {
                                    setProjects(
                                       projects.map((p) => {
                                          if (p.id === project.id) {
                                             return { ...p, name: e.target.value };
                                          }
                                          return p;
                                       })
                                    );
                                 }}
                                 onBlur={async () => {
                                    const data = await supabase.from("projects").update({ name: project.name }).eq("id", project.id);
                                    console.log(data);
                                 }}
                              />
                              {/* <p>{project.name}</p> */}
                           </Link>
                        );
                     })}
                  </div>

                  <Link
                     href="/dashboard/sharedwithme"
                     prefetch={true}
                     className={`flex flex-row justify-between rounded-sm items-center hover:bg-neutral-800 transition cursor-default ${
                        pathname === "/dashboard/sharedwithme" ? "bg-neutral-800" : ""
                     }   w-full h-9 px-3`}
                  >
                     <p>Shared With Me</p>
                  </Link>
                  <Link
                     href="/dashboard/rosters"
                     prefetch={true}
                     className={`flex flex-row justify-between rounded-sm items-center hover:bg-neutral-800 transition cursor-default ${
                        pathname === "/dashboard/rosters" ? "bg-neutral-800" : ""
                     }   w-full h-9 px-3`}
                  >
                     <p>Rosters</p>
                  </Link>
               </div>
               <Dialog>
                  <DialogTrigger className="w-full">
                     <Button className="  mt-5 w-full  ">New project</Button>
                  </DialogTrigger>
                  <DialogContent>
                     <Input
                        value={newFolderName}
                        onChange={(e) => {
                           setNewFolderName(e.target.value);
                        }}
                        type="text"
                        placeholder="My first folder"
                        className="mt-5"
                     />
                     <DialogClose>
                        {" "}
                        <Button
                           onClick={() => {
                              if (!newFolderName.length) return;
                              createNewProject();
                           }}
                           className="text-white bg-pink-600 text-sm py-2 px-4"
                        >
                           Create new project
                        </Button>
                     </DialogClose>
                  </DialogContent>
               </Dialog>
               {/* <div className="flex flex-row items-center  bg-white mt-3  rounded-md"> */}
               <Dialog>
                  <DialogTrigger className="w-full">
                     <Button className="w-full mt-3 ">New performance</Button>
                  </DialogTrigger>

                  <DialogContent className="min-w-[600px] ">
                     <NewPerformanceBuilder
                        myDances={myDances}
                        rosters={rosters}
                        projects={projects}
                        createNewDance={createNewDance}
                     ></NewPerformanceBuilder>
                  </DialogContent>
               </Dialog>
               {/* </div> */}
            </div>

            <div className="px-3">
               {!plan ? (
                  <div className="bg-neutral-800 h-[170px] rounded-xl mt-4 text-xs flex flex-col items-center justify-between p-3 text-center">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <p className="mt-3">
                        {" "}
                        Ready to go beyond the free plan? Upgrade to create more than {MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN} performances.
                     </p>
                     <Button className="w-full" size={"sm"}>
                        <Link href={"/upgrade"}>View plans</Link>
                     </Button>
                  </div>
               ) : null}
            </div>

            <Link
               href={"/dashboard/trash"}
               className={`flex flex-row justify-between rounded-xl mt-auto items-center ${
                  pathname === "/dashboard/trash" ? "bg-neutral-700" : ""
               }   w-full h-9 px-3`}
            >
               <p>Trash</p>
            </Link>
         </div>
      </>
   );
};
