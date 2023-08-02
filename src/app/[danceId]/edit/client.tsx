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

import {
   comment,
   dancer,
   dancerPosition,
   formation,
   PIXELS_PER_SQUARE,
   localSettings,
   cloudSettings,
   formationGroup,
   prop,
   item,
} from "../../../types/types";
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
const ThreeD = dynamic(() => import("./_components/ThreeD").then((mod) => mod.ThreeD), {
   loading: () => <p>Loading...</p>,
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
}: {
   initialData: any;
   viewOnly: boolean;
   pricingTier: string;
   params: { danceId: string };
   session: AuthSession | null;
   permissions: string[];
}) => {
   const colors = ["#e6194B", "#4363d8", "#f58231", "#800000", "#469990", "#3cb44b"];

   const supabase = createClientComponentClient<Database>();
   const router = useRouter();
   const videoPlayer = useRef();

   // cloud
   const [cloudSettings, setCloudSettings] = useState<cloudSettings>({
      ...initialData.settings,
      stageBackground: initialData.settings.stageBackground || "grid",
      gridSubdivisions: initialData.settings.gridSubdivisions || 7,
   });

   const [formations, setFormations] = useState<formation[]>(initialData.formations);

   const [anyoneCanView, setAnyoneCanView] = useState(initialData.anyonecanview);
   const [permissions, setPermissions] = useState(initialPermissions);

   const [soundCloudTrackId, setSoundCloudTrackId] = useState<string | null>(initialData.soundCloudId);
   const [dancers, setDancers] = useState<dancer[]>(initialData.dancers);
   const [danceName, setDanceName] = useState<string>(initialData.name);
   const [formationGroups, setFormationGroups] = useState<formationGroup[]>([]);
   const [shiftHeld, setShiftHeld] = useState(false);
   const [playbackRate, setPlaybackRate] = useState(1);
   const [selectedPropIds, setSelectedPropIds] = useState<string[]>([]);
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

   const [dropDownToggle, setDropDownToggle] = useState<boolean>(false);
   const [viewOnly, setViewOnly] = useState(viewOnlyInitial);

   const [audioFiles, setAudiofiles] = useState(initialData.audioFiles);
   const [upgradeIsOpen, setUpgradeIsOpen] = useState<boolean>(false);
   const [deltas, setDeltas] = useState([]);
   const [localSource, setLocalSource] = useState(null);
   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [zoom, setZoom] = useState(1);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [isCommenting, setIsCommenting] = useState<boolean>(false);
   const [position, setPosition] = useState<number>(0);
   const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(35);
   const [selectedFormation, setSelectedFormation] = useState<number | null>(0);
   const [selectedDancers, setSelectedDancers] = useState<string[]>([]);
   const [isScrollingTimeline, setIsScrollingTimeline] = useState(false);
   const [previousFormation, setPreviousFormation] = useState<formation[]>(initialData.formations);
   const [previousDancers, setPreviousDancers] = useState<formation[]>(initialData.dancers);
   const [previousCloudSettings, setPreviousCloudSettings] = useState<formation[]>(initialData.settings);
   const [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);
   const [menuOpen, setMenuOpen] = useState<string>("formations");
   const [player, setPlayer] = useState(null);
   const [saved, setSaved] = useState<boolean>(true);
   const [shareIsOpen, setShareIsOpen] = useState(false);
   const [isChangingCollisionRadius, setIsChangingCollisionRadius] = useState(false);
   const [isEditingFormationGroup, setIsEditingFormationGroup] = useState(false);
   const [subscriptionStatus, setSubscriptionStatus] = useState("NOT SUBSCRIBED");
   const [isChangingZoom, setIsChangingZoom] = useState(false);
   const [isThreeDancerDragging, setIsThreeDancerDragging] = useState(false);
   const [pdfLoading, setPdfLoading] = useState(false);

   const [assetsOpen, setAssetsOpen] = useState(false);

   const [onlineUsers, setOnlineUsers] = useState({});
   const [userPositions, setUserPositions] = useState({});
   const [channelGlobal, setChannelGlobal] = useState<RealtimeChannel>();

   const [items, setItems] = useState<item[]>(initialData.items);
   const [props, setProps] = useState<prop[]>(initialData.props);
   const [previousProps, setPreviousProps] = useState(initialData.props);
   const [propUploads, setPropUploads] = useState([]);
   const [helpUrl, setHelpUrl] = useState(null);
   // const [selectedFormations, setSelectedFormations] = useState<number[]>([]);
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
      const parentContainer = document.createElement("div");

      for (let index = 0; index < formations.length; index++) {
         setSelectedFormation(index); // Assuming this function sets the formation

         // Wait for the formation to be rendered in the DOM
         await sleep(100); // Delay in milliseconds. Adjust as needed.

         const stageElement = document.getElementById("stage");
         const clonedElement = stageElement.cloneNode(true); // Clone the element with its children

         // Add each stage to the parentContainer
         const label = document.createElement("p");
         label.textContent = `${formations[index].name} (${index + 1} of ${formations.length})`;
         label.style.textAlign = "center";
         label.style.width = "100%";

         const notes = document.createElement("p");
         notes.textContent = `${formations[index].notes || ""}`;
         notes.style.textAlign = "left";
         notes.style.width = "100%";
         // Add the label and formation to the parentContainer

         parentContainer.appendChild(clonedElement);
         parentContainer.appendChild(label);
         parentContainer.appendChild(notes);
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

   const removeDancer = (id: string) => {
      // remove dancer and all their positions
      setFormations((formations) => {
         return formations.map((formation) => {
            return { ...formation, positions: formation.positions.filter((dancerPosition) => dancerPosition.id !== id) };
         });
      });
      setDancers((dancers: dancer[]) => {
         return dancers.filter((dancer) => dancer.id !== id);
      });
      pushChange();
   };

   const undo = () => {
      // console.log("undo");
      if (!deltas.length) return;
      // setSaved(false);

      let reverseDelta = jsondiffpatch.reverse(deltas[deltas.length - 1]);
      setDeltas((deltas) => {
         return [...deltas].slice(0, -1);
      });
      // console.log(reverseDelta);
      setFormations((formations: formation[]) => {
         let reversed = jsondiffpatch.patch({ formations, dancers, props }, reverseDelta);
         setDancers(reversed.dancers ? reversed.dancers : dancers);
         setProps(reversed.props ? reversed.props : props);
         return [...reversed.formations];
      });
   };

   const addToStack = () => {
      return;
      // setPreviousFormation(formations);
   };

   const pushChange = () => {
      setDeltas((deltas) => {
         return deltas.slice(-40);
      });
      setFormations((formations: formation[]) => {
         setDancers((dancers: dancer[]) => {
            setProps((props: prop[]) => {
               let delta = jsondiffpatch.diff(
                  { formations: previousFormation, dancers: previousDancers, props: previousProps },
                  { formations, dancers, props }
               );

               setDeltas((deltas) => {
                  if (!delta) return deltas;
                  return [...deltas, delta];
               });
               return props;
            });
            return dancers;
         });
         return formations;
      });

      // console.log({ deltas });

      // setCloudSettings((cloudSettings) => {
      //    setPreviousCloudSettings((previousCloudSettings: dancer[]) => {
      //       if (!previousCloudSettings) return cloudSettings;
      //       var delta = jsonpatch.compare(previousCloudSettings, JSON.parse(JSON.stringify(cloudSettings)));
      //       if (!delta.length) return cloudSettings;
      //       console.log({ settings: delta });

      //       setSaved(false);
      //       try {
      //          supabase
      //             .from("dances")
      //             .update({ settings: cloudSettings, last_edited: new Date() })
      //             .eq("id", router.query.danceId)
      //             .then((r) => {
      //                console.log("pushed new settings to db");
      //                setSaved(true);
      //             });
      //          if (Object.keys(onlineUsers).length > 1) {
      //             console.log("sending settings update to clients");
      //             channelGlobal.send({
      //                type: "broadcast",
      //                event: "settings-update",
      //                payload: cloudSettings,
      //             });
      //          }
      //       } catch (error) {
      //          setSaved(true);
      //          toast.error("Error saving changes. Please refresh the page.");
      //       }

      //       // if (delta) {
      //       //    setDeltas((deltas) => [...deltas, delta]);
      //       // }

      //       return cloudSettings;
      //    });
      //    return cloudSettings;
      // });
      setDancers((dancers) => {
         setPreviousDancers((previousDancers: dancer[]) => {
            // if (!previousDancers) return dancers;
            // var delta = jsonpatch.compare(previousDancers, dancers);

            // if (!delta.length) return dancers;
            // console.log({ dancers: delta });
            // setSaved(false);
            // try {
            //    supabase
            //       .from("dances")
            //       .update({ dancers: dancers, last_edited: new Date() })
            //       .eq("id", router.query.danceId)
            //       .then((r) => {
            //          console.log("pushed new dancers to db");
            //          setSaved(true);
            //       });
            //    if (Object.keys(onlineUsers).length > 1) {
            //       console.log("sending dancers update to clients");
            //       channelGlobal.send({
            //          type: "broadcast",
            //          event: "dancers-update",
            //          payload: dancers,
            //       });
            //    }
            // } catch (error) {
            //    setSaved(true);
            //    toast.error("Error saving changes. Please refresh the page.");
            // }

            // if (delta) {
            //    setDeltas((deltas) => [...deltas, delta]);
            // }

            return dancers;
         });
         return dancers;
      });
      setFormations((formations) => {
         setPreviousFormation((previousFormations: formation[]) => {
            // if (!previousFormations) return formations;
            // var delta = jsonpatch.compare([...previousFormations], JSON.parse(JSON.stringify(formations)));

            // if (!delta.length) return formations;
            // console.log({ formations: delta });
            // setSaved(false);
            // try {
            //    supabase
            //       .rpc("apply_json_patch_operations", {
            //          operations: delta,
            //          dance_id: router.query.danceId,
            //       })
            //       .then((r) => {
            //          setSaved(true);
            //          console.log("pushed new formations to db");
            //          if (r.error) {
            //             toast.error("Error saving changes. Please refresh the page.");
            //          }
            //       });
            //    if (Object.keys(onlineUsers).length > 1) {
            //       console.log("sending formation update to clients");
            //       channelGlobal.send({
            //          type: "broadcast",
            //          event: "formation-update",
            //          payload: delta,
            //       });
            //    }
            // } catch (error) {
            //    setSaved(true);
            //    toast.error("Error saving changes. Please refresh the page.");
            // }

            return formations;
         });
         return formations;
      });
      setProps((props: prop[]) => {
         setPreviousProps((previousProps: prop[]) => {
            return props;
         });
         return props;
      });
   };

   // useEffect(() => {
   //    if (!channelGlobal) return;
   //    if (!session) return;
   //    channelGlobal.send({
   //       type: "broadcast",
   //       event: "user-position-update",
   //       payload: {
   //          [session?.user?.id]: {
   //             selectedFormation,
   //             selectedDancers,
   //          },
   //       },
   //    });
   // }, [selectedFormation, selectedDancers, channelGlobal]);

   // useEffect(() => {
   // if (!session || !router?.query?.danceId) return;

   // let channel = supabase.channel(router.query.danceId, {
   //    config: {
   //       presence: {
   //          key: session?.user.id,
   //       },
   //    },
   // });

   // setChannelGlobal(channel);

   // recieve presence data
   // channel.on("presence", { event: "sync" }, () => {
   //    let state = channel.presenceState();
   //    // console.log(state);
   //    Object.keys(state).forEach((id, index) => {
   //       state[id][0].color = colors[index];
   //    });
   //    setUserPositions((userPositions) => {
   //       let filteredKeys = Object.keys(userPositions).filter((position) => Object.keys(state).includes(position));
   //       const filteredObject = filteredKeys.reduce((obj, key) => {
   //          obj[key] = userPositions[key];
   //          return obj;
   //       }, {});

   //       return filteredObject;
   //    });

   //    setOnlineUsers({ ...state });
   // });

   // send presence data
   // channel.subscribe(async (status) => {
   //    console.log(status);
   //    setSubscriptionStatus(status);
   //    if (status === "SUBSCRIBED") {
   //       const resp = await channel.track({
   //          name: session?.user.user_metadata.full_name,
   //          profilePicUrl: session?.user.user_metadata.avatar_url,
   //       });
   //       console.log({ resp });
   //    }
   // }, 20000);

   // receive broadcasted data
   //    const formsChannel = channel
   //       .on("broadcast", { event: "user-position-update" }, ({ payload }) => {
   //          // console.log(payload);
   //          setUserPositions((userPositions) => {
   //             return { ...userPositions, ...payload };
   //          });
   //       })
   //       .on("broadcast", { event: "formation-update" }, ({ payload }) => {
   //          console.log("recieved formation update");
   //          // if the formation you are viewing is deleted, reset the selected formation to 0
   //          payload.forEach((patch: any) => {
   //             if (patch.path.split("/").length === 2 && patch.op === "remove") {
   //                setSelectedFormation((selectedFormation) => {
   //                   if (parseInt(patch.path.split("/")[1]) === selectedFormation) {
   //                      toast("The formation you were viewing was deleted.");
   //                      return 0;
   //                   } else {
   //                      return selectedFormation;
   //                   }
   //                });
   //             }
   //          });
   //          try {
   //             setFormations((formations: formation[]) => {
   //                let newForms = jsonpatch.applyPatch(formations, payload).newDocument;
   //                return [...newForms];
   //             });
   //          } catch (error) {
   //             toast.error("Error saving changes. Please refresh the page.");
   //          }
   //       })
   //       .on("broadcast", { event: "dancers-update" }, ({ payload }) => {
   //          console.log("recieved dancers update");
   //          try {
   //             setDancers((dancers) => {
   //                var delta = jsonpatch.compare(dancers, JSON.parse(JSON.stringify(payload)));
   //                if (delta.length) {
   //                   return payload;
   //                } else {
   //                   return dancers;
   //                }
   //             });
   //          } catch (error) {
   //             toast.error("Error saving changes. Please refresh the page.");
   //          }
   //       })
   //       .on("broadcast", { event: "settings-update" }, ({ payload }) => {
   //          console.log("recieved settings update");
   //          try {
   //             setCloudSettings((cloudSettings) => {
   //                var delta = jsonpatch.compare(cloudSettings, JSON.parse(JSON.stringify(payload)));
   //                if (delta.length) {
   //                   return payload;
   //                } else {
   //                   return cloudSettings;
   //                }
   //             });
   //          } catch (error) {
   //             toast.error("Error saving changes. Please refresh the page.");
   //          }
   //       });

   //    return () => {
   //       supabase.removeChannel(formsChannel);
   //       supabase.removeChannel(channel);
   //    };
   // }, [router.query.danceId, session]);

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

   //////////////////////////////////////
   // let uploadGroups = useCallback(
   //    debounce(async (formationGroups) => {
   //       console.log("uploading dancers");
   //       const { data, error } = await supabase
   //          .from("dances")
   //          .update({ formation_groups: formationGroups, last_edited: new Date() })
   //          .eq("id", router.query.danceId);

   //       console.log({ data });

   //       console.log({ error });
   //       setSaved(true);
   //    }, 5000),
   //    [router.query.danceId]
   // );

   // useDidMountEffect(() => {
   //    if (!session && router.query.danceId !== "207") {
   //       router.push("/login");
   //    }
   //    if (router.isReady) {
   //       setSaved(false);
   //       uploadGroups(formationGroups);
   //    }
   // }, [formationGroups]);
   // // // // // // // // // // // //
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

         {isCommenting ? (
            <>
               <div className="fixed left-1/2 -translate-x-1/2 w-60 h-12 select-none rounded-full shadow-xl bottom-6 bg-black  z-[9999] opacity-70 grid place-items-center">
                  <p className="text-white text-sm pointer-events-none">Click on the stage to comment</p>
               </div>
            </>
         ) : null}

         {/* {subscriptionStatus !== "SUBSCRIBED" ? (
            <>
               <div className="fixed bottom-0 left-0 h-full  w-full  flex flex-col z-[9999999]  ">
                  <div className="flex flex-row items-center justify-center h-14 bg-red-600 mt-auto pointer-events-auto">
                     <p className="text-white text-sm">
                        You are disconnected, please <button className="font-bold">click here</button> or refresh the page to connect.
                     </p>
                  </div>
               </div>
            </>
         ) : null} */}

         {assetsOpen ? (
            <Assets
               setProps={setProps}
               menuOpen={menuOpen}
               pushChange={pushChange}
               setItems={setItems}
               assetsOpen={assetsOpen}
               invalidatePropUploads={invalidatePropUploads}
               propUploads={propUploads}
               setAssetsOpen={setAssetsOpen}
               session={session}
               setCloudSettings={setCloudSettings}
            ></Assets>
         ) : null}

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
               body {
                  overscroll-behavior: none;
              }
               `}
            </style>
            <EventHandler
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
               viewOnly={viewOnly}
               setSelectedFormation={setSelectedFormation}
               formations={formations}
               selectedFormation={selectedFormation}
               setFormations={setFormations}
               selectedDancers={selectedDancers}
               setSelectedDancers={setSelectedDancers}
               setIsPlaying={setIsPlaying}
               setPixelsPerSecond={setPixelsPerSecond}
               cloudSettings={cloudSettings}
               coordsToPosition={coordsToPosition}
               currentFormationIndex={currentFormationIndex}
               percentThroughTransition={percentThroughTransition}
               dancers={dancers}
            ></EventHandler>
            <Header
               danceId={danceId}
               folder={initialData?.project_id}
               exportPdf={exportPdf}
               dropDownToggle={dropDownToggle}
               formations={formations}
               isChangingCollisionRadius={isChangingCollisionRadius}
               setIsChangingCollisionRadius={setIsChangingCollisionRadius}
               isCommenting={isCommenting}
               pushChange={pushChange}
               selectedFormation={selectedFormation}
               selectedDancers={selectedDancers}
               setIsCommenting={setIsCommenting}
               viewOnlyInitial={viewOnlyInitial}
               setViewOnly={setViewOnly}
               setSelectedFormation={setSelectedFormation}
               userPositions={userPositions}
               pricingTier={pricingTier}
               onlineUsers={onlineUsers}
               setFormations={setFormations}
               localSettings={localSettings}
               setLocalSettings={setLocalSettings}
               undo={undo}
               saved={saved}
               danceName={danceName}
               setDanceName={setDanceName}
               setShareIsOpen={setShareIsOpen}
               viewOnly={viewOnly}
               setUpgradeIsOpen={setUpgradeIsOpen}
               dancers={dancers}
            />

            <div className="flex flex-row  overflow-hidden w-screen h-full">
               {!localSettings.fullScreen ? (
                  <>
                     <div className="flex flex-row ">
                        <Sidebar setHelpUrl={setHelpUrl} viewOnly={viewOnly} setMenuOpen={setMenuOpen} menuOpen={menuOpen}></Sidebar>
                        <div className="border-r border-neutral-300 dark:border-neutral-700">
                           {menuOpen === "dancers" ? (
                              <Roster
                                 session={session}
                                 removeDancer={removeDancer}
                                 setSelectedDancers={setSelectedDancers}
                                 addToStack={addToStack}
                                 pushChange={pushChange}
                                 setDancers={setDancers}
                                 dancers={dancers}
                                 formations={formations}
                                 selectedFormation={selectedFormation}
                                 cloudSettings={cloudSettings}
                                 setFormations={setFormations}
                                 selectedDancers={selectedDancers}
                                 viewOnly={viewOnly}
                                 localSettings={localSettings}
                              ></Roster>
                           ) : menuOpen === "audio" ? (
                              <ChooseAudioSource
                                 session={session}
                                 pricingTier={pricingTier}
                                 setUpgradeIsOpen={setUpgradeIsOpen}
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
                                 formations={formations}
                                 pricingTier={pricingTier}
                                 cloudSettings={cloudSettings}
                                 setCloudSettings={setCloudSettings}
                                 setFormations={setFormations}
                                 setUpgradeIsOpen={setUpgradeIsOpen}
                                 setAssetsOpen={setAssetsOpen}
                              ></Settings>
                           ) : menuOpen === "stageSettings" ? (
                              // <StageSettings
                              //    dropDownToggle={dropDownToggle}
                              //    pushChange={pushChange}
                              //    formations={formations}
                              //    pricingTier={pricingTier}
                              //    cloudSettings={cloudSettings}
                              //    setCloudSettings={setCloudSettings}
                              //    setFormations={setFormations}
                              //    setUpgradeIsOpen={setUpgradeIsOpen}
                              // ></StageSettings>
                              <></>
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
                                 formations={formations}
                                 viewOnly={viewOnly}
                                 pushChange={pushChange}
                                 setSelectedPropIds={setSelectedPropIds}
                                 invalidatePropUploads={invalidatePropUploads}
                                 selectedPropIds={selectedPropIds}
                                 propUploads={propUploads}
                                 selectedFormation={selectedFormation}
                                 props={props}
                                 setProps={setProps}
                                 pricingTier={pricingTier}
                                 setUpgradeIsOpen={setUpgradeIsOpen}
                                 player={player}
                                 setIsPlaying={setIsPlaying}
                                 soundCloudTrackId={soundCloudTrackId}
                                 setSoundCloudTrackId={setSoundCloudTrackId}
                                 audioFiles={audioFiles}
                                 setAudiofiles={setAudiofiles}
                                 setLocalSource={setLocalSource}
                                 setFormations={setFormations}
                              ></Props>
                           ) : menuOpen === "items" ? (
                              <Items
                                 setAssetsOpen={setAssetsOpen}
                                 setHelpUrl={setHelpUrl}
                                 formations={formations}
                                 viewOnly={viewOnly}
                                 pushChange={pushChange}
                                 setSelectedPropIds={setSelectedPropIds}
                                 invalidatePropUploads={invalidatePropUploads}
                                 // selectedPropIds={selectedPropIds}
                                 propUploads={propUploads}
                                 selectedFormation={selectedFormation}
                                 items={items}
                                 setItems={setItems}
                                 pricingTier={pricingTier}
                                 setUpgradeIsOpen={setUpgradeIsOpen}
                                 player={player}
                                 setIsPlaying={setIsPlaying}
                                 soundCloudTrackId={soundCloudTrackId}
                                 setSoundCloudTrackId={setSoundCloudTrackId}
                                 audioFiles={audioFiles}
                                 setAudiofiles={setAudiofiles}
                                 setLocalSource={setLocalSource}
                                 setFormations={setFormations}
                              ></Items>
                           ) : (
                              <CurrentFormation
                                 viewOnly={viewOnly}
                                 dropDownToggle={dropDownToggle}
                                 setIsEditingFormationGroup={setIsEditingFormationGroup}
                                 formationGroups={formationGroups}
                                 setFormationGroups={setFormationGroups}
                                 isCommenting={isCommenting}
                                 setIsCommenting={setIsCommenting}
                                 addToStack={addToStack}
                                 pushChange={pushChange}
                                 pricingTier={pricingTier}
                                 cloudSettings={cloudSettings}
                                 selectedDancers={selectedDancers}
                                 setSelectedDancers={setSelectedDancers}
                                 setSelectedFormation={setSelectedFormation}
                                 dancers={dancers}
                                 setFormations={setFormations}
                                 formations={formations}
                                 selectedFormation={selectedFormation}
                                 setUpgradeIsOpen={setUpgradeIsOpen}
                                 items={items}
                              />
                           )}
                        </div>
                     </div>
                  </>
               ) : null}
               <DndContext onDragEnd={handleDragEnd}>
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
                        viewOnly={viewOnly}
                        selectedFormation={selectedFormation}
                        songDuration={songDuration}
                        soundCloudTrackId={soundCloudTrackId}
                        setSelectedFormation={setSelectedFormation}
                        player={player}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        formations={formations}
                        position={position}
                        setFormations={setFormations}
                        setPixelsPerSecond={setPixelsPerSecond}
                        pixelsPerSecond={pixelsPerSecond}
                        localSource={localSource}
                        selectedDancers={selectedDancers}
                        cloudSettings={cloudSettings}
                        dropDownToggle={dropDownToggle}
                        items={items}
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
                           items={items}
                           props={props}
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
                           viewOnly={viewOnly}
                           setSelectedFormation={setSelectedFormation}
                           formations={formations}
                           selectedFormation={selectedFormation}
                           setFormations={setFormations}
                           selectedDancers={selectedDancers}
                           setSelectedDancers={setSelectedDancers}
                           setIsPlaying={setIsPlaying}
                           setPixelsPerSecond={setPixelsPerSecond}
                           cloudSettings={cloudSettings}
                           coordsToPosition={coordsToPosition}
                           currentFormationIndex={currentFormationIndex}
                           percentThroughTransition={percentThroughTransition}
                           // comments={comments}
                        ></ThreeD>
                     ) : null}

                     {localSettings.viewingTwo ? (
                        <Canvas
                           // selectedFormations={selectedFormations}
                           setProps={setProps}
                           resizingPropId={resizingPropId}
                           setResizingPropId={setResizingPropId}
                           setSelectedPropIds={setSelectedPropIds}
                           selectedPropIds={selectedPropIds}
                           props={props}
                           isPlaying={isPlaying}
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
                           viewOnly={viewOnly}
                           setSelectedFormation={setSelectedFormation}
                           formations={formations}
                           selectedFormation={selectedFormation}
                           setFormations={setFormations}
                           selectedDancers={selectedDancers}
                           setSelectedDancers={setSelectedDancers}
                           setIsPlaying={setIsPlaying}
                           setPixelsPerSecond={setPixelsPerSecond}
                           cloudSettings={cloudSettings}
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
                                 cloudSettings={cloudSettings}
                                 coordsToPosition={coordsToPosition}
                                 selectedDancers={selectedDancers}
                                 isPlaying={isPlaying}
                                 position={position}
                                 selectedFormation={selectedFormation}
                                 setDancers={setDancers}
                                 key={dancer.id}
                                 dancer={dancer}
                                 formations={localSettings.stageFlipped ? flippedFormations : formations}
                                 setFormations={setFormations}
                                 draggingDancerId={draggingDancerId}
                                 userPositions={userPositions}
                                 onlineUsers={onlineUsers}
                                 currentFormationIndex={currentFormationIndex}
                                 percentThroughTransition={percentThroughTransition}
                                 localSettings={localSettings}
                                 index={index}
                                 isPlaying={isPlaying}
                                 collisions={collisions}
                                 isChangingCollisionRadius={isChangingCollisionRadius}
                                 items={items}
                              />
                           ))}

                           {selectedFormation !== null
                              ? props.map((prop: prop) => {
                                   return (
                                      <Prop
                                         pushChange={pushChange}
                                         dropDownToggle={dropDownToggle}
                                         setResizingPropId={setResizingPropId}
                                         selectedPropIds={selectedPropIds}
                                         coordsToPosition={coordsToPosition}
                                         prop={prop}
                                         props={props}
                                         percentThroughTransition={percentThroughTransition}
                                         selectedFormation={selectedFormation}
                                         isPlaying={isPlaying}
                                         position={position}
                                         formations={formations}
                                         currentFormationIndex={currentFormationIndex}
                                         zoom={zoom}
                                         setFormations={setFormations}
                                         setProps={setProps}
                                      ></Prop>
                                   );
                                })
                              : null}
                           {localSettings.viewCollisions && selectedFormation !== null
                              ? collisions.map((collision) => {
                                   return <Collision coordsToPosition={coordsToPosition} collision={collision}></Collision>;
                                })
                              : null}

                           {selectedFormation !== null && !isPlaying ? (
                              <>
                                 {(formations[selectedFormation]?.comments || []).map((comment: comment) => {
                                    return (
                                       <>
                                          <Comment
                                             zoom={zoom}
                                             localSettings={localSettings}
                                             coordsToPosition={coordsToPosition}
                                             setFormations={setFormations}
                                             selectedFormation={selectedFormation}
                                             key={comment.id}
                                             comment={comment}
                                             addToStack={addToStack}
                                             pushChange={pushChange}
                                          />
                                       </>
                                    );
                                 })}

                                 {localSettings.previousFormationView !== "none"
                                    ? dancers.map((dancer, index) => (
                                         <DancerAliasShadow
                                            coordsToPosition={coordsToPosition}
                                            currentFormationIndex={currentFormationIndex}
                                            isPlaying={isPlaying}
                                            selectedFormation={selectedFormation}
                                            key={dancer.id}
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
                                                  key={dancer.id}
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
                        viewOnly={viewOnly}
                        selectedFormation={selectedFormation}
                        songDuration={songDuration}
                        soundCloudTrackId={soundCloudTrackId}
                        setSelectedFormation={setSelectedFormation}
                        player={player}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        formations={formations}
                        position={position}
                        setFormations={setFormations}
                        setPixelsPerSecond={setPixelsPerSecond}
                        pixelsPerSecond={pixelsPerSecond}
                        localSource={localSource}
                        selectedDancers={selectedDancers}
                     ></FormationControls>
                  </div>
               </DndContext>
            </div>

            <div className=" overscroll-contain bg-black">
               <AudioControls
                  setHelpUrl={setHelpUrl}
                  setIsChangingZoom={setIsChangingZoom}
                  isChangingZoom={isChangingZoom}
                  localSettings={localSettings}
                  setLocalSettings={setLocalSettings}
                  setPlaybackRate={setPlaybackRate}
                  addToStack={addToStack}
                  pushChange={pushChange}
                  viewOnly={viewOnly}
                  selectedFormation={selectedFormation}
                  songDuration={songDuration}
                  soundCloudTrackId={soundCloudTrackId}
                  setSelectedFormation={setSelectedFormation}
                  player={player}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  formations={formations}
                  position={position}
                  setFormations={setFormations}
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
                  formationGroups={formationGroups}
                  userPositions={userPositions}
                  onlineUsers={onlineUsers}
                  addToStack={addToStack}
                  pushChange={pushChange}
                  setSelectedDancers={setSelectedDancers}
                  viewOnly={viewOnly}
                  songDuration={songDuration}
                  setFormations={setFormations}
                  formations={formations}
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
               ></Timeline>
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
