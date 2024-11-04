import { GRID_CELL_SIZE } from "../../../common/constants";
import { snap } from "./snap";

export function logicalPosition({ x, y }: { x: number; y: number; }) {
  const s = snap({ x, y });
  return {
    x: Math.floor(s.x / GRID_CELL_SIZE),
    y: Math.floor(s.y / GRID_CELL_SIZE)
  }
};
