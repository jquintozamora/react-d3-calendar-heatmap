import "./App.css";

import * as React from "react";
import CalendarHeatMap from "../../src/components/CalendarHeatMap";
import { data } from "../data/data";

interface CalendarHeatMapItemType {
  day: string;
  value: number;
  projects?: Array<Record<string, number>>;
}

const timeRange = {
  from: new Date("2020-08-01"),
  to: new Date("2021-08-01"),
};

const App: React.FunctionComponent = () => {
  return (
    <CalendarHeatMap<CalendarHeatMapItemType>
      data={data}
      timeRange={timeRange}
    />
  );
};

export default App;
