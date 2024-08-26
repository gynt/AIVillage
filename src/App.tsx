import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { atom, getDefaultStore, useAtom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { KonvaNodeComponent, Layer, Line, Rect, Stage, StageProps } from 'react-konva';

const randomColor = () => `#${Math.floor(Math.random() * 255).toString(16)}${Math.floor(Math.random() * 255).toString(16)}${Math.floor(Math.random() * 255).toString(16)}`;
const highlightAtom = atomFamily((id) => atom(randomColor()));
type Position = {x: number; y:number }
const positionAtom = atom<Position>()

const selectedObjectAtom = atom<number>(13);

type GridElementProps = {
  id: number;
  // x: number;
  // y:number;
  // width: number;
  // height: number;
}
const GridElement = (props: GridElementProps) => {
  const [color, setColor] = useAtom(highlightAtom(props.id))
  const {id} = props;
  // Adding this makes it super slow, event slower than a css grid...
  const onMouseEnter = () => {
    // setColor(randomColor())
    const pos = {x: id % 100, y: ~~(id / 100)};
    getDefaultStore().set(positionAtom, pos)
    for(const i of [...Array(getDefaultStore().get(selectedObjectAtom)).keys()]) {
      for (const j of [...Array(getDefaultStore().get(selectedObjectAtom)).keys()]) {
        getDefaultStore().set(highlightAtom( (pos.x + i) + ((pos.y + j)*100)), 'green');
      }
    }
  };
  const obj = useMemo( () => (<Rect fill={color}
    x={(id % 100) * 8}
    y={(Math.floor(id / 100)) * 8}
    width={8}
    height={8}
  // onMouseEnter={onMouseEnter}
  />), []);
  return obj;
}

const ShadowRectangle = (props: any) => {
  const size = useAtomValue(selectedObjectAtom);
  return <Rect x={0} y={0} width={8*size} height={8*size} 
  fill = {'#FF7B17'}
  opacity={0.6}
  stroke={'#CF6412'}
  strokeWidth={3}
  dash={[20, 2]}
  {...props} />
}
const ConstructionRectangle = () => {

}
const GridLayer = () => {
  //https://medium.com/@pierrebleroux/snap-to-grid-with-konvajs-c41eae97c13f
  const padding = 8;
  const width = 8*100;
  const height = 8*100;
  const xlines = []
  for (var i = 0; i < width / padding; i++) {
    xlines.push(<Line
      points= {[Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height]}
      stroke= '#ddd'
      strokeWidth={1}
      />);
  }


  const ylines=[]
  ylines.push(<Line points={ [0,0,10,10]}/>);
  for (var j = 0; j < height / padding; j++) {
    ylines.push(<Line
      points= {[0, Math.round(j * padding), width, Math.round(j * padding)]}
      stroke= {'#ddd'}
      strokeWidth={ 0.5}
    />);
  }

  return <Layer>
    {[...xlines, ...ylines]}
  </Layer>
}

function App() {
  const divRef = useRef(null);

  const position = useAtomValue(positionAtom) || {x: -1, y:-1};
  const {x, y} = position;
  const objectSize = useAtomValue(selectedObjectAtom)

  // useCallback(() => {
  //   for(const i of [...Array(objectSize).keys()]) {
  //     for (const j of [...Array(objectSize).keys()]) {
  //       getDefaultStore().set(highlightAtom( i + (j*100)), 'green');
  //     }
  //   }
  // }, [])

  // const onMouseEnter = (e) => {
  //   // setColor(randomColor())
  //   const pos = {x: id % 100, y: ~~(id / 100)};
  //   getDefaultStore().set(positionAtom, pos)
  //   for(const i of [...Array(getDefaultStore().get(selectedObjectAtom)).keys()]) {
  //     for (const j of [...Array(getDefaultStore().get(selectedObjectAtom)).keys()]) {
  //       getDefaultStore().set(highlightAtom( (pos.x + i) + ((pos.y + j)*100)), 'green');
  //     }
  //   }
  // };

  const shadowRectangleRef = useRef(null);
  const stageRef = useRef<Stage>(null);
  const scaleBy = 1.20;
  const stage = useMemo(() => (
    <Stage ref={stageRef} width={100 * 8} height = {100*8}
    draggable={true}
    onWheel={(e) => {
      // stop default scrolling
      if (stageRef.current === null) return;

      e.evt.preventDefault();

      const stage = stageRef.current;
      var oldScale = stage.scaleX();
      var pointer = stage.getPointerPosition();

      var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      // how to scale? Zoom in? Or zoom out?
      let direction = e.evt.deltaY > 0 ? 1 : -1;

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
        <GridLayer/>
        <Layer 
          // Why this so slow !?
          onDragMove={(e) => {
            const x = Math.floor(e.evt.layerX / 8);
            const y = Math.floor(e.evt.layerY / 8);
            getDefaultStore().set(positionAtom, {x, y})
            // for(const i of [...Array(getDefaultStore().get(selectedObjectAtom)).keys()]) {
            //   for (const j of [...Array(getDefaultStore().get(selectedObjectAtom)).keys()]) {
            //     getDefaultStore().set(highlightAtom( (x + i) + ((y + j)*100)), 'green');
            //   }
            // }
          }}
        >
          <Rect x={0} y={0} width={8*objectSize} height={8*objectSize} 
                fill = {'#FF7B17'}
                opacity={0.6}
                stroke={'#CF6412'}
                strokeWidth={3}
                dash={[20, 2]}
                ref={shadowRectangleRef} />
          <Rect 
            x={10*8} 
            y={10*8} 
            width={8 * objectSize} 
            height={8 * objectSize} 
            draggable={true} 
            fill={randomColor()}
            stroke={'#ddd'}
            strokeWidth={1}
            shadowColor='black'
            shadowBlur={2}
            shadowOffset={{x: 1, y: 1}}
            shadowOpacity={0.4}
            onDragStart={(e) => {
              console.log(shadowRectangleRef.current);
              if(shadowRectangleRef.current === null) return;

              const sr =shadowRectangleRef.current;
              console.log(sr);
              sr.show();
              sr.moveToTop();
              e.target.moveToTop()
            }}
            onDragMove={(e) => {
              if(shadowRectangleRef.current === null) return;

              const sr =shadowRectangleRef.current;

              sr.position({
                x: Math.round(e.target.x() / 8) * 8,
                y: Math.round(e.target.y() / 8) * 8,
              })

              if (stageRef.current !== null) {
                stageRef.current.batchDraw()
              }
            }}
            onDragEnd={(e) => {
              e.target.position({
                x: Math.round(e.target.x() / 8) * 8,
                y: Math.round(e.target.y() / 8) * 8,
              })
              if(stageRef.current !== null) {
                stageRef.current.batchDraw();
              }
              if (shadowRectangleRef.current !== null) {
                shadowRectangleRef.current.hide()
              }
            }}
          />
        </Layer>
      </Stage>
  ), []);

  return (
    <div className="App" style={{borderWidth: 1, borderColor: 'black'}}>
      {stage}
      <div>{x}, {y}</div>
    </div>
    
  );
}

export default App;
