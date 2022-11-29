import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import { PIXELS_PER_SQUARE } from "../../types/types";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { Header } from "../../components/AppComponents/Header";
import { DancerAlias } from "../../components/AppComponents/DancerAlias";
import { DancerAliasShadow } from "../../components/AppComponents/DancerAliasShadow";
import { Dancer } from "../../components/AppComponents/Dancer";
import { Canvas } from "../../components/AppComponents/Canvas";
import { NewDancer } from "../../components/AppComponents/NewDancer";
import { CurrentFormation } from "../../components/AppComponents/CurrentFormation";
import { Settings } from "../../components/AppComponents/Settings";
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
   const [stageDimensions, setStageDimensions] = useState({ width: 32, height: 20 });
   const [anyoneCanView, setAnyoneCanView] = useState(initialData.anyonecanview);

   const [songDuration, setSongDuration] = useState<number | null>(null);
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [position, setPosition] = useState<number | null>(null);
   const [pixelsPerSecond, setPixelsPerSecond] = useState<number>(15);
   const [selectedFormation, setSelectedFormation] = useState<number | null>(0);
   const [selectedDancers, setSelectedDancers] = useState<string[]>([]);
   const [editingDancer, setEditingDancer] = useState<string | null>(null);
   const [viewAllPaths, setViewAllPaths] = useState<boolean>(false);

   const [saved, setSaved] = useState<boolean>(true);
   const [mobile, setMobile] = useState<string | null>(null);
   const [changeSoundCloudIsOpen, setChangeSoundCloudIsOpen] = useState(false);
   const [shareIsOpen, setShareIsOpen] = useState(false);
   const [menuOpen, setMenuOpen] = useState<string>("formations");

   const [player, setPlayer] = useState(null);

   const coordsToPosition = (x: number, y: number) => {
      return {
         left: (PIXELS_PER_SQUARE * stageDimensions.width) / 2 + PIXELS_PER_SQUARE * x,
         top: (PIXELS_PER_SQUARE * stageDimensions.height) / 2 + PIXELS_PER_SQUARE * -y,
      };
   };

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
            <div className="flex flex-row grow overflow-hidden">
               <div className="flex flex-col w-[6%] border-r-gray-300 border-r items-center justify-start pt-7 child:pb-3">
                  <button className="flex flex-col items-center justify-center" onClick={() => setMenuOpen("formations")}>
                     <svg width="40" height="40" fill="none">
                        <g filter="url(#a)" fill-rule="evenodd" clip-rule="evenodd">
                           <path
                              d="M8 17.6c0-3.3603 0-5.0405.65396-6.3239.57524-1.129 1.49314-2.0469 2.62214-2.62214C12.5595 8 14.2397 8 17.6 8h4.8c3.3603 0 5.0405 0 6.3239.65396 1.129.57524 2.0469 1.49314 2.6221 2.62214C32 12.5595 32 14.2397 32 17.6v4.8c0 3.3603 0 5.0405-.654 6.3239-.5752 1.129-1.4931 2.0469-2.6221 2.6221C27.4405 32 25.7603 32 22.4 32h-4.8c-3.3603 0-5.0405 0-6.3239-.654-1.129-.5752-2.0469-1.4931-2.62214-2.6221C8 27.4405 8 25.7603 8 22.4v-4.8Zm12.5649 2.9183c.1207.294.4656.5283 1.1555.9969l3.8726 2.6304c.8563.5816 1.2845.8725 1.6401.8534.3097-.0166.5964-.1685.7842-.4153.2155-.2835.2155-.8011.2155-1.8362v-5.2609c0-1.0351 0-1.5527-.2155-1.8361-.1878-.2469-.4745-.3988-.7842-.4154-.3556-.0191-.7838.2718-1.6401.8534l-3.8726 2.6304c-.6899.4686-1.0348.7029-1.1555.9969-.1056.2571-.1056.5454 0 .8025Z"
                              fill="#C5C7D0"
                           />
                           <path
                              d="M8 17.6c0-3.3603 0-5.0405.65396-6.3239.57524-1.129 1.49314-2.0469 2.62214-2.62214C12.5595 8 14.2397 8 17.6 8h4.8c3.3603 0 5.0405 0 6.3239.65396 1.129.57524 2.0469 1.49314 2.6221 2.62214C32 12.5595 32 14.2397 32 17.6v4.8c0 3.3603 0 5.0405-.654 6.3239-.5752 1.129-1.4931 2.0469-2.6221 2.6221C27.4405 32 25.7603 32 22.4 32h-4.8c-3.3603 0-5.0405 0-6.3239-.654-1.129-.5752-2.0469-1.4931-2.62214-2.6221C8 27.4405 8 25.7603 8 22.4v-4.8Zm12.5649 2.9183c.1207.294.4656.5283 1.1555.9969l3.8726 2.6304c.8563.5816 1.2845.8725 1.6401.8534.3097-.0166.5964-.1685.7842-.4153.2155-.2835.2155-.8011.2155-1.8362v-5.2609c0-1.0351 0-1.5527-.2155-1.8361-.1878-.2469-.4745-.3988-.7842-.4154-.3556-.0191-.7838.2718-1.6401.8534l-3.8726 2.6304c-.6899.4686-1.0348.7029-1.1555.9969-.1056.2571-.1056.5454 0 .8025Z"
                              fill="url(#b)"
                              fill-opacity=".2"
                           />
                        </g>
                        <g filter="url(#c)">
                           <path
                              d="M18.2453 18.7189c.6898.4686 1.0348.7029 1.1555.9969.1056.2571.1056.5455 0 .8026-.1207.2939-.4657.5282-1.1555.9968l-3.8726 2.6304c-.8564.5817-1.2845.8725-1.6401.8534-.3097-.0166-.5964-.1685-.7842-.4153-.2156-.2834-.2156-.801-.2156-1.8362v-5.2608c0-1.0352 0-1.5528.2156-1.8362.1878-.2469.4745-.3988.7842-.4154.3556-.019.7837.2718 1.6401.8534l3.8726 2.6304Z"
                              fill="#fff"
                           />
                        </g>
                        <defs>
                           <filter id="a" x="8" y="8" width="24" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                              <feOffset dy=".5" />
                              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                              <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
                              <feBlend in2="shape" result="effect1_innerShadow" />
                           </filter>
                           <filter
                              id="c"
                              x="9.73285"
                              y="14.2343"
                              width="11.7471"
                              height="13.7657"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                           >
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                              <feOffset dy="1" />
                              <feGaussianBlur stdDeviation="1" />
                              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                              <feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow" />
                              <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                           </filter>
                           <linearGradient id="b" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#fff" />
                              <stop offset="1" stop-color="#fff" stop-opacity="0" />
                           </linearGradient>
                        </defs>
                     </svg>
                     <p className="text-xs text-gray-500">formations</p>
                  </button>

                  <button onClick={() => setMenuOpen("dancers")}>
                     <svg height="48" width="48" className="fill-gray-400 scale-75">
                        <path d="M1.9 40v-4.7q0-1.75.9-3.175Q3.7 30.7 5.3 30q3.65-1.6 6.575-2.3Q14.8 27 17.9 27q3.1 0 6 .7t6.55 2.3q1.6.7 2.525 2.125.925 1.425.925 3.175V40Zm35 0v-4.7q0-3.15-1.6-5.175t-4.2-3.275q3.45.4 6.5 1.175t4.95 1.775q1.65.95 2.6 2.35.95 1.4.95 3.15V40Zm-19-16.05q-3.3 0-5.4-2.1-2.1-2.1-2.1-5.4 0-3.3 2.1-5.4 2.1-2.1 5.4-2.1 3.3 0 5.4 2.1 2.1 2.1 2.1 5.4 0 3.3-2.1 5.4-2.1 2.1-5.4 2.1Zm18-7.5q0 3.3-2.1 5.4-2.1 2.1-5.4 2.1-.55 0-1.225-.075T25.95 23.6q1.2-1.25 1.825-3.075.625-1.825.625-4.075t-.625-3.975Q27.15 10.75 25.95 9.3q.55-.15 1.225-.25t1.225-.1q3.3 0 5.4 2.1 2.1 2.1 2.1 5.4ZM4.9 37h26v-1.7q0-.8-.475-1.55T29.25 32.7q-3.6-1.6-6.05-2.15-2.45-.55-5.3-.55-2.85 0-5.325.55T6.5 32.7q-.7.3-1.15 1.05-.45.75-.45 1.55Zm13-16.05q1.95 0 3.225-1.275Q22.4 18.4 22.4 16.45q0-1.95-1.275-3.225Q19.85 11.95 17.9 11.95q-1.95 0-3.225 1.275Q13.4 14.5 13.4 16.45q0 1.95 1.275 3.225Q15.95 20.95 17.9 20.95Zm0 16.05Zm0-20.55Z" />
                     </svg>
                     <p className="text-xs text-gray-500">dancers</p>
                  </button>
                  <button onClick={() => setMenuOpen("audio")}>
                     <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle class="background" opacity="0" cx="20" cy="20" r="20" fill="#9094A5"></circle>
                        <g filter="url(#filter0_i_5002_422651)">
                           <rect class="main" x="8" y="8" width="24" height="24" rx="7" fill="#C5C7D0"></rect>
                           <rect x="8" y="8" width="24" height="24" rx="7" fill="url(#paint0_linear_5002_422651)" fill-opacity="0.2"></rect>
                        </g>
                        <g filter="url(#filter1_d_5002_422651)">
                           <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M21 24.4956V16.8823C21 16.378 21.3755 15.9526 21.876 15.89L24.1238 15.609C24.6243 15.5465 24.9998 15.1211 24.9998 14.6168V13.0889C24.9998 12.5033 24.4988 12.043 23.9153 12.0925L21.0025 12.3396C19.9425 12.4295 19.1384 13.3335 19.1726 14.3968L19.4126 21.8526C18.9916 21.6275 18.5107 21.4998 18 21.4998C16.3431 21.4998 15 22.843 15 24.4998C15 26.1567 16.3431 27.4998 18 27.4998C19.6313 27.4998 20.9584 26.1979 20.999 24.5764H21V24.504C21 24.5026 21 24.5012 21 24.4998C21 24.4984 21 24.497 21 24.4956Z"
                              fill="white"
                           ></path>
                        </g>
                        <defs>
                           <filter
                              id="filter0_i_5002_422651"
                              x="8"
                              y="8"
                              width="24"
                              height="24"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                           >
                              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                              <feColorMatrix
                                 in="SourceAlpha"
                                 type="matrix"
                                 values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                 result="hardAlpha"
                              ></feColorMatrix>
                              <feOffset dy="0.5"></feOffset>
                              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"></feColorMatrix>
                              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_5002_422651"></feBlend>
                           </filter>
                           <filter
                              id="filter1_d_5002_422651"
                              x="13"
                              y="11.0889"
                              width="14"
                              height="19.4111"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                           >
                              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                              <feColorMatrix
                                 in="SourceAlpha"
                                 type="matrix"
                                 values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                 result="hardAlpha"
                              ></feColorMatrix>
                              <feOffset dy="1"></feOffset>
                              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                              <feComposite in2="hardAlpha" operator="out"></feComposite>
                              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix>
                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5002_422651"></feBlend>
                              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5002_422651" result="shape"></feBlend>
                           </filter>
                           <linearGradient id="paint0_linear_5002_422651" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
                              <stop stop-color="white"></stop>
                              <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                           </linearGradient>
                        </defs>
                     </svg>
                     <p className="text-xs text-gray-500">audio</p>
                  </button>
                  <button onClick={() => setMenuOpen("settings")} className="mt-auto">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke=""
                        className="w-8 h-8 stroke-gray-400 ml-auto mr-auto"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                     <p className="text-xs text-gray-500">settings</p>
                  </button>
               </div>

               {menuOpen === "dancers" ? (
                  <div className="flex flex-col w-[23%] px-3 ">
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
               ) : menuOpen === "audio" ? (
                  <ChooseAudioSource></ChooseAudioSource>
               ) : menuOpen === "settings" ? (
                  <Settings></Settings>
               ) : (
                  <CurrentFormation
                     selectedDancers={selectedDancers}
                     setSelectedDancers={setSelectedDancers}
                     setSelectedFormation={setSelectedFormation}
                     dancers={dancers}
                     setFormations={setFormations}
                     formations={formations}
                     selectedFormation={selectedFormation}
                  />
               )}
               <div className="flex flex-col w-[70%]">
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
                     stageDimensions={stageDimensions}
                     setStageDimensions={setStageDimensions}
                     coordsToPosition={coordsToPosition}
                  >
                     {selectedFormation !== null ? (
                        <PathEditor
                           currentFormationIndex={currentFormationIndex}
                           formations={formations}
                           selectedFormation={selectedFormation}
                           selectedDancers={selectedDancers}
                           viewAllPaths={viewAllPaths}
                           isPlaying={isPlaying}
                           coordsToPosition={coordsToPosition}
                        />
                     ) : (
                        <></>
                     )}

                     {dancers.map((dancer, index) => (
                        <DancerAlias
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
                        />
                     ))}
                     {viewAllPaths
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
            <div className="min-h-[50px] bg-white w-full border-t border-gray-300 flex flex-row items-center justify-between">
               <div className="w-[45%] pl-10 flex flex-row justify-center items-center">
                  <div className="flex flex-row items-center justify-center mx-5">
                     <label className="inline-flex relative items-center cursor-pointer">
                        <input
                           checked={viewAllPaths}
                           type="checkbox"
                           id="checked-toggle"
                           className="sr-only peer"
                           onChange={() => setViewAllPaths((value: boolean) => !value)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                     </label>
                     <p className="text-sm font-medium text-gray-900 ">view all paths</p>
                  </div>
               </div>
               <div className="flex flex-row items-center justify-center w-[10%] ">
                  {isPlaying ? (
                     <button
                        className="hover:bg-gray-100 transition duration-300 p-1 rounded-2xl"
                        onClick={() => (player ? player.playPause() : null)}
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 fill-gray-600">
                           <path
                              fillRule="evenodd"
                              d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                              clipRule="evenodd"
                           />
                        </svg>
                     </button>
                  ) : (
                     <button
                        className="hover:bg-gray-100 transition duration-300 p-1 rounded-2xl"
                        onClick={() => (player ? player.playPause() : null)}
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 fill-gray-600">
                           <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                           />
                        </svg>
                     </button>
                  )}
               </div>

               <div className="w-[45%] flex flex-row items-center justify-center pr-10">
                  <p className=" mr-auto text-gray-600">
                     {msToTime(position * 1000)}:<span className="text-gray-500">{Math.round((position * 10) % 10)}</span>
                  </p>
                  <button
                     onClick={() => {
                        setFormations((formations: formation[]) => {
                           let totalFormationLength = formations
                              .map((formation) => formation.durationSeconds + formation.transition.durationSeconds)
                              .reduce((a, b) => a + b, 0);
                           let roomLeft = songDuration / 1000 - totalFormationLength;

                           if (roomLeft < 3) {
                              toast.error("there's not enough room!");
                              return formations;
                           }
                           if (!formations.length) {
                              setSelectedFormation(formations.length);
                              return [
                                 ...formations,
                                 {
                                    durationSeconds: roomLeft > 15 ? 10 : roomLeft / 2,
                                    positions: [],
                                    transition: {
                                       durationSeconds: roomLeft > 15 ? 5 : roomLeft / 2,
                                    },
                                    name: `Untitled ${formations.length + 1}`,
                                 },
                              ];
                           } else {
                              setSelectedFormation(formations.length);
                              return [
                                 ...formations,
                                 {
                                    id: uuidv4(),
                                    ...formations[formations.length - 1],
                                    name: `Untitled ${formations.length + 1}`,
                                    transition: {
                                       durationSeconds: roomLeft > 15 ? 10 : roomLeft / 2,
                                    },
                                    durationSeconds: roomLeft > 15 ? 5 : roomLeft / 2,
                                 },
                              ];
                           }
                        });
                     }}
                     className=" rounded-md ml-auto  text-gray-500 px-3 py-1 mx-1 cursor-pointer outline "
                  >
                     + new formation
                  </button>
               </div>
            </div>
            <div className="overflow-x-scroll min-h-[120px] bg-white overscroll-contain  ">
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

function msToTime(duration) {
   var seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = hours < 10 ? "0" + hours : hours;
   minutes = minutes < 10 ? "0" + minutes : minutes;
   seconds = seconds < 10 ? "0" + seconds : seconds;

   return minutes + ":" + seconds;
}
