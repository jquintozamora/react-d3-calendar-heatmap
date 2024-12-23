import "./CalendarHeatMap.css"

import * as React from "react"
import classnames from "classnames"
import { utcYear, utcMonday, utcMonths, utcMonth, timeDay } from "d3-time"
import { scaleSequential } from "d3-scale"
import { interpolatePiYG } from "d3-scale-chromatic"
import { quantile, range } from "d3-array"
import { format } from "d3-format"
import { utcFormat } from "d3-time-format"

import TooltipProvider from "../Tooltip/TooltipProvider"
import Cell from "../Cell"
import {
  BaseCalendarHeatMapItemType,
  CalendarHeatMapProps,
  TimeRange,
} from "./CalendarHeatMapProps"
import { sameDay } from "../../helpers"

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
  formatMonth = utcFormat("%b"),
  valueFn = format(".2f"),
  defaultColor = "#eeeeee",
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  paddingUnderMonthHeader = 8,
  paddingAfterDayOfWeekHeader = 8,
  cellPadding = 2,
  formatDay = (dayOfWeek: number) => "SMTWTFS"[dayOfWeek],
  fillToWidth = false,
  labelsFillColor = "black",
}: CalendarHeatMapProps<CalendarHeatMapItemType>): React.ReactElement => {
  const svgWidth = width // / (12 / columns.length);

  const { 0: firstData, [data.length - 1]: lastData } = data

  const timeWeek = utcMonday

  const currentTimeRange: TimeRange = React.useMemo(
    () =>
      timeRange
        ? timeRange
        : {
            from: utcYear(new Date(firstData ? firstData.day : "")),
            to: new Date(lastData ? lastData.day : ""),
          },
    [timeRange, lastData, firstData]
  )

  const { to } = currentTimeRange
  let { from } = currentTimeRange

  if (fillToWidth) {
    const offsetMultipleYearsPlusPadding = 49
    const offsetPosX = 28 + marginLeft + offsetMultipleYearsPlusPadding
    let date = to
    let maxPosX
    do {
      maxPosX =
        timeWeek.count(timeWeek.ceil(date), to) * cellSize + 2 + offsetPosX
      date = timeDay.offset(date, -1)
    } while (svgWidth >= maxPosX)
    from = date
  }

  // Make sure we narrow down data to fit in time time range
  const timeRangeData = timeDay.range(from, to).map((day) => {
    const utcDay = new Date(
      Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())
    )
    const currentData = data
      .filter((item) => sameDay(new Date(item.day), utcDay))
      .pop()
    return currentData
      ? currentData
      : ({
          day: utcDay.toISOString().slice(0, 10),
          value: 0,
        } as CalendarHeatMapItemType)
  })

  // color
  const max = quantile(timeRangeData, 0.9975, (d) => Math.abs(d.value))
  const color = customD3ColorScale.domain([-max, +max])

  const countDay = React.useMemo(
    () =>
      weekday === "weekend"
        ? (i: number) => (i - (1 % 7) + 7) % 7
        : (i: number) => (i + 6) % 7,
    [weekday]
  )

  const rows = weekday === "weekday" ? range(1, 6) : range(0, 7)

  const columns = utcMonths(utcMonth(from), to)

  const cells =
    weekday === "weekday"
      ? timeRangeData.filter(
          (d) => ![0, 6].includes(new Date(d.day).getUTCDay())
        )
      : timeRangeData

  // We control width with prop, use it to set marginRight for now
  // const marginRight = 0;

  const svgHeight =
    cellSize * (weekday === "weekday" ? 6 : 8) +
    marginTop +
    marginBottom +
    paddingUnderMonthHeader

  const isSameYear = from.getUTCFullYear() === to.getUTCFullYear()
  const offsetYear = isSameYear
    ? paddingAfterDayOfWeekHeader
    : paddingAfterDayOfWeekHeader + 15
  const year = `${from.getUTCFullYear()}${
    !isSameYear ? "/" + to.getUTCFullYear().toString().slice(-2) : ""
  }`

  const cellsNodes = React.useMemo(() => {
    return cells.map((c, index) => {
      return (
        <Cell<CalendarHeatMapItemType>
          key={index}
          c={c}
          color={color}
          cellSize={cellSize}
          countDay={countDay}
          timeWeek={timeWeek}
          formatDate={formatDate}
          from={from}
          cellShape={cellShape}
          defaultColor={defaultColor}
          cellPadding={cellPadding}
        />
      )
    })
  }, [
    cells,
    color,
    cellSize,
    countDay,
    timeWeek,
    formatDate,
    from,
    cellShape,
    defaultColor,
    cellPadding,
  ])

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
              fill={labelsFillColor}
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
                    fill={labelsFillColor}
                  >
                    {formatDay(row)}
                  </text>
                )
              })}
            </g>
            <g>{cellsNodes}</g>
            <g>
              {columns.map((d, index) => {
                const monthPosX =
                  timeWeek.count(from, timeWeek.ceil(d)) * cellSize + 2

                // When timeRange starts from 29 or 30, two months label overlaps
                if (monthPosX <= -10) {
                  return null
                }

                return (
                  <g key={index}>
                    <text
                      x={Math.max(monthPosX, 0)}
                      y={-paddingUnderMonthHeader}
                      fill={labelsFillColor}
                    >
                      {formatMonth(d)}
                    </text>
                  </g>
                )
              })}
            </g>
          </g>
        </svg>
      </div>
    </TooltipProvider>
  )
}

export default CalendarHeatMap
