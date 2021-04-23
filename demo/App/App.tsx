import "./App.css";

import * as React from "react";
import * as chromatic from "d3-scale-chromatic";
import { scaleSequential } from "d3-scale";

import CalendarHeatMap from "../../src/components/CalendarHeatMap";
import { data } from "../data/data";

interface CalendarHeatMapItemType {
  day: string;
  value: number;
  projects?: Array<Record<string, number>>;
}

const timeRange = {
  from: new Date("2020-10-01"),
  to: new Date(),
};

const App: React.FunctionComponent = () => {
  return (
    <CalendarHeatMap<CalendarHeatMapItemType>
      data={data}
      // weekday="sunday"
      timeRange={timeRange}
      customD3ColorScale={scaleSequential(chromatic.interpolateSpectral)}
      width={450}
      cellSize={14}
    />
  );
};

export default App;
