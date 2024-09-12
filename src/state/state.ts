import { atom } from "jotai";
import { Position } from '../common/Position';
import { randomColor } from '../canvas/colors';
import { atomFamily } from "jotai/utils";


export const selectedObjectAtom = atom<number>(13); export const positionAtom = atom<Position>();
const highlightAtom = atomFamily((id) => atom(randomColor()));

