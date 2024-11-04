import type { Rect as RectType } from 'konva/lib/shapes/Rect';
import type { Stage as StageType } from 'konva/lib/Stage';
import { KonvaEventObject } from 'konva/lib/Node';
import { GRID_CELL_SIZE } from '../../../common/constants';
import { getDefaultStore } from 'jotai';
import { positionAtom } from '../../../state/state';
import { snap } from '../bounds/snap';
import { draggingStep } from './state';
import { logicalPosition } from '../bounds/logicalPosition';

export const CreateOnDragEnd = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    const shadowPos = shadowRectangleRef.current!.getClientRect({ skipTransform: false, relativeTo: stageRef.current! });

    const roundedPos = snap(shadowPos);
    e.target.position(roundedPos);

    const gridPos = logicalPosition(roundedPos);
    getDefaultStore().set(positionAtom, gridPos);

    const { x, y } = gridPos;

    const ds = getDefaultStore().get(draggingStep);
    if (ds !== undefined && ds.id === e.target.id() && ds.type === 'construction') {
      ds.tile.x = x;
      ds.tile.y = y;
    }

    if (stageRef.current !== null) {
      stageRef.current.batchDraw();
    }
    if (shadowRectangleRef.current !== null) {
      shadowRectangleRef.current.hide();
    }

  };
};
