import * as React from "react"

export interface ITooltipContext {
  showTooltip: (content: React.ReactNode, event: React.MouseEvent) => void
  hideTooltip: () => void
  tooltipClassName?: string
  valueFn: (n: number | { valueOf(): number }) => string
  disableTooltip: boolean
}

const defaultValues: ITooltipContext = {
  showTooltip: () => {
    throw new Error("TooltipContext not initalized")
  },
  hideTooltip: () => {
    throw new Error("TooltipContext not initalized")
  },
  disableTooltip: false,
  valueFn: (n: number) => `${n}`,
}

const TooltipContext = React.createContext<ITooltipContext>(defaultValues)

export default TooltipContext
