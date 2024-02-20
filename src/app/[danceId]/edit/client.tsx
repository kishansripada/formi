"use client";
import { v4 as uuidv4 } from "uuid";
import useCookies, { roundToHundredth, useSupabaseQuery, whereInFormation } from "../../../utls";
import { detectCollisions } from "../../../utils/collisionDetector";
import { useIsDesktop } from "../../../utls";
import { Video } from "./_components/Video";
import { DndContext, useDroppable } from "@dnd-kit/core";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback, lazy } from "react";
import Head from "next/head";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { useLocalStorage, useUploadToSupabase } from "../../../utls";
import debounce from "lodash.debounce";
import toast, { Toaster } from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { comment, PIXELS_PER_SQUARE, localSettings, prop, dancerPosition } from "../../../types/types";
import { AudioControls } from "./_components/AudioControls";
import { Header } from "./_components/Header";
import { DancerAlias } from "./_components/DancerAlias";
import { DancerAliasShadow } from "./_components/DancerAliasShadow";
import { Canvas } from "./_components/Canvas";
import { PathEditor } from "./_components/PathEditor";
import { Collision } from "./_components/Collision";
import { Sidebar } from "./_components/Sidebar";
import { Settings } from "./_components/SidebarComponents/Settings";
import { ChooseAudioSource } from "./_components/SidebarComponents/ChooseAudioSource";
import { Roster } from "./_components/SidebarComponents/Roster";
import { CurrentFormation } from "./_components/SidebarComponents/CurrentFormation";
import { AuthSession } from "@supabase/supabase-js";
import { Collisions } from "./_components/SidebarComponents/Collisions";
import { Timeline } from "./_components/Timeline";
import { FormationControls } from "./_components/FormationControls";
import { EventHandler } from "./_components/EventHandler";
import { Assets } from "./_components/Modals/Assets";
import { Prop } from "./_components/Prop";
import { Comment } from "./_components/Comment";
import { HelpUrl } from "./_components/Modals/HelpUrl";
import { ObjectControls } from "./_components/ObjectControls";
import { Database } from "../../../types/supabase";
import { StageSettings } from "./_components/SidebarComponents/StageSettings";
import { useStore } from "./store";
import { MobileSidebar } from "./_components/MobileSidebar";
import * as Sentry from "@sentry/browser";
import { TemplateOverlay } from "./_components/TemplateOverlay";
import { FormationIdeas } from "./_components/SidebarComponents/FormationIdeas";
import { ItemsAndProps } from "./_components/SidebarComponents/ItemsAndProps/Layout";
import { Button } from "../../../../@/components/ui/button";
import { exportThree } from "../../../utils/augmentedReality";
import { sleep } from "../../../utils/sleep";
import { AppWrapper } from "../../../../@/components/ui/app-wrapper";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HStack } from "../../../../@/components/ui/stacks";
import { Input } from "../../../../@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../@/components/ui/dropdown-menu";
import { DialogClose } from "@radix-ui/react-dialog";
import { FormationMarkersLayer } from "./_components/FormationMarkersLayer";
import { StageMarkersLayer } from "./_components/StageMarkersLayer";
import { useSearchParams } from "next/navigation";
import { HolyWidget } from "holyuser";
import { ReflectedDancers } from "./_components/ReflectedDancers";

if (typeof Node === "function" && Node.prototype) {
   const originalRemoveChild = Node.prototype.removeChild;
   Node.prototype.removeChild = function (child) {
      // debugger;
      if (child.parentNode !== this) {
         if (console) {
            console.error("Cannot remove a child from a different parent", child, this);
         }
         return child;
      }
      return originalRemoveChild.apply(this, arguments);
   };
}

const ThreeD = dynamic(() => import("./_components/ThreeD").then((mod) => mod.ThreeD), {
   loading: () => (
      <div className="flex items-center justify-center h-screen bg-neutral-900 ">
         <img src="/logo.png" className="w-12" alt="" />
      </div>
   ),
});

const Edit = ({
   initialData,
   viewOnly: viewOnlyInitial,
   pricingTier,
   params: { danceId },
   session,
   permissions: initialPermissions,
   plan,
   myCookies,
   userData,
}: {
   initialData: any;
   viewOnly: boolean;
   pricingTier: string;
   params: { danceId: string };
   session: AuthSession | null;
   permissions: string[];
   plan: string | null;
   userData: any;
}) => {
   const {
      segments,
      setSegments,
      dancers,
      setDancers,
      selectedFormation,
      formations,
      setFormations,
      viewOnly,
      setViewOnly,
      setDanceName,
      danceName,
      props,
      setProps,
      items,
      setItems,
      setNameOrEmail,
      setCloudSettings,
      cloudSettings,
      setSoundCloudTrackId,
      soundCloudTrackId,
      selectedDancers,
      setSelectedDancers,
      getFirstSelectedFormation,
      selectedFormations,
      setSelectedFormations,
      position,
      setPosition,
      setIsMobileView,
      isMobileView,
      setImageBlobs,
      shiftHeld,
      setShiftHeld,
      isPlaying,
      newFormationFromLast,
      getSelectedFormationIndex,
      commandHeld,
   } = useStore();

   const [cookies, setCookies] = useCookies(myCookies);
   useEffect(() => {
      // Sentry.init({
      //    dsn: "https://256536ba4b0c4b0e96d719fc685bbd59@o4504556574605312.ingest.sentry.io/4504965604638720",
      //    beforeSend(event, hint) {
      //       // Check if it is an exception, and if so, show the report dialog
      //       if (event.exception) {
      //          Sentry.showReportDialog({ eventId: event.event_id });
      //       }
      //       return event;
      //    },
      // });
      Sentry.setUser(session ? { email: session?.user.email, id: session?.user.id } : null);
      Sentry.setTag("plan", plan || "free tier");

      setSegments(initialData.segments);
      setDancers(initialData.dancers);
      setFormations(initialData.formations);
      setViewOnly(viewOnlyInitial);
      setProps(initialData.props);
      setItems(initialData.items);
      setCloudSettings({
         ...initialData.settings,
         stageBackground: initialData.settings.stageBackground || "grid",
         gridSubdivisions: initialData.settings.stageBackground === "cheer9" ? 9 : initialData.settings.gridSubdivisions || 8,
         horizontalFineDivisions: initialData.settings.horizontalFineDivisions || 4,
         verticalFineDivisions: initialData.settings.verticalFineDivisions || 4,
         horizontalGridSubdivisions: initialData.settings.horizontalGridSubdivisions || 4,
      });
      setNameOrEmail(session?.user.user_metadata.full_name || session?.user.email || "");
      setSoundCloudTrackId(initialData.soundCloudId);
      setSelectedFormations([initialData.formations[0].id]);
      setDanceName(initialData.name);

      function is_touch_enabled() {
         return !window.matchMedia("(pointer:fine)").matches;
         // return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator?.msMaxTouchPoints > 0;
      }
      setIsMobileView(Boolean(is_touch_enabled()));
      setMenuOpen(is_touch_enabled() ? null : "formations");
   }, []);

   const supabase = createClientComponentClient<Database>();

   const enterRoom = useStore((state) => state.liveblocks.enterRoom);
   const leaveRoom = useStore((state) => state.liveblocks.leaveRoom);

   const undo = useStore((state) => state.liveblocks.room?.history.undo);
   // const redo = useStore((state) => state.liveblocks.room?.history.redo);
   useEffect(() => {
      enterRoom(danceId);
      return () => {
         leaveRoom(danceId);
      };
   }, [enterRoom, leaveRoom]);

   const [localSettings, setLocalSettings] = useLocalStorage<localSettings>("localSettings", {
      gridSnap: 1,
      previousFormationView: "none",
      dancerStyle: "solid",
      viewCollisions: false,
      stageFlipped: false,
      viewingThree: false,
      viewingTwo: true,
      collisionRadius: 0.5,
      fullScreen: false,
      isDarkMode: true,
      autoScroll: false,
      isInSlideMode: false,
   });

   if (localSettings.viewingTwo === undefined || localSettings.isDarkMode === undefined || localSettings.autoScroll === undefined) {
      setLocalSettings({
         gridSnap: 1,
         previousFormationView: "none",
         dancerStyle: "solid",
         viewCollisions: false,
         stageFlipped: false,
         viewingThree: false,
         viewingTwo: true,
         collisionRadius: 0.5,
         fullScreen: false,
         isDarkMode: true,
         autoScroll: false,
         isInSlideMode: false,
      });
   }
   const videoPlayer = useRef();
   const fullscreenContainer = useRef();
   const [anyoneCanView, setAnyoneCanView] = useState(initialData.anyonecanview);
   const [permissions, setPermissions] = useState(initialPermissions);
   const [playbackRate, setPlaybackRate] = useState(1);
   const [selectedPropIds, setSelectedPropIds] = useState<string[]>([]);
   const [dropDownToggle, setDropDownToggle] = useState<boolean>(false);
   const [localSource, setLocalSource] = useState(null);
   const [zoom, setZoom] = useState(1);
   const [isCommenting, setIsCommenting] = useState<boolean>(false);
   const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(35);
   const [isScrollingTimeline, setIsScrollingTimeline] = useState(false);
   const [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);
   const [menuOpen, setMenuOpen] = useState<string | null>("formations");
   const [isThreeDancerDragging, setIsThreeDancerDragging] = useState(false);
   const [pdfLoading, setPdfLoading] = useState(false);
   const [assetsOpen, setAssetsOpen] = useState(false);
   const [scene, setScene] = useState(null);
   const [resizingPropId, setResizingPropId] = useState(null);
   const [videoPosition, setVideoPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">("top-right");
   const [helpUrl, setHelpUrl] = useState(null);
   const [currentTemplate, setCurrentTemplate] = useState([]);

   let { currentFormationIndex, percentThroughTransition } = whereInFormation(formations, position);

   const coordsToPosition = useCallback(
      (coords: { x: number; y: number }) => {
         if (!coords) return null;
         let { x, y } = coords;
         return {
            left: (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.width) / 2 + PIXELS_PER_SQUARE * x,
            top: (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.height) / 2 + PIXELS_PER_SQUARE * -y,
         };
      },
      [cloudSettings.stageDimensions]
   );

   useEffect(() => {
      let allImages = items.map((item) => `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${item?.url}`);
      if (cloudSettings.backgroundUrl) {
         allImages.push(cloudSettings.backgroundUrl);
      }

      allImages = [
         ...allImages,
         ...props.map((prop) => `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${prop.user_id}/${prop?.url}`),
      ];
      const fetchImage = async (url) => {
         const response = await fetch(url);
         const blob = await response.blob();
         const objectURL = URL.createObjectURL(blob);
         return [url, objectURL];
      };

      const fetchImages = async () => {
         const newImageMap = {};

         const promises = allImages.map((url) => fetchImage(url));
         const results = await Promise.all(promises);

         for (const [url, objectURL] of results) {
            newImageMap[url] = objectURL;
         }

         setImageBlobs(newImageMap);
      };

      fetchImages();
   }, [items.length, cloudSettings.backgroundUrl, props.length]);

   const { data: audioFiles, invalidate: invalidateAudioFiles } = useSupabaseQuery(() =>
      supabase.storage.from("audiofiles").list(session?.user.id, {})
   );
   const { data: propUploads, invalidate: invalidatePropUploads } = useSupabaseQuery(() => supabase.storage.from("props").list(session?.user.id, {}));

   useEffect(() => {
      if (!isPlaying) return;
      setSelectedFormations([formations.find((formation, i) => i === currentFormationIndex)?.id]);
   }, [currentFormationIndex, isPlaying]);

   const supabaseUploadingEnabled = !viewOnlyInitial && danceName !== "initialName";

   const soundCloudIdSaved = useUploadToSupabase("soundCloudId", soundCloudTrackId, danceId, supabaseUploadingEnabled);
   const danceNameIsSaved = useUploadToSupabase("name", danceName, danceId, supabaseUploadingEnabled);
   const cloudSettingsIsSaved = useUploadToSupabase("settings", cloudSettings, danceId, supabaseUploadingEnabled);
   const dancersIsSaved = useUploadToSupabase("dancers", dancers, danceId, supabaseUploadingEnabled);
   const formationsIsSaved = useUploadToSupabase("formations", formations, danceId, supabaseUploadingEnabled);
   const propsIsSaved = useUploadToSupabase("props", props, danceId, supabaseUploadingEnabled);
   const itemsIsSaved = useUploadToSupabase("items", items, danceId, supabaseUploadingEnabled);
   const segmentsIsSaved = useUploadToSupabase("segments", segments, danceId, supabaseUploadingEnabled);
   const localSettingsIsSaved = useUploadToSupabase("localsettings", localSettings, danceId, supabaseUploadingEnabled);

   const saved =
      soundCloudIdSaved &&
      danceNameIsSaved &&
      cloudSettingsIsSaved &&
      dancersIsSaved &&
      formationsIsSaved &&
      propsIsSaved &&
      itemsIsSaved &&
      segmentsIsSaved;

   let uploadFormations = useCallback(
      debounce(async (formations) => {
         const { data: danceData, error: danceError } = await supabase.from("activity").upsert({ date: new Date(), performance: danceId }).single();
      }, 10000),
      [danceId]
   );

   useEffect(() => {
      if (viewOnlyInitial || danceName === "initialName") return;

      uploadFormations(formations);
   }, [formations]);

   const collisions = localSettings.viewCollisions ? detectCollisions(formations, selectedFormations, localSettings.collisionRadius) : [];

   function handleDragEnd(event) {
      const { active, over } = event;

      if (over && active.data.current.supports.includes(over.data.current.type)) {
         setVideoPosition(over.id);
      }
   }

   const isDesktop = useIsDesktop();
   const [hasClickedOnTimeline, setHasClickedOnTimeline] = useState(false);
   //

   const feedbackOpen = !cookies.hasSeenTimelineShiftHelp && isDesktop && hasClickedOnTimeline;
   // console.log({ feedbackOpen });

   return (
      <>
         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Toaster></Toaster>
            <Head>
               <title>Edit | FORMI</title>

               <meta
                  name="description"
                  content="Easily visualize your dance formations. Simply drag and drop dancers onto a canvas of your dancers and see what works best!"
               />
               <meta name="keywords" content="dance, choreography, desi, formations" />
               <meta name="twitter:card" content="summary" />
               <meta name="twitter:title" content="FORMI — Online performance planning software." />
               <meta name="twitter:image" content="https://i.imgur.com/83VsfSG.png" />
               <meta property="og:type" content="song" />
               <meta property="og:title" content="FORMI — Online performance planning software." />
               <meta property="og:description" content="automate, animate and visualize your dance formations synced to music" />
               <meta property="og:image" content="https://i.imgur.com/83VsfSG.png" />
               <meta property="og:site_name" content="FORMI — Online performance planning software." />
            </Head>

            <HolyWidget
               userId={session?.user.id}
               user={{
                  email: session?.user.email,
                  created_at: userData?.created_at,
                  how_you_found_out: userData?.response_data?.howYouFoundOut,
                  selectedUses: userData?.response_data?.selectedUses || [],
                  plan: plan,
               }}
               apiKey={"7599296f-6f69-4673-8b16-cfca049582fb"}
               darkMode={true}
            />

            <Dialog
               onOpenChange={() => {
                  // setFeedbackOpen(false);
                  setCookies((cookies) => {
                     return { ...cookies, hasSeenTimelineShiftHelp: true };
                  });
               }}
               open={feedbackOpen}
            >
               {/* <DialogTrigger>Open</DialogTrigger> */}
               <DialogContent className="">
                  <DialogHeader className="min-w-[450px] w-[450px]">
                     <DialogTitle className="mb-2 leading-normal">Hold shift to keep other formations in place when resizing</DialogTitle>
                     <DialogDescription className="">
                        Holding shift while changing the length of a formation will adjust the surrounding formations to maintain the same total
                        duration.
                     </DialogDescription>
                     <div className="h-[20px]"></div>
                     <img src="/shiftPopup.gif" alt="" className="rounded-md" />
                     {/* <div className="h-[20px]"></div> */}
                     <HStack className="justify-between">
                        <div></div>
                        <Button
                           onClick={async () => {
                              setCookies((cookies) => {
                                 return { ...cookies, hasSeenTimelineShiftHelp: true };
                              });
                           }}
                        >
                           Ok
                        </Button>
                     </HStack>
                  </DialogHeader>
               </DialogContent>
            </Dialog>

            {pdfLoading ? (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] bg-black/80 text-white border border-neutral-600  rounded-xl h-[100px] bg-white z-50 grid place-items-center">
                  <p className="text-center">Loading PDF. This may take a while.</p>
               </div>
            ) : null}

            {formations.some((formation, i) => (formation.transition.durationSeconds < 0.3 && i !== 0) || formation.durationSeconds < 0) &&
            isDesktop &&
            formations.length &&
            !viewOnly ? (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-black text-white border border-neutral-600  rounded-xl h-[200px] px-3  z-50 grid place-items-center">
                  <p className="text-center">
                     We noticed a bug where some of your formation durations are too short. Please click below to resolve the issue.
                  </p>
                  <Button
                     onClick={async () => {
                        const { data } = await supabase.from("clicked_button").upsert({ dance_id: danceId });
                        console.log(data);
                        setFormations(
                           formations.map((formation, i) => {
                              const transitionToSmall = formation.transition.durationSeconds < 0.3;

                              return {
                                 ...formation,
                                 transition: { durationSeconds: Math.max(formation.transition.durationSeconds, 0.3) },
                                 durationSeconds: Math.max(
                                    formation.durationSeconds - (transitionToSmall && i !== 0 ? 0.3 - formation.transition.durationSeconds : 0),
                                    0
                                 ),
                              };
                           })
                        );
                     }}
                  >
                     Click here to fix the issue!
                  </Button>
                  <p className="text-xs text-neutral-300">
                     if this popup doesn't go away after clicking the button, please email us immediately at kishansripada@formistudio.app
                  </p>
               </div>
            ) : null}

            {isCommenting ? (
               <>
                  <div className="fixed left-1/2 -translate-x-1/2 w-60 h-12 select-none rounded-full shadow-xl bottom-6 bg-black  z-[9999] opacity-70 grid place-items-center">
                     <p className="text-white text-sm pointer-events-none">Click on the stage to comment</p>
                  </div>
               </>
            ) : null}

            {selectedFormations.length > 1 ? (
               <>
                  <div className="fixed left-1/2 -translate-x-1/2 px-5 h-12 select-none rounded-full shadow-xl top-6 bg-black  z-[9999] bg-opacity-60 grid place-items-center">
                     <p className="text-white text-sm pointer-events-none">Changes will apply to all selected formations</p>
                  </div>
               </>
            ) : null}

            {assetsOpen ? (
               <Assets
                  menuOpen={menuOpen}
                  pushChange={() => {}}
                  assetsOpen={assetsOpen}
                  invalidatePropUploads={invalidatePropUploads}
                  propUploads={propUploads}
                  setAssetsOpen={setAssetsOpen}
                  session={session}
               ></Assets>
            ) : null}

            <EventHandler
               setSelectedDancers={setSelectedDancers}
               selectedDancers={selectedDancers}
               undo={undo}
               setIsCommenting={setIsCommenting}
               setZoom={setZoom}
               setDropDownToggle={setDropDownToggle}
               dancers={dancers}
               setIsScrollingTimeline={setIsScrollingTimeline}
               selectedPropIds={selectedPropIds}
               position={position}
               setLocalSettings={setLocalSettings}
               fullscreenContainer={fullscreenContainer}
            ></EventHandler>

            <AppWrapper className="dark:bg-black overflow-hidden text-neutral-900 flex flex-row">
               <div className="flex flex-col">
                  {!localSettings.fullScreen && (
                     <Header
                        fullscreenContainer={fullscreenContainer}
                        danceId={danceId}
                        folder={initialData?.project_id}
                        dropDownToggle={dropDownToggle}
                        isCommenting={isCommenting}
                        pushChange={() => {}}
                        selectedDancers={selectedDancers}
                        setIsCommenting={setIsCommenting}
                        viewOnlyInitial={viewOnlyInitial}
                        localSettings={localSettings}
                        setLocalSettings={setLocalSettings}
                        undo={undo}
                        saved={saved}
                        dancers={dancers}
                        session={session}
                        exportThree={exportThree}
                        scene={scene}
                        plan={plan}
                        permissions={permissions}
                        setPermissions={setPermissions}
                        anyoneCanView={anyoneCanView}
                        setAnyoneCanView={setAnyoneCanView}
                        setMenuOpen={setMenuOpen}
                     />
                  )}

                  <MobileSidebar
                     setLocalSettings={setLocalSettings}
                     setHelpUrl={setHelpUrl}
                     setMenuOpen={setMenuOpen}
                     menuOpen={menuOpen}
                  ></MobileSidebar>

                  <div className="flex flex-row overflow-hidden w-screen h-full">
                     {!localSettings.fullScreen && (
                        <Sidebar setLocalSettings={setLocalSettings} setHelpUrl={setHelpUrl} setMenuOpen={setMenuOpen} menuOpen={menuOpen}></Sidebar>
                     )}
                     <div className="flex flex-col w-full h-full overflow-hidden">
                        <div className="flex flex-row   overflow-hidden w-full h-full">
                           {!localSettings.fullScreen && (
                              <div
                                 style={{
                                    pointerEvents: menuOpen ? "auto" : "none",
                                 }}
                                 // top-[103px]
                                 className="flex flex-row fixed md:static top-[103px]  left-0  h-[80vh] md:w-auto w-full md:z-auto z-[40] md:h-full  "
                              >
                                 <>
                                    {menuOpen ? (
                                       <div className="border-r border-neutral-300 dark:border-neutral-700 min-w-[240px] overflow-hidden w-[240px] dark:bg-neutral-900 bg-neutral-50 dark:text-white relative">
                                          {menuOpen ? (
                                             <button
                                                onClick={() => setMenuOpen(null)}
                                                className="absolute right-0 w-6 h-6 border border-neutral-700  hover:bg-neutral-700 transition  rounded-full top-1/2 -translate-y-1/2 bg-neutral-900 translate-x-1/2 z-10 hidden md:grid place-items-center"
                                             >
                                                <svg
                                                   xmlns="http://www.w3.org/2000/svg"
                                                   viewBox="0 0 20 20"
                                                   fill="currentColor"
                                                   className="w-5 h-5 fill-neutral-400 mr-1"
                                                >
                                                   <path
                                                      fillRule="evenodd"
                                                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                                      clipRule="evenodd"
                                                   />
                                                </svg>
                                             </button>
                                          ) : null}
                                          {menuOpen === "dancers" ? (
                                             <Roster
                                                session={session}
                                                setSelectedDancers={setSelectedDancers}
                                                addToStack={() => {}}
                                                pushChange={() => {}}
                                                dancers={dancers}
                                                selectedDancers={selectedDancers}
                                                localSettings={localSettings}
                                             ></Roster>
                                          ) : menuOpen === "audio" ? (
                                             <ChooseAudioSource
                                                session={session}
                                                soundCloudTrackId={soundCloudTrackId}
                                                setSoundCloudTrackId={setSoundCloudTrackId}
                                                audioFiles={audioFiles}
                                                invalidateAudioFiles={invalidateAudioFiles}
                                                setLocalSource={setLocalSource}
                                                setLocalSettings={setLocalSettings}
                                                localSettings={localSettings}
                                             ></ChooseAudioSource>
                                          ) : menuOpen === "formationideas" ? (
                                             <FormationIdeas
                                                setCurrentTemplate={setCurrentTemplate}
                                                currentTemplate={currentTemplate}
                                                setHelpUrl={setHelpUrl}
                                                dropDownToggle={dropDownToggle}
                                                setLocalSettings={setLocalSettings}
                                                localSettings={localSettings}
                                                pushChange={() => {}}
                                                setAssetsOpen={setAssetsOpen}
                                                danceId={danceId}
                                                plan={plan}
                                             ></FormationIdeas>
                                          ) : menuOpen === "settings" ? (
                                             <Settings
                                                setHelpUrl={setHelpUrl}
                                                dropDownToggle={dropDownToggle}
                                                setLocalSettings={setLocalSettings}
                                                localSettings={localSettings}
                                                pushChange={() => {}}
                                                setAssetsOpen={setAssetsOpen}
                                             ></Settings>
                                          ) : menuOpen === "stageSettings" ? (
                                             <StageSettings
                                                setHelpUrl={setHelpUrl}
                                                dropDownToggle={dropDownToggle}
                                                setLocalSettings={setLocalSettings}
                                                localSettings={localSettings}
                                                pushChange={() => {}}
                                                setAssetsOpen={setAssetsOpen}
                                                session={session}
                                             ></StageSettings>
                                          ) : menuOpen === "collisions" ? (
                                             <Collisions
                                                dropDownToggle={dropDownToggle}
                                                setLocalSettings={setLocalSettings}
                                                localSettings={localSettings}
                                             ></Collisions>
                                          ) : menuOpen === "props" ? (
                                             <></>
                                          ) : menuOpen === "items" ? (
                                             <ItemsAndProps
                                                setAssetsOpen={setAssetsOpen}
                                                setHelpUrl={setHelpUrl}
                                                pushChange={() => {}}
                                                setSelectedPropIds={setSelectedPropIds}
                                                invalidatePropUploads={invalidatePropUploads}
                                                selectedPropIds={selectedPropIds}
                                                propUploads={propUploads}
                                                soundCloudTrackId={soundCloudTrackId}
                                                setSoundCloudTrackId={setSoundCloudTrackId}
                                                audioFiles={audioFiles}
                                                // setAudiofiles={setAudiofiles}
                                                setLocalSource={setLocalSource}
                                             ></ItemsAndProps>
                                          ) : // : menuOpen === "segments" ? (
                                          //    <Segments pushChange={pushChange}></Segments>
                                          // )

                                          menuOpen === "formations" ? (
                                             <CurrentFormation
                                                dropDownToggle={dropDownToggle}
                                                isCommenting={isCommenting}
                                                setIsCommenting={setIsCommenting}
                                                addToStack={() => {}}
                                                pushChange={() => {}}
                                                selectedDancers={selectedDancers}
                                                setSelectedDancers={setSelectedDancers}
                                                dancers={dancers}
                                                setMenuOpen={setMenuOpen}
                                                setLocalSettings={setLocalSettings}
                                                setAssetsOpen={setAssetsOpen}
                                             />
                                          ) : null}
                                       </div>
                                    ) : null}
                                 </>
                              </div>
                           )}

                           <DndContext id="1" onDragEnd={handleDragEnd}>
                              <div className={`flex flex-col min-w-0 flex-grow items-center bg-neutral-50 dark:bg-neutral-900 relative `}>
                                 <div
                                    style={{
                                       flexDirection: localSettings.videoPlacement === "above" ? "column" : "row",
                                    }}
                                    ref={fullscreenContainer}
                                    className="flex  h-full overflow-hidden  w-full items-center justify-center"
                                 >
                                    <Video
                                       localSettings={localSettings}
                                       videoPlayer={videoPlayer}
                                       soundCloudTrackId={soundCloudTrackId}
                                       localSource={localSource}
                                       videoPosition={videoPosition}
                                    ></Video>

                                    <TopLeft></TopLeft>
                                    <TopRight></TopRight>
                                    <BottomLeft></BottomLeft>
                                    <BottomRight></BottomRight>

                                    {localSettings.viewingThree ? (
                                       <ThreeD
                                          setSelectedDancers={setSelectedDancers}
                                          selectedDancers={selectedDancers}
                                          localSettings={localSettings}
                                          setIsThreeDancerDragging={setIsThreeDancerDragging}
                                          isThreeDancerDragging={isThreeDancerDragging}
                                          currentFormationIndex={currentFormationIndex}
                                          percentThroughTransition={percentThroughTransition}
                                          dancers={dancers}
                                          position={position}
                                          setScene={setScene}
                                       ></ThreeD>
                                    ) : null}

                                    {localSettings.viewingTwo ? (
                                       <Canvas
                                          setSelectedDancers={setSelectedDancers}
                                          selectedDancers={selectedDancers}
                                          coordsToPosition={coordsToPosition}
                                          setDraggingDancerId={setDraggingDancerId}
                                          undo={undo}
                                          localSettings={localSettings}
                                          isCommenting={isCommenting}
                                          setIsCommenting={setIsCommenting}
                                          zoom={zoom}
                                          setZoom={setZoom}
                                          shiftHeld={shiftHeld}
                                          session={session}
                                          setSelectedPropIds={setSelectedPropIds}
                                          selectedPropIds={selectedPropIds}
                                          resizingPropId={resizingPropId}
                                          setResizingPropId={setResizingPropId}
                                          menuOpen={menuOpen}
                                          setLocalSettings={setLocalSettings}
                                       >
                                          {commandHeld && <ReflectedDancers coordsToPosition={coordsToPosition}></ReflectedDancers>}
                                          {selectedFormations.length === 1 && getFirstSelectedFormation()?.id !== formations[0]?.id && !isPlaying ? (
                                             <PathEditor
                                                zoom={zoom}
                                                collisions={collisions}
                                                dancers={dancers}
                                                currentFormationIndex={currentFormationIndex}
                                                selectedDancers={selectedDancers}
                                                localSettings={localSettings}
                                                coordsToPosition={coordsToPosition}
                                             />
                                          ) : (
                                             <></>
                                          )}

                                          {/* <FormationMarkersLayer
                                             zoom={zoom}
                                             collisions={collisions}
                                             dancers={dancers}
                                             currentFormationIndex={currentFormationIndex}
                                             selectedDancers={selectedDancers}
                                             localSettings={localSettings}
                                             coordsToPosition={coordsToPosition}
                                          ></FormationMarkersLayer>
                                          <StageMarkersLayer
                                             zoom={zoom}
                                             collisions={collisions}
                                             dancers={dancers}
                                             currentFormationIndex={currentFormationIndex}
                                             selectedDancers={selectedDancers}
                                             localSettings={localSettings}
                                             coordsToPosition={coordsToPosition}
                                          ></StageMarkersLayer> */}

                                          {selectedFormation !== null
                                             ? props.map((prop: prop) => {
                                                  return (
                                                     <Prop
                                                        key={prop.id}
                                                        pushChange={() => {}}
                                                        dropDownToggle={dropDownToggle}
                                                        setResizingPropId={setResizingPropId}
                                                        selectedPropIds={selectedPropIds}
                                                        coordsToPosition={coordsToPosition}
                                                        prop={prop}
                                                        percentThroughTransition={percentThroughTransition}
                                                        position={position}
                                                        currentFormationIndex={currentFormationIndex}
                                                        zoom={zoom}
                                                        localSettings={localSettings}
                                                     ></Prop>
                                                  );
                                               })
                                             : null}

                                          {menuOpen !== "stageSettings" && (
                                             <>
                                                <TemplateOverlay
                                                   currentTemplate={currentTemplate}
                                                   localSettings={localSettings}
                                                   coordsToPosition={coordsToPosition}
                                                ></TemplateOverlay>

                                                {dancers.map((dancer, index) => (
                                                   <DancerAlias
                                                      zoom={zoom}
                                                      setZoom={setZoom}
                                                      coordsToPosition={coordsToPosition}
                                                      selectedDancers={selectedDancers}
                                                      position={position}
                                                      key={dancer.id}
                                                      dancer={dancer}
                                                      draggingDancerId={draggingDancerId}
                                                      currentFormationIndex={currentFormationIndex}
                                                      percentThroughTransition={percentThroughTransition}
                                                      localSettings={localSettings}
                                                      index={index}
                                                      collisions={collisions}
                                                   />
                                                ))}

                                                {/* {localSettings.viewCollisions && selectedFormations.length === 1
                                                   ? collisions.map((collision, i) => {
                                                        return (
                                                           <Collision key={i} coordsToPosition={coordsToPosition} collision={collision}></Collision>
                                                        );
                                                     })
                                                   : null} */}

                                                {selectedFormations.length === 1 && !isPlaying && !isMobileView ? (
                                                   <>
                                                      {(getFirstSelectedFormation()?.comments || []).map((comment: comment) => {
                                                         return (
                                                            <Comment
                                                               zoom={zoom}
                                                               localSettings={localSettings}
                                                               coordsToPosition={coordsToPosition}
                                                               key={comment.id}
                                                               comment={comment}
                                                               addToStack={() => {}}
                                                               pushChange={() => {}}
                                                            />
                                                         );
                                                      })}

                                                      {localSettings.previousFormationView !== "none"
                                                         ? dancers.map((dancer, index) => (
                                                              <DancerAliasShadow
                                                                 coordsToPosition={coordsToPosition}
                                                                 currentFormationIndex={currentFormationIndex}
                                                                 key={"shadow" + dancer.id}
                                                                 dancer={dancer}
                                                                 localSettings={localSettings}
                                                              />
                                                           ))
                                                         : dancers
                                                              .filter(
                                                                 (dancer) =>
                                                                    selectedDancers.includes(dancer.id) ||
                                                                    (selectedFormation
                                                                       ? collisions
                                                                            ?.map((collision) => collision.dancers)
                                                                            .flat(Infinity)
                                                                            .includes(dancer.id)
                                                                       : false)
                                                              )
                                                              .map((dancer, index) => {
                                                                 return (
                                                                    <DancerAliasShadow
                                                                       coordsToPosition={coordsToPosition}
                                                                       currentFormationIndex={currentFormationIndex}
                                                                       key={"shadow" + dancer.id}
                                                                       dancer={dancer}
                                                                       localSettings={localSettings}
                                                                    />
                                                                 );
                                                              })}
                                                   </>
                                                ) : null}
                                             </>
                                          )}
                                       </Canvas>
                                    ) : null}
                                 </div>

                                 {!localSettings.fullScreen && (
                                    <FormationControls
                                       setZoom={setZoom}
                                       zoom={zoom}
                                       localSettings={localSettings}
                                       setLocalSettings={setLocalSettings}
                                       setPlaybackRate={setPlaybackRate}
                                       addToStack={() => {}}
                                       pushChange={() => {}}
                                       position={position}
                                       setPixelsPerSecond={setPixelsPerSecond}
                                       pixelsPerSecond={pixelsPerSecond}
                                       localSource={localSource}
                                       selectedDancers={selectedDancers}
                                    ></FormationControls>
                                 )}
                              </div>
                           </DndContext>
                           {/* 
                           {!localSettings.fullScreen && (
                              <div className="h-full bg-neutral-900 max-w-[200px] w-[200px] min-w-[200px] border-l border-neutral-700 hidden md:flex">
                                 <ObjectControls
                                    selectedDancers={selectedDancers}
                                    dancers={dancers}
                                    setLocalSettings={setLocalSettings}
                                    setAssetsOpen={setAssetsOpen}
                                    setMenuOpen={setMenuOpen}
                                 ></ObjectControls>
                              </div>
                           )} */}
                        </div>

                        <div className="  bg-black">
                           {!localSettings.isInSlideMode && (
                              <AudioControls
                                 dancers={dancers}
                                 setHelpUrl={setHelpUrl}
                                 localSettings={localSettings}
                                 setLocalSettings={setLocalSettings}
                                 setPlaybackRate={setPlaybackRate}
                                 addToStack={() => {}}
                                 pushChange={() => {}}
                                 position={position}
                                 setPixelsPerSecond={setPixelsPerSecond}
                                 pixelsPerSecond={pixelsPerSecond}
                                 localSource={localSource}
                              ></AudioControls>
                           )}

                           {!localSettings.isInSlideMode ? (
                              <Timeline
                                 shiftHeld={shiftHeld}
                                 playbackRate={playbackRate}
                                 setIsScrollingTimeline={setIsScrollingTimeline}
                                 isScrollingTimeline={isScrollingTimeline}
                                 setPixelsPerSecond={setPixelsPerSecond}
                                 addToStack={() => {}}
                                 pushChange={() => {}}
                                 setSelectedDancers={setSelectedDancers}
                                 position={position}
                                 soundCloudTrackId={soundCloudTrackId}
                                 pixelsPerSecond={pixelsPerSecond}
                                 setPosition={setPosition}
                                 videoPlayer={videoPlayer}
                                 localSource={localSource}
                                 localSettings={localSettings}
                                 hasVisited={true}
                                 currentFormationIndex={currentFormationIndex}
                                 menuOpen={menuOpen}
                                 setHasClickedOnTimeline={setHasClickedOnTimeline}
                              ></Timeline>
                           ) : (
                              <div
                                 className=" overflow-y-hidden overflow-x-scroll gap-3 relative flex flex-row removeScrollBar bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-700  p-3 "
                                 style={{
                                    overscrollBehavior: "none",
                                    touchAction: "pan-x",
                                 }}
                              >
                                 {formations.map((formation, i) => {
                                    const thisFormation = formations[i];
                                    return (
                                       <div className="flex flex-col gap-1 reltive max-w-[120px]">
                                          <p className="text-xs whitespace-nowrap overflow-hidden font-medium text-white ml-1">
                                             {thisFormation.name}
                                          </p>
                                          <div
                                             onClick={(e: any) => {
                                                setSelectedFormations([formation.id]);
                                             }}
                                             style={{
                                                borderColor: formation.id === getFirstSelectedFormation()?.id ? "#db2777" : "rgb(64 64 64)",
                                             }}
                                             className="rounded-md border border-neutral-700 min-h-[70px] min-w-[120px] w-[120px] relative"
                                          >
                                             {i !== formations.length - 1 && (
                                                <div
                                                   onClick={() => {
                                                      const selectedFormationIndex = i;
                                                      const formationAtIndex = formations[selectedFormationIndex];
                                                      setFormations([
                                                         ...formations.slice(0, selectedFormationIndex),
                                                         {
                                                            ...formationAtIndex,
                                                         },
                                                         {
                                                            ...formationAtIndex,
                                                            id: uuidv4(),
                                                            name: formationAtIndex.name + " copy",
                                                         },
                                                         ...formations.slice(selectedFormationIndex + 1),
                                                      ]);
                                                      // setSelectedFormations([formations[i + 2]?.id]);
                                                   }}
                                                   className={`absolute w-6 h-6 rounded-md grid place-items-center border border-neutral-700 text-white bg-neutral-700 transition -right-5 top-1/2 -translate-y-1/2 z-10 opacity-0 ${
                                                      isMobileView && getSelectedFormationIndex() === i ? "opacity-100" : "hover:opacity-100"
                                                   } `}
                                                >
                                                   <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      viewBox="0 0 16 16"
                                                      fill="currentColor"
                                                      className="w-4 h-4"
                                                   >
                                                      <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                                                   </svg>
                                                </div>
                                             )}
                                             {thisFormation.positions?.map((position: dancerPosition) => {
                                                return (
                                                   <div
                                                      key={position.id}
                                                      className="absolute w-1 h-1  -translate-x-1/2 -translate-y-1/2 rounded-full  pointer-events-none"
                                                      style={{
                                                         backgroundColor:
                                                            position.color ||
                                                            dancers?.find((dancer: dancer) => dancer.id === position.id)?.color ||
                                                            "#db2777",
                                                         left: `${
                                                            ((position?.position?.x + cloudSettings.stageDimensions.width / 2) /
                                                               cloudSettings.stageDimensions.width) *
                                                            100
                                                         }%`,
                                                         top: `${
                                                            ((-position?.position?.y + cloudSettings.stageDimensions.height / 2) /
                                                               cloudSettings.stageDimensions.height) *
                                                            100
                                                         }%`,
                                                      }}
                                                   ></div>
                                                );
                                             })}
                                          </div>
                                       </div>
                                    );
                                 })}
                                 {!viewOnly ? (
                                    <div className="rounded-md border border-neutral-700 overflow-hidden min-h-[70px] h-[70px] mt-auto min-w-[120px] dark:text-white flex flex-row items-center justify-between">
                                       <button
                                          onClick={() => newFormationFromLast(true)}
                                          className="grid place-items-center w-full hover:bg-neutral-700 transition h-full"
                                       >
                                          <svg
                                             xmlns="http://www.w3.org/2000/svg"
                                             fill="none"
                                             viewBox="0 0 24 24"
                                             strokeWidth={1.5}
                                             stroke="currentColor"
                                             className="w-6 h-6"
                                          >
                                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                          </svg>
                                       </button>
                                       {/* <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                             <button className="border-l w-10 hover:bg-neutral-700 transition h-full border-neutral-500 grid place-items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                   <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                                </svg>
                                             </button>
                                          </DropdownMenuTrigger>

                                          <DropdownMenuContent>
                                             <DropdownMenuItem
                                                onClick={() => newFormationFromLast(false)}
                                                className="hover:bg-neutral-700 transition"
                                             >
                                                New formation and no groups
                                             </DropdownMenuItem>
                                             <DropdownMenuItem onClick={() => newFormationFromLast(true)} className="hover:bg-neutral-700 transition">
                                                New formation with same groups
                                             </DropdownMenuItem>
                                          </DropdownMenuContent>
                                       </DropdownMenu> */}
                                    </div>
                                 ) : null}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </AppWrapper>
         </ThemeProvider>
      </>
   );
};

export default Edit;

function TopLeft() {
   const { setNodeRef } = useDroppable({
      id: "top-left",
      data: {
         type: "vid-container",
      },
   });

   return <div className="w-1/2 h-1/2 top-0 left-0  absolute z-10 opacity-40 pointer-events-none" ref={setNodeRef}></div>;
}

function TopRight() {
   const { setNodeRef } = useDroppable({
      id: "top-right",
      data: {
         type: "vid-container",
      },
   });

   return <div className="w-1/2 h-1/2 top-0 right-0  absolute z-10 opacity-40 pointer-events-none" ref={setNodeRef}></div>;
}

function BottomLeft() {
   const { setNodeRef } = useDroppable({
      id: "bottom-left",
      data: {
         type: "vid-container",
      },
   });

   return <div className="w-1/2 h-1/2 bottom-0 left-0  absolute z-10 opacity-40 pointer-events-none" ref={setNodeRef}></div>;
}

function BottomRight() {
   const { setNodeRef } = useDroppable({
      id: "bottom-right",
      data: {
         type: "vid-container",
      },
   });

   return <div className="w-1/2 h-1/2 bottom-0 right-0  absolute z-10 opacity-40 pointer-events-none" ref={setNodeRef}></div>;
}
