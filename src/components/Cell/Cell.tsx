import * as React from "react";
import useTooltip from "../Tooltip/useTooltip";
import { Tooltip } from "../Tooltip/Tooltip";
import { utcYear } from "d3-time";

const Cell: React.FunctionComponent<any> = ({
  color,
  cellSize,
  c,
  countDay,
  timeWeek,
  formatDate,
  formatValue,
  ...rest
}) => {
  const { hideTooltip, showTooltip, disableTooltip } = useTooltip();

  const handleMouseMove = React.useCallback(
    (ev: React.MouseEvent) => {
      showTooltip(
        <Tooltip
          label={`${formatDate(new Date(c.date))}`}
          value={`${formatValue(c.value)}`}
        />,
        ev
      );
    },
    [showTooltip]
  );

  const handleMouseLeave = React.useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);
  return (
    <rect
      onMouseEnter={disableTooltip ? undefined : handleMouseMove}
      onMouseLeave={disableTooltip ? undefined : handleMouseLeave}
      onMouseMove={disableTooltip ? undefined : handleMouseMove}
      rx={9999}
      width={cellSize - 2}
      height={cellSize - 2}
      x={
        timeWeek.count(utcYear(new Date(c.date)), new Date(c.date)) * cellSize +
        1
      }
      y={countDay(new Date(c.date).getUTCDay()) * cellSize + 0.5}
      fill={color(c.value)}
      {...rest}
    />
  );
};

export default Cell;
