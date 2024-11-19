import "./Tooltip.css"

import * as React from "react"

import useTooltip from "./useTooltip"
import { BaseCalendarHeatMapItemType } from "../CalendarHeatMap/CalendarHeatMapProps"

interface TooltipProps {
  label: React.ReactNode
  value?: number
  projects?: BaseCalendarHeatMapItemType["projects"]
}

const InnerTooltip = ({ label, value, projects }: TooltipProps) => {
  const { tooltipClassName, valueFn } = useTooltip()
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
              const projectValue = projects[project]
              const projectValueNumber = !isNaN(
                projectValue as unknown as number
              )
                ? Number(projectValue)
                : 0

              return (
                <div key={index}>
                  <span className="CalendarHeatMap__tooltipLabel">
                    {project}:{" "}
                  </span>
                  <span className="CalendarHeatMap__tooltipValue">{`${valueFn(
                    projectValueNumber
                  )}`}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export const Tooltip = React.memo<TooltipProps>(InnerTooltip)
