import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AuthSession } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const NewFolderModel: React.FC<{
   setNewFolderName: Function;
   setNewFolderOpen: Function;
   newFolderName: string;
   session: AuthSession;
}> = ({ setNewFolderName, setNewFolderOpen, newFolderName, session }) => {
   const router = useRouter();

   const supabase = createClientComponentClient();
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
   return (
      <>
         <Toaster></Toaster>
         <div
            className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
            id="outside"
            onClick={(e) => {
               if ((e.target as HTMLElement).id === "outside") {
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
                     createNewProject().then((_) => {
                        setNewFolderOpen(false);
                     });
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
