import toast, { Toaster } from "react-hot-toast";
import { dancer, dancerPosition, formation } from "../../types/types";
import { MouseEvent } from "react";

export const EditDancer: React.FC<{
   setEditingDancer: Function;
   editingDancer: string | null;
   dancers: dancer[];
   setDancers: Function;
   removeDancer: Function;
}> = ({ setEditingDancer, editingDancer, dancers, setDancers, removeDancer }) => {
   return (
      <div
         id="outside"
         className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
         onClick={(e) => {
            if (e.target.id === "outside") {
               setEditingDancer(null);
            }
         }}
      >
         <div className="flex  w-[400px] flex-col rounded-xl bg-white pt-10 pb-3 px-3">
            <p className="text-3xl text-center mb-8">{dancers.find((dancer) => dancer.id === editingDancer)?.name}</p>

            <div className="flex flex-col mt-auto">
               <div className="flex flex-col items-center">
                  <div className="flex flex-col items-start">
                     <p className="text-sm">image url:</p>
                     <input
                        defaultValue={dancers.find((dancer) => dancer.id === editingDancer)?.instagramUsername || ""}
                        onBlur={(e) => {
                           setDancers((dancers: dancer[]) => {
                              return dancers.map((dancer) => {
                                 if (dancer.id === editingDancer) {
                                    return { ...dancer, instagramUsername: e.target.value };
                                 }
                                 return dancer;
                              });
                           });
                        }}
                        className=" border-black border-2 rounded-md focus:outline-none px-2 h-8  grow "
                        type="text"
                     />
                  </div>
               </div>
               <div className="flex flex-row justify-between">
                  <button
                     className="bg-red-600 flex flex-row mt-6 text-white px-2 py-1 rounded-md "
                     onClick={() => {
                        setEditingDancer(null);
                        removeDancer(editingDancer);
                     }}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" fill-white w-5 h-5 mr-2">
                        <path
                           fillRule="evenodd"
                           d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                           clipRule="evenodd"
                        />
                     </svg>
                     delete dancer
                  </button>
                  <button
                     className="bg-pink-600 flex flex-row mt-6 text-white px-2 py-1 rounded-md"
                     onClick={() => {
                        setEditingDancer(null);
                     }}
                  >
                     save
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};
