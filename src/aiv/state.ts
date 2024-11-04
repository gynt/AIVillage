import { atom } from "jotai";
import { AIVData, Step } from "./aiv-data";
import { generateID } from "./id";

export const CURRENT_AIV_DATA = atom<AIVData>({
  steps: new Array<Step>(
    {
      id: generateID('step'),
      type: 'construction',
      object: 'Keep',
      tile: { x: 43, y: 43 },
    } as Step,
    {
      id: generateID('step'),
      type: 'construction',
      object: 'Hovel',
      tile: { x: 5, y: 5 },
    } as Step,
    {
      id: generateID('step'),
      type: 'construction',
      object: 'Hovel',
      tile: { x: 15, y: 15 },
    } as Step)
} as AIVData);