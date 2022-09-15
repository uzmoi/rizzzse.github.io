import * as chroma from "chroma-js";
import { clamp } from "emnorst";
import { css, cx } from "@linaria/core";
import { useCallback } from "preact/hooks";
import { Draggable } from "../Draggable";
import type { HSVColor } from "./picker";

export const SVPalette: preact.FunctionComponent<{
  color: HSVColor;
  onChange: (color: Partial<HSVColor>) => void;
  className?: string;
}> = ({ color, onChange: setColor, className }) => {
  const onChange = useCallback((e: MouseEvent, paletteEl: HTMLDivElement) => {
    const clientRect = paletteEl.getBoundingClientRect();
    const saturation = clamp((e.clientX - clientRect.left) / clientRect.width, 0, 1);
    const value = 1 - clamp((e.clientY - clientRect.top) / clientRect.height, 0, 1);
    if(e.shiftKey) {
      if(e.ctrlKey) {
        setColor({ value });
      } else {
        setColor({ saturation });
      }
    } else {
      setColor({ saturation, value });
    }
  }, [setColor]);

  return (
    <Draggable
      onDrag={onChange}
      className={cx(Palette, className)}
      style={{ backgroundColor: `hsl(${color.hue},100%,50%)` }}
    >
      <div
        className={SVPointer}
        style={{
          transform: `translate(${color.saturation * 100}%,${(1 - color.value) * 100}%)`,
          "--bg-color": chroma.hsv(color.hue, color.saturation, color.value).hex(),
        }}
      />
    </Draggable>
  );
};

const Palette = css`
  width: 100%;
  height: 100%;
  background-image: linear-gradient(0, #000, transparent),
    linear-gradient(90deg, #fff, transparent);
  cursor: pointer;
`;

const SVPointer = css`
  width: 100%;
  height: 100%;
  pointer-events: none;
  &::before {
    content: "";
    position: absolute;
    transform: translate(-50%,-50%);
    width: 10%;
    height: 10%;
    border: 2px solid white;
    border-radius: 100%;
    background-color: var(--bg-color);
  }
`;
