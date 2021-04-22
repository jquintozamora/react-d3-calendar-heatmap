import { ScaleSequential } from "d3-scale";
import { TooltipPlacement } from "../Tooltip/types";

export type BaseCalendarHeatMapItemType = { day: string; value: number };

export interface CalendarHeatMapProps<CalendarHeatMapItemType> {
  className?: string;
  data: Array<CalendarHeatMapItemType>;
  weekday?: "weekday" | "sunday";
  /**
   * Tooltip placement. If none is specified then is automatic depending on
   * the quadrant
   */
  tooltipPlacement?: TooltipPlacement;

  /**
   * Tooltip custom css class
   */
  tooltipClassName?: string;

  /**
   * Disable custom tooltip
   *
   * @default false
   */
  disableTooltip?: boolean;

  /**
   * Tooltip offset X
   *
   * @default 0
   */
  tooltipOffsetX?: number;

  /**
   * Tooltip offset Y
   *
   * @default 0
   */
  tooltipOffsetY?: number;

  timeRange?: { from: Date; to: Date };

  /**
   * Custom ScaleSequential from D3
   */
  customD3ColorScale?: ScaleSequential<string>;

  width?: number;

  cellSize?: number;
}
