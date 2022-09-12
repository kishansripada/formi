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
