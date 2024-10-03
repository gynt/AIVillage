import type { Rect as RectType } from 'konva/lib/shapes/Rect'
import type { Stage as StageType } from 'konva/lib/Stage'
import type { Group as GroupType } from 'konva/lib/Group'
import { KonvaEventObject } from 'konva/lib/Node';

import { Group, Rect } from 'react-konva';
import { randomColor } from '../colors';
import { GRID_CELL_COUNT, GRID_CELL_SIZE } from '../../common/constants';
import { getDefaultStore } from 'jotai';
import { positionAtom } from '../../state/state';
import { useMemo } from 'react';

const collidesWithAnyOtherStructure = (stage: StageType, a: GroupType) => {
  const structures = stage.find('.Structure');
  for (const structure of structures) {
    if (structure === a) {
      continue;
    }

    const b = structure as unknown as GroupType;

    for (const aPart of a.find('.StructureRect')) {
      const rectA = aPart.getClientRect();
      for (const bPart of b.find('.StructureRect')) {
        const rectB = bPart.getClientRect();
        if (!(rectB.x > rectA.x + rectA.width ||
          rectB.x + rectB.width < rectA.x ||
          rectB.y > rectA.y + rectA.height ||
          rectB.y + rectB.height < rectA.y)) {
          console.log(rectA, rectB);
          return true;
        }
      }
    }


  }
  return false;
}

const sanitizeVector = (pos: { x: number, y: number }, width: number, height: number) => {
  return {
    x: Math.max(0, Math.min((GRID_CELL_COUNT * GRID_CELL_SIZE) - width, pos.x)),
    y: Math.max(0, Math.min((GRID_CELL_COUNT * GRID_CELL_SIZE) - height, pos.y)),
  }
}

const CreateOnDragStart = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
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
}

const CreateOnDragMove = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    if (shadowRectangleRef.current === null || stageRef.current === null) return;

    const { x, y, width, height } = e.target.getClientRect({ skipTransform: false, relativeTo: stageRef.current! });
    const targetPosition = sanitizeVector({ x, y }, width, height);

    if (collidesWithAnyOtherStructure(stageRef.current, e.target as GroupType)) {
      // e.target.stopDrag();
      return;
    }

    e.target.position(targetPosition);

    const sr = shadowRectangleRef.current;

    const finalPosition = {
      x: Math.round(targetPosition.x / GRID_CELL_SIZE) * GRID_CELL_SIZE,
      y: Math.round(targetPosition.y / GRID_CELL_SIZE) * GRID_CELL_SIZE,
    };
    sr.position(finalPosition);

    if (stageRef.current !== null) {
      stageRef.current.batchDraw()
    }

  }
}

const CreateOnDragEnd = (shadowRectangleRef: React.RefObject<RectType>, stageRef: React.RefObject<StageType>) => {
  return (e: KonvaEventObject<DragEvent>) => {
    const roundedPos = shadowRectangleRef.current!.getClientRect({ skipTransform: false, relativeTo: stageRef.current! });
    e.target.position(roundedPos)
    console.log('onDragEnd', roundedPos);
    console.log('stage', stageRef.current!.getClientRect());
    const gridPos = {
      x: Math.floor(roundedPos.x / GRID_CELL_SIZE),
      y: Math.floor(roundedPos.y / GRID_CELL_SIZE),
    }
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
      x={50 * GRID_CELL_SIZE}
      y={50 * GRID_CELL_SIZE}
      draggable={true}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      name='Structure'
    >
      <Rect
        x={0}
        y={0}
        width={5 * GRID_CELL_SIZE}
        height={5 * GRID_CELL_SIZE}
        fill={"brown"}
        name='StructureRect'
      />
      <Rect
        x={5 * GRID_CELL_SIZE}
        y={0}
        width={5 * GRID_CELL_SIZE}
        height={5 * GRID_CELL_SIZE}
        fill={"black"}
        name='StructureRect'
      />
      <Rect
        x={0}
        y={5 * GRID_CELL_SIZE}
        width={5 * GRID_CELL_SIZE}
        height={5 * GRID_CELL_SIZE}
        fill={"grey"}
        name='StructureRect'
      />
    </Group>
  )
}