import { formation } from "../../../types/types";

export const linear = (
   from: { x: number; y: number },
   to: { x: number; y: number },
   percentThroughTransition: number // 0 to 1
): { x: number; y: number } => {
   percentThroughTransition = easeInOutQuad(percentThroughTransition);

   return { x: from.x + (to.x - from.x) * percentThroughTransition, y: from.y + (to.y - from.y) * percentThroughTransition };
};

export const cubic = (
   from: { x: number; y: number },
   to: { x: number; y: number },
   percentThroughTransition: number, // 0 to 1
   controlPointStart: { x: number; y: number },
   controlPointEnd: { x: number; y: number }
): { x: number; y: number } => {
   percentThroughTransition = easeInOutQuad(percentThroughTransition);

   return {
      x:
         (1 - percentThroughTransition) ** 3 * from.x +
         3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * controlPointStart.x +
         3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * controlPointEnd.x +
         percentThroughTransition ** 3 * to.x,
      y:
         (1 - percentThroughTransition) ** 3 * from.y +
         3 * (1 - percentThroughTransition) ** 2 * percentThroughTransition * controlPointStart.y +
         3 * (1 - percentThroughTransition) * percentThroughTransition ** 2 * controlPointEnd.y +
         percentThroughTransition ** 3 * to.y,
   };
};

function easeInOutQuad(x: number): number {
   return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
