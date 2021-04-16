import "./App.css";

import * as React from "react";
import CalendarHeatMap from "../../src/components/CalendarHeatMap";
import { data } from "../data/data";

const App: React.FunctionComponent = () => {
  return <CalendarHeatMap data={data} />;
};

export default App;
