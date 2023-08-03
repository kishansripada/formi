export type dancer = {
   name: string;
   id: string;
   instagramUsername?: string | null;
   color?: string | null;
   height: number;
   shape?: "circle" | "square" | "triangle";
};

export type propPosition = {
   // width: number;
   // height: number;
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
      height: number;
      position: { x: number; y: number };
      rotation: number;
   };
};

export type item = {
   url: string;
   id: string;
   user_id: string;
   name: string;
   width: number;
   side: "left" | "right" | "top" | "bottom";
};

export type dancerPosition = {
   id: string;
   position: { x: number; y: number };
   transitionType?: "linear" | "cubic" | "teleport";
   controlPointStart?: { x: number; y: number };
   controlPointEnd?: { x: number; y: number };
   itemId?: string | null;
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
   group?: string;
   notes: string;
};

export type formationGroup = {
   name: string;
   color: string;
   id: string;
};

export type localSettings = {
   gridSnap: 1 | 2 | 100;
   previousFormationView: "none" | "ghostDancers" | "ghostDancersAndPaths";
   dancerStyle: "initials" | "numbered" | "solid";
   viewCollisions: boolean;
   stageFlipped: boolean;
   viewingThree: boolean;
   viewingTwo: boolean;
   collisionRadius: number;
   fullScreen: boolean;
   isDarkMode: boolean;
   autoScroll: boolean;
};

export type cloudSettings = {
   stageBackground: "none" | "grid" | "cheer9" | "custom";
   stageDimensions: { width: number; height: number };
   gridSubdivisions: number;
   backgroundUrl: string;
   collisionRadius: number;
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

export type dragBoxCoords = { start: { x: number | null; y: number | null }; end: { x: number | null; y: number | null } };
export type stageDimensions = { width: number; height: number };

export const PIXELS_PER_SECOND = 15;

export const PIXELS_PER_SQUARE = 40;
export const GRID_WIDTH = 26;
export const GRID_HEIGHT = 20;

export const MAX_PIXELS_PER_SECOND = 120;

export const initials = (name: string) => {
   if (!name) return "";
   return name
      .split(" ")
      .map((name) => name[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();
};
