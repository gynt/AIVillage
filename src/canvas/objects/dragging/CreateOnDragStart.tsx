import type { Rect as RectType } from 'konva/lib/shapes/Rect';
import type { Stage as StageType } from 'konva/lib/Stage';
import { KonvaEventObject } from 'konva/lib/Node';

export const CreateOnDragStart = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    if (shadowRectangleRef.current === null) return;

    const sr = shadowRectangleRef.current;

    const { width, height } = e.target.getClientRect({ skipTransform: false, relativeTo: stageRef.current! });
    // @ts-ignore
    const { x: scaleX, y: scaleY } = stageRef.current!.getScale();
    sr.width(Math.floor(width));
    sr.height(Math.floor(height));
    sr.show();
    sr.moveToTop();
    e.target.moveToTop();
  };
};
