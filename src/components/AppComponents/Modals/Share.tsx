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
   useEffect(() => {
      if (session) {
         updateShareSettings();
      }
   }, [shareSettings]);
   const updateShareSettings = async () => {
      // setShareSettings(async (shareSettings) => {
      const { data, error } = await supabase
         .from("dances")
         .update({ sharesettings: shareSettings, last_edited: new Date() })
         .eq("id", router.query.danceId);
      if (!error) {
         // toast.success("Share Settings Updated");
      }
      if (error) {
         toast.error("there was an error saving your settings");
      }
      //    return shareSettings;
      // });
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
            <div className="flex  w-[500px] flex-col   bg-neutral-800 border border-neutral-500  rounded-xl  text-sm ">
               <div className="flex flex-col rounded-xl px-10 pt-10 pb-6 h-full">
                  <div className="flex flex-row justify-between items-stretch border-neutral-500 overflow-hidden bg-neutral-700 border rounded-md ">
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
                              // console.log(shareSettings);
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
                        className=" bg-transparent   w-full mr-2 h-8 py-4   text-neutral-200 text-sm  px-2 focus:outline-none"
                        type="text"
                        placeholder="Email address"
                     />
                     <button
                        style={
                           {
                              // backgroundColor: validateEmail(newUserEmail) ? "#db2777" : "#F3F4F6",
                           }
                        }
                        onClick={(e) => {
                           e.preventDefault();

                           if (!validateEmail(newUserEmail)) {
                              return;
                           }

                           if (shareSettings[newUserEmail]) {
                              toast.error("You've already entered that email");
                              return;
                           }
                           setShareSettings((users) => {
                              return { ...users, [newUserEmail]: "view" };
                           });
                           setNewUserEmail("");
                           // updateShareSettings();
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
                                    .eq("id", router.query.danceId)
                                    .then((r) => console.log(r));
                                 setAnyoneCanView(true);
                              } else {
                                 // console.log("make false");
                                 supabase
                                    .from("dances")
                                    .update({ anyonecanview: false, last_edited: new Date() })
                                    .eq("id", router.query.danceId)
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
                     {Object.entries(shareSettings).map((user) => {
                        return (
                           <div className="flex flex-row py-2 rounded-md px-2 py-2 " key={user[0]}>
                              <p className="text-neutral-200">{user[0]}</p>

                              <select
                                 onChange={(e) => {
                                    if (e.target.value === "remove") {
                                       setShareSettings((users) => {
                                          let state = { ...users };
                                          delete state[user[0]];
                                          return state;
                                       });
                                    } else {
                                       setShareSettings((users) => {
                                          return { ...users, [user[0]]: e.target.value };
                                       });
                                    }
                                 }}
                                 className="ml-auto mr-2 text-right bg-transparent"
                                 value={user[1]}
                                 id=""
                              >
                                 <option value="view">can view</option>
                                 <option value="edit">can edit</option>
                                 <option value="remove">remove</option>
                              </select>
                           </div>
                        );
                     })}
                  </div>
                  {Object.entries(shareSettings).length ? (
                     <p className="text-neutral-400 text-xs mt-4 ">Collaborative Editing is Coming Soon</p>
                  ) : null}
               </div>
               {/* <div className="flex flex-row justify-between items-center w-full bg-neutral-100 h-16  px-5">
                  <button
                     onClick={() => setShareIsOpen(false)}
                     className=" border border-neutral-300 bg-white hover:bg-neutral-100 px-4  py-1 rounded-md"
                  >
                     Cancel
                  </button>
                  <button
                     onClick={() => {
                        navigator.clipboard.writeText(window.location.href).then(
                           function () {
                              toast.success("Link Copied");
                           },
                           function (err) {
                              toast.error("There was an error copying the link");
                           }
                        );
                     }}
                     className=" text-blue-500 text-sm ml-4 flex flex-row items-center"
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 mr-2"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                        />
                     </svg>
                     Copy Link
                  </button>
                  <button
                     className="ml-auto bg-pink-600 hover:bg-pink-700 text-white px-5 py-1 rounded-md"
                     onClick={() => {
                        // updateShareSettings();
                        setShareIsOpen(false);
                     }}
                  >
                     Save
                  </button>
               </div> */}
            </div>
         </div>
         <Toaster />
      </>
   );
};
