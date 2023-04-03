import { dancer, dancerPosition, formation } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown } from "./Dropdown";
import { useSupabaseClient, useSession, Session } from "@supabase/auth-helpers-react";

export const Organization: React.FC<{ organization: any; getOrganization: Function }> = ({ organization, getOrganization }) => {
   let [openPerformanceMenu, setOpenPerformanceMenu] = useState<string | null>(null);
   let [newEmail, setNewEmail] = useState<string>("");
   const [orgName, setOrgName] = useState<string>(organization[0].organization_name);
   let session = useSession();
   const supabase = useSupabaseClient();

   const clickHandler = (e) => {
      let isDropdown = e
         .composedPath()
         .map((elem) => elem.id)
         .includes("dropdown");

      if (!isDropdown) {
         setOpenPerformanceMenu(null);
      }
   };
   useEffect(() => {
      window.addEventListener("click", clickHandler);

      return () => {
         window.removeEventListener("click", clickHandler);
      };
   }, [openPerformanceMenu]);

   return (
      <>
         <Toaster></Toaster>
         <div className="flex flex-col h-full w-full px-[25%]">
            <h1 className="mt-16 text-2xl">My Organization</h1>
            <input
               className=" rounded-md w-full h-10 mt-6 outline-gray-400 transition outline-2  px-4 focus:outline-pink-600 focus:outline-2   "
               placeholder="My Organization"
               value={orgName}
               onChange={(e) => {
                  setOrgName(e.target.value);
               }}
               onBlur={() => {
                  if (orgName === organization[0].organization_name) return;
                  supabase
                     .from("organizations")
                     .update({ name: orgName })
                     .eq("id", organization[0].organization_id)
                     .then((r) => {
                        if (r.error) {
                           toast.error("Error updating organization name");
                        } else {
                           toast.success("Organization name updated");
                        }
                     });
               }}
               type="text"
            />
            <p className="mt-4">You have {10 - organization.length} seats remaining</p>
            <div className="mt-1">
               {organization.map((user) => {
                  return (
                     <div className="bg-gray-200 rounded-md mb-2 px-2 py-2 flex flex-row items-center justify-between" key={user.user_id}>
                        <p> {user.email}</p>
                        <button
                           onClick={() => {
                              supabase
                                 .from("organization_roles")
                                 .delete()
                                 .eq("user_id", user.user_id)
                                 .then((r) => {
                                    console.log(r);
                                    getOrganization(session);
                                 });
                           }}
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                              />
                           </svg>
                        </button>
                     </div>
                  );
               })}
            </div>
            <p className="mt-4">Invite Choreographer</p>
            <div className="flex flex-row items-center  mt-2">
               <input
                  className=" rounded-md w-full h-10 outline-gray-400 transition outline-2  px-4 focus:outline-pink-600 focus:outline-2   "
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => {
                     setNewEmail(e.target.value);
                  }}
                  type="text"
               />
               <button
                  onClick={() => {
                     if (organization.length >= 10) {
                        toast.error("You have reached the maximum number of seats for your organization");
                        return;
                     }
                     if (!isValidEmail(newEmail)) {
                        toast.error("Please enter a valid email");
                        return;
                     }
                     supabase
                        .from("users")
                        .select("*")
                        .eq("email", newEmail)
                        .single()
                        .then((r) => {
                           console.log(r);
                           if (!r?.data) {
                              toast.error("That email is not registered with FORMI");
                           } else {
                              supabase
                                 .from("organization_roles")
                                 .insert([{ user_id: r.data.id, organization_id: organization[0].organization_id, role: "editor" }])
                                 .then((r) => {
                                    if (r.error) {
                                       toast.error(r.error.message);
                                    } else {
                                       toast.success("Invited!");
                                       getOrganization(session);
                                       setNewEmail("");
                                    }
                                 });
                           }
                        });
                  }}
                  style={{
                     backgroundColor: isValidEmail(newEmail) ? "#db2777" : "#9ca3af",
                  }}
                  className="rounded-md  h-full px-5 text-white ml-3"
               >
                  Invite
               </button>
            </div>
         </div>
      </>
   );
};

var timeSince = function (date: string) {
   if (typeof date !== "object") {
      date = new Date(date);
   }

   var seconds = Math.floor((new Date() - date) / 1000);
   var intervalType;

   var interval = Math.floor(seconds / 31536000);
   if (interval >= 1) {
      intervalType = "year";
   } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
         intervalType = "month";
      } else {
         interval = Math.floor(seconds / 86400);
         if (interval >= 1) {
            intervalType = "day";
         } else {
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
               intervalType = "hour";
            } else {
               interval = Math.floor(seconds / 60);
               if (interval >= 1) {
                  intervalType = "minute";
               } else {
                  interval = seconds;
                  intervalType = "second";
               }
            }
         }
      }
   }

   if (interval > 1 || interval === 0) {
      intervalType += "s";
   }

   return interval + " " + intervalType;
};

const isValidEmail = (email: string) => {
   return String(email)
      .toLowerCase()
      .match(
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};
