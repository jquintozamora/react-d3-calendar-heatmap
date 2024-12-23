import "./App.css"

import * as React from "react"
import * as chromatic from "d3-scale-chromatic"
import { scaleSequential } from "d3-scale"
import { useMeasure } from "@react-hookz/web"

import CalendarHeatMap from "../../src/components/CalendarHeatMap"
import { data } from "../data/data"

interface CalendarHeatMapItemType {
  day: string
  value: number
  projects?: Record<string, string>
}

const timeRange = {
  from: new Date("2021-01-25"),
  to: new Date("2021-06-25"),
}

const App: React.FunctionComponent = () => {
  const [measurements, measureRef] = useMeasure<HTMLDivElement>()
  const { width } = measurements || {}

  return (
    <div ref={measureRef}>
      {width > 0 ? (
        <CalendarHeatMap<CalendarHeatMapItemType>
          data={data}
          weekday="weekend"
          timeRange={timeRange}
          customD3ColorScale={scaleSequential(chromatic.interpolateSpectral)}
          width={width}
          cellSize={11}
          cellShape="square"
          valueFn={(value) => value.toString()}
          cellPadding={1}
          tooltipOffsetX={5}
          fillToWidth={true}
          formatDate={(date: Date) =>
            new Intl.DateTimeFormat("en", {
              weekday: "long",
              day: "numeric",
              year: "numeric",
              month: "short",
            }).format(date)
          }
          formatMonth={(date: Date) =>
            new Intl.DateTimeFormat("en", {
              month: "short",
            }).format(date)
          }
          // formatDay={(dayOfWeek: number) => {
          //   const date = new Date(0);
          //   date.setDate(4 + dayOfWeek);
          //   const weekday = new Intl.DateTimeFormat(["en"], {
          //     weekday: "short",
          //   }).format(date);
          //   return weekday;
          // }}
          formatDay={(dayOfWeek: number) => {
            const arrayDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            return arrayDays[dayOfWeek]
          }}
        />
      ) : null}
    </div>
  )
}

export default App
