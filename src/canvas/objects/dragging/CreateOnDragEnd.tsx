import type { Rect as RectType } from 'konva/lib/shapes/Rect';
import type { Stage as StageType } from 'konva/lib/Stage';
import { KonvaEventObject } from 'konva/lib/Node';
import { GRID_CELL_SIZE } from '../../../common/constants';
import { getDefaultStore } from 'jotai';
import { positionAtom } from '../../../state/state';
import { snap } from '../bounds/snap';

export const CreateOnDragEnd = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    const shadowPos = shadowRectangleRef.current!.getClientRect({ skipTransform: false, relativeTo: stageRef.current! });

    const roundedPos = snap(shadowPos);
    e.target.position(roundedPos);

    const gridPos = {
      x: Math.floor(roundedPos.x / GRID_CELL_SIZE),
      y: Math.floor(roundedPos.y / GRID_CELL_SIZE),
    };
    getDefaultStore().set(positionAtom, gridPos);

    if (stageRef.current !== null) {
      stageRef.current.batchDraw();
    }
    if (shadowRectangleRef.current !== null) {
      shadowRectangleRef.current.hide();
    }

  };
};
