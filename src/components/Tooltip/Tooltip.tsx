import "./Tooltip.css";

import * as React from "react";

import useTooltip from "./useTooltip";

interface TooltipProps {
  label: React.ReactNode;
  value?: number | string | Date;
}

export const Tooltip = React.memo<TooltipProps>(({ label, value }) => {
  const { tooltipClassName } = useTooltip();
  return (
    <div className={tooltipClassName}>
      <div className="CalendarHeatMap__tooltip">
        {value !== undefined ? (
          <>
            <span className="CalendarHeatMap__tooltipLabel">{label}: </span>
            <span className="CalendarHeatMap__tooltipValue">{`${value}`}</span>
          </>
        ) : (
          label
        )}
      </div>
    </div>
  );
});
