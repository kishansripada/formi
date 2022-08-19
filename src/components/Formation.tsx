import { useEffect } from "react";
// import { Resizable } from "re-resizable";
import { ResizableBox } from "react-resizable";
type dancer = {
   name?: string;
   id: number;
   isOnStage?: boolean;
   position: { x: number | null; y: number | null };
};

export const Formation: React.FC<{ formation: dancer[]; amSelected: boolean; setSelectedFormation: Function; index: number }> = ({
   formation,
   amSelected,
   setSelectedFormation,
   index,
}) => {
   return (
      <>
         {/* <Resizable
            className="bg-gray-200 mr-2 rounded-xl ring-2 ring-black  flex flex-row items-center py-3"
            enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            defaultSize={{
               width: 200,
               height: "100%",
            }}
         >
            <div className="h-full w-1 bg-gray-600 ml-auto rounded-full"></div>
         </Resizable> */}
         <div className={`rounded bg-gray-200 mr-3 h-full w-[200px] ${amSelected ? "ring-2 ring-black" : ""}`}>
            <p className="">{index}</p>
         </div>
         {/* <ResizableBox width={200} height={100} className="rounded bg-gray-200 mr-3">
            <span className="text-xs">{JSON.stringify(formation)}</span>
         </ResizableBox> */}
      </>
   );
};
