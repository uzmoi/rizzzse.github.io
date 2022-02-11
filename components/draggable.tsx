import { Box, BoxProps } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef } from "react";

const debounceTime = 16;

export const Draggable: React.FC<{
  onDrag: (e: MouseEvent, el: HTMLDivElement) => void;
  children: React.ReactNode;
} & Omit<BoxProps, "onDrag">> = ({ onDrag, children, ...rest }) => {
  const containerEl = useRef<HTMLDivElement>(null);
  const debounce = useRef(NaN);

  const handlers = useMemo(() => ({
    onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
      e.stopPropagation();
      debounce.current = e.timeStamp;
      if(containerEl.current) {
        onDrag(e.nativeEvent, containerEl.current);
      }
    },
    onMouseMove(e: MouseEvent) {
      if(Number.isNaN(debounce.current)) return;
      e.stopPropagation();
      if(e.timeStamp - debounce.current > debounceTime) {
        debounce.current = e.timeStamp;
        if(containerEl.current) {
          onDrag(e, containerEl.current);
        }
      }
    },
    onMouseUp(e: MouseEvent) {
      if(Number.isNaN(debounce.current)) return;
      e.stopPropagation();
      debounce.current = NaN;
      if(containerEl.current) {
        onDrag(e, containerEl.current);
      }
    },
  }), [onDrag]);

  useEffect(() => {
    const MOUSE_MOVE = "mousemove";
    const MOUSE_UP = "mouseup";
    window.addEventListener(MOUSE_MOVE, handlers.onMouseMove);
    window.addEventListener(MOUSE_UP, handlers.onMouseUp);
    return () => {
      window.removeEventListener(MOUSE_MOVE, handlers.onMouseMove);
      window.removeEventListener(MOUSE_UP, handlers.onMouseUp);
    };
  }, [handlers]);

  return (
    <Box
      ref={containerEl}
      cursor="pointer"
      {...rest}
      onMouseDown={handlers.onMouseDown}
    >
      {children}
    </Box>
  )
};

export const Rotatable: React.FC<{
  onChangeAngle: (angle: number) => void;
  children: React.ReactNode;
} & BoxProps> = ({ onChangeAngle, children, ...rest }) => {
  const c = useCallback((e: MouseEvent, el: HTMLDivElement) => {
    const clientRect = el.getBoundingClientRect();
    const angle = Math.atan2(
      e.clientY - clientRect.top - (clientRect.height / 2),
      e.clientX - clientRect.left - (clientRect.width / 2),
    );
    onChangeAngle(angle);
  }, [onChangeAngle]);

  return (
    <Draggable {...rest} onDrag={c}>
      {children}
    </Draggable>
  )
};
