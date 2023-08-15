"use client";
import { detectCollisions } from "../../../types/collisionDetector";
import { Video } from "./_components/Video";
import { DndContext, useDroppable } from "@dnd-kit/core";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback, lazy } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "../../../hooks";
import debounce from "lodash.debounce";
import toast, { Toaster } from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { comment, dancer, dancerPosition, formation, PIXELS_PER_SQUARE, localSettings, cloudSettings, prop, item } from "../../../types/types";
import { AudioControls } from "./_components/AudioControls";
import { Header } from "./_components/Header";
import { DancerAlias } from "./_components/DancerAlias";
import { DancerAliasShadow } from "./_components/DancerAliasShadow";
import { Canvas } from "./_components/Canvas";
import { PathEditor } from "./_components/PathEditor";
import { Share } from "./_components/Modals/Share";
import { Collision } from "./_components/Collision";
import { Sidebar } from "./_components/Sidebar";
import { Settings } from "./_components/SidebarComponents/Settings";
import { ChooseAudioSource } from "./_components/SidebarComponents/ChooseAudioSource";
import { Roster } from "./_components/SidebarComponents/Roster";
import { CurrentFormation } from "./_components/SidebarComponents/CurrentFormation";
import { AuthSession, RealtimeChannel } from "@supabase/supabase-js";
import { Collisions } from "./_components/SidebarComponents/Collisions";
import { Props } from "./_components/SidebarComponents/Props";
import { Timeline } from "./_components/Timeline";
import { FormationControls } from "./_components/FormationControls";
import { EventHandler } from "./_components/EventHandler";
import { Items } from "./_components/SidebarComponents/Items";
import { Assets } from "./_components/Modals/Assets";
// could be dynamic imports
import { Prop } from "./_components/Prop";
import { Comment } from "./_components/Comment";
import * as jsonpatch from "fast-json-patch";
import { HelpUrl } from "./_components/Modals/HelpUrl";
import { ObjectControls } from "./_components/ObjectControls";
import { Database } from "../../../types/supabase";
import Loading from "../../loading";
import { StageSettings } from "./_components/SidebarComponents/StageSettings";
import { Segments } from "./_components/SidebarComponents/Segments";
import { create } from "zustand";
import { useStore } from "./store";

const ThreeD = dynamic(() => import("./_components/ThreeD").then((mod) => mod.ThreeD), {
   loading: () => (
      <div className="flex items-center justify-center h-screen bg-neutral-100 dark:bg-neutral-900  w-full">
         <style>
            {`
               /* Define the keyframes for the animation */
               @keyframes width-animation {
                  0% {
                     width: 0;
                  }
                  100% {
                     width: 300px;
                  }
               }

               /* Create a CSS class that applies the animation */
               .animate-width {
                  animation: width-animation 0.5s linear forwards;
               }
            `}
         </style>
         <div className="w-[300px] cursor-pointer ">
            {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
 <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
            <h1 className="text-4xl font-bold z-10 text-center text-neutral-200 relative">FORMI</h1>

            <div className="bg-pink-600 relative h-1 mt-3 rounded-full animate-width"></div>
         </div>
      </div>
   ),
});

var jsondiffpatch = require("jsondiffpatch").create({
   objectHash: function (obj) {
      return obj.id;
   },
});

// use effect, but not on initial render
const useDidMountEffect = (func, deps) => {
   const didMount = useRef(false);

   useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
   }, deps);
};

const Edit = ({
   initialData,
   viewOnly: viewOnlyInitial,
   pricingTier,
   params: { danceId },
   session,
   permissions: initialPermissions,
   hasVisited,
}: {
   initialData: any;
   viewOnly: boolean;
   pricingTier: string;
   params: { danceId: string };
   session: AuthSession | null;
   permissions: string[];
   hasVisited: boolean;
}) => {
   const {
      segments,
      setSegments,
      dancers,
      setDancers,
      selectedFormation,
      setSelectedFormation,
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
      liveblocks,
   } = useStore();
   // console.log(liveblocks);
   // console.log({ liveStatus });
   useEffect(() => {
      setSegments(initialData.segments);
      setDancers(initialData.dancers);
      setFormations(initialData.formations);
      setViewOnly(viewOnlyInitial);
      setDanceName(initialData.name);
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
   }, []);

   const enterRoom = useStore((state) => state.liveblocks.enterRoom);
   const leaveRoom = useStore((state) => state.liveblocks.leaveRoom);
   // const isLoading = useStore((state) => state.liveblocks.isStorageLoading);
   const undo = useStore((state) => state.liveblocks.room?.history.undo);
   // const redo = useStore((state) => state.liveblocks.room?.history.redo);
   useEffect(() => {
      enterRoom(danceId);
      return () => {
         leaveRoom(danceId);
      };
   }, [enterRoom, leaveRoom]);

   const supabase = createClientComponentClient<Database>();
   const router = useRouter();
   const videoPlayer = useRef();

   const [anyoneCanView, setAnyoneCanView] = useState(initialData.anyonecanview);
   const [permissions, setPermissions] = useState(initialPermissions);
   // const [selectedDancers, setSelectedDancers] = useState<string[]>([]);
   // local
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
      });
   }
   const [shiftHeld, setShiftHeld] = useState(false);
   const [playbackRate, setPlaybackRate] = useState(1);
   const [selectedPropIds, setSelectedPropIds] = useState<string[]>([]);
   const [dropDownToggle, setDropDownToggle] = useState<boolean>(false);
   const [audioFiles, setAudiofiles] = useState(initialData.audioFiles);
   const [localSource, setLocalSource] = useState(null);
   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [zoom, setZoom] = useState(1);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [isCommenting, setIsCommenting] = useState<boolean>(false);
   const [position, setPosition] = useState<number>(0);
   const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(35);

   const [isScrollingTimeline, setIsScrollingTimeline] = useState(false);
   const [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);
   const [menuOpen, setMenuOpen] = useState<string>("formations");
   const [player, setPlayer] = useState(null);
   const [saved, setSaved] = useState<boolean>(true);
   const [shareIsOpen, setShareIsOpen] = useState(false);
   const [isChangingCollisionRadius, setIsChangingCollisionRadius] = useState(false);
   // const [subscriptionStatus, setSubscriptionStatus] = useState("NOT SUBSCRIBED");
   const [isChangingZoom, setIsChangingZoom] = useState(false);
   const [isThreeDancerDragging, setIsThreeDancerDragging] = useState(false);
   const [pdfLoading, setPdfLoading] = useState(false);
   const [assetsOpen, setAssetsOpen] = useState(false);

   const [propUploads, setPropUploads] = useState([]);
   const [helpUrl, setHelpUrl] = useState(hasVisited ? null : { url: "https://www.youtube.com/shorts/JRS1tPHJKAI" });
   const [resizingPropId, setResizingPropId] = useState(null);
   let { currentFormationIndex, percentThroughTransition } = whereInFormation(formations, position);
   const [videoPosition, setVideoPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">("top-right");

   const coordsToPosition = (coords: { x: number; y: number }) => {
      if (!coords) return null;
      let { x, y } = coords;
      return {
         left: (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.width) / 2 + PIXELS_PER_SQUARE * x,
         top: (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.height) / 2 + PIXELS_PER_SQUARE * -y,
      };
   };

   useEffect(() => {
      if (!session) return;
      supabase.storage
         .from("audiofiles")
         .list(session?.user.id, {})
         .then((r) => {
            if (!r.data) return;
            setAudiofiles(r);
         });
      invalidatePropUploads();
   }, [session]);

   const invalidatePropUploads = () => {
      supabase.storage
         .from("props")
         .list(session?.user.id, {})
         .then((r) => {
            if (!r.data) return;
            console.log(r.data);
            setPropUploads(r?.data);
         });
   };

   useEffect(() => {
      if (!isPlaying) return;
      setSelectedFormation(currentFormationIndex);
   }, [currentFormationIndex, isPlaying]);

   useEffect(() => {
      // Add event listener for beforeunload event
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Cleanup event listener on unmount
      return () => {
         window.removeEventListener("beforeunload", handleBeforeUnload);
      };
   }, [saved]);

   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

   const exportPdf = async () => {
      setPdfLoading(true);
      setLocalSettings({ ...localSettings, viewingTwo: true, viewingThree: false });
      const parentContainer = document.createElement("p");
      const extendedFormations = [...formations, { name: "", notes: "" }];

      for (let index = 0; index < extendedFormations.length; index++) {
         setSelectedFormation(index); // Assuming this function sets the formation

         // Wait for the formation to be rendered in the DOM
         await sleep(500); // Delay in milliseconds. Adjust as needed.

         const stageElement = document.getElementById("stage-cutout");
         const clonedElement = stageElement.cloneNode(true); // Clone the element with its children

         // Add each stage to the parentContainer
         const label = document.createElement("p");
         label.textContent = `${extendedFormations[index].name} (${index + 1} of ${formations.length})`;
         label.style.textAlign = "center";
         label.style.width = "100%";

         const notes = document.createElement("p");
         notes.textContent = `${extendedFormations[index].notes || ""}`;
         notes.style.textAlign = "left";
         notes.style.width = "100%";

         // Create a container for the current formation to force a new page
         const formationContainer = document.createElement("div");
         formationContainer.style.pageBreakInside = "avoid";

         formationContainer.style.transform = "rotate(90deg)"; // Rotate the content 90 degrees
         formationContainer.style.transformOrigin = "center"; // Rotate from the bottom left corner
         formationContainer.style.textAlign = "center";
         stageElement.style.textAlign = "center";
         // const pageBreak = document.createElement("div");

         // Add the label, formation, and notes to the formationContainer
         formationContainer.appendChild(clonedElement);
         formationContainer.appendChild(label);
         formationContainer.appendChild(notes);

         // Add the formationContainer to the parentContainer
         parentContainer.appendChild(formationContainer);
      }

      var options = {
         filename: `${danceName}.pdf`,
      };
      const domToPdf = (await import("dom-to-pdf")).default;
      domToPdf(parentContainer, options, (pdf) => {
         setPdfLoading(false);
      });
   };

   async function handleBeforeUnload(event) {
      if (!saved) {
         // Prompt the user before closing the tab
         event.preventDefault();
      }
   }

   const pushChange = () => {
      return;
   };
   const removeDancer = (id: string) => {
      // remove dancer and all their positions
      setFormations(
         formations.map((formation) => {
            return { ...formation, positions: formation.positions.filter((dancerPosition) => dancerPosition.id !== id) };
         })
      );
      setDancers(dancers.filter((dancer) => dancer.id !== id));
      // pushChange();
   };

   // const undo = () => {
   //    return;

   // };

   const addToStack = () => {
      return;
      // setPreviousFormation(formations);
   };

   ////////////////////////////////////////
   let uploadSettings = useCallback(
      debounce(async (cloudSettings) => {
         console.log("uploading settings");
         const { data, error } = await supabase.from("dances").update({ settings: cloudSettings, last_edited: new Date() }).eq("id", danceId);

         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 0),
      [danceId]
   );

   useDidMountEffect(() => {
      if (!session && danceId !== "207") {
         router.push("/login");
      }
      //   if (router.isReady) {
      setSaved(false);
      uploadSettings(cloudSettings);
      //   }
   }, [cloudSettings]);

   ////////////////////////////////////////
   let uploadDancers = useCallback(
      debounce(async (dancers) => {
         console.log("uploading dancers");
         const { data, error } = await supabase.from("dances").update({ dancers: dancers, last_edited: new Date() }).eq("id", danceId);

         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 2000),
      [danceId]
   );

   useDidMountEffect(() => {
      if (!session && danceId !== "207") {
         router.push("/login");
      }
      //   if (router.isReady) {
      setSaved(false);
      uploadDancers(dancers);
      //   }
   }, [dancers]);

   let uploadSoundCloudId = useCallback(
      debounce(async (soundCloudTrackId) => {
         console.log("uploading formations");
         const { data, error } = await supabase.from("dances").update({ soundCloudId: soundCloudTrackId, last_edited: new Date() }).eq("id", danceId);

         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 0),
      [danceId]
   );

   useDidMountEffect(() => {
      if (!session && danceId !== "207") {
         router.push("/login");
      }
      //   if (router.isReady) {
      setSaved(false);
      uploadSoundCloudId(soundCloudTrackId);
      //   }
   }, [soundCloudTrackId]);
   // //////////////////////////

   let uploadName = useCallback(
      debounce(async (danceName) => {
         console.log("uploading name");
         const { data, error } = await supabase.from("dances").update({ name: danceName }).eq("id", danceId);
         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 500),
      [danceId]
   );

   useDidMountEffect(() => {
      if (!session && danceId !== "207") {
         router.push("/login");
      }
      //   if (router.isReady) {
      setSaved(false);
      uploadName(danceName);
      //   }
   }, [danceName]);
   // console.log(formations);
   // // ///////////
   let uploadFormations = useCallback(
      debounce(async (formations) => {
         console.log("uploading formations");
         const { data, error } = await supabase.from("dances").update({ formations: formations, last_edited: new Date() }).eq("id", danceId);
         console.log({ data });
         console.log({ error });

         setSaved(true);
      }, 5000),
      [danceId]
   );

   useDidMountEffect(() => {
      if (!session && danceId !== "207") {
         router.push("/login");
      }
      //   if (router.isReady) {
      setSaved(false);
      uploadFormations(formations);
      //   }
   }, [formations]);

   let uploadProps = useCallback(
      debounce(async (props) => {
         console.log("uploading props");
         const { data, error } = await supabase.from("dances").update({ props: props, last_edited: new Date() }).eq("id", danceId);
         console.log({ data });
         console.log({ error });

         setSaved(true);
      }, 1000),
      [danceId]
   );

   useDidMountEffect(() => {
      if (!session && danceId !== "207") {
         router.push("/login");
      }
      //   if (router.isReady) {
      setSaved(false);
      uploadProps(props);
      //   }
   }, [props]);

   let uploadItems = useCallback(
      debounce(async (items) => {
         console.log("uploading items");
         const { data, error } = await supabase.from("dances").update({ items: items, last_edited: new Date() }).eq("id", danceId);
         console.log({ data });
         console.log({ error });

         setSaved(true);
      }, 1000),
      [danceId]
   );

   useDidMountEffect(() => {
      if (!session && danceId !== "207") {
         router.push("/login");
      }
      //   if (router.isReady) {
      setSaved(false);
      uploadItems(items);
      //   }
   }, [items]);

   let uploadSegments = useCallback(
      debounce(async (segments) => {
         console.log("uploading segments");
         const { data, error } = await supabase.from("dances").update({ segments: segments, last_edited: new Date() }).eq("id", danceId);
         console.log({ data });
         console.log({ error });

         setSaved(true);
      }, 1000),
      [danceId]
   );

   useDidMountEffect(() => {
      if (!session && danceId !== "207") {
         router.push("/login");
      }
      //   if (router.isReady) {
      setSaved(false);
      uploadSegments(segments);
      //   }
   }, [segments]);

   //////////////////////
   let flippedFormations = formations.map((formation: formation) => {
      let flippedPositions = formation.positions.map((position) => {
         if (position.controlPointEnd && position.controlPointStart) {
            return {
               ...position,
               position: { x: -position.position.x, y: -position.position.y },
               controlPointEnd: { x: -position.controlPointEnd.x, y: -position.controlPointEnd.y },
               controlPointStart: { x: -position.controlPointStart.x, y: -position.controlPointStart.y },
            };
         } else {
            return {
               ...position,
               position: { x: -position.position.x, y: -position.position.y },
            };
         }
      });

      // let flippedComments = formation.comments
      //    ? formation.comments.map((comment: comment) => {
      //         return { ...comment, position: { x: -comment.position.x, y: -comment.position.y } };
      //      })
      //    : [];

      return { ...formation, positions: flippedPositions };
   });
   //////////////////////////
   const collisions = localSettings.viewCollisions
      ? detectCollisions(localSettings.stageFlipped ? flippedFormations : formations, selectedFormation, localSettings.collisionRadius)
      : [];

   function handleDragEnd(event) {
      const { active, over } = event;

      if (over && active.data.current.supports.includes(over.data.current.type)) {
         setVideoPosition(over.id);
      }
   }
   useEffect(() => {
      if (typeof window !== "undefined") {
         document.cookie = "hasVisited=true; expires=" + new Date(new Date().getTime() + 86409000).toUTCString() + "; path=/";
      }
   }, []);
   return (
      <>
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
         </Head>

         {/* {!hasVisited ? <div className="fixed w-[500px] h-[200px] bg-black">warning</div> : null} */}

         {shareIsOpen ? (
            <Share
               danceId={danceId}
               permissions={permissions}
               setPermissions={setPermissions}
               anyoneCanView={anyoneCanView}
               setAnyoneCanView={setAnyoneCanView}
               setShareIsOpen={setShareIsOpen}
            />
         ) : null}

         {helpUrl && <HelpUrl helpUrl={helpUrl} setHelpUrl={setHelpUrl}></HelpUrl>}

         {pdfLoading ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] bg-black/80 text-white border border-neutral-600  rounded-xl h-[100px] bg-white z-50 grid place-items-center">
               <p className="text-center">Loading, pdf. This may take a sec. lol</p>
            </div>
         ) : null}

         {/* {isLoading ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] bg-black/80 text-white border border-neutral-600  rounded-xl h-[100px] bg-white z-50 grid place-items-center">
               <p className="text-center">Connected</p>
            </div>
         ) : null} */}

         {isCommenting ? (
            <>
               <div className="fixed left-1/2 -translate-x-1/2 w-60 h-12 select-none rounded-full shadow-xl bottom-6 bg-black  z-[9999] opacity-70 grid place-items-center">
                  <p className="text-white text-sm pointer-events-none">Click on the stage to comment</p>
               </div>
            </>
         ) : null}

         {assetsOpen ? (
            <Assets
               menuOpen={menuOpen}
               pushChange={pushChange}
               assetsOpen={assetsOpen}
               invalidatePropUploads={invalidatePropUploads}
               propUploads={propUploads}
               setAssetsOpen={setAssetsOpen}
               session={session}
            ></Assets>
         ) : null}
         <EventHandler
            position={position}
            setPosition={setPosition}
            selectedPropIds={selectedPropIds}
            setIsChangingZoom={setIsChangingZoom}
            setIsScrollingTimeline={setIsScrollingTimeline}
            setIsChangingCollisionRadius={setIsChangingCollisionRadius}
            dancers={dancers}
            setDropDownToggle={setDropDownToggle}
            shiftHeld={shiftHeld}
            setShiftHeld={setShiftHeld}
            stageFlipped={localSettings.stageFlipped}
            soundCloudTrackId={soundCloudTrackId}
            zoom={zoom}
            setZoom={setZoom}
            isCommenting={isCommenting}
            setIsCommenting={setIsCommenting}
            localSettings={localSettings}
            pushChange={pushChange}
            undo={undo}
            addToStack={addToStack}
            player={player}
            draggingDancerId={draggingDancerId}
            setDraggingDancerId={setDraggingDancerId}
            songDuration={songDuration}
            setSelectedFormation={setSelectedFormation}
            selectedFormation={selectedFormation}
            selectedDancers={selectedDancers}
            setSelectedDancers={setSelectedDancers}
            setIsPlaying={setIsPlaying}
            setPixelsPerSecond={setPixelsPerSecond}
            coordsToPosition={coordsToPosition}
            currentFormationIndex={currentFormationIndex}
            percentThroughTransition={percentThroughTransition}
            dancers={dancers}
            setLocalSettings={setLocalSettings}
         ></EventHandler>
         <div
            // style={{
            //    pointerEvents: subscriptionStatus === "SUBSCRIBED" ? "none" : "auto",
            // }}
            className={`   flex-col h-screen ${
               localSettings.isDarkMode ? "dark" : ""
            }  flex  bg-[#fafafa] overflow-hidden text-neutral-900 select-none `}
         >
            <style>
               {`
               html, body {
                  overscroll-behavior: none;
                  // overscroll-behavior-x: none;
              }

         //      select{
         //       background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+) no-repeat 95% 50%;
         //       -moz-appearance: none; 
         //       -webkit-appearance: none; 
         //       appearance: none;
         //       /* and then whatever styles you want*/
         //       height: 30px; 
         //       width: 100px;
         //       padding: 5px;
         //   }
               `}
            </style>

            <Header
               danceId={danceId}
               folder={initialData?.project_id}
               exportPdf={exportPdf}
               dropDownToggle={dropDownToggle}
               isChangingCollisionRadius={isChangingCollisionRadius}
               setIsChangingCollisionRadius={setIsChangingCollisionRadius}
               isCommenting={isCommenting}
               pushChange={pushChange}
               selectedFormation={selectedFormation}
               selectedDancers={selectedDancers}
               setIsCommenting={setIsCommenting}
               viewOnlyInitial={viewOnlyInitial}
               setSelectedFormation={setSelectedFormation}
               localSettings={localSettings}
               setLocalSettings={setLocalSettings}
               undo={undo}
               saved={saved}
               setShareIsOpen={setShareIsOpen}
               dancers={dancers}
            />
            <div className="flex flex-row overflow-hidden w-screen h-full">
               <Sidebar setLocalSettings={setLocalSettings} setHelpUrl={setHelpUrl} setMenuOpen={setMenuOpen} menuOpen={menuOpen}></Sidebar>
               <div className="flex flex-col w-full h-full overflow-hidden">
                  <div className="flex flex-row   overflow-hidden w-full h-full">
                     {!localSettings.fullScreen ? (
                        <>
                           <div className="flex flex-row ">
                              <div className="border-r border-neutral-300 dark:border-neutral-700">
                                 {menuOpen === "dancers" ? (
                                    <Roster
                                       session={session}
                                       removeDancer={removeDancer}
                                       setSelectedDancers={setSelectedDancers}
                                       addToStack={addToStack}
                                       pushChange={pushChange}
                                       dancers={dancers}
                                       selectedFormation={selectedFormation}
                                       selectedDancers={selectedDancers}
                                       localSettings={localSettings}
                                    ></Roster>
                                 ) : menuOpen === "audio" ? (
                                    <ChooseAudioSource
                                       session={session}
                                       player={player}
                                       setIsPlaying={setIsPlaying}
                                       soundCloudTrackId={soundCloudTrackId}
                                       setSoundCloudTrackId={setSoundCloudTrackId}
                                       audioFiles={audioFiles}
                                       setAudiofiles={setAudiofiles}
                                       setLocalSource={setLocalSource}
                                    ></ChooseAudioSource>
                                 ) : menuOpen === "settings" ? (
                                    <Settings
                                       setHelpUrl={setHelpUrl}
                                       dropDownToggle={dropDownToggle}
                                       setLocalSettings={setLocalSettings}
                                       localSettings={localSettings}
                                       pushChange={pushChange}
                                       setAssetsOpen={setAssetsOpen}
                                    ></Settings>
                                 ) : menuOpen === "stageSettings" ? (
                                    <StageSettings
                                       setHelpUrl={setHelpUrl}
                                       dropDownToggle={dropDownToggle}
                                       setLocalSettings={setLocalSettings}
                                       localSettings={localSettings}
                                       pushChange={pushChange}
                                       setAssetsOpen={setAssetsOpen}
                                    ></StageSettings>
                                 ) : menuOpen === "collisions" ? (
                                    <Collisions
                                       dropDownToggle={dropDownToggle}
                                       setLocalSettings={setLocalSettings}
                                       localSettings={localSettings}
                                    ></Collisions>
                                 ) : menuOpen === "props" ? (
                                    <Props
                                       setAssetsOpen={setAssetsOpen}
                                       setHelpUrl={setHelpUrl}
                                       pushChange={pushChange}
                                       setSelectedPropIds={setSelectedPropIds}
                                       invalidatePropUploads={invalidatePropUploads}
                                       selectedPropIds={selectedPropIds}
                                       propUploads={propUploads}
                                       selectedFormation={selectedFormation}
                                       player={player}
                                       setIsPlaying={setIsPlaying}
                                       soundCloudTrackId={soundCloudTrackId}
                                       setSoundCloudTrackId={setSoundCloudTrackId}
                                       audioFiles={audioFiles}
                                       setAudiofiles={setAudiofiles}
                                       setLocalSource={setLocalSource}
                                    ></Props>
                                 ) : menuOpen === "items" ? (
                                    <Items
                                       setAssetsOpen={setAssetsOpen}
                                       setHelpUrl={setHelpUrl}
                                       pushChange={pushChange}
                                       setSelectedPropIds={setSelectedPropIds}
                                       invalidatePropUploads={invalidatePropUploads}
                                       // selectedPropIds={selectedPropIds}
                                       propUploads={propUploads}
                                       selectedFormation={selectedFormation}
                                       player={player}
                                       setIsPlaying={setIsPlaying}
                                       soundCloudTrackId={soundCloudTrackId}
                                       setSoundCloudTrackId={setSoundCloudTrackId}
                                       audioFiles={audioFiles}
                                       setAudiofiles={setAudiofiles}
                                       setLocalSource={setLocalSource}
                                    ></Items>
                                 ) : menuOpen === "segments" ? (
                                    <Segments pushChange={pushChange}></Segments>
                                 ) : (
                                    <CurrentFormation
                                       dropDownToggle={dropDownToggle}
                                       isCommenting={isCommenting}
                                       setIsCommenting={setIsCommenting}
                                       addToStack={addToStack}
                                       pushChange={pushChange}
                                       selectedDancers={selectedDancers}
                                       setSelectedDancers={setSelectedDancers}
                                       setSelectedFormation={setSelectedFormation}
                                       dancers={dancers}
                                       selectedFormation={selectedFormation}
                                    />
                                 )}
                              </div>
                           </div>
                        </>
                     ) : null}
                     <DndContext id="1" onDragEnd={handleDragEnd}>
                        <div className={`flex flex-col min-w-0 flex-grow items-center bg-neutral-100 dark:bg-neutral-900 relative `}>
                           <ObjectControls
                              zoom={zoom}
                              setIsChangingZoom={setIsChangingZoom}
                              isChangingZoom={isChangingZoom}
                              localSettings={localSettings}
                              setLocalSettings={setLocalSettings}
                              setPlaybackRate={setPlaybackRate}
                              addToStack={addToStack}
                              pushChange={pushChange}
                              selectedFormation={selectedFormation}
                              songDuration={songDuration}
                              soundCloudTrackId={soundCloudTrackId}
                              setSelectedFormation={setSelectedFormation}
                              player={player}
                              isPlaying={isPlaying}
                              setIsPlaying={setIsPlaying}
                              position={position}
                              setPixelsPerSecond={setPixelsPerSecond}
                              pixelsPerSecond={pixelsPerSecond}
                              localSource={localSource}
                              selectedDancers={selectedDancers}
                              dropDownToggle={dropDownToggle}
                              dancers={dancers}
                              viewOnlyInitial={viewOnlyInitial}
                           ></ObjectControls>
                           <Video
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
                                 setIsThreeDancerDragging={setIsThreeDancerDragging}
                                 isThreeDancerDragging={isThreeDancerDragging}
                                 isPlaying={isPlaying}
                                 currentFormationIndex={currentFormationIndex}
                                 percentThroughTransition={percentThroughTransition}
                                 dancers={dancers}
                                 position={position}
                                 shiftHeld={shiftHeld}
                                 setShiftHeld={setShiftHeld}
                                 stageFlipped={localSettings.stageFlipped}
                                 zoom={zoom}
                                 setZoom={setZoom}
                                 isCommenting={isCommenting}
                                 setIsCommenting={setIsCommenting}
                                 localSettings={localSettings}
                                 pushChange={pushChange}
                                 undo={undo}
                                 addToStack={addToStack}
                                 player={player}
                                 draggingDancerId={draggingDancerId}
                                 setDraggingDancerId={setDraggingDancerId}
                                 songDuration={songDuration}
                                 setSelectedFormation={setSelectedFormation}
                                 selectedFormation={selectedFormation}
                                 selectedDancers={selectedDancers}
                                 setSelectedDancers={setSelectedDancers}
                                 setIsPlaying={setIsPlaying}
                                 setPixelsPerSecond={setPixelsPerSecond}
                                 coordsToPosition={coordsToPosition}
                                 currentFormationIndex={currentFormationIndex}
                                 percentThroughTransition={percentThroughTransition}
                                 // comments={comments}
                              ></ThreeD>
                           ) : null}

                           {localSettings.viewingTwo ? (
                              <Canvas
                                 menuOpen={menuOpen}
                                 // selectedFormations={selectedFormations}
                                 session={session}
                                 resizingPropId={resizingPropId}
                                 setResizingPropId={setResizingPropId}
                                 setSelectedPropIds={setSelectedPropIds}
                                 selectedPropIds={selectedPropIds}
                                 isPlaying={isPlaying}
                                 shiftHeld={shiftHeld}
                                 setShiftHeld={setShiftHeld}
                                 stageFlipped={localSettings.stageFlipped}
                                 zoom={zoom}
                                 setZoom={setZoom}
                                 isCommenting={isCommenting}
                                 setIsCommenting={setIsCommenting}
                                 localSettings={localSettings}
                                 pushChange={pushChange}
                                 undo={undo}
                                 addToStack={addToStack}
                                 player={player}
                                 draggingDancerId={draggingDancerId}
                                 setDraggingDancerId={setDraggingDancerId}
                                 songDuration={songDuration}
                                 setSelectedFormation={setSelectedFormation}
                                 selectedFormation={selectedFormation}
                                 selectedDancers={selectedDancers}
                                 setSelectedDancers={setSelectedDancers}
                                 setIsPlaying={setIsPlaying}
                                 setPixelsPerSecond={setPixelsPerSecond}
                                 coordsToPosition={coordsToPosition}
                                 currentFormationIndex={currentFormationIndex}
                                 percentThroughTransition={percentThroughTransition}
                                 dancers={dancers}
                              >
                                 {selectedFormation !== null ? (
                                    <PathEditor
                                       zoom={zoom}
                                       collisions={collisions}
                                       dancers={dancers}
                                       currentFormationIndex={currentFormationIndex}
                                       formations={localSettings.stageFlipped ? flippedFormations : formations}
                                       selectedFormation={selectedFormation}
                                       selectedDancers={selectedDancers}
                                       localSettings={localSettings}
                                       isPlaying={isPlaying}
                                       coordsToPosition={coordsToPosition}
                                    />
                                 ) : (
                                    <></>
                                 )}

                                 {dancers.map((dancer, index) => (
                                    <DancerAlias
                                       zoom={zoom}
                                       setZoom={setZoom}
                                       coordsToPosition={coordsToPosition}
                                       selectedDancers={selectedDancers}
                                       isPlaying={isPlaying}
                                       position={position}
                                       selectedFormation={selectedFormation}
                                       key={dancer.id}
                                       dancer={dancer}
                                       formations={localSettings.stageFlipped ? flippedFormations : formations}
                                       draggingDancerId={draggingDancerId}
                                       currentFormationIndex={currentFormationIndex}
                                       percentThroughTransition={percentThroughTransition}
                                       localSettings={localSettings}
                                       index={index}
                                       isPlaying={isPlaying}
                                       collisions={collisions}
                                       isChangingCollisionRadius={isChangingCollisionRadius}
                                    />
                                 ))}

                                 {selectedFormation !== null
                                    ? props.map((prop: prop) => {
                                         return (
                                            <Prop
                                               key={prop.id}
                                               pushChange={pushChange}
                                               dropDownToggle={dropDownToggle}
                                               setResizingPropId={setResizingPropId}
                                               selectedPropIds={selectedPropIds}
                                               coordsToPosition={coordsToPosition}
                                               prop={prop}
                                               percentThroughTransition={percentThroughTransition}
                                               selectedFormation={selectedFormation}
                                               isPlaying={isPlaying}
                                               position={position}
                                               currentFormationIndex={currentFormationIndex}
                                               zoom={zoom}
                                            ></Prop>
                                         );
                                      })
                                    : null}
                                 {localSettings.viewCollisions && selectedFormation !== null
                                    ? collisions.map((collision, i) => {
                                         return <Collision key={i} coordsToPosition={coordsToPosition} collision={collision}></Collision>;
                                      })
                                    : null}

                                 {selectedFormation !== null && !isPlaying ? (
                                    <>
                                       {(formations[selectedFormation]?.comments || []).map((comment: comment) => {
                                          return (
                                             <Comment
                                                zoom={zoom}
                                                localSettings={localSettings}
                                                coordsToPosition={coordsToPosition}
                                                selectedFormation={selectedFormation}
                                                key={comment.id}
                                                comment={comment}
                                                addToStack={addToStack}
                                                pushChange={pushChange}
                                             />
                                          );
                                       })}

                                       {localSettings.previousFormationView !== "none"
                                          ? dancers.map((dancer, index) => (
                                               <DancerAliasShadow
                                                  coordsToPosition={coordsToPosition}
                                                  currentFormationIndex={currentFormationIndex}
                                                  isPlaying={isPlaying}
                                                  selectedFormation={selectedFormation}
                                                  key={"shadow" + dancer.id}
                                                  dancer={dancer}
                                                  formations={localSettings.stageFlipped ? flippedFormations : formations}
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
                                                        isPlaying={isPlaying}
                                                        selectedFormation={selectedFormation}
                                                        key={"shadow" + dancer.id}
                                                        dancer={dancer}
                                                        formations={localSettings.stageFlipped ? flippedFormations : formations}
                                                     />
                                                  );
                                               })}
                                    </>
                                 ) : null}
                              </Canvas>
                           ) : null}
                           <FormationControls
                              zoom={zoom}
                              setIsChangingZoom={setIsChangingZoom}
                              isChangingZoom={isChangingZoom}
                              localSettings={localSettings}
                              setLocalSettings={setLocalSettings}
                              setPlaybackRate={setPlaybackRate}
                              addToStack={addToStack}
                              pushChange={pushChange}
                              selectedFormation={selectedFormation}
                              songDuration={songDuration}
                              setSelectedFormation={setSelectedFormation}
                              player={player}
                              isPlaying={isPlaying}
                              setIsPlaying={setIsPlaying}
                              position={position}
                              setPixelsPerSecond={setPixelsPerSecond}
                              pixelsPerSecond={pixelsPerSecond}
                              localSource={localSource}
                              selectedDancers={selectedDancers}
                           ></FormationControls>
                        </div>
                     </DndContext>
                  </div>

                  <div className="  bg-black">
                     <AudioControls
                        setHelpUrl={setHelpUrl}
                        setIsChangingZoom={setIsChangingZoom}
                        isChangingZoom={isChangingZoom}
                        localSettings={localSettings}
                        setLocalSettings={setLocalSettings}
                        setPlaybackRate={setPlaybackRate}
                        addToStack={addToStack}
                        pushChange={pushChange}
                        selectedFormation={selectedFormation}
                        songDuration={songDuration}
                        setSelectedFormation={setSelectedFormation}
                        player={player}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        position={position}
                        setPixelsPerSecond={setPixelsPerSecond}
                        pixelsPerSecond={pixelsPerSecond}
                        localSource={localSource}
                     ></AudioControls>

                     <Timeline
                        // selectedFormations={selectedFormations}
                        // setSelectedFormations={setSelectedFormations}
                        shiftHeld={shiftHeld}
                        playbackRate={playbackRate}
                        setIsScrollingTimeline={setIsScrollingTimeline}
                        isScrollingTimeline={isScrollingTimeline}
                        setPixelsPerSecond={setPixelsPerSecond}
                        addToStack={addToStack}
                        pushChange={pushChange}
                        setSelectedDancers={setSelectedDancers}
                        songDuration={songDuration}
                        selectedFormation={selectedFormation}
                        setSelectedFormation={setSelectedFormation}
                        isPlaying={isPlaying}
                        position={position}
                        soundCloudTrackId={soundCloudTrackId}
                        pixelsPerSecond={pixelsPerSecond}
                        player={player}
                        setPlayer={setPlayer}
                        setSongDuration={setSongDuration}
                        setIsPlaying={setIsPlaying}
                        setPosition={setPosition}
                        videoPlayer={videoPlayer}
                        localSource={localSource}
                        localSettings={localSettings}
                        hasVisited={hasVisited}
                        menuOpen={menuOpen}
                     ></Timeline>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default Edit;

const whereInFormation = (formations: formation[], position: number) => {
   let sum = 0;
   let currentFormationIndex = null;

   let percentThroughTransition;
   for (let i = 0; i < formations.length; i++) {
      sum = sum + formations[i].durationSeconds + (i === 0 ? 0 : formations[i]?.transition.durationSeconds);
      if (position < sum) {
         currentFormationIndex = i;
         if (currentFormationIndex === 0) break;
         let durationThroughTransition = position - (sum - formations[i]?.transition?.durationSeconds - formations[i].durationSeconds);

         if (durationThroughTransition < formations[i]?.transition?.durationSeconds) {
            percentThroughTransition = durationThroughTransition / formations[i]?.transition?.durationSeconds;
         }
         break;
      }
   }
   return { currentFormationIndex, percentThroughTransition };
};

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

// function roundDownToEven(n: number): number {
//    // If the floored number is odd
//    if (Math.floor(n) % 2 !== 0) {
//       return Math.floor(n) - 1;
//    }
//    // If the floored number is even
//    return Math.floor(n);
// }
function roundDownToEven(value) {
   return Number.isNaN(value) ? 0.0 : 2 * Math.round(value / 2);
}
