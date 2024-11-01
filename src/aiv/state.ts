import { atom } from "jotai";
import { AIVData, Step } from "./aiv-data";

export const CURRENT_AIV_DATA = atom<AIVData>({
  steps: new Array<Step>(
    {
      type: 'construction',
      object: 'Hovel',
      tile: { x: 5, y: 5 },
    } as Step,
    {
      type: 'construction',
      object: 'Hovel',
      tile: { x: 15, y: 15 },
    } as Step)
} as AIVData);