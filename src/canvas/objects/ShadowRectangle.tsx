import { forwardRef } from 'react';
import { useAtomValue } from 'jotai';
import { Rect } from 'react-konva';
import type { Rect as RectType } from 'konva/lib/shapes/Rect'
import { selectedObjectAtom } from '../../state/state';
import { gridSize } from '../../common/constants';

export const ShadowRectangle = forwardRef<RectType>((props, ref) => {
  const size = useAtomValue(selectedObjectAtom);
  return <Rect
    ref={ref}
    id="shadow-rect"
    x={0}
    y={0}
    width={gridSize * size}
    height={gridSize * size}
    fill={'#FF7B17'}
    opacity={0.6}
    stroke={'#CF6412'}
    strokeWidth={3}
    dash={[20, 2]}
    visible={false}
    {...props} />;
});
