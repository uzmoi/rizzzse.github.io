import { Box, LayoutProps } from "@chakra-ui/react";
import { useCallback } from "react";
import { calcAngle, Draggable } from "../draggable";
import { PosCenter } from "./pos-center";

const colors = Array.from({ length: 36 }, (_, i) => `hsl(${i * 10},100%,50%)`);
const hueWheel = `conic-gradient(from 90deg,${colors})`;

const stopPropagation = (e: { stopPropagation(): void }) => {
  e.stopPropagation();
};

const TAU = Math.PI * 2;
const DEG_RATE = TAU / 360;

export const HueWheel: React.FC<{
  hue: number;
  onChange(hue: number): void;
  size?: LayoutProps["boxSize"];
}> = ({ hue, onChange, size = "32", children }) => {
  const setDrag = useCallback((e: MouseEvent, el: HTMLDivElement) => {
    onChange(calcAngle(e, el) / DEG_RATE);
  }, [onChange]);

  return (
    <Draggable
      onDrag={setDrag}
      bg={hueWheel}
      boxSize={size}
      borderRadius="full"
      pos="relative"
    >
      <PosCenter
        bg="gray"
        boxSize="80%"
        borderRadius="full"
        cursor="default"
        onMouseDown={stopPropagation}
      >
        {children}
      </PosCenter>
      <Box
        boxSize="full"
        style={{ transform: `rotate(${hue}deg)`, "--bg-color": `hsl(${hue},100%,50%)` }}
        pointerEvents="none"
        _before={{
          content: `""`,
          pos: "absolute",
          left: "100%",
          top: "50%",
          transform: "translate(-100%,-50%)",
          boxSize: "10%",
          border: "2px solid white",
          borderRadius: "full",
          bgColor: "var(--bg-color)",
        }}
      />
    </Draggable>
  );
};
