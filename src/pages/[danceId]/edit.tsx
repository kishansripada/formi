import { detectCollisions } from "../../types/collisionDetector";
import { useState, useEffect, useRef, useCallback, lazy } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useLocalStorage } from "../../hooks";
import { ThreeDancer } from "../../components/AppComponents/ThreeDancer";
import { debounce } from "lodash";
import toast, { Toaster } from "react-hot-toast";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { comment, dancer, dancerPosition, formation, PIXELS_PER_SQUARE, localSettings, cloudSettings, formationGroup } from "../../types/types";
import { AudioControls } from "../../components/AppComponents/AudioControls";
import { Header } from "../../components/AppComponents/Header";
import { DancerAlias } from "../../components/AppComponents/DancerAlias";
import { Comment } from "../../components/AppComponents/Comment";
import { DancerAliasShadow } from "../../components/AppComponents/DancerAliasShadow";
import { Canvas } from "../../components/AppComponents/Canvas";
import { EditDancer } from "../../components/AppComponents/Modals/EditDancer";
import { EditFormationGroup } from "../../components/AppComponents/Modals/EditFormationGroup";
import { PathEditor } from "../../components/AppComponents/PathEditor";
import { Share } from "../../components/AppComponents/Modals/Share";
import { Collision } from "../../components/AppComponents/Collision";
import { Sidebar } from "../../components/AppComponents/Sidebar";
import { Settings } from "../../components/AppComponents/SidebarComponents/Settings";
import { Presets } from "../../components/AppComponents/SidebarComponents/Presets";
import { ChooseAudioSource } from "../../components/AppComponents/SidebarComponents/ChooseAudioSource";
import { Roster } from "../../components/AppComponents/SidebarComponents/Roster";
import { CurrentFormation } from "../../components/AppComponents/SidebarComponents/CurrentFormation";
import { StageSettings } from "../../components/AppComponents/SidebarComponents/StageSettings";
import { Collisions } from "../../components/AppComponents/SidebarComponents/Collisions";
import { RealtimeChannel } from "@supabase/supabase-js";
import { PricingTable } from "../../components/NonAppComponents/PricingTable";
import { grandfatheredEmails } from "../../../public/grandfathered";
import { Timeline } from "../../components/AppComponents/Timeline";
import * as jsonpatch from "fast-json-patch";

var jsondiffpatch = require("jsondiffpatch").create({
   objectHash: function (obj) {
      return obj.id;
   },
});

// import jsondiffpatch from "jsondiffpatch";

// let jsondiffpatch = jsondiffpatch.create({
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

const Edit = ({ initialData, viewOnly, pricingTier }: { viewOnly: boolean }) => {
   const colors = ["#e6194B", "#4363d8", "#f58231", "#800000", "#469990", "#3cb44b"];

   const supabase = useSupabaseClient();
   let session = useSession();
   const router = useRouter();
   const videoPlayer = useRef();

   // cloud
   const [cloudSettings, setCloudSettings] = useState<cloudSettings>({
      ...initialData.settings,
      stageBackground: initialData.settings.stageBackground || "grid",
      gridSubdivisions: initialData.settings.gridSubdivisions || 7,
      collisionRadius: initialData.settings.collisionRadius || 0.5,
   });

   const [formations, setFormations] = useState<formation[]>(initialData.formations);

   const [anyoneCanView, setAnyoneCanView] = useState(initialData.anyonecanview);
   const [shareSettings, setShareSettings] = useState(initialData.sharesettings);

   const [soundCloudTrackId, setSoundCloudTrackId] = useState<string | null>(initialData.soundCloudId);
   const [dancers, setDancers] = useState<dancer[]>(initialData.dancers);
   const [danceName, setDanceName] = useState<string>(initialData.name);
   const [formationGroups, setFormationGroups] = useState<formationGroup[]>(initialData.formation_groups);

   // local
   const [localSettings, setLocalSettings] = useLocalStorage<localSettings>("localSettings", {
      gridSnap: 1,
      previousFormationView: "ghostDancersAndPaths",
      dancerStyle: "solid",
      viewCollisions: false,
      stageFlipped: false,
   });

   const [audioFiles, setAudiofiles] = useState(initialData.audioFiles);
   const [upgradeIsOpen, setUpgradeIsOpen] = useState<boolean>(false);
   const [deltas, setDeltas] = useState([]);
   const [localSource, setLocalSource] = useState(null);
   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [zoom, setZoom] = useState(1);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [isCommenting, setIsCommenting] = useState<boolean>(false);
   const [position, setPosition] = useState<number>(0);
   const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(25);
   const [selectedFormation, setSelectedFormation] = useState<number | null>(0);
   const [selectedDancers, setSelectedDancers] = useState<string[]>([]);
   const [editingDancer, setEditingDancer] = useState<string | null>(null);
   const [previousFormation, setPreviousFormation] = useState<formation[]>(initialData.formations);
   const [previousDancers, setPreviousDancers] = useState<formation[]>(initialData.dancers);
   const [previousCloudSettings, setPreviousCloudSettings] = useState<formation[]>(initialData.settings);
   // const [previousFormation, setPreviousFormation] = useState<formation[]>(initialData.formations);
   const [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);
   const [menuOpen, setMenuOpen] = useState<string>("formations");
   const [isPreviewingThree, setIsPreviewingThree] = useState<boolean>(false);
   const [player, setPlayer] = useState(null);
   const [saved, setSaved] = useState<boolean>(true);
   const [shareIsOpen, setShareIsOpen] = useState(false);
   const [isChangingCollisionRadius, setIsChangingCollisionRadius] = useState(false);
   const [isEditingFormationGroup, setIsEditingFormationGroup] = useState(false);
   const [subscriptionStatus, setSubscriptionStatus] = useState("NOT SUBSCRIBED");

   const [onlineUsers, setOnlineUsers] = useState({});
   const [userPositions, setUserPositions] = useState({});
   const [channelGlobal, setChannelGlobal] = useState<RealtimeChannel>();

   let { currentFormationIndex, percentThroughTransition } = whereInFormation(formations, position);

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
   }, [session]);
   useEffect(() => {
      if (!isPlaying) return;
      setSelectedFormation(currentFormationIndex);
   }, [currentFormationIndex, isPlaying]);

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
      console.log("undo");
      // if (!deltas.length) return;
      // // setSaved(false);

      // let reverseDelta = jsondiffpatch.reverse(deltas[deltas.length - 1]);
      // setDeltas((deltas) => {
      //    return [...deltas].slice(0, -1);
      // });
      // console.log(reverseDelta);
      // setFormations((formations: formation[]) => {
      //    jsondiffpatch.patch(formations, reverseDelta);

      //    return [...formations];
      // });
   };

   const addToStack = () => {
      setPreviousFormation(formations);
   };

   const pushChange = () => {
      console.log("push change");
      setCloudSettings((cloudSettings) => {
         setPreviousCloudSettings((previousCloudSettings: dancer[]) => {
            if (!previousCloudSettings) return cloudSettings;
            var delta = jsonpatch.compare(previousCloudSettings, JSON.parse(JSON.stringify(cloudSettings)));
            if (!delta.length) return cloudSettings;
            console.log({ settings: delta });

            setSaved(false);
            try {
               supabase
                  .from("dances")
                  .update({ settings: cloudSettings, last_edited: new Date() })
                  .eq("id", router.query.danceId)
                  .then((r) => {
                     console.log("pushed new settings to db");
                     setSaved(true);
                  });
               if (Object.keys(onlineUsers).length > 1) {
                  console.log("sending settings update to clients");
                  channelGlobal.send({
                     type: "broadcast",
                     event: "settings-update",
                     payload: cloudSettings,
                  });
               }
            } catch (error) {
               setSaved(true);
               toast.error("Error saving changes. Please refresh the page.");
            }

            // if (delta) {
            //    setDeltas((deltas) => [...deltas, delta]);
            // }

            return cloudSettings;
         });
         return cloudSettings;
      });
      setDancers((dancers) => {
         setPreviousDancers((previousDancers: dancer[]) => {
            if (!previousDancers) return dancers;
            var delta = jsonpatch.compare(previousDancers, dancers);

            if (!delta.length) return dancers;
            console.log({ dancers: delta });
            setSaved(false);
            try {
               supabase
                  .from("dances")
                  .update({ dancers: dancers, last_edited: new Date() })
                  .eq("id", router.query.danceId)
                  .then((r) => {
                     console.log("pushed new dancers to db");
                     setSaved(true);
                  });
               if (Object.keys(onlineUsers).length > 1) {
                  console.log("sending dancers update to clients");
                  channelGlobal.send({
                     type: "broadcast",
                     event: "dancers-update",
                     payload: dancers,
                  });
               }
            } catch (error) {
               setSaved(true);
               toast.error("Error saving changes. Please refresh the page.");
            }

            // if (delta) {
            //    setDeltas((deltas) => [...deltas, delta]);
            // }

            return dancers;
         });
         return dancers;
      });
      setFormations((formations) => {
         setPreviousFormation((previousFormations: formation[]) => {
            if (!previousFormations) return formations;
            var delta = jsonpatch.compare(previousFormations, JSON.parse(JSON.stringify(formations)));
            if (!delta.length) return formations;
            console.log({ formations: delta });
            setSaved(false);
            try {
               supabase
                  .rpc("apply_json_patch_operations", {
                     operations: delta,
                     dance_id: router.query.danceId,
                  })
                  .then((r) => {
                     setSaved(true);
                     console.log("pushed new formations to db");
                     if (r.error) {
                        toast.error("Error saving changes. Please refresh the page.");
                     }
                  });
               if (Object.keys(onlineUsers).length > 1) {
                  console.log("sending formation update to clients");
                  channelGlobal.send({
                     type: "broadcast",
                     event: "formation-update",
                     payload: delta,
                  });
               }
            } catch (error) {
               setSaved(true);
               toast.error("Error saving changes. Please refresh the page.");
            }

            return formations;
         });
         return formations;
      });
   };

   useEffect(() => {
      if (!channelGlobal) return;
      if (!session) return;
      channelGlobal.send({
         type: "broadcast",
         event: "user-position-update",
         payload: {
            [session?.user?.id]: {
               selectedFormation,
               selectedDancers,
            },
         },
      });
   }, [selectedFormation, selectedDancers, channelGlobal]);

   useEffect(() => {
      if (!session || !router?.query?.danceId) return;

      let channel = supabase.channel(router.query.danceId, {
         config: {
            presence: {
               key: session?.user.id,
            },
         },
      });

      setChannelGlobal(channel);

      // recieve presence data
      channel.on("presence", { event: "sync" }, () => {
         let state = channel.presenceState();
         // console.log(state);
         Object.keys(state).forEach((id, index) => {
            state[id][0].color = colors[index];
         });
         setUserPositions((userPositions) => {
            let filteredKeys = Object.keys(userPositions).filter((position) => Object.keys(state).includes(position));
            const filteredObject = filteredKeys.reduce((obj, key) => {
               obj[key] = userPositions[key];
               return obj;
            }, {});

            return filteredObject;
         });

         setOnlineUsers({ ...state });
      });

      // send presence data
      channel.subscribe(async (status) => {
         console.log(status);
         setSubscriptionStatus(status);
         if (status === "SUBSCRIBED") {
            const resp = await channel.track({ name: session?.user.user_metadata.full_name, profilePicUrl: session?.user.user_metadata.avatar_url });
            console.log({ resp });
         }
      });

      // receive broadcasted data
      const formsChannel = channel
         .on("broadcast", { event: "user-position-update" }, ({ payload }) => {
            // console.log(payload);
            setUserPositions((userPositions) => {
               return { ...userPositions, ...payload };
            });
         })
         .on("broadcast", { event: "formation-update" }, ({ payload }) => {
            console.log("recieved formation update");
            // if the formation you are viewing is deleted, reset the selected formation to 0
            payload.forEach((patch: any) => {
               if (patch.path.split("/").length === 2 && patch.op === "remove") {
                  setSelectedFormation((selectedFormation) => {
                     if (parseInt(patch.path.split("/")[1]) === selectedFormation) {
                        toast("The formation you were viewing was deleted.");
                        return 0;
                     } else {
                        return selectedFormation;
                     }
                  });
               }
            });
            try {
               setFormations((formations: formation[]) => {
                  let newForms = jsonpatch.applyPatch(formations, payload).newDocument;
                  return [...newForms];
               });
            } catch (error) {
               toast.error("Error saving changes. Please refresh the page.");
            }
         })
         .on("broadcast", { event: "dancers-update" }, ({ payload }) => {
            console.log("recieved dancers update");
            try {
               setDancers((dancers) => {
                  var delta = jsonpatch.compare(dancers, JSON.parse(JSON.stringify(payload)));
                  if (delta.length) {
                     return payload;
                  } else {
                     return dancers;
                  }
               });
            } catch (error) {
               toast.error("Error saving changes. Please refresh the page.");
            }
         })
         .on("broadcast", { event: "settings-update" }, ({ payload }) => {
            console.log("recieved settings update");
            try {
               setCloudSettings((cloudSettings) => {
                  var delta = jsonpatch.compare(cloudSettings, JSON.parse(JSON.stringify(payload)));
                  if (delta.length) {
                     return payload;
                  } else {
                     return cloudSettings;
                  }
               });
            } catch (error) {
               toast.error("Error saving changes. Please refresh the page.");
            }
         });

      return () => {
         supabase.removeChannel(formsChannel);
         supabase.removeChannel(channel);
      };
   }, [router.query.danceId, session]);

   ////////////////////////////////////////
   // let uploadSettings = useCallback(
   //    debounce(async (cloudSettings) => {
   //       console.log("uploading settings");
   //       const { data, error } = await supabase
   //          .from("dances")
   //          .update({ settings: cloudSettings, last_edited: new Date() })
   //          .eq("id", router.query.danceId);
   //       channelGlobal.send({
   //          type: "broadcast",
   //          event: "settings-update",
   //          payload: cloudSettings,
   //       });
   //       console.log({ data });
   //       console.log({ error });
   //       setSaved(true);
   //    }, 0),
   //    [router.query.danceId, channelGlobal]
   // );

   // useDidMountEffect(() => {
   //    if (!session && router.query.danceId !== "207") {
   //       router.push("/login");
   //    }
   //    if (router.isReady) {
   //       setSaved(false);
   //       uploadSettings(cloudSettings);
   //    }
   // }, [cloudSettings]);

   ////////////////////////////////////////
   // let uploadDancers = useCallback(
   //    debounce(async (dancers) => {
   //       console.log("uploading dancers");
   //       const { data, error } = await supabase.from("dances").update({ dancers: dancers, last_edited: new Date() }).eq("id", router.query.danceId);
   //       channelGlobal.send({
   //          type: "broadcast",
   //          event: "dancers-update",
   //          payload: dancers,
   //       });
   //       console.log({ data });
   //       console.log({ error });
   //       setSaved(true);
   //    }, 0),
   //    [router.query.danceId, channelGlobal]
   // );

   // useDidMountEffect(() => {
   //    if (!session && router.query.danceId !== "207") {
   //       router.push("/login");
   //    }
   //    if (router.isReady) {
   //       setSaved(false);
   //       uploadDancers(dancers);
   //    }
   // }, [dancers]);

   ////////////////////////////////////////
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
   //    [router.query.danceId, channelGlobal]
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
         const { data, error } = await supabase
            .from("dances")
            .update({ soundCloudId: soundCloudTrackId, last_edited: new Date() })
            .eq("id", router.query.danceId);

         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 0),
      [router.query.danceId, channelGlobal]
   );

   useDidMountEffect(() => {
      if (!session && router.query.danceId !== "207") {
         router.push("/login");
      }
      if (router.isReady) {
         setSaved(false);
         uploadSoundCloudId(soundCloudTrackId);
      }
   }, [soundCloudTrackId]);
   // //////////////////////////

   let uploadName = useCallback(
      debounce(async (danceName) => {
         console.log("uploading name");
         const { data, error } = await supabase.from("dances").update({ name: danceName }).eq("id", router.query.danceId);
         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 500),
      [router.query.danceId, channelGlobal]
   );

   useDidMountEffect(() => {
      if (!session && router.query.danceId !== "207") {
         router.push("/login");
      }
      if (router.isReady) {
         setSaved(false);
         uploadName(danceName);
      }
   }, [danceName]);
   // // ///////////
   // let uploadFormations = useCallback(
   //    debounce(async (formations) => {
   //       console.log("uploading formations");
   //       const { data, error } = await supabase
   //          .from("dances")
   //          .update({ formations: formations, last_edited: new Date() })
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
   //       uploadFormations(formations);
   //    }
   // }, [formations]);
   ////////////////////////
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

      let flippedComments = formation.comments
         ? formation.comments.map((comment: comment) => {
              return { ...comment, position: { x: -comment.position.x, y: -comment.position.y } };
           })
         : [];

      return { ...formation, positions: flippedPositions, comments: flippedComments };
   });
   //////////////////////////
   const collisions = localSettings.viewCollisions
      ? detectCollisions(localSettings.stageFlipped ? flippedFormations : formations, selectedFormation, cloudSettings.collisionRadius)
      : [];

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
         </Head>

         {editingDancer !== null ? (
            <EditDancer
               pushChange={pushChange}
               setUpgradeIsOpen={setUpgradeIsOpen}
               pricingTier={pricingTier}
               removeDancer={removeDancer}
               setDancers={setDancers}
               dancers={dancers}
               setEditingDancer={setEditingDancer}
               editingDancer={editingDancer}
            ></EditDancer>
         ) : (
            <></>
         )}
         {isEditingFormationGroup ? (
            <EditFormationGroup
               formationGroups={formationGroups}
               setFormationGroups={setFormationGroups}
               setIsEditingFormationGroup={setIsEditingFormationGroup}
               isEditingFormationGroup={isEditingFormationGroup}
            ></EditFormationGroup>
         ) : null}

         {upgradeIsOpen ? (
            <div
               className="fixed top-0 left-0 z-[70] flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-[2px]"
               id="outside"
               onClick={(e) => {
                  if (e.target.id === "outside") {
                     setUpgradeIsOpen(false);
                  }
               }}
            >
               <div className="flex  w-[80%] h-[90%] overflow-y-scroll   flex-col rounded-xl font-proxima  bg-white overflow-hidden">
                  <PricingTable></PricingTable>
               </div>
            </div>
         ) : null}

         {shareIsOpen ? (
            <Share
               shareSettings={shareSettings}
               setShareSettings={setShareSettings}
               anyoneCanView={anyoneCanView}
               setAnyoneCanView={setAnyoneCanView}
               setShareIsOpen={setShareIsOpen}
            />
         ) : null}

         {isCommenting ? (
            <>
               <div
                  style={{
                     left: "50%",
                     transform: "translate(-50%, 0)",
                  }}
                  className="fixed w-60 h-12 rounded-full shadow-xl top-6 bg-black z-[9999] opacity-70 grid place-items-center"
               >
                  <p className="text-white text-sm pointer-events-none">Click on the stage to comment</p>
               </div>
            </>
         ) : null}

         {subscriptionStatus !== "SUBSCRIBED" ? (
            <>
               <div className="fixed bottom-0 left-0 h-full  w-full  flex flex-col z-[9999999]  ">
                  <div className="flex flex-row items-center justify-center h-14 bg-red-600 mt-auto pointer-events-auto">
                     <p className="text-white text-sm">
                        You are disconnected, please <button className="font-bold">click here</button> or refresh the page to connect.
                     </p>
                  </div>
               </div>
            </>
         ) : null}

         <div
            // style={{
            //    pointerEvents: subscriptionStatus === "SUBSCRIBED" ? "none" : "auto",
            // }}
            className={`flex flex-col h-screen overflow-hidden bg-[#fafafa] overscroll-y-none text-gray-900 `}
         >
            <div className="flex flex-row  overflow-hidden w-screen h-full">
               {!viewOnly ? (
                  <>
                     <Sidebar setMenuOpen={setMenuOpen} menuOpen={menuOpen}></Sidebar>

                     {menuOpen === "dancers" ? (
                        <Roster
                           addToStack={addToStack}
                           pushChange={pushChange}
                           setDancers={setDancers}
                           dancers={dancers}
                           formations={formations}
                           selectedFormation={selectedFormation}
                           setEditingDancer={setEditingDancer}
                           cloudSettings={cloudSettings}
                           setFormations={setFormations}
                           selectedDancers={selectedDancers}
                        ></Roster>
                     ) : menuOpen === "audio" ? (
                        <ChooseAudioSource
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
                        <Settings setLocalSettings={setLocalSettings} localSettings={localSettings}></Settings>
                     ) : menuOpen === "stageSettings" ? (
                        <StageSettings
                           pushChange={pushChange}
                           formations={formations}
                           pricingTier={pricingTier}
                           cloudSettings={cloudSettings}
                           setCloudSettings={setCloudSettings}
                           setFormations={setFormations}
                           setUpgradeIsOpen={setUpgradeIsOpen}
                        ></StageSettings>
                     ) : menuOpen === "presets" ? (
                        <Presets
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
                        ></Presets>
                     ) : menuOpen === "collisions" ? (
                        <Collisions
                           isChangingCollisionRadius={isChangingCollisionRadius}
                           setIsChangingCollisionRadius={setIsChangingCollisionRadius}
                           setCloudSettings={setCloudSettings}
                           cloudSettings={cloudSettings}
                           setLocalSettings={setLocalSettings}
                           localSettings={localSettings}
                           setUpgradeIsOpen={setUpgradeIsOpen}
                           pricingTier={pricingTier}
                        ></Collisions>
                     ) : (
                        <CurrentFormation
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
                        />
                     )}
                  </>
               ) : null}

               <div className={`flex flex-col min-w-0 flex-grow items-center `}>
                  <Header
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
                     isPreviewingThree={isPreviewingThree}
                     setIsPreviewingThree={setIsPreviewingThree}
                     setUpgradeIsOpen={setUpgradeIsOpen}
                  />
                  {/* <div className="flex flex-row items-center w-full h-full"> */}
                  <video
                     ref={videoPlayer}
                     style={{
                        height: localSource?.startsWith("data:video") || isVideo(soundCloudTrackId) ? "33%" : 0,
                     }}
                     src={localSource || soundCloudTrackId}
                  ></video>
                  {!isPreviewingThree && localSettings.stageFlipped ? <p className="text-gray-600 font-semibold text-sm mt-2">AUDIENCE</p> : null}

                  <Canvas
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
                     isPreviewingThree={isPreviewingThree}
                     currentFormationIndex={currentFormationIndex}
                     percentThroughTransition={percentThroughTransition}
                     dancers={dancers}
                  >
                     {selectedFormation !== null && !isPreviewingThree ? (
                        <PathEditor
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

                     {!isPreviewingThree
                        ? dancers.map((dancer, index) => (
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
                             />
                          ))
                        : null}

                     {localSettings.viewCollisions && selectedFormation !== null && !isPreviewingThree
                        ? collisions.map((collision) => {
                             return <Collision coordsToPosition={coordsToPosition} collision={collision}></Collision>;
                          })
                        : null}

                     {selectedFormation !== null && !isPlaying && !isPreviewingThree ? (
                        <>
                           {((localSettings.stageFlipped ? flippedFormations : formations)[selectedFormation].comments || []).map(
                              (comment: comment) => {
                                 return (
                                    <>
                                       <Comment
                                          zoom={zoom}
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
                              }
                           )}

                           {localSettings.previousFormationView !== "none" && !isPreviewingThree
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

                     {selectedFormation !== null && isPreviewingThree
                        ? formations[selectedFormation].positions.map((dancerPosition: dancerPosition) => {
                             return (
                                <ThreeDancer
                                   addToStack={addToStack}
                                   pushChange={pushChange}
                                   viewOnly={viewOnly}
                                   isPlaying={isPlaying}
                                   currentFormationIndex={currentFormationIndex}
                                   percentThroughTransition={percentThroughTransition}
                                   dancers={dancers}
                                   position={position}
                                   dancerPosition={dancerPosition}
                                   formations={formations}
                                   setFormations={setFormations}
                                   selectedFormation={selectedFormation}
                                   localSettings={localSettings}
                                ></ThreeDancer>
                             );
                          })
                        : null}
                  </Canvas>
                  {!isPreviewingThree && !localSettings.stageFlipped ? <p className="text-gray-600 font-semibold text-sm mb-2">AUDIENCE</p> : null}
               </div>
            </div>

            <div className=" overscroll-contain">
               <AudioControls
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

export const getServerSideProps = async (ctx) => {
   // Create authenticated Supabase Client
   const supabase = createServerSupabaseClient(ctx, {
      supabaseKey:
         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
      supabaseUrl: "https://dxtxbxkkvoslcrsxbfai.supabase.co",
   });
   // Check if we have a session
   const {
      data: { session },
   } = await supabase.auth.getSession();

   // console.log(session?.user.id);

   // if (!session) {
   //    return {
   //       redirect: {
   //          destination: "/",
   //          permanent: false,
   //       },
   //    };
   // }

   async function getSubscriptionPlan(supabase_id: string) {
      return await fetch(
         `https://api.stripe.com/v1/customers/search?query=metadata['supabase_id']:'${supabase_id}'&expand[]=data.subscriptions.data`,
         {
            headers: {
               Authorization:
                  "Basic cmtfbGl2ZV81MUxhajV0SHZDM3c2ZThmY21zVklCRjlKMjRLUWFFYlgwVUs0SHE0b245QTVXMUNIaWlHaHAwVzlrbHg5dDU3OW9WcWVibFJGOHh3cE8xc3FlUmFMOHBzYjAwMmhLNFl0NEU6",
            },
         }
      )
         .then((r) => r.json())
         .then((r) => {
            // customerExists = Boolean(r.data.length);

            let plan = r?.data?.[0]?.subscriptions.data?.[0] || null;
            return plan || { plan: { product: null } };
         });
   }

   let [{ data: dance }, subscription] = await Promise.all([
      supabase.from("dances").select("*").eq("id", ctx.query.danceId).single(),
      !session
         ? { plan: { product: null } }
         : grandfatheredEmails.includes(session?.user?.email)
         ? { plan: { product: "legacy" } }
         : getSubscriptionPlan(session?.user.id),
   ]);

   let pricingTier = subscription.plan.product;

   // let { data: dance } = await supabase.from("dances").select("*").eq("id", ctx.query.danceId).single();

   // let sortedDeltas = deltas?.sort((a, b) => a.timestamp - b.timestamp);

   // for (let i = 0; i < sortedDeltas.length; i++) {
   //    jsondiffpatch.patch(dance.formations, sortedDeltas[i].delta);
   // }

   // let _ = await Promise.all([
   //    supabase.from("deltas").delete().eq("danceid", ctx.query.danceId),
   //    supabase.from("dances").update({ formations: dance.formations }).eq("id", ctx.query.danceId),
   // ]);

   if (!dance?.formations) {
      return {
         redirect: {
            destination: "/noaccess",
            permanent: false,
         },
      };
   }
   let viewOnly = true;
   // let pricingTier = "premium";

   if (dance.id === 207) {
      pricingTier = "legacy";
   }

   if (!pricingTier) {
      pricingTier = "basic";
   }
   if (dance.id === 207 || dance?.user === session?.user?.id || dance?.sharesettings?.[session?.user?.email] === "edit") {
      viewOnly = false;
   }
   dance = { ...{ ...dance, formations: dance.formations } };

   return {
      props: {
         initialData: dance,
         viewOnly,
         pricingTier: "legacy",
      },
   };

   // if (dance?.sharesettings[session?.user?.email] === "view") {
   //    return {
   //       props: {
   //          initialData: dance,
   //          viewOnly: true,
   //       },
   //    };
   // }

   // if (dance) {
   //    return {
   //       props: {
   //          initialData: dance,
   //          viewOnly: true,
   //       },
   //    };
   // }
};

function isVideo(filename: string) {
   if (!filename) return false;
   var ext = getExtension(filename);
   switch (ext.toLowerCase()) {
      case "m4v":
      case "avi":
      case "mpg":
      case "mp4":
         // etc
         return true;
   }
   return false;
}

function getExtension(filename: string) {
   var parts = filename.split(".");
   return parts[parts.length - 1];
}

function jsonPatchToPostgres(patch: JsonPatchOperation[], danceId: number): string[] {
   const queries: string[] = [];

   patch.forEach((operation) => {
      // Convert JSON Patch path to PostgreSQL path format (e.g., "/formations/0/dancers/0/x" -> "{formations,0,dancers,0,x}")
      const path = `{${operation.path.slice(1).replace(/\//g, ",")}}`;

      let query: string | null = null;

      switch (operation.op) {
         case "add":
         case "replace":
            query = `
           UPDATE dances SET formations = jsonb_set(formations, '${path}', '${JSON.stringify(operation.value)}'::jsonb) WHERE dance_id = ${danceId};`;
            break;
         case "remove":
            query = `UPDATE dances SET formations = formations #- '${path}' WHERE dance_id = ${danceId};`;
            break;
         case "move":
         case "copy":
            const fromPath = `{${operation.from!.slice(1).replace(/\//g, ",")}}`;
            if (operation.op === "move") {
               query = `
             WITH moved_value AS (SELECT formations # '${fromPath}' AS value FROM dances WHERE dance_id = ${danceId}) UPDATE dances SET formations = jsonb_set(formations #- '${fromPath}', '${path}', (SELECT value FROM moved_value)) WHERE dance_id = ${danceId};`;
            } else {
               query = `
             WITH copied_value AS (SELECT formations # '${fromPath}' AS value FROM dances WHERE dance_id = ${danceId}) UPDATE dances SET formations = jsonb_set(formations, '${path}', (SELECT value FROM copied_value)) WHERE dance_id = ${danceId};`;
            }
            break;
      }

      if (query) {
         queries.push(query.trim());
      }
   });

   return queries;
}
