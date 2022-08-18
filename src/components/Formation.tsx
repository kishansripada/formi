import { useEffect } from "react";
import { Resizable } from "re-resizable";

export const Formation: React.FC<{}> = ({}) => {
   return (
      <>
         <Resizable
            className="bg-gray-200 mr-2 rounded-2xl ring-2 ring-black  flex flex-row items-center py-3"
            enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            defaultSize={{
               width: 200,
               height: "100%",
            }}
         >
            <div className="h-full w-1 bg-gray-600 ml-auto rounded-full"></div>
         </Resizable>
      </>
   );
};
