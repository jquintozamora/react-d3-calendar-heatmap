import "./App.css";

import * as React from "react";
import CalendarHeatMap from "../../src/components/CalendarHeatMap";
import { data } from "../data/data";

interface CalendarHeatMapItemType {
  day: string
  value: number
  projects?: Array<Record<string, number>>
}


const App: React.FunctionComponent = () => {
  return <CalendarHeatMap<CalendarHeatMapItemType> data={data} />;
};

export default App;
