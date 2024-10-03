import type { Stage as StageType } from 'konva/lib/Stage';
import type { Group as GroupType } from 'konva/lib/Group';

export const collidesWithAnyOtherStructure = (stage: StageType, a: GroupType) => {
  const structures = stage.find('.Structure');
  for (const structure of structures) {
    if (structure === a) {
      continue;
    }

    const b = structure as unknown as GroupType;

    for (const aPart of a.find('.StructureRect')) {
      const rectA = aPart.getClientRect();
      for (const bPart of b.find('.StructureRect')) {
        const rectB = bPart.getClientRect();
        if (!(rectB.x > rectA.x + rectA.width ||
          rectB.x + rectB.width < rectA.x ||
          rectB.y > rectA.y + rectA.height ||
          rectB.y + rectB.height < rectA.y)) {

          return true;
        }
      }
    }


  }
  return false;
};
