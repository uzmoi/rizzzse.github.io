import {
  AspectRatio,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { useReducer, useRef } from "react";
import { Layout } from "../../components/layout";

const TAU = Math.PI * 2;

const ANGLE_UNIT_RATES = {
  rad: 1,
  deg: Math.PI / 180,
  turn: TAU,
} as const;
const angleUnits = Object.keys(ANGLE_UNIT_RATES);
type AngleUnit = keyof typeof ANGLE_UNIT_RATES;

// max = TAU / UNIT_RATES[unit];

const DEBOUNCE_TIME = 32;

const Angle: React.VFC<{
  angle: number;
  onChange(angle: number): void;
  mainColor: string;
  subColor: string;
}> = ({ angle, onChange, mainColor, subColor }) => {
  const debounce = useRef(NaN);
  const handleAngle: React.MouseEventHandler<HTMLDivElement> = e => {
    const x = e.nativeEvent.offsetX - (e.currentTarget.offsetWidth / 2);
    const y = e.nativeEvent.offsetY - (e.currentTarget.offsetHeight / 2);
    let rad = Math.atan2(y, x) + Math.PI / 2;
    if(rad < 0) {
      rad += TAU;
    }
    onChange(rad);
  };
  const gradient = `conic-gradient(${mainColor} 0 ${angle}rad,${subColor} ${angle}rad)`;

  return (
    <Box
      style={{ background: gradient }}
      borderRadius="full"
      cursor="pointer"
      onMouseDown={e => {
        debounce.current = Date.now();
        handleAngle(e);
      }}
      onMouseMove={e => {
        if(Date.now() - debounce.current > DEBOUNCE_TIME) {
          debounce.current = Date.now();
          handleAngle(e);
        }
      }}
      onMouseUp={e => {
        debounce.current = NaN;
        handleAngle(e);
      }}
    />
  );
};

const DIGITS = 8;
const formatAngle = (x: number, unit: AngleUnit) =>
  (x / ANGLE_UNIT_RATES[unit]).toFixed(DIGITS).replace(/\.?0+$/, "");

const reducer: React.Reducer<{
  unit: AngleUnit;
  angle: number;
  isInvalid: boolean;
  string: string;
},
  | { type: "UNIT"; payload: AngleUnit }
  | { type: "ANGLE"; payload: number }
  | { type: "STRING"; payload: string }
> = ({ unit, angle }, action) => {
  switch(action.type) {
    case "UNIT":
      return {
        unit: action.payload,
        angle,
        isInvalid: false,
        string: formatAngle(angle, action.payload),
      };
    case "ANGLE":
      return {
        unit,
        angle: action.payload,
        isInvalid: false,
        string: formatAngle(action.payload, unit),
      };
    case "STRING":
      const isInvalid = Number.isNaN(parseFloat(action.payload));
      return {
        unit,
        angle: isInvalid ? angle : parseFloat(action.payload) * ANGLE_UNIT_RATES[unit],
        isInvalid,
        string: action.payload,
      };
  }
};

export default function AnglePage() {
  const [state, dispatch] = useReducer(reducer, {
    unit: "rad",
    angle: 1,
    isInvalid: false,
    string: "1",
  });
  const handleInput: React.ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: "STRING", payload: e.target.value });
  };
  const handleChangeUnit: React.ChangeEventHandler<HTMLSelectElement> = e => {
    dispatch({ type: "UNIT", payload: e.target.value as AngleUnit });
  };
  const handleAngle = (rad: number) => {
    dispatch({ type: "ANGLE", payload: rad });
  };

  const mainColor = "#df6c20";
  const subColor = useColorModeValue("#aaa", "#444");

  return (
    <Layout>
      <Head>
        <title>angle</title>
      </Head>
      <Stack
        align="center"
        justify="center"
        direction={["column", "row"]}
        spacing={[8, 16]}
        my={16}
      >
        <AspectRatio ratio={1} flex={1} minW={48} minH={48} maxW={80} maxH={80}>
          <Angle
            angle={state.angle}
            onChange={handleAngle}
            mainColor={mainColor}
            subColor={subColor}
          />
        </AspectRatio>
        <InputGroup minW="10em" maxW="16em" variant="flushed">
          <Input
            value={state.string}
            onChange={handleInput}
            pr="5em"
            isInvalid={state.isInvalid}
          />
          <InputRightElement w="5em" pl={2}>
            <Select variant="unstyled" value={state.unit} onChange={handleChangeUnit}>
              {angleUnits.map(unit => <option key={unit}>{unit}</option>)}
            </Select>
          </InputRightElement>
        </InputGroup>
      </Stack>
    </Layout>
  );
}
