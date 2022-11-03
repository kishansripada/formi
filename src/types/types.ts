export type dancer = {
   name: string;
   id: string;
   instagramUsername: string | null;
};

export type dancerPosition = {
   id: string;
   position: { x: number; y: number };
   exitStrategy: "left" | "right" | "closest";
   enterStrategy: "left" | "right" | "closest";
   transitionType?: "linear" | "cubic";
   controlPointStart?: { x: number | null; y: number | null };
   controlPointEnd?: { x: number | null; y: number | null };
};

export type formation = {
   durationSeconds: number;
   positions: dancerPosition[];
   transition: {
      durationSeconds: number;
   };
   name: string | null;
   notes?: string | null | undefined;
};

export type dragBoxCoords = { start: { x: number | null; y: number | null }; end: { x: number | null; y: number | null } };

export const PIXELS_PER_SECOND = 15;

export const PIXELS_PER_SQUARE = 40;
export const GRID_WIDTH = 40;
export const GRID_HEIGHT = 30;

export const coordsToPosition = (x: number, y: number) => {
   return { left: (PIXELS_PER_SQUARE * GRID_WIDTH) / 2 + PIXELS_PER_SQUARE * x, top: (PIXELS_PER_SQUARE * GRID_HEIGHT) / 2 + PIXELS_PER_SQUARE * -y };
};
