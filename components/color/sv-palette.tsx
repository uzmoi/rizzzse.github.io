import { Box } from "@chakra-ui/react";
import { clampValue } from "@chakra-ui/utils";
import chroma from "chroma-js";
import { useCallback } from "react";
import { Draggable } from "../draggable";
import { HSVColor } from "./picker";

const svPalette = "linear-gradient(0,#000,transparent),linear-gradient(90deg,#fff,transparent)";

export const SVPalette: React.FC<{
  color: HSVColor;
  onChange: (color: Partial<HSVColor>) => void;
}> = ({ color, onChange: setColor }) => {
  const onChange = useCallback((e: MouseEvent, paletteEl: HTMLDivElement) => {
    const clientRect = paletteEl.getBoundingClientRect();
    const s = clampValue((e.clientX - clientRect.left) / clientRect.width, 0, 1);
    const v = 1 - clampValue((e.clientY - clientRect.top) / clientRect.height, 0, 1);
    if(e.shiftKey) {
      if(e.ctrlKey) {
        setColor({ value: v });
      } else {
        setColor({ saturation: s });
      }
    } else {
      setColor({ saturation: s, value: v });
    }
  }, [setColor]);

  return (
    <Draggable
      onDrag={onChange}
      boxSize="full"
      bgImage={svPalette}
      style={{ backgroundColor: `hsl(${color.hue},100%,50%)` }}
      cursor="pointer"
    >
      <Box
        boxSize="full"
        style={{
          transform: `translate(${color.saturation * 100}%,${(1 - color.value) * 100}%)`,
        }}
        pointerEvents="none"
      >
        <Box
          style={{
            backgroundColor: chroma.hsv(color.hue, color.saturation, color.value).hex()
          }}
          pos="absolute"
          transform="translate(-50%,-50%)"
          boxSize="10%"
          border="2px solid white"
          borderRadius="full"
        />
      </Box>
    </Draggable>
  );
};
