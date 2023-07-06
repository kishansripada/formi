import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
type permission = {
   email: string;
   role: "view" | "edit";
};
export const NewFolderModel: React.FC<{
   setNewFolderName: Function;
   setNewFolderOpen: Function;
   newFolderName: string;
   createNewProject: Function;
}> = ({ setNewFolderName, setNewFolderOpen, newFolderName, createNewProject }) => {
   let [newUserEmail, setNewUserEmail] = useState("");
   const router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();

   return (
      <>
         <Toaster></Toaster>
         <div
            className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
            id="outside"
            onClick={(e) => {
               if (e.target.id === "outside") {
                  setNewFolderOpen(false);
               }
            }}
         >
            <div className="flex  w-[500px] flex-col overflow-hidden   bg-neutral-800/90 border border-neutral-500  rounded-xl  text-sm ">
               <div className="flex flex-col rounded-xl px-10 pt-10 pb-6 h-full">
                  <div className="flex flex-row justify-between items-stretch border-neutral-500 overflow-hidden bg-neutral-700 border rounded-md ">
                     <input
                        value={newFolderName}
                        onChange={(e) => {
                           setNewFolderName(e.target.value);
                        }}
                        onKeyDown={async (e) => {
                           if (e.key === "Enter") {
                              if (!newFolderName.length) return;
                              setNewFolderOpen(false);
                              createNewProject();
                           }
                        }}
                        className=" bg-transparent   w-full mr-2 h-8 py-4   text-neutral-200 text-sm  px-2 focus:outline-none"
                        type="text"
                        placeholder="My first project"
                     />
                  </div>
               </div>
               <button
                  onClick={() => {
                     if (!newFolderName.length) return;
                     setNewFolderOpen(false);
                     createNewProject();
                  }}
                  className="text-white bg-pink-600 text-sm py-2 px-4"
               >
                  Create new folder
               </button>
            </div>
         </div>
         <Toaster />
      </>
   );
};
