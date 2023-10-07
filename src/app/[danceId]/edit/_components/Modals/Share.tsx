import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Input } from "../../../../../../@/components/ui/input";
import { Button } from "../../../../../../@/components/ui/button";

type permission = {
   email: string;
   role: "view" | "edit";
};

export const Share: React.FC<{
   setPermissions: Function;
   permissions: permission[];
   anyoneCanView: boolean;
   setAnyoneCanView: Function;
   danceId: string;
   plan: string | null;
}> = ({ permissions, setPermissions, anyoneCanView, setAnyoneCanView, danceId, plan }) => {
   let [newUserEmail, setNewUserEmail] = useState("");
   const supabase = createClientComponentClient();

   const validateEmail = (email: string) => {
      return String(email)
         .toLowerCase()
         .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
         );
   };

   const addNewEmail = async (e) => {
      e.preventDefault();

      if (newUserEmail === "error") {
         throw new Error("this is a test error");
      }

      if (!validateEmail(newUserEmail)) {
         toast.error("please enter a valid email");
         return;
      }
      // user to perms table
      const { data, error } = await supabase
         .from("permissions")
         .upsert({ email: newUserEmail, performance_id: danceId }, { onConflict: "email, performance_id" })
         .eq("id", danceId);

      setNewUserEmail("");

      setPermissions([...permissions, { email: newUserEmail, role: "view" }]);
   };
   return (
      <div className="flex flex-col rounded-xl h-full text-sm mt-4">
         <div className="flex flex-row justify-between  overflow-hidden   rounded-md ">
            <Input
               value={newUserEmail}
               onChange={(e) => {
                  setNewUserEmail(e.target.value);
               }}
               onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                     addNewEmail(e);
                  }
               }}
               className="rounded-r-none"
               type="text"
               placeholder="Email address"
            />
            <button
               onClick={async (e) => {
                  // if (permissions.length > 0) {
                  //    toast.error("Upgrade to add more collaborators");
                  //    return;
                  // }

                  addNewEmail(e);
               }}
               className="text-sm dark:bg-neutral-600 bg-black text-neutral-200 w-10 grid place-items-center  "
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
               </svg>
            </button>
         </div>

         <div className="mt-5 dark:text-neutral-200">
            <div className="flex flex-row py-2 rounded-md px-2   ">
               <p className="">Anyone with the link</p>

               <select
                  value={anyoneCanView ? "view" : "none"}
                  onChange={(e) => {
                     if (e.target.value === "view") {
                        supabase
                           .from("dances")
                           .update({ anyonecanview: true, last_edited: new Date() })
                           .eq("id", danceId)
                           .then((r) => console.log(r));
                        setAnyoneCanView(true);
                     } else {
                        supabase
                           .from("dances")
                           .update({ anyonecanview: false, last_edited: new Date() })
                           .eq("id", danceId)
                           .then((r) => console.log(r));
                        setAnyoneCanView(false);
                     }
                  }}
                  className="ml-auto mr-2 text-right bg-transparent dark:text-neutral-200"
               >
                  <option value="view">can view</option>
                  <option value="none">none</option>
               </select>
            </div>
            {permissions.map((permission: permission) => {
               return (
                  <div className="flex flex-row rounded-md px-2 py-2 " key={permission.email}>
                     <p className="">{permission.email}</p>

                     <select
                        onChange={async (e) => {
                           if (e.target.value === "remove") {
                              const { data, error } = await supabase
                                 .from("permissions")
                                 .delete()
                                 .eq("performance_id", danceId)
                                 .eq("email", permission.email);

                              setPermissions(permissions.filter((p) => p.email !== permission.email));
                           } else {
                              setPermissions((permissions: permission[]) => {
                                 return permissions.map((p: permission) => {
                                    if (p.email === permission.email) {
                                       return { ...p, role: e.target.value };
                                    } else {
                                       return p;
                                    }
                                 });
                              });
                              const { data, error } = await supabase
                                 .from("permissions")
                                 .upsert(
                                    { email: permission.email, performance_id: danceId, role: e.target.value },
                                    { onConflict: "email, performance_id" }
                                 )
                                 .eq("performance_id", danceId);
                           }
                        }}
                        className="ml-auto mr-2 text-right bg-transparent"
                        value={permission.role}
                     >
                        <option value="view">can view</option>
                        <option value="edit">can edit</option>
                        <option value="remove">remove</option>
                     </select>
                  </div>
               );
            })}
         </div>
         <div className="flex w-full  items-center space-x-2 mt-5">
            <Input value={`https://formistudio.app/${danceId}/edit`} className="" type="text" />
            <Button
               size={"sm"}
               onClick={() => {
                  navigator.clipboard.writeText(`https://formistudio.app/${danceId}/edit`);
                  toast.success("Copied to clipboard");
               }}
               className=" whitespace-nowrap "
            >
               Copy Link
            </Button>
         </div>

         <div className="flex flex-row items-center justify-between mt-6">
            <p className="dark:text-neutral-400 text-xs  ">Edit in real-time with your other choreographers</p>
            {/* <Link href={"/upgrade"} className="text-pink-400 font-semibold text-xs">
                  Upgrade
               </Link> */}
         </div>
      </div>
   );
};
