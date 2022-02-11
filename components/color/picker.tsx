import { useCallback, useState } from "react";
import { HueWheel } from "./hue-wheel";
import { PosCenter } from "./pos-center";
import { SVPalette } from "./sv-palette";

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

export const ColorPicker: React.FC = () => {
  const color = useHSVColor();

  return (
    <HueWheel hue={color.hue} onChange={color.setHue}>
      <PosCenter boxSize="66%">
        <SVPalette color={color} onChange={color.set} />
      </PosCenter>
    </HueWheel>
  );
};
