import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";

import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Header } from "../../components/AppComponents/Header";
import { DancerAlias } from "../../components/AppComponents/DancerAlias";
import { DancerAliasShadow } from "../../components/AppComponents/DancerAliasShadow";
import { Dancer } from "../../components/AppComponents/Dancer";
import { Canvas } from "../../components/AppComponents/Canvas";
import { NewDancer } from "../../components/AppComponents/NewDancer";
import { CurrentFormation } from "../../components/AppComponents/CurrentFormation";
import { EditDancer } from "../../components/AppComponents/EditDancer";
import { Layers } from "../../components/AppComponents/Layers";
import { isMobile } from "react-device-detect";
import { PathEditor } from "../../components/AppComponents/PathEditor";
import { Share } from "../../components/AppComponents/Share";
import { ChooseAudioSource } from "../../components/AppComponents/ChooseAudioSource";

var changesets = require("json-diff-ts");
import { applyChangeset } from "json-diff-ts";
// use effect, but not on initial render
const useDidMountEffect = (func, deps) => {
   const didMount = useRef(false);

   useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
   }, deps);
};

const SoundCloudComponent = dynamic<{
   setPosition: Function;
   setIsPlaying: Function;
   setSongDuration: Function;
   songDuration: number | null;
   soundCloudTrackId: string | null;
   setSelectedFormation: Function;
   setFormations: Function;
   viewOnly: boolean;
}>(() => import("../../components/AppComponents/SoundCloudComponent").then((mod) => mod.SoundCloudComponent), {
   ssr: false,
});

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
}>(() => import("../../components/AppComponents/FileAudioPlayer").then((mod) => mod.FileAudioPlayer), {
   ssr: false,
});

import { dancer, dancerPosition, formation } from "../../types/types";

const Edit = ({ initialData, viewOnly }: {}) => {
   let session = useSession();
   const supabase = useSupabaseClient();

   const [danceName, setDanceName] = useState<string>(initialData.name);
   const [shareSettings, setShareSettings] = useState(initialData.sharesettings);
   const [formations, setFormations] = useState<formation[]>(initialData.formations);
   const [soundCloudTrackId, setSoundCloudTrackId] = useState<string | null>(initialData.soundCloudId);
   const [dancers, setDancers] = useState<dancer[]>(initialData.dancers);
   const [anyoneCanView, setAnyoneCanView] = useState(initialData.anyonecanview);

   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [position, setPosition] = useState<number | null>(null);
   const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(15);
   const [selectedFormation, setSelectedFormation] = useState<number | null>(0);
   const [selectedDancers, setSelectedDancers] = useState<string[]>([]);
   const [editingDancer, setEditingDancer] = useState<string | null>(null);
   const [viewAllPaths, setViewAllPaths] = useState<boolean>(true);

   const [saved, setSaved] = useState<boolean>(true);
   const [mobile, setMobile] = useState<string | null>(null);
   const [changeSoundCloudIsOpen, setChangeSoundCloudIsOpen] = useState(false);
   const [shareIsOpen, setShareIsOpen] = useState(false);

   // let [channelGloabl, setChannel] = useState(null);

   let currentFormationIndex = whereInFormation(formations, position).currentFormationIndex;

   useEffect(() => {
      if (window !== undefined) {
         setViewAllPaths(JSON.parse(window.localStorage.getItem("viewAllPaths")));
      }
   }, []);

   useDidMountEffect(() => {
      if (window !== undefined) {
         window.localStorage.setItem("viewAllPaths", viewAllPaths);
      }
   }, [viewAllPaths]);

   // remove this eventually
   useEffect(() => {
      setSelectedDancers([]);
   }, [selectedFormation]);

   useEffect(() => {
      if (isMobile) {
         setMobile(true);
      }
   }, [isMobile]);

   useEffect(() => {
      if (!isPlaying) return;
      setSelectedFormation(currentFormationIndex);
   }, [currentFormationIndex, isPlaying]);

   useEffect(() => {
      if (!songDuration) return;
      console.log("setting original");
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

   useEffect(() => {
      // let channel = supabase.channel("177");
      // setChannel(channel);
      // channel
      //    .on("broadcast", { event: "cursor-pos" }, ({ payload }) => {
      //       console.log(payload?.[0]?.changes);
      //       // if (!payload.length) return;
      //       setFormations((formations) => {
      //          console.log(payload);
      //          return applyChangeset(formations, payload[0].changes);
      //       });
      //    })
      //    .subscribe((status) => {
      //       if (status === "SUBSCRIBED") {
      //          console.log("subbedd");
      //       }
      //    });

      return () => {
         // supabase.removeSubscription(mySub);
      };
   }, [router.query.danceId]);

   // function usePrevious(value) {
   //    const ref = useRef();
   //    useEffect(() => {
   //       ref.current = value; //assign the value of ref to the argument
   //    }, [value]); //this code will run when the value of 'value' changes
   //    return ref.current; //in the end, return the current ref value.
   // }

   // const prevFormations = usePrevious(formations);

   // useDidMountEffect(() => {
   //    console.log({ prevFormations });
   //    if (!changesets) return;
   //    if (!channelGloabl) return;
   //    let diffs = changesets.diff(prevFormations, formations);
   //    if (!diffs.length) return;
   //    channelGloabl.send({
   //       type: "broadcast",
   //       event: "cursor-pos",
   //       payload: diffs,
   //    });
   // }, [formations, prevFormations, channelGloabl]);
   // /////////////////////////////
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
      if (router.isReady) {
         setSaved(false);
         uploadDancers(dancers);
      }
   }, [dancers]);
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
      }, 10000),
      [router.query.danceId]
   );

   useDidMountEffect(() => {
      if (router.isReady) {
         setSaved(false);
         uploadFormations(formations);
      }
   }, [formations]);
   //////////////////////////
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
      }, 100),
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
      }, 100),
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
         <Head>
            <title>Naach: Online formation building software</title>

            <meta
               name="description"
               content="Easily visualize your dance formations. Simply drag and drop dancers onto a canvas of your dancers and see what works best!"
            />
            <meta name="keywords" content="dance, choreography, desi, formations" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Naach — Expression Through Movement." />
            <meta name="twitter:image" content="https://i.imgur.com/woDsnv8.png" />
            <meta property="og:type" content="song" />
            <meta property="og:title" content="Naach — Expression Through Movement." />
            <meta property="og:description" content="automate, animate and visualize your dance formations synced to music" />
            <meta property="og:image" content="https://i.imgur.com/woDsnv8.png" />
            <meta property="og:site_name" content="Naach — Expression Through Movement." />
         </Head>
         {mobile ? (
            <>
               <div className="fixed top-0 left-0 z-[100] flex h-screen w-screen items-center justify-center bg-black/95 backdrop-blur-[2px]">
                  <div className="flex  w-[700px] flex-col rounded-xl bg-white">
                     <div className="flex flex-col rounded-xl px-10 py-10 h-full text-center">
                        <div className="flex flex-col mt-auto">
                           editing dances with Naach is unfortunately not yet optimized for mobile devices, please visit naach.app on your desktop to
                           edit your formations
                        </div>
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <></>
         )}

         <Head>
            <title>Edit | Naach</title>
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

         {!soundCloudTrackId || changeSoundCloudIsOpen ? (
            <ChooseAudioSource
               setChangeSoundCloudIsOpen={setChangeSoundCloudIsOpen}
               setSelectedFormation={setSelectedFormation}
               setFormations={setFormations}
               soundCloudTrackId={soundCloudTrackId}
               setSoundCloudTrackId={setSoundCloudTrackId}
               setSongDuration={setSongDuration}
               songDuration={songDuration}
               setIsPlaying={setIsPlaying}
               setPosition={setPosition}
            />
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

         <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa] overscroll-y-none ">
            <Header
               saved={saved}
               danceName={danceName}
               setDanceName={setDanceName}
               viewAllPaths={viewAllPaths}
               setViewAllPaths={setViewAllPaths}
               setChangeSoundCloudIsOpen={setChangeSoundCloudIsOpen}
               setShareIsOpen={setShareIsOpen}
               viewOnly={viewOnly}
            />
            <div className="flex flex-row grow overflow-hidden">
               {!viewOnly ? (
                  <div className="flex flex-col w-[30%] ml-3">
                     <p className="text-xl font-bold mb-2 ml-2">My dancers</p>
                     <div className="flex flex-col  relative overflow-y-scroll overflow-x-hidden  ">
                        <NewDancer setDancers={setDancers} />

                        {dancers
                           .slice()
                           .reverse()
                           .map((dancer, index) => (
                              <Dancer
                                 isPlaying={isPlaying}
                                 formations={formations}
                                 selectedFormation={selectedFormation}
                                 setDancers={setDancers}
                                 {...dancer}
                                 key={dancer.id}
                                 dancers={dancers}
                                 setEditingDancer={setEditingDancer}
                                 setFormations={setFormations}
                              />
                           ))}
                     </div>
                  </div>
               ) : null}

               <Canvas
                  songDuration={songDuration}
                  viewOnly={viewOnly}
                  setSelectedFormation={setSelectedFormation}
                  formations={formations}
                  selectedFormation={selectedFormation}
                  setDancers={setDancers}
                  dancers={dancers}
                  setFormations={setFormations}
                  selectedDancers={selectedDancers}
                  setSelectedDancers={setSelectedDancers}
                  setIsPlaying={setIsPlaying}
                  setPixelsPerSecond={setPixelsPerSecond}
               >
                  {selectedFormation !== null ? (
                     <PathEditor
                        currentFormationIndex={currentFormationIndex}
                        formations={formations}
                        selectedFormation={selectedFormation}
                        selectedDancers={selectedDancers}
                        viewAllPaths={viewAllPaths}
                        isPlaying={isPlaying}
                     />
                  ) : (
                     <></>
                  )}

                  {dancers.map((dancer, index) => (
                     <DancerAlias
                        selectedDancers={selectedDancers}
                        isPlaying={isPlaying}
                        position={position}
                        selectedFormation={selectedFormation}
                        setDancers={setDancers}
                        key={dancer.id}
                        dancer={dancer}
                        formations={formations}
                        setFormations={setFormations}
                     />
                  ))}
                  {viewAllPaths
                     ? dancers.map((dancer, index) => (
                          <DancerAliasShadow
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
               {!viewOnly ? (
                  <CurrentFormation
                     selectedDancers={selectedDancers}
                     setSelectedDancers={setSelectedDancers}
                     setSelectedFormation={setSelectedFormation}
                     dancers={dancers}
                     setFormations={setFormations}
                     formations={formations}
                     selectedFormation={selectedFormation}
                  />
               ) : null}
            </div>
            <div className="overflow-x-scroll min-h-[170px] bg-white overscroll-contain  ">
               {soundCloudTrackId && soundCloudTrackId.length < 15 ? (
                  <div
                     style={{
                        width: songDuration ? (songDuration / 1000) * pixelsPerSecond + 130 : "100%",
                     }}
                  >
                     <SoundCloudComponent
                        key={soundCloudTrackId}
                        setSelectedFormation={setSelectedFormation}
                        setFormations={setFormations}
                        soundCloudTrackId={soundCloudTrackId}
                        setSongDuration={setSongDuration}
                        songDuration={songDuration}
                        setIsPlaying={setIsPlaying}
                        setPosition={setPosition}
                        viewOnly={viewOnly}
                     />
                  </div>
               ) : null}

               {soundCloudTrackId && soundCloudTrackId.length > 15 ? (
                  <div
                     className="relative"
                     style={{
                        left: 10,
                        width: songDuration ? (songDuration / 1000) * pixelsPerSecond : "100%",
                     }}
                  >
                     <FileAudioPlayer
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
               ) : null}

               <Layers
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
   // Create authenticated Supabase Client
   const supabase = createServerSupabaseClient(ctx);
   // Check if we have a session
   const {
      data: { session },
   } = await supabase.auth.getSession();

   // if (!session){
   //    return {
   //       redirect: {
   //          destination: "/",
   //          permanent: false,
   //       },
   //    };
   // }
   // function detectMob(agent) {
   //    const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

   //    return toMatch.some((toMatchItem) => {
   //       return agent.match(toMatchItem);
   //    });
   // }

   // console.log(detectMob(ctx.req.rawHeaders[7]));
   // Run queries with RLS on the server
   const { data } = await supabase.from("dances").select("*").eq("id", ctx.query.danceId).single();
   console.log(data);
   if (!data) {
      return {
         redirect: {
            destination: "/noaccess",
            permanent: false,
         },
      };
   }

   if (data.id === 207) {
      return {
         props: {
            initialData: data,
         },
      };
   }

   if (data?.user === session?.user?.id) {
      return {
         props: {
            initialData: data,
         },
      };
   }

   if (!session) {
      return {
         props: {
            initialData: data,
            viewOnly: true,
         },
      };
   }

   if (data?.anyonecanview) {
      return {
         props: {
            initialData: data,
            viewOnly: true,
         },
      };
   }
   if (data?.sharesettings[session?.user?.email] === "view") {
      return {
         props: {
            initialData: data,
            viewOnly: true,
         },
      };
   }

   if (data) {
      return {
         props: {
            initialData: data,
            viewOnly: true,
         },
      };
   }
};
