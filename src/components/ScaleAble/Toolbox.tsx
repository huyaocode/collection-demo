import React, { FC, CSSProperties } from "react";

export interface ToolboxProps {
  className?: string;
  style?: CSSProperties;
  zoom: number;
  zoomMin: number;
  zoomMax: number;
  zoomStep: number;
  onChangeOfZoom(zoom: number): void;
}

const Toolbox: FC<ToolboxProps> = (props) => {
  const { zoom, zoomMin, zoomMax, zoomStep, onChangeOfZoom } = props;
  const zoominDisabled = zoom >= zoomMax;
  const zoomoutDisabled = zoom <= zoomMin;

  return (
    <div style={{ display: "flex"}}>
      <button
        style={{ padding: '0 50px' }}
        disabled={zoomoutDisabled}
        onClick={() => {
          if (!zoomoutDisabled) {
            onChangeOfZoom(Math.max(zoomMin, zoom - zoomStep) as number);
          }
        }}
      >
        -
      </button>
      <button
        style={{ padding: '0 50px' }}
        disabled={zoominDisabled}
        onClick={() => {
          if (!zoominDisabled) {
            onChangeOfZoom(Math.min(zoom + zoomStep, zoomMax) as number);
          }
        }}
      >
        +
      </button>

      <div>{zoom}%</div>
    </div>
  );
};

export default Toolbox;
