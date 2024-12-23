import { ScaleSequential } from "d3-scale"
import { TooltipPlacement } from "../Tooltip/types"

export interface TimeRange {
  from: Date
  to: Date
}

export type CellShape = "circle" | "square"

export type BaseCalendarHeatMapItemType = {
  day: string
  value: number
  projects?: Record<string, string>
}

export interface CalendarHeatMapProps<CalendarHeatMapItemType> {
  className?: string
  data: Array<CalendarHeatMapItemType>
  weekday?: "weekday" | "weekend"
  /**
   * Tooltip placement. If none is specified then is automatic depending on
   * the quadrant
   */
  tooltipPlacement?: TooltipPlacement

  /**
   * Tooltip custom css class
   */
  tooltipClassName?: string

  /**
   * Disable custom tooltip
   *
   * @default false
   */
  disableTooltip?: boolean

  /**
   * Tooltip offset X
   *
   * @default 0
   */
  tooltipOffsetX?: number

  /**
   * Tooltip offset Y
   *
   * @default 0
   */
  tooltipOffsetY?: number

  timeRange?: TimeRange

  /**
   * Custom ScaleSequential from D3
   */
  customD3ColorScale?: ScaleSequential<string>

  width?: number

  cellSize?: number

  cellShape?: CellShape

  formatDate?: (date: Date) => string

  formatMonth?: (date: Date) => string

  formatDay?: (dayOfWeek: number) => string

  /**
   * Override value text for node
   */
  valueFn?: (value: number) => string

  defaultColor?: string

  marginTop?: number

  marginBottom?: number

  marginLeft?: number

  paddingUnderMonthHeader?: number

  paddingAfterDayOfWeekHeader?: number

  cellPadding?: number

  /**
   * If true, timeRange.from is ignored and it's calculated based on width to fill
   * all width with cells
   */
  fillToWidth?: boolean

  labelsFillColor?: string
}
