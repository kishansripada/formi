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
import Script from "next/script";
import { comment, dancer, dancerPosition, formation, PIXELS_PER_SQUARE, localSettings, cloudSettings, formationGroup } from "../../types/types";
import { AudioControls } from "../../components/AppComponents/AudioControls";
import { Header } from "../../components/AppComponents/Header";
import { DancerAlias } from "../../components/AppComponents/DancerAlias";
import { Comment } from "../../components/AppComponents/Comment";
import { DancerAliasShadow } from "../../components/AppComponents/DancerAliasShadow";
import { Canvas } from "../../components/AppComponents/Canvas";
// import { ThreeCanvas } from "../../components/AppComponents/ThreeCanvas";
// const ThreeCanvas = lazy(() => import("../../components/AppComponents/ThreeCanvas"));

// const ThreeCanvas = dynamic(() => import("../../components/AppComponents/ThreeCanvas").then((mod) => mod.ThreeCanvas));

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

const Edit = ({ initialData, viewOnly }: { viewOnly: boolean }) => {
   // let forms = initialData.formations;

   // let newForms = forms.map((formation: formation, i) => {
   //    if (i === 0) return formation;
   //    return {
   //       ...formation,
   //       positions: forms[i - 1].positions.map((position) => {
   //          return { ...position, position: formation.positions.find((positionx) => positionx.id === position.id).position };
   //       }),
   //       transition: { durationSeconds: forms[i - 1].transition.durationSeconds },
   //    };
   // });

   let pricingTier = "premium";
   const colors = ["#e6194B", "#4363d8", "#f58231", "#800000", "#469990", "#3cb44b"];

   const supabase = useSupabaseClient();
   let session = useSession();
   const router = useRouter();
   const videoPlayer = useRef();
   // const supabase = createClient(
   //    "https://dxtxbxkkvoslcrsxbfai.supabase.co",
   //    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dHhieGtrdm9zbGNyc3hiZmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjE0NjM3NDYsImV4cCI6MTk3NzAzOTc0Nn0.caFbFV4Ck7MrTSwsPXyIifjeKWYJWXisKR9-zFA33Ng",
   //    {
   //       realtime: {
   //          params: {
   //             eventsPerSecond: 1,
   //          },
   //       },
   //    }

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
   const [audioFiles, setAudiofiles] = useState(initialData.audioFiles);
   const [danceName, setDanceName] = useState<string>(initialData.name);
   const [formationGroups, setFormationGroups] = useState<formationGroup[]>(initialData.formation_groups);

   // local
   const [localSettings, setLocalSettings] = useLocalStorage<localSettings>("localSettings", {
      gridSnap: 1,
      previousFormationView: "ghostDancersAndPaths",
      dancerStyle: "initials",
      viewCollisions: false,
   });

   const [upgradeIsOpen, setUpgradeIsOpen] = useState<boolean>(false);
   const [deltas, setDeltas] = useState([]);
   const [localSource, setLocalSource] = useState(null);
   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [videoCoordinates, setVideoCoordinates] = useState<{ left: number; top: number }>({ left: 40, top: 40 });
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

   // not in use
   const [onlineUsers, setOnlineUsers] = useState({
      "f30197ba-cf06-4234-bcdb-5d40d83c7999": [{ name: "Kishan Sripada", color: "#e6194B" }],
      "0e5f35d1-3989-401c-9693-f6a632954d0b": [
         {
            name: "Sasha Shrestha",
            color: "#4363d8",
         },
      ],
   });
   const [userPositions, setUserPositions] = useState({});

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
   //       let newFormations = { formations: [...initialData.formations] };
   //       applyChangeset({ ...newFormations }, unflattenChanges([...deltas]));
   //       return [...newFormations.formations];
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
            var delta = jsondiffpatch.diff(previousFormations, formations);
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
   // if (!session) return;
   // let channel = supabase.channel("207", {
   //    config: {
   //       presence: {
   //          key: session?.user.id,
   //       },
   //    },
   // });

   // setChannelGlobal(channel);
   // const usersChannel = channel.on("presence", { event: "sync" }, () => {
   //    // console.log("Online users: ", channel.presenceState());
   //    // let users = channel.presenceState();
   //    // Object.keys(users).forEach((id, index) => {
   //    //    users[id][0].color = colors[index];
   //    // });
   //    // setOnlineUsers({ ...users });
   //    // // setOnlineUsers({ ...channel.presenceState() });
   // });

   // channel.on("presence", { event: "join" }, ({ newPresences }) => {
   //    console.log("New users have joined: ", newPresences);
   // });

   // const formsChannel = channel
   //    .on("broadcast", { event: "user-position-update" }, ({ payload }) => {
   //       console.log(payload);
   //       setUserPositions((userPositions) => {
   //          return { ...userPositions, ...payload };
   //       });
   //    })
   //    .on("broadcast", { event: "formation-update" }, ({ payload }) => {
   //       console.log(payload);
   //       setDeltas((deltas) => [...deltas, ...payload]);
   //       // setFormations((formations: formation[]) => {
   //       //    let newFormations = { formations: [...formations] };
   //       //    applyChangeset(newFormations, unflattenChanges(payload));
   //       //    return [...newFormations.formations];
   //       // });
   //    })
   //    .subscribe(async (status) => {
   //       if (status === "SUBSCRIBED") {
   //          console.log("subbedd");
   //          // const status = await channel.track({ name: session?.user.user_metadata.full_name }); //online_at: new Date().toISOString(), //user: session?.user
   //          console.log({ status });
   //       }
   //    });

   // return () => {
   // usersChannel.unsubscribe();
   // formsChannel.unsubscribe();
   // };
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
   //////////////////////////
   const collisions = localSettings.viewCollisions ? detectCollisions(formations, selectedFormation, cloudSettings.collisionRadius) : [];
   // console.log(collisions);
   // console.log(collisions);

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
            <title>FORMI: {initialData.name}</title>

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

         <Head>
            <title>Edit | FORMI</title>
         </Head>

         {editingDancer !== null ? (
            <EditDancer
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
               <div className="flex  w-3/4 scale-[0.95]  flex-col rounded-xl font-proxima  bg-white overflow-hidden">
                  <div className="flex flex-col items-center">
                     <div className="w-[250px] pointer-events-none select-none mt-16">
                        <h1 className="text-6xl font-bold z-10 relative">FORMI</h1>
                        <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[100%]"></div>
                     </div>
                     <p className="tracking-widest text-gray-500 font-semibold">UPGRADE PLAN</p>
                     <p className="text-3xl mt-8 font-bold">The Most Intuitive Stage Planning Software</p>
                     <p className="text-2xl mt-2 font-thin">
                        Join thousands of dancers and choreographers that use FORMI to perfect their performances.
                     </p>
                  </div>

                  <Script strategy="lazyOnload" src="https://js.stripe.com/v3/pricing-table.js" />

                  <div className="flex flex-col justify-center mt-12 mb-12 ">
                     <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
                     <stripe-pricing-table
                        customer-email={session?.user.email}
                        pricing-table-id="prctbl_1MTeLNHvC3w6e8fcVDDjDqQE"
                        publishable-key="pk_live_51Laj5tHvC3w6e8fcTNgLYosshdlXBG9tELw1GacJuZQwzb7DwGSCRv8jx1pbJtf6jOR16cSb5it0Jk7Js2TSd03y00uKhclRcz"
                     ></stripe-pricing-table>
                  </div>
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
                  <Canvas
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
                           formations={formations}
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
                                formations={formations}
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
                           {(formations[selectedFormation].comments || []).map((comment: comment) => {
                              return (
                                 <>
                                    <Comment
                                       zoom={zoom}
                                       coordsToPosition={coordsToPosition}
                                       setFormations={setFormations}
                                       selectedFormation={selectedFormation}
                                       key={comment.id}
                                       comment={comment}
                                    />
                                 </>
                              );
                           })}

                           {localSettings.previousFormationView !== "none" && !isPreviewingThree
                              ? dancers.map((dancer, index) => (
                                   <DancerAliasShadow
                                      coordsToPosition={coordsToPosition}
                                      currentFormationIndex={currentFormationIndex}
                                      isPlaying={isPlaying}
                                      selectedFormation={selectedFormation}
                                      key={dancer.id}
                                      dancer={dancer}
                                      formations={formations}
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
                                            formations={formations}
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
                  {!isPreviewingThree ? <p className="text-gray-600 font-semibold text-sm mb-2">AUDIENCE</p> : null}
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

   // let [{ data: dance }, { data: deltas }, audioFiles, sampleAudioFiles] = await Promise.all([
   //    supabase.from("dances").select("*").eq("id", ctx.query.danceId).single(),
   //    supabase.from("deltas").select("*").eq("danceid", ctx.query.danceId),
   //    supabase.storage.from("audiofiles").list(session?.user.id, {}),
   //    supabase.storage.from("audiofiles").list("sample", {}),
   // ]);

   let { data: dance } = await supabase.from("dances").select("*").eq("id", ctx.query.danceId).single();

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

   if (dance.id === 207 || dance?.user === session?.user?.id) {
      viewOnly = false;
   }
   dance = { ...{ ...dance, formations: dance.formations } };

   return {
      props: {
         initialData: dance,
         viewOnly,
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
