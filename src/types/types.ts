export type dancer = {
   name: string;
   id: string;
   instagramUsername?: string | null;
   color?: string | null;
};

export type dancerPosition = {
   id: string;
   position: { x: number; y: number };
   transitionType?: "linear" | "cubic";
   controlPointStart?: { x: number; y: number };
   controlPointEnd?: { x: number; y: number };
};

export type formation = {
   durationSeconds: number;
   positions: dancerPosition[];
   transition: {
      durationSeconds: number;
   };
   id: string;
   name: string | null;
   comments?: comment[];
};

export type comment = {
   name: string;
   id: string;
   content: string;
   position: { x: number; y: number };
};

export type dragBoxCoords = { start: { x: number | null; y: number | null }; end: { x: number | null; y: number | null } };
export type stageDimensions = { width: number; height: number };

export const PIXELS_PER_SECOND = 15;

export const PIXELS_PER_SQUARE = 40;
export const GRID_WIDTH = 26;
export const GRID_HEIGHT = 20;
