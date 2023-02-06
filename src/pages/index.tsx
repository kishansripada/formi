import Link from "next/link";
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { Stage, Grid, OrbitControls } from "@react-three/drei";
// import { ThreeDancer } from "../components/AppComponents/ThreeDancer";
// import { Canvas } from "@react-three/fiber";
// import Image from "next/image";
let dancers = [
   {
      name: "Michael Hunt",
      id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
      instagramUsername: null,
      color: "#f44336",
   },
   {
      name: "Joshua Kelly",
      id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
      instagramUsername: "",
      color: "#f44336",
   },
   {
      name: "Reece Elliott",
      id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
      instagramUsername: null,
      color: "#ffeb3b",
   },
   {
      name: "Owen Thompson",
      id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
      instagramUsername: "",
      color: "#ffeb3b",
   },
   {
      name: "Esteban Ramos ",
      id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
      instagramUsername: null,
      color: "#4caf50",
   },
   {
      name: "Billy Thornton",
      id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
      instagramUsername: null,
      color: "#4caf50",
   },
   {
      name: "Kaleb Roberts",
      id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
      instagramUsername: null,
      color: "#9c27b0",
   },
   {
      name: "Jack Saunders",
      id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
      instagramUsername: null,
      color: "#9c27b0",
   },
   {
      name: "N I H A R",
      id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
      instagramUsername: null,
      color: "#795548",
   },
   {
      name: "Molly Smith",
      id: "11fe9236-c506-491e-93db-3db88669e952",
      instagramUsername: "",
      color: "#795548",
   },
   {
      name: "Rosie Hart",
      id: "01978521-0017-424f-aab7-c6b9757ead94",
      instagramUsername: "",
      color: "#cddc39",
   },
   {
      name: "Alice Farley",
      id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
      instagramUsername: "",
      color: "#cddc39",
   },
];

let formations = [
   {
      durationSeconds: 15.32,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -5,
               y: -5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 18,
               y: -5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -2,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 18,
               y: -7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.5,
               y: -6.75,
            },
            controlPointEnd: {
               x: -0.47744360902255,
               y: 0.5996240601503761,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 2,
               y: 2,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -18,
               y: 3,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 5,
               y: 5,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -18,
               y: 1,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 18,
               y: -1,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 18,
               y: -3,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -18,
               y: 7,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -18,
               y: 5,
            },
         },
      ],
      transition: {
         durationSeconds: 3.98,
      },
      name: "ASAP DSB",
      id: "ce69d49e-efb6-4782-8e4b-426236737a28",
   },
   {
      id: "554881b7-cf39-43d6-840e-b4ca5fbb7706",
      durationSeconds: 0.03,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -5,
               y: -5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -3,
               y: -7,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -2,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -10,
               y: -7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.5,
               y: -6.75,
            },
            controlPointEnd: {
               x: -0.47744360902255,
               y: 0.5996240601503761,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 2,
               y: 2,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 7,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 5,
               y: 5,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -10,
               y: 7,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 10,
               y: -7,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 4,
               y: -7,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 10,
               y: 7,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 4,
               y: 7,
            },
         },
      ],
      transition: {
         durationSeconds: 3.98,
      },
      name: "Untitled 2",
   },
   {
      id: "7f61adfb-a82a-4fbf-a220-f0df33e67471",
      durationSeconds: 1.5,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -5,
               y: -5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -10,
               y: 2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -2,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -10,
               y: 5,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 2,
               y: 2,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 10,
               y: 2,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 5,
               y: 5,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 10,
               y: 5,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -10,
               y: -5,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -10,
               y: -2,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 10,
               y: -5,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 10,
               y: -2,
            },
         },
      ],
      transition: {
         durationSeconds: 3.79,
      },
      name: "Untitled 3",
   },
   {
      id: "9f949d9a-5620-4d39-824e-b14ed0572367",
      durationSeconds: 0.03,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -2,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -3,
               y: 1,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -1,
               y: 1,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -2,
               y: 2,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 2,
               y: 0,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 3,
               y: 1,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 1,
               y: 1,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 2,
               y: 2,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -2,
               y: -1,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -4,
               y: -1,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 2,
               y: -1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 4,
               y: -1,
            },
         },
      ],
      transition: {
         durationSeconds: 3.16,
      },
      name: "Untitled 4",
   },
   {
      id: "41341f32-a706-4c1c-8068-5f55555469cc",
      durationSeconds: 0.03,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -2,
               y: -2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -3,
               y: -1,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -1,
               y: -1,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -2,
               y: 0,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 2,
               y: -2,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 3,
               y: -1,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 1,
               y: -1,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 2,
               y: 0,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -7,
               y: -3,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -7,
               y: 3,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 7,
               y: -3,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 7,
               y: 3,
            },
         },
      ],
      transition: {
         durationSeconds: 2.9,
      },
      name: "Untitled 5",
   },
   {
      id: "f7839b4f-5545-4614-8520-8086f6a0e73f",
      durationSeconds: 0.06,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -2,
               y: -4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -3,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -1,
               y: -3,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -2,
               y: -2,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 2,
               y: -4,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 3,
               y: -3,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 1,
               y: -3,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 2,
               y: -2,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -4,
               y: -1,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -1,
               y: -1,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 4,
               y: -1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 1,
               y: -1,
            },
         },
      ],
      transition: {
         durationSeconds: 2.51,
      },
      name: "Untitled 6",
   },
   {
      id: "6b3ce453-e38e-472c-8756-90fe46e2a971",
      durationSeconds: 1.9,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -1,
               y: 5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -2,
               y: 6,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -1,
               y: 7,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -3,
               y: 7,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 1,
               y: 5,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 2,
               y: 6,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 1,
               y: 7,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 3,
               y: 7,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -4,
               y: 8,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -1,
               y: 8,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 4,
               y: 8,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 1,
               y: 8,
            },
         },
      ],
      transition: {
         durationSeconds: 3.59,
      },
      name: "Untitled 7",
   },
   {
      id: "6f6c18b2-e5c2-445b-bb75-2f2bc528c8f5",
      durationSeconds: 0.01,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -6,
               y: -5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -2,
               y: -5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -1,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -4,
               y: -2,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 6,
               y: -5,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 2,
               y: -5,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 1,
               y: -2,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 4,
               y: -2,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -6,
               y: 1,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -2,
               y: 1,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 6,
               y: 1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 2,
               y: 1,
            },
         },
      ],
      transition: {
         durationSeconds: 2.88,
      },
      name: "Untitled 8",
      notes: "",
   },
   {
      id: "f068f83c-bdf0-4489-9917-b0f3f446642d",
      durationSeconds: 0.66,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -10,
               y: 1,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -2,
               y: -5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -1,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -8,
               y: -2,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 10,
               y: 1,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 2,
               y: -5,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 1,
               y: -2,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 8,
               y: -2,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -6,
               y: 1,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -6,
               y: -5,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 6,
               y: 1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 6,
               y: -5,
            },
         },
      ],
      transition: {
         durationSeconds: 2.7,
      },
      name: "Untitled 9",
      notes: "",
   },
   {
      id: "4f3f6168-a529-4635-b56d-d5b18f4b6e46",
      durationSeconds: 0,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -8,
               y: 1,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 0,
               y: -4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 0,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -8,
               y: -2,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 8,
               y: 1,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 0,
               y: -5,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 0,
               y: -3,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 8,
               y: -2,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 0,
               y: 0,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -8,
               y: -5,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 0,
               y: -1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 8,
               y: -5,
            },
         },
      ],
      transition: {
         durationSeconds: 2.88,
      },
      name: "Untitled 10",
      notes: "",
   },
   {
      id: "a079ffd5-4546-4ac3-a7f8-6ac889ab518d",
      durationSeconds: 0,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -5,
               y: 1,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -1,
               y: -4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -1,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -8,
               y: -2,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 5,
               y: 1,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 1,
               y: -5,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 1,
               y: -3,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 8,
               y: -2,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -1,
               y: 0,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -10,
               y: -5,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 1,
               y: -1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 10,
               y: -5,
            },
         },
      ],
      transition: {
         durationSeconds: 1.02,
      },
      name: "Untitled 11",
      notes: "",
   },
   {
      id: "1cb58095-b9b4-40dc-b9a5-ca3efec8bb8c",
      durationSeconds: 0.03,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 3,
               y: 2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 6,
               y: -4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 6,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 0,
               y: 2,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 3,
               y: -7,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -6,
               y: -5,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -6,
               y: -3,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 0,
               y: -7,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 6,
               y: 0,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -3,
               y: 2,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -6,
               y: -1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -3,
               y: -7,
            },
         },
      ],
      transition: {
         durationSeconds: 2.71,
      },
      name: "Untitled 12",
      notes: "",
   },
   {
      id: "7af8f4f7-5a77-4fc9-b18c-4e35aa6137ec",
      durationSeconds: 4.29,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 5,
               y: 1,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 5,
               y: -1,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 3,
               y: 2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 3,
               y: -3,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -1,
               y: -4,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -1,
               y: 3,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -3,
               y: 2,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -3,
               y: -3,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 1,
               y: -4,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 1,
               y: 3,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -5,
               y: 1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -5,
               y: -1,
            },
         },
      ],
      transition: {
         durationSeconds: 2.81,
      },
      name: "Untitled 13",
      notes: "-this is the criss cross step \n-turn for each side? \n-stomp step with pause",
      comments: [
         {
            id: "7540e078-ea0a-444b-bb89-e4d45a5464ba",
            user: {
               name: "Ambika Rautray",
               avatar_url: "https://lh3.googleusercontent.com/a/AEdFTp73FaOhazjUx4Xc3NSazzAR7t5qJrBRzjtq8nfx7w=s96-c",
               id: "dd8c42d5-cb7a-4839-9ba2-659e12ed0672",
            },
            content: "refer",
            position: {
               x: 10.61,
               y: 3.06,
            },
         },
      ],
   },
   {
      id: "4c5c6f45-2b0c-43dc-a19e-f5091f0df1e0",
      durationSeconds: 0.05,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 4,
               y: -1,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 6,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 1,
               y: 2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 1,
               y: -3,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -3,
               y: -4,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 3,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -1,
               y: 2,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -1,
               y: -3,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 3,
               y: -4,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 3,
               y: 3,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -4,
               y: -1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -6,
               y: -3,
            },
         },
      ],
      transition: {
         durationSeconds: 3.04,
      },
      name: "Untitled 14",
      notes: "-right hand goes to left and use it to CHILL",
   },
   {
      id: "e9db78a8-83d6-46ac-9b85-bfe6dcbf85a6",
      durationSeconds: 3.06,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 1,
               y: -2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 4,
               y: -2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 1,
               y: 2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 2,
               y: 0,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -5,
               y: 0,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 2,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -1,
               y: 2,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -2,
               y: 0,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 5,
               y: 0,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 3,
               y: 2,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -1,
               y: -2,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -4,
               y: -2,
            },
         },
      ],
      transition: {
         durationSeconds: 2.61,
      },
      name: "Untitled 15",
      notes: "",
   },
   {
      id: "ddaf08a8-1d7f-4415-a287-f5f1dfebb99e",
      durationSeconds: 0.02,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 4,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 7,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 1,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 2,
               y: 0,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -5,
               y: 0,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 2,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -1,
               y: -2,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -2,
               y: 0,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 5,
               y: 0,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 3,
               y: 2,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -4,
               y: -3,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -7,
               y: -3,
            },
         },
      ],
      transition: {
         durationSeconds: 1.99,
      },
      name: "Untitled 16",
      notes: "",
   },
   {
      id: "d0782611-2bbd-4d03-a271-11bf9ca1cbfb",
      durationSeconds: 0.01,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 4,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 7,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 2,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 3,
               y: 0,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -5,
               y: 0,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 2,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 0,
               y: -2,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -1,
               y: 0,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 5,
               y: 0,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 3,
               y: 2,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -4,
               y: -3,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -7,
               y: -3,
            },
         },
      ],
      transition: {
         durationSeconds: 1.64,
      },
      name: "Untitled 17",
      notes: "",
   },
   {
      id: "01820fdb-7b5b-452e-b033-4e132191ac18",
      durationSeconds: 0.02,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 2,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 5,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 0,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 1,
               y: 0,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -5,
               y: 0,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 2,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -2,
               y: -2,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -3,
               y: 0,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 3,
               y: 0,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 1,
               y: 2,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -4,
               y: -3,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -7,
               y: -3,
            },
         },
      ],
      transition: {
         durationSeconds: 1.72,
      },
      name: "Untitled 18",
      notes: "-jumps for hoi ",
   },
   {
      id: "7944ac90-952a-44fd-b724-ab0894af367b",
      durationSeconds: 2.83,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 3,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 6,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 1,
               y: -2,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 2,
               y: 0,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -4,
               y: 0,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -2,
               y: 2,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -1,
               y: -2,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -2,
               y: 0,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 4,
               y: 0,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 2,
               y: 2,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -3,
               y: -3,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -6,
               y: -3,
            },
         },
      ],
      transition: {
         durationSeconds: 1.8,
      },
      name: "Untitled 19",
      notes: "-get lower for last jugni",
   },
   {
      id: "f7a65d6a-2b97-4961-9554-420d08713343",
      durationSeconds: 0.77,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 6,
               y: -2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 8,
               y: -2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 1,
               y: 0,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 3,
               y: 0,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -2,
               y: 2,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -4,
               y: 2,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -1,
               y: 0,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -3,
               y: 0,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 2,
               y: 2,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 4,
               y: 2,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -6,
               y: -2,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -8,
               y: -2,
            },
         },
      ],
      transition: {
         durationSeconds: 1.35,
      },
      name: "Untitled 20",
      notes: "",
   },
   {
      id: "e86ca19f-af8e-4f80-a5c5-bc11b4019e0c",
      durationSeconds: 0.07,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 5,
               y: 2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 5,
               y: -3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 0,
               y: -3,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 3,
               y: -1,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 0,
               y: 5,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 3,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 0,
               y: 0,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -3,
               y: -1,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 0,
               y: 2,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 3,
               y: 3,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -5,
               y: 5,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -5,
               y: 0,
            },
         },
      ],
      transition: {
         durationSeconds: 1.78,
      },
      name: "Untitled 21",
      notes: "",
   },
   {
      id: "25f567b7-6014-4306-befc-98207db0bee4",
      durationSeconds: 0.04,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 5,
               y: 3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 5,
               y: -2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 5,
               y: -5,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 3,
               y: -3,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 0,
               y: 0,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 1,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 0,
               y: -5,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -3,
               y: -3,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 5,
               y: 0,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 3,
               y: 1,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 0,
               y: 3,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 0,
               y: -2,
            },
         },
      ],
      transition: {
         durationSeconds: 1.04,
      },
      name: "Untitled 22",
      notes: "",
   },
   {
      id: "1f5edc23-c7fe-4507-b139-ea8e9e45f390",
      durationSeconds: 0.02,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 0,
               y: 4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 0,
               y: -2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 5,
               y: -6,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 3,
               y: -8,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -5,
               y: -1,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: -4,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -5,
               y: -6,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -3,
               y: -8,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 5,
               y: -1,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 3,
               y: -4,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 0,
               y: 1,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 0,
               y: -6,
            },
         },
      ],
      transition: {
         durationSeconds: 1.11,
      },
      name: "Untitled 23",
      notes: "",
   },
   {
      id: "5bf44f13-9269-4188-a48e-fece53cbd943",
      durationSeconds: 0.07,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -5,
               y: 3,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -4,
               y: -5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 3,
               y: -8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 7,
               y: -10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -10,
               y: -3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -8,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -3,
               y: -8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -7,
               y: -10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 9,
               y: -3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 7,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 5,
               y: 3,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 6,
               y: -5,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.1,
      },
      name: "Untitled 24",
      notes: "",
   },
   {
      id: "2134ed30-ed62-4ee3-b4b3-39394386e6f2",
      durationSeconds: 2.75,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -13,
               y: 4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -12,
               y: -11,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 7,
               y: -11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 3,
               y: -11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -13,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -13,
               y: -4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -7,
               y: -11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -3,
               y: -11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 13,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 13,
               y: -4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 13,
               y: 4,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 12,
               y: -11,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.27,
      },
      name: "Untitled 25",
      notes: "",
   },
   {
      id: "f3b8ea2c-dcae-42fd-8a51-95eeb7ada94e",
      durationSeconds: 1.62,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -6,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -2,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 13,
               y: -6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 8,
               y: -3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -13,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -9,
               y: 3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -13,
               y: -6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -9,
               y: -3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 5,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 2,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 13,
               y: 6,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 8,
               y: 3,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 2.3,
      },
      name: "Untitled 27",
      notes: "",
   },
   {
      id: "3b5048fe-ad74-4dad-b17b-b89d652804e9",
      durationSeconds: 0.8,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -3,
               y: 2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -3,
               y: -1,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 11,
               y: -6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 11,
               y: -3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -7,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -7,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -11,
               y: -3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -11,
               y: -6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 3,
               y: -1,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 3,
               y: 2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 7,
               y: 5,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 7,
               y: 8,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.67,
      },
      name: "Untitled 27",
      notes: "",
   },
   {
      id: "953d4e9b-5033-4426-aee1-ea2f46ab2293",
      durationSeconds: 0.6,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -3,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -1,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 12,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 10,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -8,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -6,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -12,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -10,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 3,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 1,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 8,
               y: 5,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 6,
               y: 5,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.04,
      },
      name: "Untitled 28",
      notes: "",
   },
   {
      id: "790fa598-a1f8-48d0-b700-b91e05d8d843",
      durationSeconds: 6.67,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -3,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
            controlPointStart: {
               x: -0.7690253671562087,
               y: -1.3521361815754334,
            },
            controlPointEnd: {
               x: -3.237316421895861,
               y: -1.3167393923605455,
            },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 3,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "cubic",
            controlPointStart: {
               x: -0.13719512195121952,
               y: -1.6249999999999996,
            },
            controlPointEnd: {
               x: 2.42378048780488,
               y: -1.0731707317073171,
            },
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 12,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 8,
               y: 5,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: 11.210614152202941,
               y: 0.3985981308411215,
            },
            controlPointEnd: {
               x: 10.282042723631509,
               y: 2.004606141522028,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -10,
               y: -5,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: -10.729973297730323,
               y: 1.107409879839787,
            },
            controlPointEnd: {
               x: -10.25,
               y: -0.05,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -6,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -12,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -8,
               y: 5,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: -7.237316421895855,
               y: -0.5908544726301737,
            },
            controlPointEnd: {
               x: -7.270026702269657,
               y: 1.7443925233644852,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -1,
               y: 0,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: 1.3658536585365848,
               y: 2.2621951219512195,
            },
            controlPointEnd: {
               x: -0.18902439024390275,
               y: 1.396341463414634,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 1,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2,
               y: 0.25,
            },
            controlPointEnd: {
               x: 2,
               y: -0.25,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 10,
               y: -5,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: 7.109145527369819,
               y: -0.05,
            },
            controlPointEnd: {
               x: 7.6865821094792945,
               y: -1.6482643524699598,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 6,
               y: 5,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.87,
      },
      name: "Untitled 29",
      notes: "jodi on left turns to face back",
   },
   {
      id: "66fd4049-607a-4fcc-aaca-8652316b3323",
      durationSeconds: 2.4,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -2,
               y: 5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -1,
               y: 6,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 1,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 3,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 0,
               y: 3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -2,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -1,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -3,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 2,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 1,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 0,
               y: 6,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 2,
               y: 6,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 5.47,
      },
      name: "Untitled 30",
      notes: "",
      comments: [],
   },
   {
      id: "317f0c3c-05b0-4298-99c7-e9f6fb1809df",
      durationSeconds: 0.93,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -1,
               y: 14,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -7,
               y: 14,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 5,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 11,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -3,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -9,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -5,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -11,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 1,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 7,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 3,
               y: 14,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 9,
               y: 14,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 3.53,
      },
      name: "Untitled 31",
      notes: "",
   },
   {
      id: "c0a914e8-ed90-4d7b-a2a9-65017e79cf9a",
      durationSeconds: 0.05,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -1,
               y: 5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -6,
               y: 6,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 5,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 11,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -3,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -9,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -5,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -11,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 1,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 6,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 3,
               y: 14,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 9,
               y: 14,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.69,
      },
      name: "Untitled 32",
      notes: "",
   },
   {
      id: "e86583d1-2217-4762-8826-181ed7bf9373",
      durationSeconds: 0.06,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -1,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -5,
               y: 4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 5,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 11,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -2,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -9,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -5,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -11,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 1,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 5,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 2,
               y: 8,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 8,
               y: 8,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.45,
      },
      name: "Untitled 33",
      notes: "",
   },
   {
      id: "228afcf6-920b-4e99-8e72-a47ecc4a74c3",
      durationSeconds: 0.01,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -1,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -5,
               y: 4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 9,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 11,
               y: 12,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -1,
               y: 2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -5,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -9,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -11,
               y: 12,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 1,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 5,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 1,
               y: 2,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 5,
               y: 6,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.59,
      },
      name: "Untitled 34",
      notes: "",
   },
   {
      id: "265c9d06-cbcf-4c2e-af9d-ccfb58614ded",
      durationSeconds: 0.83,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -1,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -5,
               y: 4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 9,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 9,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -1,
               y: 2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -5,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -9,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -9,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 1,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 5,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 1,
               y: 2,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 5,
               y: 6,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.18,
      },
      name: "Untitled 35",
      notes: "",
   },
   {
      id: "a1f47f6f-d239-4440-8531-f8efbcf1a2f0",
      durationSeconds: 1.54,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -5,
               y: 4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -7,
               y: 6,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 9,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 11,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -1,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -9,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -11,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 5,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 7,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 1,
               y: 0,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 3,
               y: 2,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 3.73,
      },
      name: "Untitled 36",
      notes: "",
   },
   {
      id: "952683e5-bc4e-45ea-9506-ec08a66876ba",
      durationSeconds: 4.39,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -14,
               y: 4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -1,
               y: 6,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
            controlPointStart: {
               x: -4,
               y: 6.25,
            },
            controlPointEnd: {
               x: -4,
               y: 5.75,
            },
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 3,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 5,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -10,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -12,
               y: 2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -3,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -5,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 14,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 1,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.716463414634134,
               y: 5.3810975609756015,
            },
            controlPointEnd: {
               x: 6.6981707317073225,
               y: 2.1371951219512124,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 10,
               y: 0,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 12,
               y: 2,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 3.37,
      },
      name: "Untitled 37",
      notes: "people coming in face in \npeople going out face front",
   },
   {
      id: "39b4d309-c4fc-4ba8-9212-6c300931bac7",
      durationSeconds: 0,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -6,
               y: 5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -6,
               y: 9,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
            controlPointStart: {
               x: -4.041666666666667,
               y: 3.3536585365853617,
            },
            controlPointEnd: {
               x: -8.897357723577233,
               y: 4.8902439024390185,
            },
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 6,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 6,
               y: 9,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -14,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -14,
               y: 9,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -10,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -10,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 10,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 10.887195121951244,
               y: 1.8119918699186945,
            },
            controlPointEnd: {
               x: 9.76219512195126,
               y: 4.980691056910567,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 10,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 6.357469512195126,
               y: 2.509146341463423,
            },
            controlPointEnd: {
               x: 5.791920731707317,
               y: 2.2591463414634108,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 14,
               y: 5,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 14,
               y: 9,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 2.48,
      },
      name: "Untitled 38",
      notes: "people coming in face in \npeople going out face front",
   },
   {
      id: "5e2b7e0d-a4a4-4a2c-bddd-e7e0c58836b5",
      durationSeconds: 0.93,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -10,
               y: 7,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -10,
               y: 9,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 10,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 10,
               y: 9,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.540650406504058,
               y: 5.286585365853654,
            },
            controlPointEnd: {
               x: 8.916666666666666,
               y: 5.25,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -12,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -12,
               y: 9,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -14,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -10,
               y: 11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -9.083333333333334,
               y: 5.25,
            },
            controlPointEnd: {
               x: -9.053861788617883,
               y: 8.945121951219498,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 14,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 10,
               y: 11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 12,
               y: 7,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 12,
               y: 9,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.54,
      },
      name: "Untitled 39",
      notes: "people coming in face in \npeople going out face front",
      comments: [
         {
            id: "934f58fe-a931-4c42-ad2f-31b9df260f80",
            user: {
               name: "Ambika Rautray",
               avatar_url: "https://lh3.googleusercontent.com/a/AEdFTp73FaOhazjUx4Xc3NSazzAR7t5qJrBRzjtq8nfx7w=s96-c",
               id: "dd8c42d5-cb7a-4839-9ba2-659e12ed0672",
            },
            content: "hi",
            position: {
               x: 15.5,
               y: 4.98,
            },
         },
      ],
   },
   {
      id: "55504615-66ce-4755-b8d6-ff4f193e8150",
      durationSeconds: 0,
      positions: [
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -8,
               y: 9,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -11,
               y: 8,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 8,
               y: 9,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 11,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -13,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -10,
               y: 11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -15,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -12,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 15,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 12,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 13,
               y: 6,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 10,
               y: 11,
            },
            transitionType: "linear",
         },
      ],
      transition: {
         durationSeconds: 1.13,
      },
      name: "Untitled 40",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "48a3de85-3a78-406c-bf1a-3a62939c3293",
      durationSeconds: 0,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 10,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 10,
               y: 9,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 14,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 10,
               y: 11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 12,
               y: 7,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 12,
               y: 9,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -10,
               y: 7,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -10,
               y: 9,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -12,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -12,
               y: 9,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -14,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -10,
               y: 11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
      ],
      transition: {
         durationSeconds: 1.33,
      },
      name: "Untitled 41",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "5ce706ba-f37f-4379-aa41-0a775c6aabfa",
      durationSeconds: 1.27,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 11,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 11,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 15,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 11,
               y: 12,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 13,
               y: 8,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 13,
               y: 10,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -11,
               y: 8,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -11,
               y: 10,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -13,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -13,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -15,
               y: 8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -11,
               y: 12,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
      ],
      transition: {
         durationSeconds: 1.21,
      },
      name: "Untitled 42",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "bf8b95d2-c2de-4eb5-a669-f777666eef63",
      durationSeconds: 0,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 4,
               y: -1,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -1,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 6,
               y: -1,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 4,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 4,
               y: 1,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 2,
               y: 2,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -2,
               y: 4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -1,
               y: 5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -4,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -2,
               y: 6,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -6,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -4,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
      ],
      transition: {
         durationSeconds: 1.2,
      },
      name: "Untitled 43",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "f364bb71-3b5a-46bd-92ce-e3c9d28fdc67",
      durationSeconds: 2.18,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -2,
               y: -8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -7,
               y: -7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 0,
               y: -8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -3,
               y: -3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -2,
               y: -6,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -5,
               y: -5,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -10,
               y: -2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "cubic",
            controlPointStart: {
               x: -4.4405487804878,
               y: 0.28150406504065045,
            },
            controlPointEnd: {
               x: -7.376524390243862,
               y: -3.129065040650415,
            },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -9,
               y: -6,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "cubic",
            controlPointStart: {
               x: -3.330030487804875,
               y: -0.4096452328159645,
            },
            controlPointEnd: {
               x: -4.52057926829268,
               y: -1.8251108647450107,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -8,
               y: -2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -7,
               y: -4,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: -3.3140243902439,
               y: 0.8048780487804877,
            },
            controlPointEnd: {
               x: -3.582317073170727,
               y: -0.22256097560975646,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -10,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -5,
               y: -2,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: -2.25,
               y: 2.5277777777777777,
            },
            controlPointEnd: {
               x: -2.725609756097556,
               y: 2.2435636856368557,
            },
         },
      ],
      transition: {
         durationSeconds: 1.47,
      },
      name: "Untitled 44",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "a6e16d02-ce46-4409-9ecd-b60ba5848621",
      durationSeconds: 0,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -5,
               y: -7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -3,
               y: -3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -3,
               y: -7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 1,
               y: 1,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -5,
               y: -5,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -1,
               y: -1,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -9,
               y: -4,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -5,
               y: -2,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -7,
               y: -4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -3,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -9,
               y: -2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -1,
               y: 2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
      ],
      transition: {
         durationSeconds: 1.48,
      },
      name: "Untitled 45",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "244459bc-23c7-434f-ba51-26157e7c472c",
      durationSeconds: 3.24,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: -9,
               y: -10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -5,
               y: -12,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: -11,
               y: -12,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -3,
               y: -12,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -7,
               y: -8,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -5,
               y: -10,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: -11,
               y: -9,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: -13,
               y: -5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -9,
               y: -7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -11,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: -13,
               y: -11,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -13,
               y: -3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
      ],
      transition: {
         durationSeconds: 1.29,
      },
      name: "Untitled 46",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "02896046-6d40-460d-aee0-478360a325d7",
      durationSeconds: 0.06,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 9,
               y: -10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 1.0203604806408555,
               y: -4.160213618157541,
            },
            controlPointEnd: {
               x: 2.1545393858477953,
               y: -11.658210947930566,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 12,
               y: -10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 9,
               y: -13,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 13,
               y: -8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.946929238985321,
               y: -0.07076101468624638,
            },
            controlPointEnd: {
               x: 1.8528037383177565,
               y: 4.89586114819758,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 9,
               y: -7,
            },
            transitionType: "linear",
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 11,
               y: -8,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 6,
               y: -10,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 3,
               y: -10,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 6,
               y: -7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.1999332443257678,
               y: -2.128170894526035,
            },
            controlPointEnd: {
               x: -3.8080774365821077,
               y: 1.5246995994659556,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 4,
               y: -8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 6,
               y: -13,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -0.039719626168222825,
               y: -6.2309746328437905,
            },
            controlPointEnd: {
               x: -3.8721628838451347,
               y: -4.46862483311079,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 2,
               y: -8,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.426908752327744,
               y: -11.11033519553072,
            },
            controlPointEnd: {
               x: -0.165270018621975,
               y: 5.082402234636871,
            },
         },
      ],
      transition: {
         durationSeconds: 5.54,
      },
      name: "Untitled 48",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "800ecef5-62eb-43c6-8906-d0168de867c7",
      durationSeconds: 1.32,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 11,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 9.378205128205133,
               y: 1.4527972027972034,
            },
            controlPointEnd: {
               x: 3.737179487179514,
               y: 5.31643356643356,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: 15,
               y: 10,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 8.344793057409856,
               y: -4.93591455273699,
            },
            controlPointEnd: {
               x: 3.615153538050731,
               y: -5.448598130841119,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 15,
               y: -12,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 13,
               y: -14,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: 17.519230769230784,
               y: -11,
            },
            controlPointEnd: {
               x: 16.326923076923073,
               y: -12.807692307692301,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: 15,
               y: 12,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: 15.208333333333325,
               y: 0.7036199095022617,
            },
            controlPointEnd: {
               x: 14.6378205128205,
               y: 3.1425339366515823,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 13,
               y: 14,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 11,
               y: -14,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 15,
               y: -10,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: 15,
               y: 8,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: 14.339743589743577,
               y: -6.196153846153841,
            },
            controlPointEnd: {
               x: 16.04487179487179,
               y: -2.3807692307692303,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 9,
               y: 14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 15,
               y: -8,
            },
            transitionType: "cubic",
            controlPointStart: {
               x: 11.869658119658117,
               y: -11.973076923076917,
            },
            controlPointEnd: {
               x: 12.89957264957264,
               y: -10.603846153846154,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 9,
               y: -14,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
      ],
      transition: {
         durationSeconds: 3.47,
      },
      name: "Untitled 49",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "435d197a-f4e3-435d-8bfb-40cecbacd026",
      durationSeconds: 4.79,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 0,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 11.839743589743586,
               y: 10.375874125874105,
            },
            controlPointEnd: {
               x: 0.31410256410256465,
               y: -9.068181818181838,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -7.5,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 12.002747252747254,
               y: 10.85817307692308,
            },
            controlPointEnd: {
               x: -10.310439560439535,
               y: 0.9110576923076973,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 7.5,
               y: -4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 5,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 17.519230769230784,
               y: -11,
            },
            controlPointEnd: {
               x: 16.326923076923073,
               y: -12.807692307692301,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -7.5,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 15.208333333333325,
               y: 0.7036199095022617,
            },
            controlPointEnd: {
               x: 14.6378205128205,
               y: 3.1425339366515823,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 5,
               y: -5,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 0,
               y: 5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
            controlPointStart: {
               x: 12.519230769230772,
               y: -10.903846153846157,
            },
            controlPointEnd: {
               x: 0.9423076923077012,
               y: 7.173076923076916,
            },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 7.5,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
            controlPointStart: {
               x: 11.980769230769235,
               y: -11.442307692307693,
            },
            controlPointEnd: {
               x: 4.288461538461553,
               y: -1.8653846153846252,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -7.5,
               y: -4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 13.608974358974349,
               y: -0.5038461538461537,
            },
            controlPointEnd: {
               x: 13.929487179487179,
               y: 0.31153846153846154,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: -5,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 7.5,
               y: 4,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 7.369658119658132,
               y: -8.665384615384621,
            },
            controlPointEnd: {
               x: 8.822649572649578,
               y: -8.142307692307702,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: -5,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
      ],
      transition: {
         durationSeconds: 11.14,
      },
      name: "Untitled 50",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "4a8a4c49-4709-45f4-8de2-ee625c42209c",
      durationSeconds: 2.33,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 0,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 11.839743589743586,
               y: 10.375874125874105,
            },
            controlPointEnd: {
               x: 0.31410256410256465,
               y: -9.068181818181838,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -7.5,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 12.002747252747254,
               y: 10.85817307692308,
            },
            controlPointEnd: {
               x: -10.310439560439535,
               y: 0.9110576923076973,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 10,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: 0,
               y: 7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 17.519230769230784,
               y: -11,
            },
            controlPointEnd: {
               x: 16.326923076923073,
               y: -12.807692307692301,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -10,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 15.208333333333325,
               y: 0.7036199095022617,
            },
            controlPointEnd: {
               x: 14.6378205128205,
               y: 3.1425339366515823,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: 0,
               y: -3,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 0,
               y: 5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
            controlPointStart: {
               x: 12.519230769230772,
               y: -10.903846153846157,
            },
            controlPointEnd: {
               x: 0.9423076923077012,
               y: 7.173076923076916,
            },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 7.5,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
            controlPointStart: {
               x: 11.980769230769235,
               y: -11.442307692307693,
            },
            controlPointEnd: {
               x: 4.288461538461553,
               y: -1.8653846153846252,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -5,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 13.608974358974349,
               y: -0.5038461538461537,
            },
            controlPointEnd: {
               x: 13.929487179487179,
               y: 0.31153846153846154,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 0,
               y: -7,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 5,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 7.369658119658132,
               y: -8.665384615384621,
            },
            controlPointEnd: {
               x: 8.822649572649578,
               y: -8.142307692307702,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 0,
               y: 3,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
      ],
      transition: {
         durationSeconds: 1.07,
      },
      name: "Untitled 51",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
   {
      id: "0e4b291e-b943-4010-ad40-c756d4caca72",
      durationSeconds: 11.06,
      positions: [
         {
            id: "dc1d97c5-509d-4188-9c6c-23cbf49551c2",
            position: {
               x: 0,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 11.839743589743586,
               y: 10.375874125874105,
            },
            controlPointEnd: {
               x: 0.31410256410256465,
               y: -9.068181818181838,
            },
         },
         {
            id: "17d60e75-f096-4d16-820b-d60b3d483f8a",
            position: {
               x: -7.5,
               y: 0,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 12.002747252747254,
               y: 10.85817307692308,
            },
            controlPointEnd: {
               x: -10.310439560439535,
               y: 0.9110576923076973,
            },
         },
         {
            id: "71234b06-db99-477f-9d89-c8b65d4e39bd",
            position: {
               x: 7.5,
               y: 2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 2.237983978638185,
               y: -5.248331108144193,
            },
            controlPointEnd: {
               x: 0.776702269692931,
               y: 2.1214953271027994,
            },
         },
         {
            id: "11fe9236-c506-491e-93db-3db88669e952",
            position: {
               x: -2,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 17.519230769230784,
               y: -11,
            },
            controlPointEnd: {
               x: 16.326923076923073,
               y: -12.807692307692301,
            },
         },
         {
            id: "01978521-0017-424f-aab7-c6b9757ead94",
            position: {
               x: -7.5,
               y: -2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 15.208333333333325,
               y: 0.7036199095022617,
            },
            controlPointEnd: {
               x: 14.6378205128205,
               y: 3.1425339366515823,
            },
         },
         {
            id: "54c9cee6-91ec-412d-8404-b5815cbc63fd",
            position: {
               x: -2,
               y: -5,
            },
            transitionType: "linear",
         },
         {
            id: "267a3dd5-8016-4b5b-85ef-30c1addca819",
            position: {
               x: 0,
               y: 5,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
            controlPointStart: {
               x: 12.519230769230772,
               y: -10.903846153846157,
            },
            controlPointEnd: {
               x: 0.9423076923077012,
               y: 7.173076923076916,
            },
         },
         {
            id: "14aa03bd-df0d-42dc-9b91-7899ef60e2de",
            position: {
               x: 7.5,
               y: 0,
            },
            exitStrategy: "closest",
            enterStrategy: "closest",
            transitionType: "linear",
            controlPointStart: {
               x: 11.980769230769235,
               y: -11.442307692307693,
            },
            controlPointEnd: {
               x: 4.288461538461553,
               y: -1.8653846153846252,
            },
         },
         {
            id: "98dc05a0-95e8-4c4e-bfc7-59ab75fbdd95",
            position: {
               x: -7.5,
               y: 2,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 13.608974358974349,
               y: -0.5038461538461537,
            },
            controlPointEnd: {
               x: 13.929487179487179,
               y: 0.31153846153846154,
            },
         },
         {
            id: "65d610b9-2845-474e-a0be-2e60c6cef6ab",
            position: {
               x: 2,
               y: -5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -4.608477970627511,
               y: -4.492656875834447,
            },
            controlPointEnd: {
               x: -7.858399650978203,
               y: -1.0000000000000056,
            },
         },
         {
            id: "24c0e859-52b0-49cf-b2b8-5854d6be507f",
            position: {
               x: 7.5,
               y: -2.5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: 7.369658119658132,
               y: -8.665384615384621,
            },
            controlPointEnd: {
               x: 8.822649572649578,
               y: -8.142307692307702,
            },
         },
         {
            id: "e15e2a11-3d0b-4b2c-b4f0-9a6daf5f86aa",
            position: {
               x: 2,
               y: 5,
            },
            transitionType: "linear",
            controlPointStart: {
               x: -7.332109479305741,
               y: -5.672897196261686,
            },
            controlPointEnd: {
               x: -5.492990654205619,
               y: -13.074766355140216,
            },
         },
      ],
      transition: {
         durationSeconds: 1.07,
      },
      name: "Untitled 51",
      notes: "people coming in face in \npeople going out face front",
      comments: [],
   },
];
const home = () => {
   const videoRef = useRef();
   let router = useRouter();

   const [position, setPosition] = useState(0);
   useEffect(() => {
      const intervalId = setInterval(() => {
         setPosition((position) => position + 0.06);
      }, 16);

      return () => clearInterval(intervalId);
   }, []);
   let { currentFormationIndex, percentThroughTransition } = whereInFormation(formations, position);

   return (
      <>
         <style jsx>{`
            @keyframes sidetoside {
               0% {
                  left: 0%;
               }
               50% {
                  left: 100%;
               }
               100% {
                  left: 0%;
               }
            }

            @keyframes upanddown {
               0% {
                  top: -100px;
               }
               50% {
                  top: 100px;
               }
               100% {
                  top: -100px;
               }
            }
         `}</style>
         <Head>
            <title>FORMI: Online stage performance planning software.</title>
            <meta
               name="description"
               content="Easily build, create and visualize your dance and cheer formations synced to music. Formi is the ultimate choreographer formation tool. Dance formation builder. Cheer formation builder."
            />
            <meta name="keywords" content="dance, choreography, desi, formations, cheer, cheerleading, formation building tool" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="FORMI: Online stage performance planning software." />
            <meta name="twitter:image" content="https://i.imgur.com/83VsfSG.png" />
            <meta property="og:type" content="song" />
            <meta property="og:title" content="FORMI: Online stage performance planning software." />
            <meta
               property="og:description"
               content="Easily build, create and visualize your dance and cheer formations synced to music. Formi is the ultimate choreographer formation tool."
            />
            <meta property="og:image" content="https://i.imgur.com/83VsfSG.png" />

            <meta property="og:site_name" content="FORMI: Online stage performance planning software." />
         </Head>
         {/* {router.query.ref === "naach" ? (
            <>
               <div className="fixed top-0 left-0 z-[100] flex h-screen w-screen items-center justify-center font-proxima ">
                  <div className="flex  w-[700px] flex-col rounded-xl bg-white border border-black">
                     <div className="flex flex-col rounded-xl px-10 py-10 h-full text-center">
                        <div className="flex flex-col mt-auto text-5xl">naach is now FORMI!</div>
                     </div>
                  </div>
               </div>
            </>
         ) : (
            <></>
         )} */}
         <div className="sticky top-0 z-50 ">
            <nav className="flex flex-row py-3 lg:justify-between text-black items-center justify-center px-[10%]  bg-[#fafafa]  ">
               <div className="flex flex-row items-center">
                  <div className="w-[150px]">
                     {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
                     <h1 className="text-4xl font-bold z-10 relative">FORMI</h1>

                     <div className="bg-pink-600 relative h-2 opacity-40 top-[-10px] mr-auto w-[100%]"></div>
                  </div>
                  <div className="flex flex-row items-center ml-9 ">
                     <Link href={"/login"} className="z-50">
                        <button className="text-gray-500 hover:text-black text-medium">Pricing</button>
                     </Link>
                     <Link href={"/login"} className=" ">
                        <button className="text-gray-500 hover:text-black text-medium ml-7">Features</button>
                     </Link>
                  </div>
               </div>

               {/* <div>
                     <h1 className="text-7xl font-bold z-10 relative">n</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-full"></div>
                  </div> */}
               <div className="flex flex-row items-center justify-center">
                  {/* <Link href={"/upgrade"} className="z-50">
                        <button className=" border-pink-600 border-2 mr-3 px-4 py-1 hidden lg:block  rounded-md ">pricing</button>
                     </Link> */}

                  <Link href={"/login"} className="z-50">
                     <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white  px-4 py-2 hidden lg:block  rounded-full">
                        Get Started
                     </button>
                  </Link>
               </div>
            </nav>
            <hr></hr>
         </div>

         <div className="bg-[#fafafa] overflow-hidden ">
            <div className="overflow-hidden">
               <div className=" flex flex-row items-center justify-center w-full  text-center pt-12 px-[10%] lg:px-[20%] bg-[#fafafa]  ">
                  <div className="w-full  ">
                     <h1 className=" text-4xl lg:text-6xl  leading-10  font-bold text-gray-900 ">
                        Create stunning performances that impress your audience.
                        {/* Visualize your stage formations <span className="italic">before</span> performing */}
                     </h1>
                     <h1 className="font-bold  text-2xl text-gray-600  mt-4 ">Three dimensional. Synced to music.</h1>
                     {/* <p className="text-gray-500  mt-5">Plan out your dance and cheer formations, visualizing the transitions synced to music.</p> */}

                     <Link href={"/207/edit"} className="">
                        <button className=" bg-gradient-to-r from-purple-500 to-pink-500 flex-row items-center   text-white px-4 py-2  mx-auto hidden lg:flex rounded-full mt-8 text-xl group">
                           <span className="mr-2  ">View Demo</span>
                           <span className="relative left-0 group-hover:left-3 transition-all duration-300">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor"
                                 className="w-6 h-6"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                              </svg>
                           </span>
                        </button>
                     </Link>
                  </div>
               </div>

               <div className=" mt-12 relative">
                  <img
                     className=" max-w-[1000px]  w-full mx-auto relative -bottom-11 rounded-xl border border-gray-200 shadow-xl z-10"
                     src="/threePreview.png"
                  ></img>

                  <div
                     className="pointer-events-none absolute  h-[2000px] overflow-hidden w-[2000px]  "
                     style={{
                        backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #db2777 0%, rgba(239, 255, 250, 0) 100%)",
                        top: -200,
                        left: "50%",
                        transform: "translate(-50%, 0)",
                        opacity: 0.8,
                     }}
                  ></div>
               </div>
            </div>

            <div className=" bg-white  font-proxima overflow-hidden relative ">
               <div className="absolute top-12 w-full px-4 -translate-x-1/2 left-1/2">
                  {/* <p className="font-bold w-full text-3xl">Bring your dancers to life.</p> */}
               </div>
               {/* <div
                  className="pointer-events-none absolute  h-[2000px]  w-[2000px]  "
                  style={{
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #0284c7 0%, rgba(239, 255, 250, 0) 100%)",
                     // top: -200,
                     left: -1000,

                     opacity: 0.2,
                  }}
               ></div>
               <div
                  className="pointer-events-none absolute  h-[2000px]  w-[2000px]  "
                  style={{
                     backgroundImage: "radial-gradient(37.66% 48.2% at 47.64% 52.94%, #10b981 0%, rgba(239, 255, 250, 0) 100%)",
                     // top: -200,
                     right: -1000,

                     opacity: 0.2,
                  }}
               ></div> */}

               <video className="rounded-xl w-full mx-auto max-w-[1000px] my-5 border border-gray-300" autoPlay muted loop src="/threeD.mp4"></video>
               {/* <Canvas
                  className="h-[700px] relative bottom-0 w-full "
                  gl={{ logarithmicDepthBuffer: true }}
                  camera={{ position: [15, 15, 15], fov: 40 }}
               >
                 
                  <Stage
                     position={[10, 0, 0]}
                    
                     environment="apartment"
                   
                     adjustCamera={false}
                  ></Stage>
                  <Grid
                     renderOrder={-1}
                     position={[0, 0, 0]}
                     args={[40 / 2, 30 / 2]}
                     cellSize={0.5}
                     cellThickness={0.5}
                     sectionSize={2.5}
                     sectionThickness={1.5}
                     sectionColor={[0.5, 0.5, 10]}
                    
                  />

                  {formations[0].positions.map((dancerPosition) => {
                     return (
                        <ThreeDancer
                           isPlaying={true}
                           currentFormationIndex={currentFormationIndex}
                           percentThroughTransition={percentThroughTransition}
                           dancers={dancers}
                           position={position}
                           dancerPosition={dancerPosition}
                           formations={formations}
                        ></ThreeDancer>
                     );
                  })}

                  <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
                  
               </Canvas> */}
            </div>
            <hr />
            <div className="bg-white  font-proxima">
               <div className="flex lg:flex-row flex-col items-center mx-auto max-w-[1000px] py-8 w-full ">
                  <div className="lg:w-1/2 w-[90%]">
                     <p className="text-3xl font-bold">Collaborate, communicate</p>
                     <p className="text-lg mt-6 lg:w-[80%] text-gray-500">
                        Directly add comments and annotations on the stage, making collaboration among team members easier and more efficient. Make
                        FORMI a central platform for discussion and feedback, streamlining the choreography process.
                     </p>
                  </div>

                  <div className="lg:w-1/2 w-[90%]">
                     <video
                        autoPlay
                        muted
                        src="/commentdemo.mp4"
                        loop
                        className=" lg:ml-auto lg:w-[90%] border border-gray-200 rounded-xl relative"
                     />
                  </div>
               </div>
            </div>

            <div className="bg-white  font-proxima">
               <div className="flex lg:flex-row flex-col-reverse items-center mx-auto max-w-[1000px] py-8 w-full ">
                  <div className="lg:w-1/2 w-[90%]">
                     <video autoPlay muted src="/curveDemo.mp4" loop className=" lg:mr-auto lg:w-[90%] border border-gray-200 rounded-xl relative" />
                  </div>
                  <div className="lg:w-1/2 w-[90%] ">
                     <div className="lg:w-[90%] mx-auto">
                        <p className="text-3xl font-bold">Complex dancer paths</p>
                        <p className="text-lg mt-6  text-gray-500">
                           Our non-linear path feature lets you plan complex formations with ease, making your choreography process smoother and more
                           efficient. Say goodbye to old-fashioned, complicated methods and hello to modern, streamlined choreography.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* FOOTER */}
            <div className="bg-[#fafafa]  pt-6 pb-6 px-12 ">
               <div className="w-[150px]">
                  {/* <h1 className="text-6xl font-bold z-10 relative">naach.app</h1>
                     <div className="bg-pink-600 relative h-3 opacity-40 top-[-15px] mr-auto w-[58%]"></div> */}
                  <h1 className="text-4xl font-bold z-10 relative">FORMI</h1>

                  <div className="bg-pink-600 relative h-2 opacity-40 top-[-10px] mr-auto w-[100%]"></div>
               </div>
               <p className="text-sm text-gray-500">© 2023 The Sripada Company, LLC. All Rights Reserved</p>
               <p className="text-gray-400 max-w-[300px] text-sm mt-2">
                  All trademarks, logos, and brand names are the property of their respective owners.
               </p>
               <div className=" flex flex-row bg-[#fafafa] mt-12 ">
                  <svg className="ml-auto opacity-40" fill="none" xmlns="http://www.w3.org/2000/svg" width={200} viewBox="0 0 1004 135">
                     <path
                        d="M13.5643 134.909c-2.4886 0-4.6661-.207-6.53252-.621-1.86642-.345-3.31808-.69-4.35499-1.035-.96777-.344-1.45166-.517-1.45166-.517l-.311067-.724c.138257-.759.276507-2 .414757-3.725.20738-1.793.3802-3.656.51845-5.587.20738-1.931.31107-3.449.31107-4.552l3.62916-.518c0 4.553.76039 7.76 2.28118 9.623 1.52079 1.862 4.11302 2.793 7.77672 2.793 2.6269 0 4.8389-.586 6.6362-1.759 1.7973-1.172 2.6959-2.621 2.6959-4.345 0-1.173-.3456-2.242-1.0369-3.208-.6912-.965-1.9009-2.035-3.6291-3.207-1.7282-1.173-4.1822-2.587-7.362-4.242-3.94023-2-6.80899-4.035-8.60628-6.104-1.7973-2.07-2.69595-4.346-2.69595-6.829 0-2.8281.82952-5.3457 2.48857-7.5529 1.65904-2.2073 3.94022-3.9317 6.84356-5.1732 2.9033-1.3106 6.1523-1.9658 9.7469-1.9658 2.8341 0 5.2536.2759 7.2583.8277l3.1107.8277.2073.5173s-.1382.5863-.4147 1.7589c-.2074 1.1726-.4839 2.7245-.8295 4.6559-.2765 1.8623-.5185 3.9316-.7259 6.2074l-3.8365.311s.0346-.38.1037-1.1383c.0691-.7588.1037-1.3795.1037-1.8624 0-2.4831-.6913-4.2765-2.0738-5.3801-1.3134-1.1726-3.4564-1.7589-6.4288-1.7589-2.3503 0-4.355.5518-6.014 1.6554-1.58995 1.1037-2.38491 2.4487-2.38491 4.0351 0 1.6555.69127 3.2074 2.07381 4.6562 1.4517 1.448 3.7674 3 6.9472 4.656 3.7329 1.931 6.6362 3.69 8.71 5.276 2.1429 1.518 3.6292 3.001 4.4587 4.449.8986 1.449 1.3479 3.035 1.3479 4.76 0 2.621-.8986 5.069-2.6959 7.345-1.7282 2.277-4.0439 4.104-6.9472 5.484-2.8342 1.311-5.9449 1.966-9.3321 1.966ZM85.1461 129.943c2.0738-.207 3.4563-.863 4.1476-1.966.6912-1.173 1.0369-3.38 1.0369-6.622V98.593c0-2.2762-.3111-3.8971-.9332-4.8628-.6222-.9656-1.6245-1.4485-3.007-1.4485-.5531 0-1.0715.069-1.5554.207-.4148.0689-.6221.1034-.6221.1034l-.5185-.7242.3111-3.2074c2.1429-.4138 4.2858-.8622 6.4288-1.345 2.1429-.4828 3.9402-.8967 5.3919-1.2416 1.4516-.3449 2.1774-.5173 2.1774-.5173l.7259.6208-.3111 1.6554c-.1382 1.1036-.2765 2.4831-.4148 4.1386-.1382 1.5864-.2073 3.2073-.2073 4.8627l.4147.3104c2.143-3.2418 4.597-5.8974 7.362-7.9667 2.765-2.0692 5.185-3.1039 7.258-3.1039 1.175 0 2.005.069 2.489.2069l.726.207.311.4138s-.069.4829-.208 1.4485c-.138.8967-.311 2.1038-.518 3.6213-.207 1.4484-.415 3.0349-.622 4.7593-.138 1.7244-.242 3.3803-.311 4.9663l-4.044.31c0-2.8277-.173-4.69-.519-5.5867-.345-.9657-1.106-1.4485-2.281-1.4485-1.521 0-3.145.6208-4.873 1.8623-1.728 1.2416-3.3183 2.966-4.77 5.1729 0 0-.0345.656-.1037 1.966-.0691 1.242-.1382 2.828-.2073 4.759-.0692 1.932-.1383 3.932-.2074 6.001-.0692 2.001-.1383 3.794-.2074 5.381-.0691 1.517-.1037 2.517-.1037 3 0 2.345.3456 3.932 1.0369 4.759.6913.828 2.0046 1.242 3.9406 1.242.76 0 1.693-.035 2.799-.104 1.175-.069 1.763-.103 1.763-.103l.104.414-.934 4.552s-.345-.034-1.036-.103h-2.696c-1.106 0-2.282-.035-3.5258-.104h-3.3181c-2.0047 0-3.8366.035-5.4956.104-1.659.069-2.9724.138-3.9402.207-.9678.069-1.4517.103-1.4517.103l.5185-4.138ZM164.761 134.909l.414-4.242c2.074-.552 3.56-1.345 4.459-2.38.899-1.103 1.348-2.552 1.348-4.345V97.6619c0-1.9314-.311-3.3454-.933-4.2421-.622-.8966-1.59-1.345-2.904-1.345-.553 0-1.14.069-1.762.2069-.553.138-.83.207-.83.207l.415-3.8282c1.728-.2759 3.456-.5863 5.184-.9312 1.798-.3448 3.422-.6552 4.874-.9311 1.452-.3449 2.627-.6208 3.525-.8277.899-.207 1.348-.3104 1.348-.3104l.519 1.2415c-.277.6898-.588 2.2417-.933 4.6559-.277 2.3452-.519 5.2422-.726 8.6905-.208 3.38-.38 7.105-.519 11.175-.138 4-.207 8.035-.207 12.105 0 2 .276 3.483.829 4.449.553.896 1.487 1.345 2.8 1.345.622 0 1.383-.035 2.281-.104.899-.069 1.348-.103 1.348-.103l.208.414-.83 4.449s-.311-.035-.933-.104c-.553 0-1.314-.034-2.281-.103-.899 0-1.901-.035-3.007-.104h-3.007c-1.452 0-3.007.104-4.666.311-1.659.207-3.077.414-4.252.62-1.175.207-1.762.311-1.762.311Zm9.124-61.4577c-1.728 0-3.007-.5518-3.836-1.6554-.83-1.1036-1.244-2.3107-1.244-3.6212 0-1.6554.587-3.0694 1.762-4.242 1.175-1.2416 2.627-1.8624 4.355-1.8624 1.659 0 2.904.5518 3.733 1.6554.899 1.0347 1.348 2.2418 1.348 3.6213 0 1.6554-.588 3.1039-1.763 4.3454-1.106 1.1726-2.557 1.7589-4.355 1.7589ZM275.623 125.164c6.083-1.106 10.092-2.696 12.028-4.77 1.935-2.213 2.903-6.292 2.903-12.238l.207-87.1134c0-4.4249-.553-7.3978-1.659-8.9188-.967-1.5211-2.972-2.28159-6.013-2.28159-1.383 0-2.765.06913-4.148.20739-1.382.1383-2.35.2074-2.903.2074l-.415-.82962 1.452-9.126221c1.659.138274 4.769.276552 9.332.414835 4.562.138274 9.124.207409 13.686.207409 4.285 0 9.124-.069135 14.515-.207409 5.53-.276557 9.401-.48397 11.613-.622244 14.377 0 25.368 3.18034 32.971 9.54104 7.604 6.36071 11.405 15.48691 11.405 27.37871 0 7.7434-2.281 15.1412-6.843 22.1933-4.424 6.9138-10.299 12.5139-17.626 16.8005-7.327 4.2865-14.999 6.4298-23.018 6.4298h-17.418l-.415 20.3269c0 6.637.207 11.407.622 14.311.415 2.766 1.175 4.633 2.281 5.6 1.244.83 3.318 1.245 6.221 1.245 2.35 0 4.562-.069 6.636-.207 2.212-.139 3.732-.277 4.562-.415l.415.829-1.867 9.541c-1.382-.138-3.94-.276-7.672-.414-3.595-.139-7.396-.208-11.406-.208-5.529 0-12.027.208-19.492.622-7.327.415-11.129.761-11.405 1.037l1.451-9.541Zm52.464-51.8531c8.295-1.3828 14.516-4.7705 18.663-10.1633 4.286-5.3927 6.429-12.7905 6.429-22.1933 0-10.6472-3.18-18.3907-9.539-23.2304-6.221-4.9779-16.037-7.4669-29.446-7.4669-2.489 0-4.009.1383-4.562.4149-.553.2765-.899 1.1062-1.037 2.4889-1.244 17.5611-2.074 36.574-2.489 57.0389l21.981 3.1112ZM528.899 133.461l.622-7.467c5.806-.415 9.677-1.037 11.613-1.867 2.073-.829 3.11-2.212 3.11-4.148 0-2.212-.484-4.563-1.451-7.052l-4.977-15.9709c-2.765-.1383-8.502-.2074-17.212-.2074-4.009 0-9.953.4148-17.833 1.2445l-5.806 15.3488c-.968 3.18-1.452 5.116-1.452 5.807 0 2.213.76 3.803 2.281 4.771 1.521.968 4.009 1.452 7.465 1.452h8.917l.622.829-1.244 7.882c-1.382-.138-4.562-.345-9.539-.622-4.838-.277-9.608-.415-14.308-.415-4.424 0-8.433.069-12.027.208-3.457.138-5.807.207-7.051.207l1.244-8.504c3.042-.415 5.461-1.452 7.258-3.111 1.797-1.798 3.594-4.771 5.392-8.919l32.556-82.3434 14.723-2.6964 1.452.2074c0 .5531 3.11 11.477 9.331 32.7715 6.36 21.2945 12.028 38.9247 17.004 52.8909 1.383 4.01 3.111 6.844 5.184 8.504 2.212 1.521 5.669 2.489 10.369 2.903l.415.83-1.037 7.467c-1.383 0-3.94-.069-7.673-.207-3.732-.139-7.465-.208-11.198-.208-5.668 0-11.059.208-16.174.622-5.115.415-8.433.692-9.954.83l-.622-1.037Zm-8.709-45.2163c4.838 0 9.884-.2765 15.137-.8296l-12.649-40.2384h-1.451l-15.138 41.068h14.101ZM733.107 134.913c-1.798-.277-5.461-.691-10.991-1.245-5.391-.414-9.953-.622-13.686-.622-3.594 0-7.534.208-11.82.622-4.286.554-7.05.968-8.295 1.245l1.037-8.712c4.977-.829 8.364-2.212 10.161-4.148 1.797-1.936 2.696-5.116 2.696-9.541l.207-65.9575c0-3.4569-.414-5.7385-1.244-6.8447-.829-1.2444-2.419-1.8667-4.769-1.8667-1.244 0-2.42.0691-3.526.2074-1.105.1383-1.866.2074-2.281.2074l-.414-1.037 1.244-7.8818c1.382 0 3.871.0692 7.465.2074 3.733.1383 7.465.2075 11.198.2075 4.977 0 10.092-.0692 15.345-.2075 5.253-.2765 8.848-.4148 10.783-.4148 11.06 0 20.806 2.005 29.239 6.015s14.93 9.6793 19.492 17.008c4.701 7.1903 7.051 15.6252 7.051 25.3045 0 10.7855-2.627 20.534-7.88 29.2458-5.115 8.711-12.166 15.625-21.152 20.741-8.986 4.978-18.939 7.467-29.86 7.467Zm-7.88-96.0328c-2.212 0-3.733.2765-4.562.8296-.692.4149-1.106 1.3828-1.245 2.9038-1.659 38.8556-2.488 61.6714-2.488 68.4464 0 3.734.553 6.638 1.659 8.712 1.106 1.936 3.041 3.318 5.806 4.148 2.765.691 6.843 1.037 12.235 1.037 11.612 0 20.667-3.803 27.165-11.408 6.636-7.605 9.953-18.2522 9.953-31.9415 0-13.9659-4.147-24.544-12.442-31.7344-8.294-7.3286-20.321-10.9929-36.081-10.9929ZM957.257 133.461l.622-7.467c5.806-.415 9.677-1.037 11.613-1.867 2.073-.829 3.11-2.212 3.11-4.148 0-2.212-.484-4.563-1.452-7.052l-4.976-15.9709c-2.765-.1383-8.502-.2074-17.212-.2074-4.009 0-9.953.4148-17.833 1.2445l-5.807 15.3488c-.967 3.18-1.451 5.116-1.451 5.807 0 2.213.76 3.803 2.281 4.771 1.521.968 4.009 1.452 7.465 1.452h8.917l.622.829-1.244 7.882c-1.383-.138-4.562-.345-9.539-.622-4.839-.277-9.608-.415-14.308-.415-4.424 0-8.433.069-12.028.208-3.456.138-5.806.207-7.05.207l1.244-8.504c3.041-.415 5.461-1.452 7.258-3.111 1.797-1.798 3.594-4.771 5.391-8.919l32.557-82.3434 14.723-2.6964 1.452.2074c0 .5531 3.11 11.477 9.331 32.7715 6.359 21.2945 12.027 38.9247 17.004 52.8909 1.383 4.01 3.111 6.844 5.184 8.504 2.212 1.521 5.668 2.489 10.369 2.903l.41.83-1.03 7.467c-1.38 0-3.942-.069-7.675-.207-3.733-.139-7.465-.208-11.198-.208-5.668 0-11.059.208-16.174.622-5.116.415-8.433.692-9.954.83l-.622-1.037Zm-8.71-45.2163c4.839 0 9.885-.2765 15.138-.8296l-12.649-40.2384h-1.452l-15.137 41.068h14.1Z"
                        fill="#000000"
                     />
                  </svg>
               </div>
            </div>
         </div>
      </>
   );
};
export default home;

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
