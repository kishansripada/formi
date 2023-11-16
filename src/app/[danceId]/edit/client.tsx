"use client";
import { roundToHundredth } from "../../../utls";
import { detectCollisions } from "../../../types/collisionDetector";
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
import { comment, dancer, dancerPosition, formation, PIXELS_PER_SQUARE, localSettings, cloudSettings, prop, item } from "../../../types/types";
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
import { AuthSession, RealtimeChannel } from "@supabase/supabase-js";
import { Collisions } from "./_components/SidebarComponents/Collisions";
import { Timeline } from "./_components/Timeline";
import { FormationControls } from "./_components/FormationControls";
import { EventHandler } from "./_components/EventHandler";
import { Assets } from "./_components/Modals/Assets";
// could be dynamic imports
import { Prop } from "./_components/Prop";
import { Comment } from "./_components/Comment";

import { HelpUrl } from "./_components/Modals/HelpUrl";
import { ObjectControls } from "./_components/ObjectControls";
import { Database } from "../../../types/supabase";

import { StageSettings } from "./_components/SidebarComponents/StageSettings";
import { Segments } from "./_components/SidebarComponents/Segments";

import { useStore } from "./store";
import { MobileSidebar } from "./_components/MobileSidebar";
import * as Sentry from "@sentry/browser";
import { cubic, linear } from "./animationFunctions";
import { ItemsAndProps } from "./_components/SidebarComponents/ItemsAndProps/Layout";

const ThreeD = dynamic(() => import("./_components/ThreeD").then((mod) => mod.ThreeD), {
   loading: () => (
      <div className="flex items-center justify-center h-screen bg-neutral-900 ">
         <img src="/logo.png" className="w-12" alt="" />
      </div>
   ),
});

// var jsondiffpatch = require("jsondiffpatch").create({
//    objectHash: function (obj) {
//       return obj.id;
//    },
// });

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
   plan,
}: {
   initialData: any;
   viewOnly: boolean;
   pricingTier: string;
   params: { danceId: string };
   session: AuthSession | null;
   permissions: string[];
   plan: string | null;
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
      liveblocks,
      getFirstSelectedFormation,
      selectedFormations,
      setSelectedFormations,
      position,
      setPosition,
      setIsMobileView,
      isMobileView,
      setImageBlobs,
      imageBlobs,
      shiftHeld,
      setShiftHeld,
   } = useStore();

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

   const videoPlayer = useRef();
   const fullscreenContainer = useRef();

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
   const hasVisited = true;
   const [anyoneCanView, setAnyoneCanView] = useState(initialData.anyonecanview);
   const [permissions, setPermissions] = useState(initialPermissions);
   // const [shiftHeld, setShiftHeld] = useState(false);
   const [playbackRate, setPlaybackRate] = useState(1);
   const [selectedPropIds, setSelectedPropIds] = useState<string[]>([]);
   const [dropDownToggle, setDropDownToggle] = useState<boolean>(false);
   const [audioFiles, setAudiofiles] = useState(initialData.audioFiles);
   const [localSource, setLocalSource] = useState(null);
   // const [songDuration, setSongDuration] = useState<number | null>(null);
   const [zoom, setZoom] = useState(1);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [isCommenting, setIsCommenting] = useState<boolean>(false);
   // const [position, setPosition] = useState<number>(0);
   const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(35);

   const [isScrollingTimeline, setIsScrollingTimeline] = useState(false);
   const [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);
   const [menuOpen, setMenuOpen] = useState<string | null>("formations");
   const [player, setPlayer] = useState(null);
   const [saved, setSaved] = useState<boolean>(true);

   const [isChangingCollisionRadius, setIsChangingCollisionRadius] = useState(false);
   // const [subscriptionStatus, setSubscriptionStatus] = useState("NOT SUBSCRIBED");

   const [isThreeDancerDragging, setIsThreeDancerDragging] = useState(false);
   const [pdfLoading, setPdfLoading] = useState(false);
   const [assetsOpen, setAssetsOpen] = useState(false);
   const [scene, setScene] = useState(null);
   const [propUploads, setPropUploads] = useState([]);
   // hasVisited ? null : { url: "https://www.youtube.com/shorts/JRS1tPHJKAI" }
   const [helpUrl, setHelpUrl] = useState(null);
   useEffect(() => {
      const allImages = items.map((item) => `https://dxtxbxkkvoslcrsxbfai.supabase.co/storage/v1/object/public/props/${item?.url}`);

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
   }, [items]);

   const [resizingPropId, setResizingPropId] = useState(null);
   let { currentFormationIndex, percentThroughTransition } = whereInFormation(formations, position);

   const dancerPositions = (() => {
      if (!isPlaying && selectedFormations.length === 0) {
         return [];
      }
      if (!isPlaying && selectedFormations.length) return getFirstSelectedFormation()?.positions || [];

      if (currentFormationIndex === null) return [];
      if (!percentThroughTransition) {
         return formations[currentFormationIndex]?.positions || [];
      }

      // worst case animate
      const previousFormationPositions = formations[currentFormationIndex - 1]?.positions || [];
      const thisFormationPositions = formations[currentFormationIndex]?.positions || [];
      const animatedPositions = [];

      for (let i = 0; i < thisFormationPositions.length; i++) {
         const previousDancer = previousFormationPositions[i];
         const thisDancer = thisFormationPositions[i];
         if (!previousDancer || !thisDancer) continue;
         let animatedPosition;
         //   console.log(thisDancer);
         if (thisDancer.transitionType === "cubic" && thisDancer.controlPointStart && thisDancer.controlPointEnd) {
            animatedPosition = cubic(
               previousDancer.position,
               thisDancer.position,
               percentThroughTransition,
               thisDancer.controlPointStart,
               thisDancer.controlPointEnd
            );
         } else if (thisDancer.transitionType === "teleport") {
            animatedPosition = linear(previousDancer.position, thisDancer.position, percentThroughTransition);
         } else {
            animatedPosition = linear(previousDancer.position, thisDancer.position, percentThroughTransition);
         }
         animatedPositions.push({ ...thisDancer, position: animatedPosition });
      }

      return animatedPositions;
   })();

   const [videoPosition, setVideoPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">("top-right");

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
      setSelectedFormations([formations.find((formation, i) => i === currentFormationIndex)?.id]);
   }, [currentFormationIndex, isPlaying]);

   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

   const exportPdf = async () => {
      setPdfLoading(true);
      setLocalSettings({ ...localSettings, viewingTwo: true, viewingThree: false });
      // const parentContainer = document.createElement("div");
      // const extendedFormations = [...formations, { name: "", notes: "" }];

      // for (let index = 0; index < extendedFormations.length; index++) {
      //    setSelectedFormations([formations[index]?.id]);

      //    // Wait for the formation to be rendered in the DOM
      //    await sleep(1000); // Delay in milliseconds. Adjust as needed.

      //    const stageElement = document.getElementById("stage");
      //    const clonedElement = stageElement.cloneNode(true); // Clone the element with its children
      //    console.log(typeof clonedElement);
      //    // Add each stage to the parentContainer
      //    const label = document.createElement("p");
      //    label.textContent = `${extendedFormations[index].name} (${index + 1} of ${formations.length})`;
      //    label.style.textAlign = "center";
      //    // label.style.width = "100%";

      //    const notes = document.createElement("p");
      //    notes.textContent = `${extendedFormations[index].notes || ""}`;
      //    notes.style.textAlign = "left";
      //    // notes.style.width = "100%";

      //    // Create a container for the current formation to force a new page
      //    const formationContainer = document.createElement("div");

      //    // formationContainer.style.transform = "rotate(90deg)"; // Rotate the content 90 degrees

      //    // Add the label, formation, and notes to the formationContainer
      //    formationContainer.appendChild(clonedElement);
      //    formationContainer.appendChild(label);
      //    formationContainer.appendChild(notes);

      //    // Add the formationContainer to the parentContainer
      //    parentContainer.appendChild(formationContainer);
      // }

      const canvases = [];

      // dynamically import html2canvas and jspdf
      const [html2canvasinit, jsPDFinit] = await Promise.all([import("html2canvas"), import("jspdf")]);
      const html2canvas = html2canvasinit.default;
      const jsPDF = jsPDFinit.default;

      const stageElement = document.getElementById("stage");
      for (let index = 0; index < formations.length; index++) {
         setSelectedFormations([formations[index]?.id]);

         // Wait for the formation to be rendered in the DOM
         await sleep(1000); // Delay in milliseconds. Adjust as needed.

         console.log(stageElement?.clientWidth);
         const canvas = await html2canvas(stageElement);
         // canvases.push(canvas);

         // const formationContainer = document.createElement("div");

         const label = document.createElement("p");
         label.textContent = `${formations[index].name} (${index + 1} of ${formations.length})`;
         label.style.textAlign = "center";

         // label.style.width = "100%";

         const notes = document.createElement("p");
         notes.textContent = `${formations[index].notes || ""}`;
         notes.style.textAlign = "left";
         // notes.style.width = "100%";
         // formationContainer.appendChild(canvas);
         // formationContainer.appendChild(label);
         // formationContainer.appendChild(notes);
         // formationContainer.appendChild(formationContainer);
         canvases.push({ canvas, label, notes });
         // document.body.appendChild(canvas);
      }

      // Now export the canvases to a PDF
      const pdf = new jsPDF({
         orientation: "landscape",
         unit: "px",
         format: [stageElement?.clientWidth, stageElement?.clientHeight + 100],
      });

      for (let i = 0; i < canvases.length; i++) {
         const imgData = canvases[i].canvas.toDataURL("image/png");
         // pdf.addImage(imgData, "PNG", 0, 0);
         pdf.addImage(imgData, "PNG", 0, 0, stageElement?.clientWidth, stageElement?.clientHeight);
         pdf.text(canvases[i].label.textContent, 10, stageElement?.clientHeight + 20);
         pdf.text(canvases[i].notes.textContent, 10, stageElement?.clientHeight + 40);
         if (i < canvases.length - 1) {
            pdf.addPage(); // Add new page for next image if there is one
         }
      }

      pdf.save("formations.pdf");
      setPdfLoading(false);

      var options = {
         filename: `${danceName}.pdf`,
      };

      // domToPdf(parentContainer, options, (pdf) => {
      //    setPdfLoading(false);
      // });
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

   const roundPositions = () => {
      const { stageBackground, gridSubdivisions, horizontalGridSubdivisions, verticalFineDivisions, horizontalFineDivisions, stageDimensions } =
         cloudSettings;
      const { gridSnap } = localSettings;
      let gridSizeX = 1;
      let gridSizeY = 1;
      let verticalOffset = 0;
      let horizontalOffset = 0;
      if (stageBackground === "gridfluid" || stageBackground === "cheer9") {
         // Determine the total number of divisions along each axis.
         const totalVerticalDivisions = gridSubdivisions * verticalFineDivisions;
         const totalHorizontalDivisions = horizontalGridSubdivisions * horizontalFineDivisions;

         // Calculate the width and height of each grid cell.
         gridSizeX = stageDimensions.width / totalVerticalDivisions / gridSnap;
         gridSizeY = stageDimensions.height / totalHorizontalDivisions / gridSnap;
         let isOddVerticalDivisions = (gridSubdivisions * verticalFineDivisions) % 2 !== 0;
         let isOddHorizontalDivisions = (horizontalGridSubdivisions * horizontalFineDivisions) % 2 !== 0;

         verticalOffset = isOddVerticalDivisions ? gridSizeX / 2 : 0;
         horizontalOffset = isOddHorizontalDivisions ? gridSizeY / 2 : 0;
         if (gridSnap % 2 === 0) {
            verticalOffset = 0;
            horizontalOffset = 0;
         }
      } else {
         gridSizeX = 1 / gridSnap;
         gridSizeY = 1 / gridSnap;
      }

      // console.log(gridSizeX);
      setFormations(
         formations.map((formation) => {
            // Use the grid cell dimensions to round the dancer positions to the nearest grid position.
            return {
               ...formation,
               positions: formation.positions.map((position) => {
                  return {
                     ...position,
                     position: {
                        x: roundToHundredth(Math.round((position.position.x - verticalOffset) / gridSizeX) * gridSizeX + verticalOffset),
                        y: roundToHundredth(Math.round((position.position.y - horizontalOffset) / gridSizeY) * gridSizeY + horizontalOffset),
                     },
                  };
               }),
            };
         })
      );
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
      if (viewOnlyInitial || danceName === "initialName") return;

      setSaved(false);
      uploadSettings(cloudSettings);
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
      if (viewOnlyInitial || danceName === "initialName") return;

      setSaved(false);

      uploadDancers(dancers);
   }, [dancers]);

   let uploadSoundCloudId = useCallback(
      debounce(async (soundCloudTrackId) => {
         console.log("uploading soundcloudId");
         const { data, error } = await supabase.from("dances").update({ soundCloudId: soundCloudTrackId, last_edited: new Date() }).eq("id", danceId);

         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 0),
      [danceId]
   );

   useDidMountEffect(() => {
      if (viewOnlyInitial || danceName === "initialName") return;
      setSaved(false);
      uploadSoundCloudId(soundCloudTrackId);
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
      if (viewOnlyInitial || danceName === "initialName") return;
      setSaved(false);
      uploadName(danceName);
   }, [danceName]);

   // // ///////////
   let uploadFormations = useCallback(
      debounce(async (formations) => {
         console.log("uploading formations");
         const { data, error } = await supabase.from("dances").update({ formations: formations, last_edited: new Date() }).eq("id", danceId);
         const { data: danceData, error: danceError } = await supabase.from("activity").upsert({ date: new Date(), performance: danceId }).single();
         console.log({ data });
         console.log({ error });

         setSaved(true);
      }, 5000),
      [danceId]
   );

   useDidMountEffect(() => {
      if (viewOnlyInitial || danceName === "initialName") return;
      setSaved(false);

      uploadFormations(formations);
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
      if (viewOnlyInitial || danceName === "initialName") return;
      setSaved(false);
      uploadProps(props);
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
      if (viewOnlyInitial || danceName === "initialName") return;
      setSaved(false);
      uploadItems(items);
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
      if (viewOnlyInitial || danceName === "initialName") return;
      setSaved(false);
      uploadSegments(segments);
   }, [segments]);

   //////////////////////
   let flippedFormations = formations.map((formation: formation) => {
      let flippedPositions = formation?.positions.map((position) => {
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

      return { ...formation, positions: flippedPositions };
   });

   //////////////////////////
   const collisions = localSettings.viewCollisions
      ? detectCollisions(localSettings.stageFlipped ? flippedFormations : formations, selectedFormations, localSettings.collisionRadius)
      : [];

   function handleDragEnd(event) {
      const { active, over } = event;

      if (over && active.data.current.supports.includes(over.data.current.type)) {
         setVideoPosition(over.id);
      }
   }

   useEffect(() => {
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`);
   }, []);

   const exportThree = async () => {
      const { USDZExporter } = await import("three/addons/exporters/USDZExporter.js");

      const exporter = new USDZExporter();
      const arraybuffer = await exporter.parse(scene);
      const blob = new Blob([arraybuffer], { type: "model/vnd.usdz+zip" });

      const url = URL.createObjectURL(blob);

      // Create an anchor element and set its href to the blob's URL
      const a = document.createElement("a");
      a.rel = "ar";
      a.href = url;
      // a.download = "scene.usdz";
      const img = document.createElement("img");
      img.src = "path_to_your_image.jpg"; // Set the image source
      img.alt = "Description of image";
      a.appendChild(img);
      // Append the anchor to the body (this is required for Firefox)
      document.body.appendChild(a);

      // Trigger a click event on the anchor
      a.click();

      // Clean up: remove the anchor and revoke the blob URL
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
   };

   return (
      <>
         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
         <Toaster></Toaster>
         <Head>
            <title>Edit | FORMI</title>
            {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" /> */}

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
            {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta> */}
            {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta> */}
         </Head>

         {helpUrl && <HelpUrl helpUrl={helpUrl} setHelpUrl={setHelpUrl}></HelpUrl>}

         {pdfLoading ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] bg-black/80 text-white border border-neutral-600  rounded-xl h-[100px] bg-white z-50 grid place-items-center">
               <p className="text-center">Loading PDF. This may take a while.</p>
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
               pushChange={pushChange}
               assetsOpen={assetsOpen}
               invalidatePropUploads={invalidatePropUploads}
               propUploads={propUploads}
               setAssetsOpen={setAssetsOpen}
               session={session}
            ></Assets>
         ) : null}
         <EventHandler
            fullscreenContainer={fullscreenContainer}
            position={position}
            setPosition={setPosition}
            selectedPropIds={selectedPropIds}
            setIsScrollingTimeline={setIsScrollingTimeline}
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
            draggingDancerId={draggingDancerId}
            setDraggingDancerId={setDraggingDancerId}
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
            className={`  full-screen   flex-col   flex  bg-[#fafafa] dark:bg-black overflow-hidden text-neutral-900 select-none `}
            style={{
               touchAction: "none",
            }}
         >
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
            <style>
               {`
                     html,
                     body {
                  overscroll-behavior: none;
                  overscroll-behavior-y: none;
                  overflow-y: overlay;
                  background-color: black;
                  // overscroll-behavior-x: none;
              }
              .full-screen {
               height: 100vh; /* Fallback for browsers that do not support Custom Properties */
               height: calc(var(--vh, 1vh) * 100);
             }
               `}
            </style>

            <Header
               fullscreenContainer={fullscreenContainer}
               danceId={danceId}
               folder={initialData?.project_id}
               exportPdf={exportPdf}
               dropDownToggle={dropDownToggle}
               isCommenting={isCommenting}
               pushChange={pushChange}
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
               plan={plan}
               permissions={permissions}
               setPermissions={setPermissions}
               anyoneCanView={anyoneCanView}
               setAnyoneCanView={setAnyoneCanView}
            />

               <MobileSidebar
                  setLocalSettings={setLocalSettings}
                  setHelpUrl={setHelpUrl}
                  setMenuOpen={setMenuOpen}
                  menuOpen={menuOpen}
               ></MobileSidebar>

            <div className="flex flex-row overflow-hidden w-screen h-full">
               <Sidebar setLocalSettings={setLocalSettings} setHelpUrl={setHelpUrl} setMenuOpen={setMenuOpen} menuOpen={menuOpen}></Sidebar>
               <div className="flex flex-col w-full h-full overflow-hidden">
                  <div className="flex flex-row   overflow-hidden w-full h-full">
                     {!localSettings.fullScreen ? (
                        <div
                           style={{
                              pointerEvents: menuOpen ? "auto" : "none",
                           }}
                              className="flex flex-row absolute md:static bottom-0 top-[103px] h-full md:w-auto w-full md:z-auto z-[65]  "
                        >
                              <>
                              {menuOpen ? (
                                 <div className="border-r border-neutral-300 dark:border-neutral-700 min-w-[240px]  w-[240px] dark:bg-neutral-900 bg-neutral-50 dark:text-white relative">
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
                                    addToStack={addToStack}
                                    pushChange={pushChange}
                                    dancers={dancers}
                                    selectedDancers={selectedDancers}
                                    localSettings={localSettings}
                                 ></Roster>
                              ) : menuOpen === "audio" ? (
                                 <ChooseAudioSource
                                    session={session}
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
                                          <></>
                                       ) : menuOpen === "items" ? (
                                          <ItemsAndProps
                                    setAssetsOpen={setAssetsOpen}
                                    setHelpUrl={setHelpUrl}
                                    pushChange={pushChange}
                                    setSelectedPropIds={setSelectedPropIds}
                                    invalidatePropUploads={invalidatePropUploads}
                                    selectedPropIds={selectedPropIds}
                                    propUploads={propUploads}
                                    setIsPlaying={setIsPlaying}
                                    soundCloudTrackId={soundCloudTrackId}
                                    setSoundCloudTrackId={setSoundCloudTrackId}
                                    audioFiles={audioFiles}
                                    setAudiofiles={setAudiofiles}
                                    setLocalSource={setLocalSource}
                                          ></ItemsAndProps>
                              ) : menuOpen === "segments" ? (
                                 <Segments pushChange={pushChange}></Segments>
                              ) : menuOpen === "formations" ? (
                                 <CurrentFormation
                                    dropDownToggle={dropDownToggle}
                                    isCommenting={isCommenting}
                                    setIsCommenting={setIsCommenting}
                                    addToStack={addToStack}
                                    pushChange={pushChange}
                                    selectedDancers={selectedDancers}
                                    setSelectedDancers={setSelectedDancers}
                                    dancers={dancers}
                                 />
                              ) : null}
                           </div>
                              ) : null}
                              </>
                        </div>
                     ) : null}
                     <DndContext id="1" onDragEnd={handleDragEnd}>
                           <div className={`flex flex-col min-w-0 flex-grow items-center bg-neutral-50 dark:bg-neutral-900 relative `}>
                              {/* <ObjectControls
                              zoom={zoom}
                              localSettings={localSettings}
                              setLocalSettings={setLocalSettings}
                              setPlaybackRate={setPlaybackRate}
                              addToStack={addToStack}
                              pushChange={pushChange}
                              songDuration={songDuration}
                              soundCloudTrackId={soundCloudTrackId}
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
                                 localSettings={localSettings}
                              ></ObjectControls> */}

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
                              {/* <video
                                 className="w-1/4"
                                 src="https://res.cloudinary.com/dxavpfwki/video/upload/q_auto:eco,vc_auto/v1692378451/IMG_2428_j6ymhd.mp4"
                              ></video> */}
                              {localSettings.viewingThree ? (
                                 <ThreeD
                                    setScene={setScene}
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
                                    draggingDancerId={draggingDancerId}
                                    setDraggingDancerId={setDraggingDancerId}
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
                                    draggingDancerId={draggingDancerId}
                                    setDraggingDancerId={setDraggingDancerId}
                                    selectedDancers={selectedDancers}
                                    setSelectedDancers={setSelectedDancers}
                                    setIsPlaying={setIsPlaying}
                                    setPixelsPerSecond={setPixelsPerSecond}
                                    coordsToPosition={coordsToPosition}
                                    currentFormationIndex={currentFormationIndex}
                                    percentThroughTransition={percentThroughTransition}
                                    dancers={dancers}
                                 >
                                    {selectedFormations.length === 1 && getFirstSelectedFormation()?.id !== formations[0]?.id && !isPlaying ? (
                                       <PathEditor
                                          zoom={zoom}
                                          collisions={collisions}
                                          dancers={dancers}
                                          currentFormationIndex={currentFormationIndex}
                                          // formations={localSettings.stageFlipped ? flippedFormations : formations}
                                          selectedDancers={selectedDancers}
                                          localSettings={localSettings}
                                          coordsToPosition={coordsToPosition}
                                       />
                                    ) : (
                                       <></>
                                    )}

                                    {dancers.map((dancer, index) => (
                                       <DancerAlias
                                          roundPositions={roundPositions}
                                          zoom={zoom}
                                          setZoom={setZoom}
                                          coordsToPosition={coordsToPosition}
                                          selectedDancers={selectedDancers}
                                          isPlaying={isPlaying}
                                          position={position}
                                          key={dancer.id}
                                          dancer={dancer}
                                          formations={localSettings.stageFlipped ? flippedFormations : formations}
                                          draggingDancerId={draggingDancerId}
                                          currentFormationIndex={currentFormationIndex}
                                          percentThroughTransition={percentThroughTransition}
                                          localSettings={localSettings}
                                          index={index}
                                          collisions={collisions}
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
                                                  isPlaying={isPlaying}
                                                  position={position}
                                                  currentFormationIndex={currentFormationIndex}
                                                  zoom={zoom}
                                                  localSettings={localSettings}
                                               ></Prop>
                                            );
                                         })
                                       : null}

                                    {localSettings.viewCollisions && selectedFormations.length === 1
                                       ? collisions.map((collision, i) => {
                                            return <Collision key={i} coordsToPosition={coordsToPosition} collision={collision}></Collision>;
                                         })
                                       : null}

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
                                                     key={"shadow" + dancer.id}
                                                     dancer={dancer}
                                                     //   formations={localSettings.stageFlipped ? flippedFormations : formations}
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
                                                           isPlaying={isPlaying}
                                                           key={"shadow" + dancer.id}
                                                           dancer={dancer}
                                                           //   formations={localSettings.stageFlipped ? flippedFormations : formations}
                                                           localSettings={localSettings}
                                                        />
                                                     );
                                                  })}
                                       </>
                                    ) : null}
                                 </Canvas>
                              ) : null}
                           </div>

                           <FormationControls
                                 setZoom={setZoom}
                              zoom={zoom}
                              localSettings={localSettings}
                              setLocalSettings={setLocalSettings}
                              setPlaybackRate={setPlaybackRate}
                              addToStack={addToStack}
                              pushChange={pushChange}
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

                        <div className="h-full bg-neutral-900 max-w-[200px] w-[200px] min-w-[200px] border-l border-neutral-700 hidden md:flex">
                           {selectedDancers.length ? (
                              <ObjectControls
                                 zoom={zoom}
                                 localSettings={localSettings}
                                 setLocalSettings={setLocalSettings}
                                 setPlaybackRate={setPlaybackRate}
                                 addToStack={addToStack}
                                 pushChange={pushChange}
                                 soundCloudTrackId={soundCloudTrackId}
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
                                 localSettings={localSettings}
                                 setAssetsOpen={setAssetsOpen}
                              ></ObjectControls>
                           ) : (
                              <>
                                 {/* <div className="text-neutral-200 text-lg p-2">
                                    <span className="font-bold">20 dancers</span> <span className="font-light">on stage</span>
                                 </div> */}
                              </>
                           )}
                        </div>
                  </div>

                  <div className="  bg-black">
                     <AudioControls
                        dancers={dancers}
                        setHelpUrl={setHelpUrl}
                        localSettings={localSettings}
                        setLocalSettings={setLocalSettings}
                        setPlaybackRate={setPlaybackRate}
                        addToStack={addToStack}
                        pushChange={pushChange}
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
                        isPlaying={isPlaying}
                        position={position}
                        soundCloudTrackId={soundCloudTrackId}
                        pixelsPerSecond={pixelsPerSecond}
                        setIsPlaying={setIsPlaying}
                        setPosition={setPosition}
                        videoPlayer={videoPlayer}
                        localSource={localSource}
                        localSettings={localSettings}
                        hasVisited={hasVisited}
                        currentFormationIndex={currentFormationIndex}
                        menuOpen={menuOpen}
                     ></Timeline>
                  </div>
               </div>
            </div>
         </div>
         </ThemeProvider>
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
