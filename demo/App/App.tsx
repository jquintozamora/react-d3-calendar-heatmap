import "./App.css";

import * as React from "react";
import * as chromatic from "d3-scale-chromatic";
import { scaleSequential } from "d3-scale";

import CalendarHeatMap from "../../src/components/CalendarHeatMap";
import { data } from "../data/data";

interface CalendarHeatMapItemType {
  day: string;
  value: number;
  projects?: Record<string, string>;
}

const timeRange = {
  from: new Date("2021-02-30"),
  to: new Date(),
};

const App: React.FunctionComponent = () => {
  return (
    <CalendarHeatMap<CalendarHeatMapItemType>
      data={data}
      weekday="sunday"
      timeRange={timeRange}
      customD3ColorScale={scaleSequential(chromatic.interpolateSpectral)}
      width={160}
      cellSize={11}
      cellShape="square"
      valueFn={(value) => value.toString()}
      cellPadding={1}
    />
  );
};

export default App;
