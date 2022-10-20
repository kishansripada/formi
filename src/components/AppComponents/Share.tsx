import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { memo } from "react";
import { PIXELS_PER_SECOND, formation } from "../../types/types";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/router";
import e from "express";

export const Share: React.FC<{
   setShareIsOpen: Function;
   setShareSettings: Function;
   shareSettings: any;
   anyoneCanView: boolean;
   setAnyoneCanView: Function;
}> = ({ setShareIsOpen, shareSettings, setShareSettings, anyoneCanView, setAnyoneCanView }) => {
   let [newUserEmail, setNewUserEmail] = useState("");
   const router = useRouter();

   const updateShareSettings = async () => {
      const { data, error } = await supabase
         .from("dances")
         .update({ sharesettings: shareSettings, last_edited: new Date() })
         .eq("id", router.query.danceId);
      if (data) {
         toast.success("share settings updated");
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
            <div className="flex  w-[700px] flex-col rounded-xl bg-white">
               <div className="flex flex-col rounded-xl px-10 pt-10 pb-6 h-full">
                  <div className="flex flex-row">
                     <h1 className="text-2xl font-semibold mr-auto">Sharing settings</h1>
                     <div className="flex flex-row items-center justify-center mx-5">
                        <p className="text-sm font-medium text-gray-900 mr-3">anyone with the link can view</p>

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

                                 if (data) {
                                    toast.success("share settings updated");
                                    setAnyoneCanView(data[0].anyonecanview);
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
                  <input
                     value={newUserEmail}
                     onChange={(e) => {
                        setNewUserEmail(e.target.value);
                     }}
                     onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                           e.preventDefault();
                           if (!validateEmail(newUserEmail)) {
                              toast.error("please enter a valid email");
                              return;
                           }
                           if (shareSettings[e.target.value]) {
                              toast.error("you've already entered that email");
                              return;
                           }
                           setShareSettings((users) => {
                              return { ...users, [e.target.value]: "view" };
                           });
                           setNewUserEmail("");
                        }
                     }}
                     className="mt-10 focus:outline-pink-600 rounded-sm w-2/3 h-8  outline-gray-400 focus:outline-2  outline-2 focus:outline outline px-2"
                     type="text"
                     placeholder="enter an email"
                  />
                  <div className="mt-5">
                     {Object.entries(shareSettings).map((user) => {
                        return (
                           <div className="flex flex-row mb-3" key={user[0]}>
                              <p>{user[0]}</p>
                              <select
                                 className="ml-auto"
                                 name=""
                                 id=""
                                 onChange={(e) => {
                                    setShareSettings((users) => {
                                       return { ...users, [user[0]]: e.target.value };
                                    });
                                 }}
                              >
                                 <option value="view">view</option>
                                 {/* <option value="edit">edit</option> */}
                              </select>
                              <button
                                 onClick={() => {
                                    setShareSettings((users) => {
                                       //    let test = users;
                                       //    delete test[user[0]];
                                       //    return test;
                                    });
                                 }}
                              >
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 ml-3"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                 </svg>
                              </button>
                           </div>
                        );
                     })}
                  </div>
                  {Object.entries(shareSettings).length ? <p className="text-gray-500 text-xs italic">collaborative editing is coming soon</p> : null}
                  <button className="ml-auto bg-blue-600 text-white px-3 mt-5 py-1 rounded-md" onClick={updateShareSettings}>
                     save
                  </button>
               </div>
            </div>
         </div>
         <Toaster />
      </>
   );
};
