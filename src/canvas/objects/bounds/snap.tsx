import { GRID_CELL_SIZE } from '../../common/constants';

export const snap = ({ x, y }: { x: number; y: number; }) => {
  return {
    x: Math.round(x / GRID_CELL_SIZE) * GRID_CELL_SIZE,
    y: Math.round(y / GRID_CELL_SIZE) * GRID_CELL_SIZE,
  };
};
