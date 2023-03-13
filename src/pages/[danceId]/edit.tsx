import { detectCollisions } from "../../types/collisionDetector";
import { useState, useEffect, useRef, useCallback, lazy } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
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
import { Layers } from "../../components/AppComponents/Layers";
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
import {
   PostgrestResponse,
   REALTIME_LISTEN_TYPES,
   REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
   REALTIME_PRESENCE_LISTEN_EVENTS,
   REALTIME_SUBSCRIBE_STATES,
   RealtimeChannelSendResponse,
   RealtimePostgresInsertPayload,
} from "@supabase/supabase-js";
var jsondiffpatch = require("jsondiffpatch").create({
   objectHash: function (obj) {
      return obj.id;
   },
});

// import jsondiffpatch from "jsondiffpatch";

// let jsondiffpatch = patcher.create({
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

const FileAudioPlayer = dynamic<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSelectedFormation: Function;
   setFormations: Function;
   viewOnly: boolean;
   pixelsPerSecond: number;
   player: any;
   setPlayer: Function;
}>(() => import("../../components/AppComponents/FileAudioPlayer").then((mod) => mod.FileAudioPlayer), {
   ssr: false,
});

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
      gridSubdivisions: initialData.settings.gridSubdivisions || 5,
      collisionRadius: initialData.settings.collisionRadius || 0.5,
   });

   const [anyoneCanView, setAnyoneCanView] = useState(initialData.anyonecanview);
   const [formations, setFormations] = useState<formation[]>(initialData.formations);
   const [shareSettings, setShareSettings] = useState(initialData.sharesettings);
   const [soundCloudTrackId, setSoundCloudTrackId] = useState<string | null>(initialData.soundCloudId);
   const [dancers, setDancers] = useState<dancer[]>(initialData.dancers);
   const [danceName, setDanceName] = useState<string>(initialData.name);
   const [formationGroups, setFormationGroups] = useState<formationGroup[]>(initialData.formation_groups);

   // local
   const [localSettings, setLocalSettings] = useLocalStorage<localSettings>("localSettings", {
      gridSnap: 1,
      previousFormationView: "ghostDancersAndPaths",
      dancerStyle: "initials",
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
   const [position, setPosition] = useState<number | null>(null);
   const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(25);
   const [selectedFormation, setSelectedFormation] = useState<number | null>(0);
   const [selectedDancers, setSelectedDancers] = useState<string[]>([]);
   const [editingDancer, setEditingDancer] = useState<string | null>(null);
   const [previousFormation, setPreviousFormation] = useState<formation[]>();
   const [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);
   const [menuOpen, setMenuOpen] = useState<string>("formations");
   const [isPreviewingThree, setIsPreviewingThree] = useState<boolean>(false);
   const [player, setPlayer] = useState(null);
   const [saved, setSaved] = useState<boolean>(true);
   const [shareIsOpen, setShareIsOpen] = useState(false);
   const [isChangingCollisionRadius, setIsChangingCollisionRadius] = useState(false);
   const [isEditingFormationGroup, setIsEditingFormationGroup] = useState(false);
   // const [stageFlipped, setStageFlipped] = useState(true);
   // not in use
   // {
   //    "f30197ba-cf06-4234-bcdb-5d40d83c7999": [{ name: "Kishan Sripada", color: "#e6194B" }],
   //    "0e5f35d1-3989-401c-9693-f6a632954d0b": [
   //       {
   //          name: "Sasha Shrestha",
   //          color: "#4363d8",
   //       },
   //    ],
   // }
   const [onlineUsers, setOnlineUsers] = useState({});
   const [userPositions, setUserPositions] = useState({});
   const [channelGlobal, setChannelGlobal] = useState<RealtimeChannel>();

   let { currentFormationIndex, percentThroughTransition } = whereInFormation(formations, position);
   const coordsToPosition = (coords: { x: number; y: number } | null | undefined) => {
      if (!coords) return null;
      let { x, y } = coords;
      return {
         left: (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.width) / 2 + PIXELS_PER_SQUARE * x,
         top: (PIXELS_PER_SQUARE * cloudSettings.stageDimensions.height) / 2 + PIXELS_PER_SQUARE * -y,
      };
   };

   // useEffect(() => {
   //    setFormations((formations: formation[]) => {
   //       let newForms = initialData.formations;
   //       for (let i = 0; i < deltas.length; i++) {
   //          jsondiffpatch.patch(newForms, deltas[i]);
   //       }
   //       return [...newForms];
   //    });
   // }, [deltas]);

   useEffect(() => {
      if (!isPlaying) return;
      setSelectedFormation(currentFormationIndex);
   }, [currentFormationIndex, isPlaying]);

   useEffect(() => {
      if (!songDuration) return;

      setPixelsPerSecond(25);
      if (pixelsPerSecond * (songDuration / 1000) < window.screen.width - 20) {
         setPixelsPerSecond((window.screen.width - 20) / (songDuration / 1000));
      }
   }, [soundCloudTrackId, songDuration]);

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
   };

   const undo = () => {
      if (!deltas.length) return;
      // setSaved(false);

      let reverseDelta = jsondiffpatch.reverse(deltas[deltas.length - 1]);
      setDeltas((deltas) => {
         return [...deltas].slice(0, -1);
      });
      console.log(reverseDelta);
      setFormations((formations: formation[]) => {
         jsondiffpatch.patch(formations, reverseDelta);

         return [...formations];
      });

      // supabase
      //    .from("deltas")
      //    .insert([{ userid: session?.user?.id, timestamp: new Date(), delta: reverseDelta, danceid: router.query.danceId }])
      //    .then((r) => {
      //       setSaved(true);
      //       console.log(r);
      //    });
   };

   const addToStack = () => {
      console.log("add to stack");
      setPreviousFormation(formations);
   };

   const pushChange = () => {
      console.log("push change");
      setPreviousFormation((previousFormations: formation[]) => {
         setFormations((formations) => {
            var delta = jsondiffpatch.diff(previousFormations, JSON.parse(JSON.stringify(formations)));
            // console.log(delta);
            if (delta) {
               setDeltas((deltas) => [...deltas, delta]);
               // channelGlobal.send({
               //    type: "broadcast",
               //    event: "formation-update",
               //    payload: diffs,
               // });
               // setSaved(false);
               // supabase
               //    .from("deltas")
               //    .insert([{ userid: session?.user?.id, timestamp: new Date(), delta: delta, danceid: router.query.danceId }])
               //    .then((r) => {
               //       setSaved(true);
               //       console.log(r);
               //    });
            }

            return formations;
         });
         return previousFormations;
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
   //    if (!session) return;

   //    let channel = supabase.channel("1", {
   //       config: {
   //          presence: {
   //             key: session?.user.id,
   //          },
   //       },
   //    });

   //    setChannelGlobal(channel);

   //    channel.on(REALTIME_LISTEN_TYPES.PRESENCE, { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC }, () => {
   //       let state = channel.presenceState();
   //       console.log(state);
   //       console.log({ state });
   //       setOnlineUsers({ ...state });

   //       Object.keys(state).forEach((id, index) => {
   //          state[id][0].color = colors[index];
   //       });
   //       // setOnlineUsers({ ...state });
   //       // state = {Object.keys(state)}
   //       // User attempting to navigate directly to an existing room with users

   //       // User will be assigned an existing room with the fewest users

   //       // Generate an id if no existing rooms are available
   //    });

   //    channel.subscribe(async (status: `${REALTIME_SUBSCRIBE_STATES}`) => {
   //       if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
   //          // const resp: RealtimeChannelSendResponse = await channel.track({ name: session?.user.user_metadata.full_name, formations });
   //          // const resp: RealtimeChannelSendResponse = await channel.track(formations);
   //          // console.log(resp);
   //          //   if (resp === 'ok') {
   //          //     router.push(`/${roomId}`)
   //          //   } else {
   //          //     router.push(`/`)
   //          //   }
   //       }
   //    });

   //    const formsChannel = channel
   //       .on("broadcast", { event: "user-position-update" }, ({ payload }) => {
   //          console.log(payload);
   //          setUserPositions((userPositions) => {
   //             return { ...userPositions, ...payload };
   //          });
   //       })
   //       .on("broadcast", { event: "formation-update" }, ({ payload }) => {
   //          console.log(payload);
   //          setDeltas((deltas) => [...deltas, payload]);
   //          // setFormations((formations: formation[]) => {
   //          //    let newFormations = { formations: [...formations] };
   //          //    applyChangeset(newFormations, unflattenChanges(payload));
   //          //    return [...newFormations.formations];
   //          // });
   //       });

   //    return () => {
   //       // usersChannel.unsubscribe();
   //       supabase.removeChannel(formsChannel);
   //       supabase.removeChannel(channel);
   //    };
   // }, [router.query.danceId, session]);

   let uploadSettings = useCallback(
      debounce(async (cloudSettings) => {
         console.log("uploading settings");
         const { data, error } = await supabase
            .from("dances")
            .update({ settings: cloudSettings, last_edited: new Date() })
            .eq("id", router.query.danceId);

         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 2000),
      [router.query.danceId]
   );

   useDidMountEffect(() => {
      if (!session && router.query.danceId !== "207") {
         router.push("/login");
      }
      if (router.isReady) {
         setSaved(false);
         uploadSettings(cloudSettings);
      }
   }, [cloudSettings]);

   ////////////////////////////////////////
   let uploadDancers = useCallback(
      debounce(async (dancers) => {
         console.log("uploading dancers");
         const { data, error } = await supabase.from("dances").update({ dancers: dancers, last_edited: new Date() }).eq("id", router.query.danceId);

         console.log({ data });

         console.log({ error });
         setSaved(true);
      }, 2000),
      [router.query.danceId]
   );

   useDidMountEffect(() => {
      if (!session && router.query.danceId !== "207") {
         router.push("/login");
      }
      if (router.isReady) {
         setSaved(false);
         uploadDancers(dancers);
      }
   }, [dancers]);

   ////////////////////////////////////////
   let uploadGroups = useCallback(
      debounce(async (formationGroups) => {
         console.log("uploading dancers");
         const { data, error } = await supabase
            .from("dances")
            .update({ formation_groups: formationGroups, last_edited: new Date() })
            .eq("id", router.query.danceId);

         console.log({ data });

         console.log({ error });
         setSaved(true);
      }, 5000),
      [router.query.danceId]
   );

   useDidMountEffect(() => {
      if (!session && router.query.danceId !== "207") {
         router.push("/login");
      }
      if (router.isReady) {
         setSaved(false);
         uploadGroups(formationGroups);
      }
   }, [formationGroups]);

   // // ///////////
   let uploadFormations = useCallback(
      debounce(async (formations) => {
         console.log("uploading formations");
         const { data, error } = await supabase
            .from("dances")
            .update({ formations: formations, last_edited: new Date() })
            .eq("id", router.query.danceId);
         console.log({ data });
         console.log({ error });

         setSaved(true);
      }, 5000),
      [router.query.danceId]
   );

   useDidMountEffect(() => {
      if (!session && router.query.danceId !== "207") {
         router.push("/login");
      }
      if (router.isReady) {
         setSaved(false);
         uploadFormations(formations);
      }
   }, [formations]);
   ////////////////////////
   // ///////////
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
      [router.query.danceId]
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
   // ///////////
   let uploadName = useCallback(
      debounce(async (danceName) => {
         console.log("uploading name");
         const { data, error } = await supabase.from("dances").update({ name: danceName }).eq("id", router.query.danceId);
         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 1000),
      [router.query.danceId]
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
                  className="fixed w-60 h-12 rounded-full top-6 bg-black z-[9999] opacity-70 grid place-items-center"
               >
                  <p className="text-white text-sm pointer-events-none">Click on the stage to comment</p>
               </div>
            </>
         ) : null}

         <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa] overscroll-y-none text-gray-900  ">
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
                           localSettings={localSettings}
                        />
                     ) : (
                        <></>
                     )}

                     {!isPreviewingThree
                        ? dancers.map((dancer, index) => (
                             <DancerAlias
                                zoom={zoom}
                                //   stageFlipped={stageFlipped}
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

            <div className="pb-2">
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

               <div className="overflow-x-scroll  bg-[#fafafa] overscroll-contain pb-3 ">
                  {soundCloudTrackId || localSource ? (
                     <div
                        className="relative"
                        style={{
                           left: 10,
                           width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
                        }}
                     >
                        <FileAudioPlayer
                           player={player}
                           setPlayer={setPlayer}
                           key={localSource || soundCloudTrackId}
                           setSelectedFormation={setSelectedFormation}
                           setFormations={setFormations}
                           soundCloudTrackId={localSource || soundCloudTrackId}
                           setSongDuration={setSongDuration}
                           songDuration={songDuration}
                           setIsPlaying={setIsPlaying}
                           setPosition={setPosition}
                           viewOnly={viewOnly}
                           pixelsPerSecond={pixelsPerSecond}
                           videoPlayer={videoPlayer}
                        ></FileAudioPlayer>
                     </div>
                  ) : (
                     <></>
                  )}

                  <Layers
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
                  />
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
   if (dance.id === 207 || dance?.user === session?.user?.id) {
      viewOnly = false;
   }
   dance = { ...{ ...dance, formations: dance.formations } };

   return {
      props: {
         initialData: dance,
         viewOnly,
         pricingTier,
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
