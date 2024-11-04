import { AbstractStructureProps, Structure } from "./Structure"

export type KeepProps = AbstractStructureProps;

export const Keep = (props: KeepProps) => {
  return <Structure structureDefinition={[
    { x: 0, y: 0, size: 7 },
    { x: 2, y: 7, size: 1 },
    { x: 3, y: 7, size: 1 },
    { x: 4, y: 7, size: 1 },
    { x: 0, y: 8, size: 7 },
    { x: 7, y: 2, size: 5 }]} {...props} />
}