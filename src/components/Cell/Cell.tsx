import * as React from "react";
import useTooltip from "../Tooltip/useTooltip";
import { Tooltip } from "../Tooltip/Tooltip";
import { CountableTimeInterval } from "d3-time";
import { ScaleSequential } from "d3-scale";
import {
  BaseCalendarHeatMapItemType,
  CellShape,
} from "../CalendarHeatMap/CalendarHeatMapProps";

interface CellProps<CalendarHeatMapItemType> {
  c: CalendarHeatMapItemType;
  color: ScaleSequential<string, never>;
  cellSize: number;
  countDay: (i: number) => number;
  timeWeek: CountableTimeInterval;
  formatDate: (date: Date) => string;
  timeRange?: { from: Date; to: Date };
  cellShape?: CellShape;
  defaultColor: string;
  cellPadding: number;
}

const Cell = <CalendarHeatMapItemType extends BaseCalendarHeatMapItemType>({
  color,
  cellSize,
  cellPadding,
  c,
  countDay,
  timeWeek,
  formatDate,
  timeRange,
  cellShape,
  defaultColor,
  ...rest
}: CellProps<CalendarHeatMapItemType>): React.ReactElement => {
  const { hideTooltip, showTooltip, disableTooltip } = useTooltip();

  const handleMouseMove = React.useCallback(
    (ev: React.MouseEvent) => {
      showTooltip(
        <Tooltip
          label={`${formatDate(new Date(c.day))}`}
          value={c.value}
          projects={"projects" in c ? c["projects"] : undefined}
        />,
        ev
      );
    },
    [showTooltip]
  );

  const handleMouseLeave = React.useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  const cellDay = new Date(c.day);
  const x =
    timeWeek.count(timeRange.from, cellDay) * cellSize + cellPadding / 2;
  const y = countDay(cellDay.getUTCDay()) * cellSize + cellPadding / 2;

  return (
    <rect
      onMouseEnter={disableTooltip ? undefined : handleMouseMove}
      onMouseLeave={disableTooltip ? undefined : handleMouseLeave}
      onMouseMove={disableTooltip ? undefined : handleMouseMove}
      rx={cellShape === "circle" ? 9999 : 1}
      width={cellSize - cellPadding}
      height={cellSize - cellPadding}
      x={x}
      y={y}
      fill={c.value ? color(c.value) : defaultColor}
      {...rest}
    />
  );
};

export default Cell;
