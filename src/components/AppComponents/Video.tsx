import React from "react";
import { useDraggable } from "@dnd-kit/core";

export function Video({ videoPosition, videoPlayer, localSource, soundCloudTrackId }) {
   const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: "vid",
      data: {
         supports: ["vid-container"],
      },
   });
   const style = transform
      ? {
           transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

   const classList =
      videoPosition === "top-left"
         ? "top-5 left-5"
         : videoPosition === "top-right"
         ? "top-5 right-5"
         : videoPosition === "bottom-left"
         ? "bottom-5 left-5"
         : "bottom-5 right-5";

   return (
      <div
         className={`absolute ${classList} z-50 lg:block hidden pointer-events-auto shadow-md  `}
         ref={setNodeRef}
         {...listeners}
         {...attributes}
         style={{
            width: localSource?.startsWith("data:video") || isVideo(soundCloudTrackId) ? 350 : 0,
            ...style,
         }}
      >
         <video
            tabIndex={-1}
            playsInline
            className=" pointer-events-none rounded-xl focus:outline-none focus-visible:outline-none"
            ref={videoPlayer}
            src={localSource || soundCloudTrackId}
         ></video>
      </div>
   );
}

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
