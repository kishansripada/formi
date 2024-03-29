import { formation, dancerPosition } from "./types";
interface Position {
   x: number;
   y: number;
}

type Collision = {
   formationId: string;
   dancer1Id: string;
   dancer2Id: string;
};

export function detectCollisions(formations: formation[], selectedFormations, collisionRadius): Record<string, Collision[]> {
   const collisionMap = [];
   collisionRadius = 0.75;
   if (!formations) return [];
   if (selectedFormations.length !== 1) return [];
   const selectedFormation = formations.findIndex((formation) => formation.id === selectedFormations[0]);
   if (selectedFormation === 0 || selectedFormation === -1) return [];
   const currFormation = formations[selectedFormation - 1];
   const nextFormation = formations[selectedFormation];

   const currPositions = currFormation.positions;
   const nextPositions = nextFormation.positions;

   const snapshots = 10;
   for (let j = 0; j < snapshots; j++) {
      const currSnapshotPositions = getCurrSnapshotPositions(j, snapshots, currPositions, nextPositions, collisionRadius);
      const collisions = detectCollisionsInSnapshot(currFormation.id || "", currSnapshotPositions);

      if (collisions.length > 0) {
         collisionMap.push(...collisions);
      }
   }

   return collisionMap;
}

function getCurrSnapshotPositions(
   snapshot: number,
   snapshots: number,
   currPositions: dancerPosition[],
   nextPositions: dancerPosition[],
   collisionRadius: number
): dancerPosition[] {
   const snapshotPositions = [];

   for (let k = 0; k < currPositions.length; k++) {
      const currDancer = currPositions[k];
      const nextDancer = nextPositions[k];
      let percentThroughTransition = snapshot / snapshots;
      let x;
      let y;
      if (nextDancer?.transitionType === "cubic" && nextDancer?.controlPointStart?.y && nextDancer?.controlPointStart?.x) {
         x =
            (1 - percentThroughTransition) ** 3 * currDancer.position.x +
            3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * nextDancer.controlPointStart.x +
            3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * nextDancer.controlPointEnd.x +
            percentThroughTransition ** 3 * nextDancer.position.x;
         y =
            (1 - percentThroughTransition) ** 3 * currDancer.position.y +
            3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * nextDancer.controlPointStart.y +
            3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * nextDancer.controlPointEnd.y +
            percentThroughTransition ** 3 * nextDancer.position.y;
      } else {
         x = currDancer.position.x + ((nextDancer.position.x - currDancer.position.x) / snapshots) * snapshot;
         y = currDancer.position.y + ((nextDancer.position.y - currDancer.position.y) / snapshots) * snapshot;
      }
      //    return coordsToPosition({ x: from.x + (to.x - from.x) * percentThroughTransition, y: from.y + (to.y - from.y) * percentThroughTransition });

      snapshotPositions.push({
         id: currDancer.id,
         position: { x, y },
         radius: collisionRadius,
      });
   }

   return snapshotPositions;
}

function detectCollisionsInSnapshot(formationId: string, snapshotPositions: dancerPosition[]): Collision[] {
   const collisions: Collision[] = [];

   for (let j = 0; j < snapshotPositions.length; j++) {
      const currDancer = snapshotPositions[j];

      for (let k = j + 1; k < snapshotPositions.length; k++) {
         const nextDancer = snapshotPositions[k];

         const distanceBetweenDancers = Math.sqrt(
            (nextDancer.position.x - currDancer.position.x) ** 2 + (nextDancer.position.y - currDancer.position.y) ** 2
         );

         if (distanceBetweenDancers < currDancer.radius + nextDancer.radius) {
            collisions.push({
               dancers: [currDancer.id, nextDancer.id],
               collisionPoint: midpoint(nextDancer.position, currDancer.position),
            });
         }
      }
   }

   return collisions;
}

function midpoint(p1: { x: number; y: number }, p2: { x: number; y: number }): { x: number; y: number } {
   const x = (p1.x + p2.x) / 2;
   const y = (p1.y + p2.y) / 2;
   return { x, y };
}
