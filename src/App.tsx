import { useCallback, useMemo, useRef, useState } from 'react'

import { atom, getDefaultStore, useAtom, useAtomValue } from 'jotai';
import { atomFamily } from 'jotai/utils';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const randomColor = () => `#${Math.floor(Math.random() * 255).toString(16)}${Math.floor(Math.random() * 255).toString(16)}${Math.floor(Math.random() * 255).toString(16)}`;
const highlightAtom = atomFamily((id) => atom(randomColor()));
type Position = {x: number; y:number }
const positionAtom = atom<Position>()

const selectedObjectAtom = atom<number>(5);

type GridElementProps = {
  id: number;
}
const GridElement = (props: GridElementProps) => {
  const [color, setColor] = useAtom(highlightAtom(props.id))
  return (<div style={{
    backgroundColor: color,
    width: '8px',
    height: '8px',
  }}
  onMouseEnter={() => {
    // setColor(randomColor())
    const pos = {x: props.id % 100, y: ~~(props.id / 100)};
    getDefaultStore().set(positionAtom, pos)
    for(const i of [...Array(getDefaultStore().get(selectedObjectAtom)).keys()]) {
      for (const j of [...Array(getDefaultStore().get(selectedObjectAtom)).keys()]) {
        getDefaultStore().set(highlightAtom( (pos.x + i) + ((pos.y + j)*100)), 'green');
      }
    }
  }}
  ></div>)
}

function App() {
  const divRef = useRef(null);

  const position = useAtomValue(positionAtom) || {x: -1, y:-1};
  const {x, y} = position;
  const objectSize = useAtomValue(selectedObjectAtom)

  useCallback(() => {
    for(const i of [...Array(objectSize).keys()]) {
      for (const j of [...Array(objectSize).keys()]) {
        getDefaultStore().set(highlightAtom( i + (j*100)), 'green');
      }
    }
  }, [x, y])

  const grid = useMemo(() => {
    return (<div ref={divRef} style={{
      width: '800px',
      height: '800px',
      backgroundColor: 'black',
      display: 'grid',
      gridTemplateColumns: 'repeat(100, 1fr)',
      padding: '0',

    }}
    >
      {Array.from(new Array(100*100).keys()).map((i) => <GridElement id={i}/>)}
    </div>)
  }, [])

  return (
    <div className="App">
      {grid}
      <div>{x}, {y}</div>
    </div>
    
  );
}

export default App;
