import "./CalendarHeatMap.css";

import * as React from "react";
import classnames from "classnames";
import { utcYear, utcSunday, utcMonday, utcMonths, utcMonth } from "d3-time";
import { scaleSequential } from "d3-scale";
import { interpolatePiYG } from "d3-scale-chromatic";
import { quantile, range } from "d3-array";
import { format } from "d3-format";
import { utcFormat } from "d3-time-format";

import TooltipProvider from "../Tooltip/TooltipProvider";
import { TooltipPlacement } from "../Tooltip/types";
import Cell from "../Cell";

export type BaseCalendarHeatMapItemType = { day: string; value: number };

export interface CalendarHeatMapProps<CalendarHeatMapItemType> {
  className?: string;
  data: Array<CalendarHeatMapItemType>;
  weekday?: "weekday" | "sunday";
  /**
   * Tooltip placement. If none is specified then is automatic depending on
   * the quadrant of the treeMap
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
}

const CalendarHeatMap = <
  CalendarHeatMapItemType extends BaseCalendarHeatMapItemType
>({
  className,
  data,
  weekday = "weekday",
  disableTooltip = false,
  tooltipOffsetX = 0,
  tooltipOffsetY = 0,
  tooltipPlacement,
  tooltipClassName,
  timeRange,
}: CalendarHeatMapProps<CalendarHeatMapItemType>): React.ReactElement => {
  const filteredData = timeRange
    ? data.filter((d) => {
        const currentDay = new Date(d.day);
        return currentDay >= timeRange.from && currentDay <= timeRange.to;
      })
    : data;

  const cellSize = 17;
  const width = 954;

  const [color] = React.useState(() => {
    const max = quantile(filteredData, 0.9975, (d) => Math.abs(d.value));
    return scaleSequential(interpolatePiYG).domain([-max, +max]);
  });

  const height = cellSize * (weekday === "weekday" ? 7 : 9);
  const timeWeek = weekday === "sunday" ? utcSunday : utcMonday;
  const countDay =
    weekday === "sunday" ? (i: number) => i : (i: number) => (i + 6) % 7;

  const formatValue = format("+.2%");

  const formatDate = utcFormat("%x");

  const formatDay = (i) => "SMTWTFS"[i];

  const formatMonth = utcFormat("%b");

  const rows = weekday === "weekday" ? range(1, 6) : range(7);

  const { 0: firstItem, [filteredData.length - 1]: lastItem } = filteredData;
  let columns = [];
  if (firstItem) {
    const firstDay = new Date(firstItem.day);
    const lastDay = new Date(lastItem.day);
    columns = utcMonths(
      timeRange ? utcMonth(timeRange.from) : utcMonth(utcYear(firstDay)),
      timeRange ? timeRange.to : lastDay
    );
  } else {
    console.warn("CalendarHeatMap: Please provide valid data or time range");
  }

  const cells =
    weekday === "weekday"
      ? filteredData.filter(
          (d) => ![0, 6].includes(new Date(d.day).getUTCDay())
        )
      : filteredData;

  const svgWidth = width; // / (12 / columns.length);

  return (
    <TooltipProvider
      tooltipPlacement={tooltipPlacement}
      tooltipClassName={tooltipClassName}
      disableTooltip={disableTooltip}
      tooltipOffsetX={tooltipOffsetX}
      tooltipOffsetY={tooltipOffsetY}
    >
      <div className={classnames("CalendarHeatMap", className)}>
        <svg fontSize="10px" viewBox={`0 0 ${svgWidth} ${height}`}>
          <g id="year" transform={`translate(40.5, ${cellSize * 1.5})`}>
            <text x={-5} y={-5} fontWeight="bold" textAnchor="end">
              2021
            </text>
            <g textAnchor="end">
              {rows.map((row, index) => {
                return (
                  <text
                    key={index}
                    x={-5}
                    y={(countDay(row) + 0.5) * cellSize}
                    dy="0.31em"
                  >
                    {formatDay(row)}
                  </text>
                );
              })}
            </g>
            <g>
              {cells.map((c, index) => {
                return (
                  <Cell<CalendarHeatMapItemType>
                    key={index}
                    c={c}
                    color={color}
                    cellSize={cellSize}
                    countDay={countDay}
                    timeWeek={timeWeek}
                    formatDate={formatDate}
                    formatValue={formatValue}
                    timeRange={timeRange}
                  />
                );
              })}
            </g>
            <g>
              {columns.map((d, index) => {
                return (
                  <g key={index}>
                    {/* {index && (
                    <path
                      fill="none"
                      stroke="#fff"
                      strokeWidth={3}
                      d={pathMonth(d)}
                    ></path>
                  )} */}
                    <text
                      x={
                        timeWeek.count(
                          timeRange ? timeRange.from : utcYear(d),
                          timeWeek.ceil(d)
                        ) *
                          cellSize +
                        2
                      }
                      y={-5}
                    >
                      {formatMonth(d)}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>
    </TooltipProvider>
  );
};

export default CalendarHeatMap;
