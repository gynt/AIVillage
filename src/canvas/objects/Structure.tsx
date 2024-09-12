import type { Rect as RectType } from 'konva/lib/shapes/Rect'
import type { Stage as StageType } from 'konva/lib/Stage'
import { KonvaEventObject } from 'konva/lib/Node';

import { Group, Rect } from 'react-konva';
import { randomColor } from '../colors';
import { gridSize } from '../../common/constants';
import { getDefaultStore } from 'jotai';
import { positionAtom } from '../../state/state';
import { useMemo } from 'react';


const CreateOnDragStart = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    if (shadowRectangleRef.current === null) return;

    const sr = shadowRectangleRef.current;

    const { width, height } = e.target.getClientRect();
    // @ts-ignore
    const { x: scaleX, y: scaleY } = stageRef.current!.getScale();
    sr.width(Math.floor(width / scaleX));
    sr.height(Math.floor(height / scaleY));
    sr.show();
    sr.moveToTop();
    e.target.moveToTop()
  };
}

const CreateOnDragMove = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    if (shadowRectangleRef.current === null) return;

    const x = e.target.x();
    const y = e.target.y();

    const targetPosition = {
      x: Math.max(0, Math.min((100 * gridSize) - e.target.width(), x)),
      y: Math.max(0, Math.min((100 * gridSize) - e.target.height(), y)),
    }
    e.target.position(targetPosition)

    const sr = shadowRectangleRef.current;

    sr.position({
      x: Math.round(targetPosition.x / gridSize) * gridSize,
      y: Math.round(targetPosition.y / gridSize) * gridSize,
    })

    if (stageRef.current !== null) {
      stageRef.current.batchDraw()
    }

  }
}

const CreateOnDragEnd = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    const gridPos = {
      x: Math.round(e.target.x() / gridSize),
      y: Math.round(e.target.y() / gridSize),
    }
    const pos = {
      x: gridPos.x * gridSize,
      y: gridPos.y * gridSize,
    }
    e.target.position(pos)
    getDefaultStore().set(positionAtom, gridPos)
    if (stageRef.current !== null) {
      stageRef.current.batchDraw();
    }
    if (shadowRectangleRef.current !== null) {
      shadowRectangleRef.current.hide()
    }
  }
}

export type StructureProps = {
  shadowRectangleRef: React.RefObject<RectType>;
  stageRef: React.RefObject<StageType>;
}
export const Structure = (props: StructureProps) => {
  const { shadowRectangleRef, stageRef } = props;

  const onDragStart = useMemo(() => {
    return CreateOnDragStart(shadowRectangleRef, stageRef)
  }, [shadowRectangleRef])
  const onDragMove = useMemo(() => {
    return CreateOnDragMove(shadowRectangleRef, stageRef)
  }, [shadowRectangleRef, stageRef])
  const onDragEnd = useMemo(() => {
    return CreateOnDragEnd(shadowRectangleRef, stageRef)
  }, [shadowRectangleRef, stageRef])

  return (
    <Group
      x={50 * gridSize}
      y={50 * gridSize}
      fill={randomColor()}
      draggable={true}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
    >
      <Rect
        x={0}
        y={0}
        width={5 * gridSize}
        height={5 * gridSize}
        fill={"brown"}
      />
      <Rect
        x={5 * gridSize}
        y={0}
        width={5 * gridSize}
        height={5 * gridSize}
        fill={"black"}
      />
      <Rect
        x={0}
        y={5 * gridSize}
        width={5 * gridSize}
        height={5 * gridSize}
        fill={"grey"}
      />
    </Group>
  )
}