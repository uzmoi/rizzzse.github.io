import { Box, BoxProps } from "@chakra-ui/react";

const transparentCheckered = "linear-gradient(45deg,#fff 25%,transparent 25% 75%,#fff 75%)";

type TransparentCheckeredProps = {
  color?: string;
  patternColor?: string;
  size?: string;
} & Omit<BoxProps, "color" | `bg${string}` | "_before">;

export const TransparentCheckered: React.FC<TransparentCheckeredProps> = (
  { color = "#0000", patternColor = "gray", size = "10px", style, ...rest }
) => (
  <Box
    {...rest}
    bgColor={patternColor}
    bgImage={transparentCheckered + "," + transparentCheckered}
    bgPos={`0 0,calc(${size}/2) calc(${size}/2)`}
    bgSize={`${size} ${size}`}
    style={{ ...style, "--foreground-color": color }}
    _before={{
      content: `""`,
      display: "block",
      w: "full",
      h: "full",
      backgroundColor: "var(--foreground-color)",
    }}
  />
);
