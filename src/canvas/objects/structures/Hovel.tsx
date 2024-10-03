import { Structure, StructureProps } from "./Structure"

export type HovelProps = StructureProps;

export const Hovel = (props: HovelProps) => {
  return <Structure {...props} />
}