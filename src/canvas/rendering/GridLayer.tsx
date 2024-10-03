import { Layer, Line } from 'react-konva';
import { GRID_CELL_COUNT, GRID_CELL_SIZE } from '../../common/constants';

export const GridLayer = () => {
  //https://medium.com/@pierrebleroux/snap-to-grid-with-konvajs-c41eae97c13f
  const padding = GRID_CELL_SIZE;
  const width = GRID_CELL_SIZE * GRID_CELL_COUNT;
  const height = GRID_CELL_SIZE * GRID_CELL_COUNT;
  const xlines = [];
  for (let i = 0; i <= width / padding; i++) {
    xlines.push(<Line
      key={`i-${i}`}
      points={[Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height]}
      stroke='#ddd'
      strokeWidth={1} />);
  }


  const ylines = [];
  // ylines.push(<Line points={[0, 0, 10, 10]} />);
  for (let j = 0; j <= height / padding; j++) {
    ylines.push(<Line
      key={`j-${j}`}
      points={[0, Math.round(j * padding), width, Math.round(j * padding)]}
      stroke={'#ddd'}
      strokeWidth={0.5} />);
  }

  return <Layer>
    {[...xlines, ...ylines]}
  </Layer>;
};
