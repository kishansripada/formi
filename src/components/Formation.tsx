import { useEffect } from "react";
// import { Resizable } from "re-resizable";
import { ResizableBox } from "react-resizable";
type dancer = {
   name?: string;
   id: string;
   isOnStage?: boolean;
   position: { x: number | null; y: number | null };
};
type formation = {
   durationSeconds: number;
   positions: dancer[];
};

export const Formation: React.FC<{
   formation: formation;
   amSelected: boolean;
   index: number;
   setFormations: Function;
   setSelectedFormation: Function;
   deleteFormation: Function;
}> = ({ formation, amSelected, index, setFormations, setSelectedFormation, deleteFormation }) => {
   return (
      <>
         <div
            className={` bg-gray-200 ring-black ring-2 h-full flex flex-row rounded-xl group mr-1 ${amSelected ? "bg-gray-400" : ""}`}
            style={{
               width: formation.durationSeconds * 100 + 0.3,
            }}
         >
            {/* <p className="">index: {index}</p>
            <p className="">duration: {formation.durationSeconds}s</p> */}

            <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-6 w-6 ml-auto mr-1 mt-1 fill-gray-300 cursor-pointer invisible group-hover:visible"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth={2}
               onClick={() => deleteFormation(index)}
            >
               <path
                  id="delete"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
               />
            </svg>
         </div>
      </>
   );
};
