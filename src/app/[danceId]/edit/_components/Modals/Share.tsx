import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
type permission = {
   email: string;
   role: "view" | "edit";
};
export const Share: React.FC<{
   setShareIsOpen: Function;
   setPermissions: Function;
   permissions: permission[];
   anyoneCanView: boolean;
   setAnyoneCanView: Function;
   danceId: string;
}> = ({ setShareIsOpen, permissions, setPermissions, anyoneCanView, setAnyoneCanView, danceId }) => {
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
         return;
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

      // await fetch("/api/sendshareemail", {
      //    method: "POST",
      //    body: JSON.stringify({
      //       email: newUserEmail,
      //       performance_id: danceId,
      //    }),
      // })
      //    .then((r) => r.json())
      //    .then((r) => console.log(r));
      setNewUserEmail("");

      setPermissions([...permissions, { email: newUserEmail, role: "view" }]);
   };
   return (
      <>
         <Toaster></Toaster>
         <div
            className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
            id="outside"
            onClick={(e) => {
               if (e.target.id === "outside") {
                  setShareIsOpen(false);
               }
            }}
         >
            <div className="flex  w-[500px] flex-col   bg-neutral-800/90 border border-neutral-500  rounded-xl  text-sm ">
               <div className="flex flex-col rounded-xl px-10 pt-10 pb-6 h-full">
                  <div className="flex flex-row justify-between items-stretch border-neutral-500 overflow-hidden bg-neutral-700 border rounded-md ">
                     <input
                        value={newUserEmail}
                        onChange={(e) => {
                           setNewUserEmail(e.target.value);
                        }}
                        onKeyDown={async (e) => {
                           if (e.key === "Enter") {
                              addNewEmail(e);
                           }
                        }}
                        className=" bg-transparent   w-full mr-2 h-8 py-4   text-neutral-200 text-sm  px-2 focus:outline-none"
                        type="text"
                        placeholder="Email address"
                     />
                     <button
                        onClick={async (e) => {
                           addNewEmail(e);
                        }}
                        className="text-sm bg-neutral-600 text-neutral-200 w-10 grid place-items-center  "
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           strokeWidth={1.5}
                           stroke="currentColor"
                           className="w-5 h-5"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                           />
                        </svg>
                     </button>
                  </div>

                  <div className="mt-5 text-neutral-200">
                     <div className="flex flex-row py-2 rounded-md px-2   ">
                        <p className="text-neutral-200">Anyone with the link</p>

                        <select
                           value={anyoneCanView ? "view" : "none"}
                           onChange={(e) => {
                              if (e.target.value === "view") {
                                 // console.log("viewing");
                                 supabase
                                    .from("dances")
                                    .update({ anyonecanview: true, last_edited: new Date() })
                                    .eq("id", danceId)
                                    .then((r) => console.log(r));
                                 setAnyoneCanView(true);
                              } else {
                                 // console.log("make false");
                                 supabase
                                    .from("dances")
                                    .update({ anyonecanview: false, last_edited: new Date() })
                                    .eq("id", danceId)
                                    .then((r) => console.log(r));
                                 setAnyoneCanView(false);
                              }
                           }}
                           className="ml-auto mr-2 text-right bg-transparent text-neutral-200"
                        >
                           <option value="view">can view</option>
                           <option value="none">none</option>
                        </select>
                     </div>
                     {permissions.map((permission: permission) => {
                        console.log(permission);
                        return (
                           <div className="flex flex-row rounded-md px-2 py-2 " key={permission.email}>
                              <p className="text-neutral-200">{permission.email}</p>

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
                                       // console.log(e.target.value);
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

                  <div className="flex flex-row items-center mt-5">
                     <div className="flex flex-row  w-full justify-between items-stretch border-neutral-500 overflow-hidden bg-neutral-700 border rounded-md ">
                        <input
                           value={`https://formistudio.app/${danceId}/edit`}
                           className=" bg-transparent   w-full mr-2 h-8 py-4    text-neutral-200 text-xs  px-2 focus:outline-none"
                           type="text"
                        />
                     </div>

                     <button
                        onClick={() => {
                           navigator.clipboard.writeText(`https://formistudio.app/${danceId}/edit`);
                           toast.success("Copied to clipboard");
                        }}
                        className=" w-24 grid place-items-center text-white h-8 ml-1  border-neutral-500 overflow-hidden bg-neutral-700 border rounded-md "
                     >
                        Copy Link
                     </button>
                  </div>

                  <p className="text-neutral-400 text-xs mt-4 ">Collaborative Editing is Coming Soon</p>
               </div>
            </div>
         </div>
         <Toaster />
      </>
   );
};
