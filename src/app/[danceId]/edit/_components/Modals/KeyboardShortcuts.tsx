import { HStack, VStack } from "../../../../../../@/components/ui/stacks";
import LearnKeyboardShortcut from "../../../../../../@/components/LearnKeyboardShortcut";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const KeyboardShortcuts: React.FC<{}> = ({}) => {
   return (
      <Tabs defaultValue="essentials" className="">
         <div className="py-4">
            <TabsList className="w-full">
               <TabsTrigger className="w-full" value="essentials">
                  Essentials
               </TabsTrigger>
               <TabsTrigger className="w-full" value="timeline">
                  Timeline
               </TabsTrigger>
            </TabsList>
         </div>
         <TabsContent value="essentials">
            <VStack className="gap-16 mt-4">
               <HStack className="gap-10">
                  <LearnKeyboardShortcut
                     action="Show/Hide UI"
                     description="Press it now to quickly hide the panes and focus on your work"
                     shortcut={["⌘", "\\"]}
                  />
                  <LearnKeyboardShortcut
                     action="Rotate stage"
                     description="Press it to flip the stage 180 degrees and view dancers from the other side"
                     shortcut={["R"]}
                  />
                  <LearnKeyboardShortcut
                     action="Presentation mode"
                     description="Toggle the entire stage in fullscreen to take up as much space as possible"
                     shortcut={["F"]}
                  />
               </HStack>
               <HStack className="gap-10">
                  <LearnKeyboardShortcut action="Switch to 3D view" description="Press it to switch to viewing dancers in 3D" shortcut={["3"]} />
                  <LearnKeyboardShortcut action="Switch to 2D view" description="Press it to switch to viewing dancers in 2D" shortcut={["2"]} />
                  <div className="w-full"></div>
               </HStack>
               <HStack className="gap-10">
                  <LearnKeyboardShortcut
                     action="Select all dancers"
                     description="Press it to select all dancers in the current formation"
                     shortcut={["⌘", "A"]}
                  />
                  <LearnKeyboardShortcut
                     action="Copy selected dancers"
                     description="Press it to copy the properties and positions of the selected dancers on the current formation"
                     shortcut={["⌘", "C"]}
                  />
                  <LearnKeyboardShortcut
                     action="Paste selected dancers"
                     description="Press it to paste the properties and positions of the selected dancers on the current formation"
                     shortcut={["⌘", "V"]}
                  />
               </HStack>
            </VStack>
         </TabsContent>
         <TabsContent value="timeline">
            <VStack className="gap-16 mt-4">
               <HStack className="gap-10">
                  <LearnKeyboardShortcut action="Play/Pause" description="Press space to play/pause the timeline" shortcut={["Spacebar"]} />

                  <LearnKeyboardShortcut
                     action="Extend timeline during drag"
                     description="Holdling shift while dragging on the timeline will extent the entire timeline shinking surrounding formations to fit"
                     shortcut={["Shift"]}
                  />

                  <div className="w-full"></div>
               </HStack>
               <HStack className="gap-10">
                  <LearnKeyboardShortcut
                     action="Previous formation"
                     description="Press the left arrow key to toggle to the previous formation "
                     shortcut={["Left arrow"]}
                  />
                  <LearnKeyboardShortcut
                     action="Next formation"
                     description="Press the right arrow key to toggle to the next formation "
                     shortcut={["Right arrow"]}
                  />
                  <div className="w-full"></div>
               </HStack>
            </VStack>
         </TabsContent>
      </Tabs>
   );
};
