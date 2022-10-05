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
};

export type formation = {
   durationSeconds: number;
   positions: dancerPosition[];
   transition: {
      durationSeconds: number;
   };
   name: string | null;
};

export type dragBoxCoords = { start: { x: number | null; y: number | null }; end: { x: number | null; y: number | null } };

export const PIXELS_PER_SECOND = 15;
