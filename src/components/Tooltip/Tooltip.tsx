import "./Tooltip.css";

import * as React from "react";

import useTooltip from "./useTooltip";

interface TooltipProps {
  label: React.ReactNode;
  value?: number;
  projects?: Record<string, number>;
}

export const Tooltip = React.memo<TooltipProps>(
  ({ label, value, projects }) => {
    const { tooltipClassName, valueFn } = useTooltip();
    return (
      <div className={tooltipClassName}>
        <div className="CalendarHeatMap__tooltip">
          {value !== undefined ? (
            <>
              <span className="CalendarHeatMap__tooltipLabel">{label}: </span>
              <span className="CalendarHeatMap__tooltipValue">{`${valueFn(
                value
              )}`}</span>
            </>
          ) : (
            label
          )}
          {projects && (
            <div className="CalendarHeatMap__tooltipProjects">
              {Object.keys(projects).map((project, index) => {
                return (
                  <div key={index}>
                    <span className="CalendarHeatMap__tooltipLabel">
                      {project}:{" "}
                    </span>
                    <span className="CalendarHeatMap__tooltipValue">{`${valueFn(
                      projects[project]
                    )}`}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);
