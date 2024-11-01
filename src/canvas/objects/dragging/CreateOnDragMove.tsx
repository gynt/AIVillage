import type { Rect as RectType } from 'konva/lib/shapes/Rect';
import type { Stage as StageType } from 'konva/lib/Stage';
import type { Group as GroupType } from 'konva/lib/Group';
import { KonvaEventObject } from 'konva/lib/Node';
import { snap } from '../bounds/snap';
import { applyBounds } from '../bounds/applyBounds';
import { collidesWithAnyOtherStructure } from '../bounds/collidesWithAnyOtherStructure';

export const CreateOnDragMove = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    if (shadowRectangleRef.current === null || stageRef.current === null) return;

    const { x, y, width, height } = e.target.getClientRect({ skipTransform: false, relativeTo: stageRef.current! });
    const targetPosition = applyBounds({ x, y }, width, height);

    if (collidesWithAnyOtherStructure(stageRef.current, e.target as GroupType)) {
      // e.target.stopDrag();
      return;
    }

    e.target.position(targetPosition);

    const sr = shadowRectangleRef.current;

    const finalPosition = snap(targetPosition);
    sr.position(finalPosition);

    if (stageRef.current !== null) {
      stageRef.current.batchDraw();
    }

  };
};
