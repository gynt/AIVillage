import type { Rect as RectType } from 'konva/lib/shapes/Rect';
import type { Stage as StageType } from 'konva/lib/Stage';
import { KonvaEventObject } from 'konva/lib/Node';
import { getDefaultStore } from 'jotai';
import { CURRENT_AIV_DATA } from '../../../aiv/state';
import { Step } from '../../../aiv/aiv-data';
import { draggingStep } from './state';

export const CreateOnDragStart = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    if (shadowRectangleRef.current === null) return;

    const sr = shadowRectangleRef.current;

    const { x, y, width, height } = e.target.getClientRect({ skipTransform: false, relativeTo: stageRef.current! });

    const matchingSteps = getDefaultStore().get(CURRENT_AIV_DATA).steps.filter((s) => s.type === 'construction' && s.tile.x == x && s.tile.y == y);
    if (matchingSteps.length !== 1) {
      console.warn(`more than one matching step for: ${x} ${y}`);
    } else {
      getDefaultStore().set(draggingStep, matchingSteps[0]);
    }

    // @ts-ignore
    const { x: scaleX, y: scaleY } = stageRef.current!.getScale();
    sr.width(Math.floor(width));
    sr.height(Math.floor(height));
    sr.show();
    sr.moveToTop();
    e.target.moveToTop();
  };
};
