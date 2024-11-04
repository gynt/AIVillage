import { AbstractStructureProps, Structure } from "./Structure"

export type HovelProps = AbstractStructureProps;

export const Hovel = (props: HovelProps) => {
  return <Structure structureDefinition={[{ x: 0, y: 0, size: 4 }]} {...props} />
}