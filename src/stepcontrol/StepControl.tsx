import { useAtomValue } from "jotai"
import { CURRENT_AIV_DATA } from "../aiv/state"

export function StepControl(props: {}) {
  const data = useAtomValue(CURRENT_AIV_DATA);
  const steps = data.steps.map((step, index) => {
    if (step.type === "construction") {
      return (
        <div>
          <span>{index} - {step.object} ({step.id})</span>
          <span>@{`${step.tile.x},${step.tile.y}`}</span>
        </div>
      )
    }
    return (
      <div>
        <span>{index} - {step.object} ({step.id})</span>
        <span>@{step.tiles.map((tile) => `${tile.x},${tile.y}`).join('; ')}</span>
      </div>
    )
  })
  return (
    <div>
      {steps}
    </div>
  )
}