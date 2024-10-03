import { useEffect, useMemo, useRef, useState } from 'react'

import { getDefaultStore, useAtomValue } from 'jotai';
import type { Rect as RectType } from 'konva/lib/shapes/Rect'
import type { Stage as StageType } from 'konva/lib/Stage'

import './App.css'
import { Group, Layer, Rect, Stage } from 'react-konva';
import { Toolbar } from './toolbar/Toolbar';
import { KonvaEventObject } from 'konva/lib/Node';
import { selectedObjectAtom } from './state/state';
import { positionAtom } from './state/state';
import { randomColor } from './canvas/colors';
import { ShadowRectangle } from './canvas/objects/ShadowRectangle';
import { GRID_CELL_COUNT, GRID_CELL_SIZE } from './common/constants';
import { GridLayer } from './canvas/GridLayer';
import { Structure } from './canvas/objects/Structure';

function App() {
  const divRef = useRef<HTMLDivElement>(null)
  const shadowRectangleRef = useRef<RectType>(null);
  const stageRef = useRef<StageType>(null);
  const [dimensions, setDimensions] = useState({
    width: GRID_CELL_SIZE * GRID_CELL_COUNT,
    height: GRID_CELL_SIZE * GRID_CELL_COUNT
  })

  // Create a responsive canvas
  // https://konvajs.org/docs/sandbox/Responsive_Canvas.html
  useEffect(() => {
    if (stageRef.current !== null && divRef.current !== null) {
      const sceneWidth = GRID_CELL_COUNT * GRID_CELL_SIZE;
      const sceneHeight = sceneWidth;

      const containerWidth = divRef.current.offsetWidth;
      const containerHeight = divRef.current.offsetHeight;

      // const scale = (containerWidth) / sceneWidth;
      // const scale = (containerHeight < containerWidth) ?
      //   (containerHeight) / sceneHeight :
      //   (containerWidth) / sceneWidth;

      // stageRef.current.width(sceneWidth * scale);
      // stageRef.current.height(sceneHeight * scale)

      // stageRef.current.scale({ x: scale * 0.95, y: scale * 0.95 });
      // stageRef.current.position({ x: 20, y: 20 })


      const scaleWidth = containerWidth / sceneWidth;
      const scaleHeight = containerHeight / sceneHeight;

      stageRef.current.width(sceneWidth * scaleWidth);
      // stageRef.current.height(containerHeight)

      stageRef.current.scale({ x: scaleWidth, y: scaleWidth });
      stageRef.current.position({ x: 0, y: containerHeight / -2 })

    }
  }, [])

  const position = useAtomValue(positionAtom) || { x: -1, y: -1 };
  const { x, y } = position;
  const objectSize = useAtomValue(selectedObjectAtom)

  const onRectDragStart = (e: KonvaEventObject<DragEvent>) => {
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

  const onRectDragMove = (e: KonvaEventObject<DragEvent>) => {
    if (shadowRectangleRef.current === null) return;

    const x = e.target.x();
    const y = e.target.y();

    const targetPosition = {
      x: Math.max(0, Math.min((GRID_CELL_COUNT * GRID_CELL_SIZE) - e.target.width(), x)),
      y: Math.max(0, Math.min((GRID_CELL_COUNT * GRID_CELL_SIZE) - e.target.height(), y)),
    }
    e.target.position(targetPosition)

    const sr = shadowRectangleRef.current;

    sr.position({
      x: Math.round(targetPosition.x / GRID_CELL_SIZE) * GRID_CELL_SIZE,
      y: Math.round(targetPosition.y / GRID_CELL_SIZE) * GRID_CELL_SIZE,
    })

    if (stageRef.current !== null) {
      stageRef.current.batchDraw()
    }

  }

  const onRectDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const gridPos = {
      x: Math.round(e.target.x() / GRID_CELL_SIZE),
      y: Math.round(e.target.y() / GRID_CELL_SIZE),
    }
    const pos = {
      x: gridPos.x * GRID_CELL_SIZE,
      y: gridPos.y * GRID_CELL_SIZE,
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

  const scaleBy = 1.05;
  const stage = useMemo(() => (
    <Stage
      scale={{ x: 1, y: 1 }}
      ref={stageRef}
      width={dimensions.width} // {dimensions.width}
      height={dimensions.height} // {dimensions.height}
      draggable={true}
      onWheel={(e) => {
        // stop default scrolling
        if (stageRef.current === null) return;

        e.evt.preventDefault();

        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        if (pointer === null) return;

        var mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? -1 : 1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
          direction = -direction;
        }

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        var newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
      }}>
      <GridLayer />
      <Layer      >
        <ShadowRectangle ref={shadowRectangleRef} />
        <Rect
          x={10 * GRID_CELL_SIZE}
          y={10 * GRID_CELL_SIZE}
          width={GRID_CELL_SIZE * objectSize}
          height={GRID_CELL_SIZE * objectSize}
          draggable={true}
          fill={randomColor()}
          stroke={'#ddd'}
          strokeWidth={1}
          shadowColor='black'
          shadowBlur={2}
          shadowOffset={{ x: 1, y: 1 }}
          shadowOpacity={0.4}
          onDragStart={(e) => onRectDragStart(e)}
          onDragMove={onRectDragMove}
          onDragEnd={onRectDragEnd}
        />
        <Structure
          gridX={50}
          gridY={50}
          structureDefinition={[{ x: 0, y: 0, size: 5 }, { x: 5, y: 0, size: 5 }, { x: 0, y: 5, size: 5 },]}
          shadowRectangleRef={shadowRectangleRef}
          stageRef={stageRef}
        />
        <Structure
          gridX={10}
          gridY={10}
          structureDefinition={[{ x: 0, y: 0, size: 4 }, { x: 4, y: 0, size: 4 },]}
          shadowRectangleRef={shadowRectangleRef}
          stageRef={stageRef}
        />
      </Layer>
    </Stage>
  ), []);

  return (
    <div
      className='App'
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Toolbar />
      <div className="row" style={{
        marginTop: 10,
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: 10,
        marginRight: 10,
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: '100%',
      }}

      >
        <div
          className='col-10'
          style={{
            width: '90%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: 'black',
            paddingLeft: 0,
            paddingRight: 0,
          }}
          ref={divRef}
          id="stage-container">
          {stage}
        </div>


        <div className='col-2' style={{
          width: '10%',
        }}>
          Test
        </div>
      </div>
      <div className="row" style={{
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: 10,
        marginRight: 10,
      }}>
        <div className="col-10" style={{
          width: '90%',
        }}>
          {x}, {y}
        </div>

      </div>
    </div>
  );
}

export default App;
