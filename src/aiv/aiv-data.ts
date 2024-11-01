import { StructureType } from "../canvas/objects/factory/StructureFactory";

export type GameSerializedAIVData = {
  constructions: Array<Array<number>>; // 100x100
  steps: Array<Array<number>>; // 100x100
  placements: Array<Array<number>>; // 100x100
}

export type Construction = {
  type: StructureType,
  step: number,
}

export type Pauses = {
  value: number,
  steps: Array<number>,
}

export type Tile = {
  x: number,
  y: number,
  construction: Construction,
}

export type SparseSerializedAIVData = {
  tiles: Array<Tile>,
  pause: Pauses,
}

export function fromFile(path: string) {
  return {} as GameSerializedAIVData
}

export function fromYML(path: string) {
  return {} as SparseSerializedAIVData
}

export type ConstructionStep = {
  type: 'construction';
  object: 'Hovel';
  tile: {
    x: number;
    y: number;
  };
}

export type DefensesStep = {
  type: 'defenses';
  object: 'HighWall';
  tiles: Array<{
    x: number;
    y: number;
  }>;
}

export type Step = ConstructionStep | DefensesStep;

export type AIVData = {
  steps: Array<Step>,
  pause: Pauses,
}

