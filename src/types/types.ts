export type dancer = {
   name: string;
   id: string;
   instagramUsername?: string | null;
   color?: string | null; // default #db2777
   height?: number; // default 183 cm
   shape?: "circle" | "square" | "triangle"; // default circle
};

export type propPosition = {
   position: { x: number; y: number };
   rotation: number;
   id: string;
};

export type prop = {
   url: string;
   id: string;
   user_id: string;
   type: "static" | "dynamic";
   static: {
      width: number;
      // height: number;
      position: { x: number; y: number };
      // rotation: number;
   };
};

export type item = {
   url: string;
   id: string;
   name: string;
   width?: number;
   side?: "left" | "right" | "top" | "bottom";
};

export type dancerPosition = {
   id: string;
   position: { x: number; y: number };
   transitionType?: "linear" | "cubic" | "teleport";
   controlPointStart?: { x: number; y: number };
   controlPointEnd?: { x: number; y: number };
   itemId?: string | null;
   color?: string | null;
   level?: number | null; // elevation off the ground
   groupId?: string | null;
};

export type formation = {
   durationSeconds: number;
   positions: dancerPosition[];
   props?: propPosition[];
   transition: {
      durationSeconds: number;
   };
   id: string;
   name: string | null;
   comments?: comment[];
   notes: string;
   groups: performerGroup[];
};

export type performerGroup = {
   name: string;
   color: string;
   id: string;
   notes?: string;
};

// export type formationGroup = {
//    name: string;
//    color: string;
//    id: string;
// };

export type localSettings = {
   gridSnap: 1 | 2 | 100;
   previousFormationView: "none" | "ghostDancers" | "ghostDancersAndPaths";
   dancerStyle: "initials" | "numbered" | "solid" | "initialsAndName";
   viewCollisions: boolean;
   stageFlipped: boolean;
   viewingThree: boolean;
   viewingTwo: boolean;
   collisionRadius: number;
   fullScreen: boolean;
   isDarkMode: boolean;
   autoScroll: boolean;
   videoPlacement: "pip" | "left" | "above" | "hidden";
};

export type cloudSettings = {
   collisionRadius: number;

   stageBackground: "none" | "grid" | "cheer9" | "custom" | "gridfluid";
   stageDimensions: { width: number; height: number };

   // stage lines

   // vertical large lines
   gridSubdivisions: number;
   // horizontal large lines
   horizontalGridSubdivisions?: number;

   // places where dancers can snap to
   // vertical small lines
   verticalFineDivisions?: number;
   // horizontal small lines
   horizontalFineDivisions?: number;

   backgroundUrl: string;

   backgroundImageOpacity: number;
   hideSubdivisions: boolean;
};

export type comment = {
   id: string;
   user: {
      id: string;
      name: string;
      avatar_url: string;
   };
   content: string;
   position: { x: number; y: number };
};

export type segment = {
   id: string;
   name: string;
   duration: number;
   color: string;
};

export type dragBoxCoords = { start: { x: number | null; y: number | null }; end: { x: number | null; y: number | null } };
export type stageDimensions = { width: number; height: number };

export const PIXELS_PER_SECOND = 15;

export const PIXELS_PER_SQUARE = 40;
export const GRID_WIDTH = 26;
export const GRID_HEIGHT = 20;

/** The max zoom level of the timeline */
export const MAX_PIXELS_PER_SECOND = 150;

export const MAX_NUMBER_OF_DANCES_FOR_FREE_PLAN = 3;

export const initials = (name: string) => {
   if (!name) return "";
   return name
      .split(" ")
      .map((name) => name[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();
};

export const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#3A70ED"];
