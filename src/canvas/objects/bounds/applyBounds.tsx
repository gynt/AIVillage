import { GRID_CELL_COUNT, GRID_CELL_SIZE } from "../../../common/constants";

export const applyBounds = (pos: { x: number; y: number; }, width: number, height: number) => {
  return {
    x: Math.max(0, Math.min((GRID_CELL_COUNT * GRID_CELL_SIZE) - width, pos.x)),
    y: Math.max(0, Math.min((GRID_CELL_COUNT * GRID_CELL_SIZE) - height, pos.y)),
  };
};
