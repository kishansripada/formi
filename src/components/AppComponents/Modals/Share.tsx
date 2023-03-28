import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export const Share: React.FC<{
   setShareIsOpen: Function;
   setShareSettings: Function;
   shareSettings: any;
   anyoneCanView: boolean;
   setAnyoneCanView: Function;
}> = ({ setShareIsOpen, shareSettings, setShareSettings, anyoneCanView, setAnyoneCanView }) => {
   let [newUserEmail, setNewUserEmail] = useState("");
   const router = useRouter();
   let session = useSession();
   const supabase = useSupabaseClient();
   const updateShareSettings = async () => {
      const { data, error } = await supabase
         .from("dances")
         .update({ sharesettings: shareSettings, last_edited: new Date() })
         .eq("id", router.query.danceId);
      if (!error) {
         toast.success("Share Settings Updated");
      }
      if (error) {
         toast.error("there was an error saving your settings");
      }
      setShareIsOpen(false);
   };
   const validateEmail = (email: string) => {
      return String(email)
         .toLowerCase()
         .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
         );
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
            <div className="flex  w-[700px] flex-col rounded-xl bg-white ">
               <div className="flex flex-col rounded-xl px-10 pt-10 pb-6 h-full">
                  <div className="flex flex-row">
                     <h1 className="text-2xl  mr-auto">Sharing Settings</h1>
                     <div className="flex flex-col items-end justify-center mx-5">
                        <p className="text-sm  text-gray-700  mb-3">Anyone With The Link Can View</p>

                        <label className="inline-flex relative items-center cursor-pointer">
                           <input
                              type="checkbox"
                              id="checked-toggle"
                              className="sr-only peer"
                              checked={anyoneCanView}
                              onChange={async (e) => {
                                 const { data, error } = await supabase
                                    .from("dances")
                                    .update({ anyonecanview: !anyoneCanView, last_edited: new Date() })
                                    .eq("id", router.query.danceId);
                                 console.log(data);
                                 if (!error) {
                                    toast.success("Share Settings Updated");
                                    setAnyoneCanView(!anyoneCanView);
                                 }
                                 if (error) {
                                    toast.error("there was an error saving your settings");
                                 }
                              }}
                           />
                           <div className="w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                        </label>
                     </div>
                  </div>
                  <div className="flex flex-row justify-between items-center mt-10 ">
                     <input
                        value={newUserEmail}
                        onChange={(e) => {
                           setNewUserEmail(e.target.value);
                        }}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") {
                              e.preventDefault();

                              if (!validateEmail(newUserEmail)) {
                                 toast.error("please enter a valid email");
                                 return;
                              }
                              console.log(shareSettings);
                              if (shareSettings[newUserEmail]) {
                                 toast.error("you've already entered that email");
                                 return;
                              }
                              setShareSettings((users) => {
                                 return { ...users, [newUserEmail]: "view" };
                              });
                              setNewUserEmail("");
                           }
                        }}
                        className="focus:border-pink-700 focus:border-2 rounded-md w-full mr-10 h-8 py-4 border-gray-300 border text-sm shadow-sm px-2 focus:outline-none"
                        type="text"
                        placeholder="Enter an Email"
                     />
                     <button
                        onClick={(e) => {
                           e.preventDefault();

                           if (!validateEmail(newUserEmail)) {
                              toast.error("please enter a valid email");
                              return;
                           }
                           console.log(shareSettings);
                           if (shareSettings[newUserEmail]) {
                              toast.error("you've already entered that email");
                              return;
                           }
                           setShareSettings((users) => {
                              return { ...users, [newUserEmail]: "view" };
                           });
                           setNewUserEmail("");
                        }}
                        className="text-gray-700 text-sm border border-gray-300 rounded-md px-2 py-1 ml-auto"
                     >
                        Add
                     </button>
                  </div>

                  <div className="mt-5">
                     {Object.entries(shareSettings).map((user) => {
                        return (
                           <div className="flex flex-row py-2 rounded-md px-2 hover:bg-gray-100" key={user[0]}>
                              <p className="text-gray-700">{user[0]}</p>

                              <select
                                 onChange={(e) => {
                                    setShareSettings((users) => {
                                       return { ...users, [user[0]]: e.target.value };
                                    });
                                 }}
                                 className="ml-auto mr-2"
                                 value={user[1]}
                                 id=""
                              >
                                 <option value="view">View</option>
                                 <option value="edit">Edit</option>
                              </select>
                              <button
                                 onClick={() => {
                                    setShareSettings((users) => {
                                       let state = { ...users };
                                       delete state[user[0]];
                                       return state;
                                    });
                                 }}
                                 className="text-gray-700 text-sm border border-gray-300 rounded-md px-2 py-1 "
                              >
                                 Remove
                              </button>
                           </div>
                        );
                     })}
                  </div>
                  {Object.entries(shareSettings).length ? <p className="text-gray-400 text-xs mt-4 ">Collaborative Editing is Coming Soon</p> : null}
               </div>
               <div className="flex flex-row justify-between items-center w-full bg-gray-100 h-16 rounded-b-xl px-5">
                  <button onClick={() => setShareIsOpen(false)} className=" border border-gray-300 bg-white hover:bg-gray-100 px-4  py-1 rounded-md">
                     Cancel
                  </button>
                  <button className="ml-auto bg-pink-600 hover:bg-pink-700 text-white px-5 py-1 rounded-md" onClick={updateShareSettings}>
                     Save
                  </button>
               </div>
            </div>
         </div>
         <Toaster />
      </>
   );
};
