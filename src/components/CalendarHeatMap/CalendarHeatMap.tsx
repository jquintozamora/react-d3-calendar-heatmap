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
}: CalendarHeatMapProps<CalendarHeatMapItemType>): React.ReactElement => {
  const { 0: firstData, [data.length - 1]: lastData } = data;
  const currentTimeRange: TimeRange = timeRange
    ? timeRange
    : {
        from: utcYear(new Date(firstData ? firstData.day : "")),
        to: new Date(lastData ? lastData.day : ""),
      };

  // Make sure we narrow down data to fit in time time range
  const timeRangeData = timeDay
    .range(currentTimeRange.from, currentTimeRange.to)
    .map((day) => {
      const currentData = data
        .filter((item) => sameDay(new Date(item.day), day))
        .pop();
      return currentData
        ? currentData
        : ({
            day: day.toISOString(),
            value: 0,
          } as CalendarHeatMapItemType);
    });

  // formatting
  const formatValue = format("+.2%");
  const formatDate = utcFormat("%x");
  const formatDay = (i) => "SMTWTFS"[i];
  const formatMonth = (d: Date) => {
    if (d.getUTCMonth() === 0) {
      return (
        <>
          {utcFormat("%b")(d)}
          <title>{d.getUTCFullYear()}</title>
        </>
      );
    }
    return utcFormat("%b")(d);
  };

  // color
  const max = quantile(timeRangeData, 0.9975, (d) => Math.abs(d.value));
  const color = customD3ColorScale.domain([-max, +max]);

  const timeWeek = weekday === "sunday" ? utcSunday : utcMonday;
  const countDay =
    weekday === "sunday" ? (i: number) => i : (i: number) => (i + 6) % 7;

  const rows = weekday === "weekday" ? range(1, 6) : range(7);

  const columns = utcMonths(
    utcMonth(currentTimeRange.from),
    currentTimeRange.to
  );

  const cells =
    weekday === "weekday"
      ? timeRangeData.filter(
          (d) => ![0, 6].includes(new Date(d.day).getUTCDay())
        )
      : timeRangeData;

  const headerPadding = 3;
  const marginLeft = 0;
  const marginTop = 0;
  const marginBottom = 0;
  // We control width with prop, use it to set marginRight for now
  // const marginRight = 0;

  const svgWidth = width; // / (12 / columns.length);
  const svgHeight =
    cellSize * (weekday === "weekday" ? 6 : 8) + marginTop + marginBottom;

  return (
    <TooltipProvider
      tooltipPlacement={tooltipPlacement}
      tooltipClassName={tooltipClassName}
      disableTooltip={disableTooltip}
      tooltipOffsetX={tooltipOffsetX}
      tooltipOffsetY={tooltipOffsetY}
    >
      <div className={classnames("CalendarHeatMap", className)}>
        <svg fontSize="10px" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <g
            id="year"
            transform={`translate(${28 + marginLeft}, ${13 + marginTop})`}
          >
            <text
              x={-headerPadding}
              y={-headerPadding}
              fontWeight="bold"
              textAnchor="end"
            >
              {currentTimeRange.from.getUTCFullYear()}
            </text>
            <g textAnchor="end">
              {rows.map((row, index) => {
                return (
                  <text
                    key={index}
                    x={-headerPadding}
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
                      y={-headerPadding}
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
