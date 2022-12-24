import { useState, useEffect, useRef, useCallback } from "react";
import { debounce, divide } from "lodash";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

import dynamic from "next/dynamic";
import Head from "next/head";
import { PIXELS_PER_SQUARE } from "../../types/types";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import toast, { Toaster } from "react-hot-toast";
// import {RealtimePresenceState} from
// import { RealtimePresenceState } from 'lib/database.types'

import { Header } from "../../components/AppComponents/Header";
import { DancerAlias } from "../../components/AppComponents/DancerAlias";
import { DancerAliasShadow } from "../../components/AppComponents/DancerAliasShadow";
import { Canvas } from "../../components/AppComponents/Canvas";
import { CurrentFormation } from "../../components/AppComponents/SidebarComponents/CurrentFormation";
import { Settings } from "../../components/AppComponents/SidebarComponents/Settings";
import { EditDancer } from "../../components/AppComponents/EditDancer";
import { Layers } from "../../components/AppComponents/Layers";
import { PathEditor } from "../../components/AppComponents/PathEditor";
import { Share } from "../../components/AppComponents/Share";
import { ChooseAudioSource } from "../../components/AppComponents/SidebarComponents/ChooseAudioSource";
import { dancer, dancerPosition, formation } from "../../types/types";
import { Roster } from "../../components/AppComponents/SidebarComponents/Roster";
import { Sidebar } from "../../components/AppComponents/Sidebar";
// import { FileAudioPlayer } from "../../components/AppComponents/FileAudioPlayer";
import { AudioControls } from "../../components/AppComponents/AudioControls";

var changesets = require("json-diff-ts");
import { applyChangeset, flattenChangeset, unflattenChanges } from "json-diff-ts";
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

const Edit = ({ initialData, viewOnly }: {}) => {
   // console.log(unflattenChanges(initialData.deltas.map((delta) => delta.delta).flat(Infinity)));

   // let diffForms = applyChangeset(
   //    { formations: [...initialData.formations] },
   //    unflattenChanges(initialData.deltas.map((delta) => delta.delta).flat(Infinity))
   // );

   viewOnly = false;
   let session = useSession();

   const colors = ["#DFFF00", "#FFBF00", "#FF7F50", "#DE3163", "#9FE2BF", "#40E0D0", "#6495ED", "#CCCCFF"];

   const supabase = useSupabaseClient();

   const [formationsStack, setFormationsStack] = useState<formation[][]>([]);
   const [formations, setFormations] = useState<formation[]>(initialData.formations);
   const [deltas, setDeltas] = useState([]);
   const [dancers, setDancers] = useState<dancer[]>(initialData.dancers);

   const [danceName, setDanceName] = useState<string>(initialData.name);
   const [shareSettings, setShareSettings] = useState(initialData.sharesettings);
   const [soundCloudTrackId, setSoundCloudTrackId] = useState<string | null>(initialData.soundCloudId);
   const [stageDimensions, setStageDimensions] = useState(initialData.settings.stageDimensions);
   const [anyoneCanView, setAnyoneCanView] = useState(initialData.anyonecanview);
   const [audioFiles, setAudiofiles] = useState(initialData.audioFiles);

   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [position, setPosition] = useState<number | null>(null);
   const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(15);
   const [selectedFormation, setSelectedFormation] = useState<number | null>(0);
   const [selectedDancers, setSelectedDancers] = useState<string[]>([]);
   const [editingDancer, setEditingDancer] = useState<string | null>(null);
   const [previousFormationView, setPreviousFormationView] = useState<"none" | "ghostDancers" | "ghostDancersAndPaths">(
      initialData.settings.previousFormationView
   );
   const [draggingDancerId, setDraggingDancerId] = useState<null | string>(null);
   const [onlineUsers, setOnlineUsers] = useState<string>();

   const [saved, setSaved] = useState<boolean>(true);
   const [shareIsOpen, setShareIsOpen] = useState(false);
   const [menuOpen, setMenuOpen] = useState<string>(initialData.soundCloudId ? "formations" : "audio");
   const [pricingTier, setPricingTier] = useState<string>("premium");
   const [player, setPlayer] = useState(null);

   const [channelGlobal, setChannelGlobal] = useState();
   const [userPositions, setUserPositions] = useState({});

   const coordsToPosition = (x: number, y: number) => {
      return {
         left: (PIXELS_PER_SQUARE * stageDimensions.width) / 2 + PIXELS_PER_SQUARE * x,
         top: (PIXELS_PER_SQUARE * stageDimensions.height) / 2 + PIXELS_PER_SQUARE * -y,
      };
   };

   let currentFormationIndex = whereInFormation(formations, position).currentFormationIndex;

   useEffect(() => {
      console.log(deltas);
      setFormations((formations: formation[]) => {
         let newFormations = { formations: [...formations] };
         applyChangeset(newFormations, unflattenChanges(deltas));
         return [...newFormations.formations];
      });
   }, [deltas]);

   useEffect(() => {
      if (!isPlaying) return;
      setSelectedFormation(currentFormationIndex);
   }, [currentFormationIndex, isPlaying]);

   useEffect(() => {
      if (!songDuration) return;

      setPixelsPerSecond(15);
      if (pixelsPerSecond * (songDuration / 1000) < window.screen.width - 20) {
         setPixelsPerSecond((window.screen.width - 20) / (songDuration / 1000));
      }
   }, [soundCloudTrackId, songDuration]);

   const router = useRouter();

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

   const addToStack = () => {
      console.log("add to stack");
      setFormationsStack((formationStack: formation[][]) => {
         return [...formationStack, formations];
      });
      // console.log(formationsStack);
   };

   const pushChange = () => {
      console.log("push change");

      setFormationsStack((formationsStack: formation[][]) => {
         setFormations((formations) => {
            let diffs = changesets.diff({ formations: formationsStack[formationsStack.length - 1] }, { formations }, { formations: "id" });
            diffs = flattenChangeset(diffs);
            // console.log({ old: formationsStack[formationsStack.length - 1] });
            // console.log({ new: formations });
            console.log(diffs);
            if (diffs.length) {
               channelGlobal.send({
                  type: "broadcast",
                  event: "formation-update",
                  payload: diffs,
               });
               setSaved(false);
               supabase
                  .from("deltas")
                  .insert([{ userid: session?.user?.id, timestamp: new Date(), delta: diffs, danceid: router.query.danceId }])
                  .then((r) => {
                     setSaved(true);
                     console.log(r);
                  });
            }

            return formations;
         });
         return formationsStack;
      });
   };

   useEffect(() => {
      if (!channelGlobal) return;
      if (!session) return;
      channelGlobal.send({
         type: "broadcast",
         event: "user-position-update",
         payload: {
            selectedFormation,
            selectedDancers,
            userId: session?.user?.id,
         },
      });
   }, [selectedFormation, selectedDancers, channelGlobal]);

   useEffect(() => {
      if (!session) return;
      let channel = supabase.channel("207", {
         config: {
            presence: {
               key: session?.user.id,
            },
         },
      });

      setChannelGlobal(channel);
      // const usersChannel = channel.on("presence", { event: "sync" }, () => {
      //    console.log("Online users: ", channel.presenceState());

      //    let users = channel.presenceState();
      //    Object.keys(users).forEach((id, index) => {
      //       users[id][0].color = colors[index];
      //    });
      //    // setOnlineUsers({ ...users });
      //    setOnlineUsers({ ...channel.presenceState() });
      // });

      // channel.on("presence", { event: "join" }, ({ newPresences }) => {
      //    console.log("New users have joined: ", newPresences);
      // });

      const formsChannel = channel
         // .on("broadcast", { event: "user-position-update" }, ({ payload }) => {
         //    setUserPositions((userPositions) => {
         //       return { ...userPositions, [payload.userId]: payload };
         //    });
         // })
         .on("broadcast", { event: "formation-update" }, ({ payload }) => {
            // console.log(payload);
            // setDeltas((deltas) => [...deltas, ...payload]);
            // setFormations((formations: formation[]) => {
            //    let newFormations = { formations: [...formations] };
            //    applyChangeset(newFormations, unflattenChanges(payload));
            //    return [...newFormations.formations];
            // });
         });
      // .subscribe(async (status) => {
      //    if (status === "SUBSCRIBED") {
      //       console.log("subbedd");
      //       const status = await channel.track({ online_at: new Date().toISOString() }); //online_at: new Date().toISOString(), //user: session?.user
      //       console.log({ status });
      //    }
      // });

      return () => {
         // usersChannel.unsubscribe();
         formsChannel.unsubscribe();
      };
   }, [router.query.danceId, session]);

   let uploadSettings = useCallback(
      debounce(async (previousFormationView, stageDimensions) => {
         console.log("uploading settings");
         const { data, error } = await supabase
            .from("dances")
            .update({ settings: { stageDimensions: stageDimensions }, last_edited: new Date() })
            .eq("id", router.query.danceId);

         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 2000),
      [router.query.danceId]
   );

   useDidMountEffect(() => {
      if (router.isReady) {
         setSaved(false);
         uploadSettings(previousFormationView, stageDimensions);
      }
   }, [previousFormationView, stageDimensions]);

   let uploadDancers = useCallback(
      debounce(async (dancers) => {
         console.log("uploading dancers");
         const { data, error } = await supabase.from("dances").update({ dancers: dancers, last_edited: new Date() }).eq("id", router.query.danceId);

         console.log({ data });
         console.log({ error });
         setSaved(true);
      }, 0),
      [router.query.danceId]
   );

   useDidMountEffect(() => {
      if (router.isReady) {
         setSaved(false);
         uploadDancers(dancers);
      }
   }, [dancers]);
   // // ///////////

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
      }, 0),
      [router.query.danceId]
   );

   useDidMountEffect(() => {
      if (router.isReady) {
         setSaved(false);
         uploadName(danceName);
      }
   }, [danceName]);
   //////////////////////////

   return (
      <>
         <Toaster></Toaster>
         <Head>
            <title>FORMI: Online performance planning software.</title>

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

         {shareIsOpen ? (
            <Share
               shareSettings={shareSettings}
               setShareSettings={setShareSettings}
               anyoneCanView={anyoneCanView}
               setAnyoneCanView={setAnyoneCanView}
               setShareIsOpen={setShareIsOpen}
            />
         ) : null}

         <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa] overscroll-y-none  ">
            <div className="flex flex-row  overflow-hidden w-screen">
               {!viewOnly ? (
                  <>
                     <Sidebar setMenuOpen={setMenuOpen} menuOpen={menuOpen}></Sidebar>

                     {menuOpen === "dancers" ? (
                        <Roster
                           setDancers={setDancers}
                           dancers={dancers}
                           formations={formations}
                           selectedFormation={selectedFormation}
                           setEditingDancer={setEditingDancer}
                           stageDimensions={stageDimensions}
                           setFormations={setFormations}
                        ></Roster>
                     ) : menuOpen === "audio" ? (
                        <ChooseAudioSource
                           soundCloudTrackId={soundCloudTrackId}
                           setSoundCloudTrackId={setSoundCloudTrackId}
                           audioFiles={audioFiles}
                           sampleAudioFiles={initialData.sampleAudioFiles}
                           setAudiofiles={setAudiofiles}
                        ></ChooseAudioSource>
                     ) : menuOpen === "settings" ? (
                        <Settings
                           formations={formations}
                           pricingTier={pricingTier}
                           previousFormationView={previousFormationView}
                           setPreviousFormationView={setPreviousFormationView}
                           stageDimensions={stageDimensions}
                           setStageDimensions={setStageDimensions}
                           setFormations={setFormations}
                        ></Settings>
                     ) : (
                        <CurrentFormation
                           addToStack={addToStack}
                           pushChange={pushChange}
                           pricingTier={pricingTier}
                           stageDimensions={stageDimensions}
                           selectedDancers={selectedDancers}
                           setSelectedDancers={setSelectedDancers}
                           setSelectedFormation={setSelectedFormation}
                           dancers={dancers}
                           setFormations={setFormations}
                           formations={formations}
                           selectedFormation={selectedFormation}
                        />
                     )}
                  </>
               ) : null}

               <div className={`flex flex-col min-w-0 flex-grow items-center `}>
                  <Header
                     onlineUsers={onlineUsers}
                     setFormations={setFormations}
                     formationsStack={formationsStack}
                     setFormationsStack={setFormationsStack}
                     saved={saved}
                     danceName={danceName}
                     setDanceName={setDanceName}
                     setShareIsOpen={setShareIsOpen}
                     viewOnly={viewOnly}
                  />

                  <Canvas
                     pushChange={pushChange}
                     formationsStack={formationsStack}
                     setFormationsStack={setFormationsStack}
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
                     stageDimensions={stageDimensions}
                     coordsToPosition={coordsToPosition}
                  >
                     {selectedFormation !== null ? (
                        <PathEditor
                           currentFormationIndex={currentFormationIndex}
                           formations={formations}
                           selectedFormation={selectedFormation}
                           selectedDancers={selectedDancers}
                           previousFormationView={previousFormationView}
                           isPlaying={isPlaying}
                           coordsToPosition={coordsToPosition}
                        />
                     ) : (
                        <></>
                     )}

                     {dancers.map((dancer, index) => (
                        <DancerAlias
                           stageDimensions={stageDimensions}
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
                        />
                     ))}
                     {previousFormationView !== "none"
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
                             .filter((dancer) => selectedDancers.includes(dancer.id))
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
                  </Canvas>
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
               ></AudioControls>

               <div className="overflow-x-scroll  bg-[#fafafa] overscroll-contain removeScrollBar ">
                  {soundCloudTrackId ? (
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
                           key={soundCloudTrackId}
                           setSelectedFormation={setSelectedFormation}
                           setFormations={setFormations}
                           soundCloudTrackId={soundCloudTrackId}
                           setSongDuration={setSongDuration}
                           songDuration={songDuration}
                           setIsPlaying={setIsPlaying}
                           setPosition={setPosition}
                           viewOnly={viewOnly}
                           pixelsPerSecond={pixelsPerSecond}
                        ></FileAudioPlayer>
                     </div>
                  ) : (
                     <></>
                  )}

                  <Layers
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

   for (let i = 0; i < formations.length; i++) {
      sum = sum + formations[i].durationSeconds + formations[i]?.transition.durationSeconds;
      if (position < sum) {
         currentFormationIndex = i;
         break;
      }
   }
   return { currentFormationIndex };
};

export const getServerSideProps = async (ctx) => {
   console.log(ctx.req.headers.host);

   // Create authenticated Supabase Client
   const supabase = createServerSupabaseClient(ctx);
   // Check if we have a session
   const {
      data: { session },
   } = await supabase.auth.getSession();

   // console.log(session?.user.id);

   // if (!session){
   //    return {
   //       redirect: {
   //          destination: "/",
   //          permanent: false,
   //       },
   //    };
   // }

   let [{ data: dance }, { data: deltas }, audioFiles, sampleAudioFiles] = await Promise.all([
      supabase.from("dances").select("*").eq("id", ctx.query.danceId).single(),
      supabase.from("deltas").select("*").eq("danceid", ctx.query.danceId),
      supabase.storage.from("audiofiles").list(session?.user.id, {}),
      supabase.storage.from("audiofiles").list("sample", {}),
   ]);

   let sortedDeltas = deltas?.sort((a, b) => a.timestamp - b.timestamp);

   let diffForms = applyChangeset(
      { formations: [...dance.formations] },
      unflattenChanges(sortedDeltas.map((delta) => delta.delta).flat(Infinity))
   ).formations;

   let _ = await Promise.all([
      supabase.from("deltas").delete().eq("danceid", ctx.query.danceId),
      supabase.from("dances").update({ formations: diffForms }).eq("id", ctx.query.danceId),
   ]);

   dance = { ...{ ...dance, formations: diffForms }, audioFiles, sampleAudioFiles };

   if (!dance) {
      return {
         redirect: {
            destination: "/noaccess",
            permanent: false,
         },
      };
   }

   if (dance.id === 207) {
      return {
         props: {
            initialData: dance,
            viewOnly: false,
         },
      };
   }

   if (dance?.user === session?.user?.id) {
      return {
         props: {
            initialData: dance,
            viewOnly: false,
         },
      };
   }

   if (!session) {
      return {
         props: {
            initialData: dance,
            viewOnly: true,
         },
      };
   }

   if (dance?.anyonecanview) {
      return {
         props: {
            initialData: dance,
            viewOnly: true,
         },
      };
   }
   if (dance?.sharesettings[session?.user?.email] === "view") {
      return {
         props: {
            initialData: dance,
            viewOnly: true,
         },
      };
   }

   if (dance) {
      return {
         props: {
            initialData: dance,
            viewOnly: true,
         },
      };
   }
};
