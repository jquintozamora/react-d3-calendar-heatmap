import "./CalendarHeatMap.css";

import * as React from "react";
import classnames from "classnames";
import { utcYear, utcMonday, utcMonths, utcMonth, timeDay } from "d3-time";
import { scaleSequential } from "d3-scale";
import { interpolatePiYG } from "d3-scale-chromatic";
import { quantile, range } from "d3-array";
import { format } from "d3-format";
import { utcFormat } from "d3-time-format";

import TooltipProvider from "../Tooltip/TooltipProvider";
import Cell from "../Cell";
import {
  BaseCalendarHeatMapItemType,
  CalendarHeatMapProps,
  TimeRange,
} from "./CalendarHeatMapProps";
import { sameDay } from "../../helpers";

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
  customD3ColorScale = scaleSequential(interpolatePiYG),
  width = 900,
  cellSize = 17,
  cellShape = "circle",
  formatDate = utcFormat("%Y-%m-%d"),
  valueFn = format(".2f"),
  defaultColor = "#eeeeee",
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  paddingUnderMonthHeader = 8,
  paddingAfterDayOfWeekHeader = 8,
  cellPadding = 2,
  formatDay = (dayOfWeek: number) => "SMTWTFS"[dayOfWeek],
}: CalendarHeatMapProps<CalendarHeatMapItemType>): React.ReactElement => {
  const { 0: firstData, [data.length - 1]: lastData } = data;

  const currentTimeRange: TimeRange = timeRange
    ? timeRange
    : {
        from: utcYear(new Date(firstData ? firstData.day : "")),
        to: new Date(lastData ? lastData.day : ""),
      };
  const { from, to } = currentTimeRange;

  // Make sure we narrow down data to fit in time time range
  const timeRangeData = timeDay.range(from, to).map((day) => {
    const currentData = data
      .filter((item) => sameDay(new Date(item.day), day))
      .pop();
    return currentData
      ? currentData
      : ({
          day: day.toISOString().slice(0, 10),
          value: 0,
        } as CalendarHeatMapItemType);
  });

  // formatting
  const formatMonth = utcFormat("%b");

  // color
  const max = quantile(timeRangeData, 0.9975, (d) => Math.abs(d.value));
  const color = customD3ColorScale.domain([-max, +max]);

  const timeWeek = utcMonday;
  const countDay =
    weekday === "weekend"
      ? (i: number) => (i - (1 % 7) + 7) % 7
      : (i: number) => (i + 6) % 7;

  const rows = weekday === "weekday" ? range(1, 6) : range(0, 7);

  const columns = utcMonths(utcMonth(from), to);

  const cells =
    weekday === "weekday"
      ? timeRangeData.filter(
          (d) => ![0, 6].includes(new Date(d.day).getUTCDay())
        )
      : timeRangeData;

  // We control width with prop, use it to set marginRight for now
  // const marginRight = 0;

  const svgWidth = width; // / (12 / columns.length);
  const svgHeight =
    cellSize * (weekday === "weekday" ? 6 : 8) +
    marginTop +
    marginBottom +
    paddingUnderMonthHeader;

  const isSameYear = from.getUTCFullYear() === to.getUTCFullYear();
  const year = `${from.getUTCFullYear()}${
    !isSameYear ? "/" + to.getUTCFullYear().toString().slice(-2) : ""
  }`;
  const offsetYear = isSameYear
    ? paddingAfterDayOfWeekHeader
    : paddingAfterDayOfWeekHeader + 15;

  return (
    <TooltipProvider
      tooltipPlacement={tooltipPlacement}
      tooltipClassName={tooltipClassName}
      disableTooltip={disableTooltip}
      tooltipOffsetX={tooltipOffsetX}
      tooltipOffsetY={tooltipOffsetY}
      valueFn={valueFn}
    >
      <div className={classnames("CalendarHeatMap", className)}>
        <svg fontSize="10px" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <g
            transform={`translate(${28 + marginLeft + offsetYear}, ${
              10 + marginTop + paddingUnderMonthHeader
            })`}
          >
            <text
              x={-paddingAfterDayOfWeekHeader}
              y={-paddingUnderMonthHeader}
              fontWeight="bold"
              textAnchor="end"
            >
              {year}
            </text>
            <g textAnchor="end">
              {rows.map((row, index) => {
                return (
                  <text
                    key={index}
                    x={-paddingAfterDayOfWeekHeader}
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
                    timeRange={currentTimeRange}
                    cellShape={cellShape}
                    defaultColor={defaultColor}
                    cellPadding={cellPadding}
                  />
                );
              })}
            </g>
            <g>
              {columns.map((d, index) => {
                const monthPosX =
                  timeWeek.count(from, timeWeek.ceil(d)) * cellSize + 2;

                // When timeRange starts from 29 or 30, two months label overlaps
                if (monthPosX <= -10) {
                  return null;
                }

                return (
                  <g key={index}>
                    <text
                      x={Math.max(monthPosX, 0)}
                      y={-paddingUnderMonthHeader}
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
