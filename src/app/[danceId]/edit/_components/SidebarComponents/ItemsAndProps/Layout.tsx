import { useRef, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Items } from "./Items";
export const ItemsAndProps: React.FC<{
   audioFiles: any;

   setAudiofiles: Function;

   setLocalSource: Function;

   // items: item[];
   // setFormations: Function;

   propUploads: any;
   // setItems: Function;
   selectedPropIds: string[];
   invalidatePropUploads: Function;
   setSelectedPropIds: Function;
   pushChange: Function;

   // formations: formation[];
   setHelpUrl: Function;
   setAssetsOpen: Function;
}> = ({
   setAssetsOpen,
   setHelpUrl,
   pushChange,
   setSelectedPropIds,
   invalidatePropUploads,
   selectedPropIds,
   propUploads,

   soundCloudTrackId,
   setSoundCloudTrackId,
   audioFiles,
   setAudiofiles,
   setLocalSource,
}) => {
   return (
      <>
         {/* <div ref={ref} className="flex   w-full h-full  flex-col  overflow-hidden dark:text-white   ">
            <Tabs defaultValue="props" className="w-full h-full flex flex-col overflow-hidden  ">
               <div className="pb-2  ">
                  <TabsList className="w-full rounded-none dark:bg-neutral-900 border-b border-neutral-700 ">
                     <TabsTrigger className="w-full bg-neutral-900" value="props">
                        Props
                     </TabsTrigger>
                     <TabsTrigger className="w-full" value="setpieces">
                        Scenery
                     </TabsTrigger>
                  </TabsList>
               </div>
               <TabsContent
                  style={{
                     flex: "1",
                  }}
                  className="flex flex-col overflow-hidden "
                  value="props"
               ></TabsContent>
               <TabsContent className="h-full mt-0" value="setpieces">
                  <Props
                     setAssetsOpen={setAssetsOpen}
                     setHelpUrl={setHelpUrl}
                     pushChange={pushChange}
                     setSelectedPropIds={setSelectedPropIds}
                     selectedPropIds={selectedPropIds}
                     invalidatePropUploads={invalidatePropUploads}
                     selectedPropIds={selectedPropIds}
                     propUploads={propUploads}
                     soundCloudTrackId={soundCloudTrackId}
                     setSoundCloudTrackId={setSoundCloudTrackId}
                     audioFiles={audioFiles}
                     setAudiofiles={setAudiofiles}
                     setLocalSource={setLocalSource}
                  ></Props>
               </TabsContent>
            </Tabs>
         </div> */}
         <div className="py-2">
            <Items
               setAssetsOpen={setAssetsOpen}
               setHelpUrl={setHelpUrl}
               pushChange={pushChange}
               setSelectedPropIds={setSelectedPropIds}
               invalidatePropUploads={invalidatePropUploads}
               selectedPropIds={selectedPropIds}
               propUploads={propUploads}
               soundCloudTrackId={soundCloudTrackId}
               setSoundCloudTrackId={setSoundCloudTrackId}
               audioFiles={audioFiles}
               setAudiofiles={setAudiofiles}
               setLocalSource={setLocalSource}
            ></Items>
         </div>
         <Toaster />
      </>
   );
};
