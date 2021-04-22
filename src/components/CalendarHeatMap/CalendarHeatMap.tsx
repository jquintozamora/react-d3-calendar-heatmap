import "./CalendarHeatMap.css";

import * as React from "react";
import classnames from "classnames";
import {
  utcYear,
  utcSunday,
  utcMonday,
  utcMonths,
  utcMonth,
  timeDay,
} from "d3-time";
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
}: CalendarHeatMapProps<CalendarHeatMapItemType>): React.ReactElement => {
  const currentTimeRange = timeRange
    ? timeRange
    : data && data.length > 0
    ? {
        from: utcYear(new Date(data[0].day)),
        to: new Date(data[data.length - 1].day),
      }
    : undefined;
  let filteredData = currentTimeRange
    ? data.filter((d) => {
        const currentDay = new Date(d.day);
        return (
          currentDay >= currentTimeRange.from &&
          currentDay <= currentTimeRange.to
        );
      })
    : data;

  const [color] = React.useState(() => {
    const max = quantile(filteredData, 0.9975, (d) => Math.abs(d.value));
    return customD3ColorScale.domain([-max, +max]);
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
      currentTimeRange
        ? utcMonth(currentTimeRange.from)
        : utcMonth(utcYear(firstDay)),
      currentTimeRange ? currentTimeRange.to : lastDay
    );
  } else {
    console.warn("CalendarHeatMap: Please provide valid data or time range");
  }

  if (currentTimeRange) {
    const tempFilteredData = timeDay
      .range(currentTimeRange.from, currentTimeRange.to)
      .map((day) => {
        const currentData = filteredData
          .filter((item) => sameDay(new Date(item.day), day))
          .pop();
        if (currentData) {
          return currentData;
        }
        return {
          day: day.toISOString(),
          value: 0,
        } as CalendarHeatMapItemType;
      });
    filteredData = tempFilteredData;
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
                    timeRange={currentTimeRange}
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
                          currentTimeRange ? currentTimeRange.from : utcYear(d),
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
