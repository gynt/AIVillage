import { Stage } from "konva/lib/Stage";
import { Rect } from "konva/lib/shapes/Rect";
import { RefObject } from "react";
import { Hovel } from "../structures/Hovel";

export type StructureType = 'Hovel' | 'Keep';

export const createStructure = (type: StructureType, pos: { x: number, y: number }, shadowRectangleRef: RefObject<Rect>, stageRef: RefObject<Stage>) => {
  const { x, y } = pos;
  if (type === "Hovel") {
    return <Hovel
      gridX={x}
      gridY={y}
      shadowRectangleRef={shadowRectangleRef}
      stageRef={stageRef}
    />
  }
}