import { Stage } from "konva/lib/Stage";
import { Rect } from "konva/lib/shapes/Rect";
import { RefObject } from "react";
import { Hovel } from "../structures/Hovel";
import { Keep } from "../structures/Keep";

export type StructureType = 'Hovel' | 'Keep';

export type StructureFactoryStructureProps = { id: string, type: StructureType, pos: { x: number, y: number }, shadowRectangleRef: RefObject<Rect>, stageRef: RefObject<Stage> };

export const StructureFactory = {
  Structure: (props: StructureFactoryStructureProps) => {
    const { type, id, pos, shadowRectangleRef, stageRef } = props;
    const { x, y } = pos;
    if (type === "Hovel") {
      return <Hovel
        structureID={id}
        gridX={x}
        gridY={y}
        shadowRectangleRef={shadowRectangleRef}
        stageRef={stageRef}
      />
    }

    if (type === 'Keep') {
      return <Keep
        structureID={id}
        gridX={x}
        gridY={y}
        shadowRectangleRef={shadowRectangleRef}
        stageRef={stageRef}
      />
    }

    throw Error(`undefined type: ${type} @ (${x},${y})`);
  },
}