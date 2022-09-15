import { modulo } from "emnorst";
import { css } from "@linaria/core";
import { useCallback } from "preact/hooks";
import { calcAngle, Draggable } from "../Draggable";

const stopPropagation = (e: { stopPropagation(): void }) => {
  e.stopPropagation();
};

const TAU = Math.PI * 2;
const DEG_RATE = TAU / 360;

export const HueWheel: preact.FunctionComponent<{
  hue: number;
  onChange(hue: number): void;
  size?: string;
}> = ({ hue, onChange, size = "8em", children }) => {
  const setDrag = useCallback((e: MouseEvent, el: HTMLDivElement) => {
    onChange(modulo(calcAngle(e, el) / DEG_RATE, 360));
  }, [onChange]);

  return (
    <Draggable onDrag={setDrag} className={HueRing} style={{ "--size": size }}>
      <div className={HueCenter} onMouseDown={stopPropagation}>
        {children}
      </div>
      <div
        className={HuePointer}
        style={{
          transform: `rotate(${hue}deg)`,
          "--bg-color": `hsl(${hue},100%,50%)`,
        }}
      />
    </Draggable>
  );
};

const colors = Array.from({ length: 36 }, (_, i) => `hsl(${i * 10},100%,50%)`);

const HueRing = css`
  position: relative;
  width: var(--size);
  height: var(--size);
  background: conic-gradient(from 90deg, ${colors.join()});
  border-radius: 100%;
`;

const HueCenter = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: gray;
  width: 80%;
  height: 80%;
  border-radius: 100%;
  cursor: default;
`;

const HuePointer = css`
  width: 100%;
  height: 100%;
  pointer-events: none;
  &::before {
    content: "";
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translate(-100%, -50%);
    width: 10%;
    height: 10%;
    border: 2px solid white;
    border-radius: 100%;
    background-color: var(--bg-color);
  }
`;
