import type { Rect as RectType } from 'konva/lib/shapes/Rect'
import type { Stage as StageType } from 'konva/lib/Stage'

import { Group, Rect } from 'react-konva';
import { randomColor } from '../../rendering/colors';
import { GRID_CELL_SIZE } from '../../../common/constants';
import { useMemo } from 'react';
import { CreateOnDragStart } from '../dragging/CreateOnDragStart';
import { CreateOnDragMove } from '../dragging/CreateOnDragMove';
import { CreateOnDragEnd } from '../dragging/CreateOnDragEnd';

export type StructureRectangle = {
  x: number,
  y: number,
  size: number,
}

export type StructureDefinition = StructureRectangle[];

export type StructureProps = {
  structureID?: string,
  gridX: number,
  gridY: number,
  structureDefinition: StructureDefinition,
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

  const { gridX, gridY, structureID, structureDefinition } = props;

  const children = structureDefinition.map((sd) =>
    <Rect
      // This key is unique because structures can't overlap exactly
      key={`${gridX}-${gridY}-${structureID}-${sd.x}-${sd.y}-${sd.size}`}
      x={sd.x * GRID_CELL_SIZE}
      y={sd.y * GRID_CELL_SIZE}
      width={sd.size * GRID_CELL_SIZE}
      height={sd.size * GRID_CELL_SIZE}
      fill={randomColor()}
      name='StructureRect'
    />
  )

  return (
    <Group
      x={gridX * GRID_CELL_SIZE}
      y={gridY * GRID_CELL_SIZE}
      draggable={true}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      name='Structure'
      id={structureID !== undefined ? structureID : undefined}
    >
      {children}
    </Group>
  )
}