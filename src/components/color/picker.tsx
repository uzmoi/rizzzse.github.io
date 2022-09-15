import { css } from "@linaria/core";
import { useCallback, useState } from "preact/hooks";
import { HueWheel } from "./HueWheel";
import { SVPalette } from "./SVPalette";

export interface HSVColor {
  hue: number;
  saturation: number;
  value: number;
  alpha: number;
}

export const useHSVColor = () => {
  const [color, setColor] = useState<HSVColor>({
    hue: 0,
    saturation: 0,
    value: 1,
    alpha: 1,
  });

  const mergeColor = useCallback((pcolor: Partial<HSVColor>) => {
    setColor(color => {
      return { ...color, ...pcolor };
    });
  }, []);

  const useSet = (name: keyof HSVColor) => useCallback((value: number) => {
    mergeColor({ [name]: value });
  }, [name]);

  return {
    ...color,
    set: mergeColor,
    setHue: useSet("hue"),
    setSaturation: useSet("saturation"),
    setValue: useSet("value"),
    setAlpha: useSet("alpha"),
  };
};

export const useColorPicker = () => {
  const color = useHSVColor();

  const picker = (
    <HueWheel hue={color.hue} onChange={color.setHue}>
      <SVPalette color={color} onChange={color.set} className={SVPalettePosition} />
    </HueWheel>
  );
  return [color, picker] as const;
};

export const ColorPicker: preact.FunctionComponent = () => {
  const [_, picker] = useColorPicker();

  return picker;
};

const SVPalettePosition = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 66%;
  height: 66%;
`;
