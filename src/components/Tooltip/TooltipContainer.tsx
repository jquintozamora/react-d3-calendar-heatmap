import * as React from "react";
import { useMeasure } from "react-use";
import { TooltipPlacement, TooltipPosition } from "./types";

interface TooltipContainerProps {
  position: TooltipPosition;
  placement: TooltipPlacement;
  children?: React.ReactNode;
  offsetX?: number;
  offsetY?: number;
}

export const TooltipContainer = React.memo<TooltipContainerProps>(
  ({ position, placement, offsetX = 0, offsetY = 0, children }) => {
    const [measureRef, { width, height }] = useMeasure();

    const [newX, newY] = position;
    let x = Math.round(newX);
    let y = Math.round(newY);

    if (width > 0 && height > 0) {
      switch (placement) {
        case "bottom":
          x -= width / 2;
          break;
        case "bottomLeft":
          x -= width;
          y += height / 2;
          break;
        case "bottomRight":
          x += 25;
          y += 20;
          break;
        case "left":
          x -= width + offsetX;
          y -= height / 2 + offsetY;
          break;
        case "right":
          x += 20 + offsetX;
          y -= height / 2 + offsetY;
          // y += height  + offsetY;
          break;
        case "top":
          x -= width / 2;
          y -= height;
          break;
        case "topLeft":
          x -= width;
          y -= height;
          break;
        case "topRight":
          x += 20;
          y -= height;
          break;
        default:
          break;
      }
    }

    const style: React.CSSProperties = {
      pointerEvents: "none",
      position: "absolute",
      zIndex: 10,
      top: 0,
      left: 0,
      maxWidth: "calc(50% - 15px)",
      transform: `translate(${x}px, ${y}px)`,
    };

    return (
      <div ref={measureRef} style={style}>
        {children}
      </div>
    );
  }
);

export default TooltipContainer;
