import { css, cx } from "@linaria/core";
import { useEffect, useMemo, useRef } from "preact/hooks";

const debounceTime = 16;

export const Draggable: preact.FunctionComponent<{
  onDrag: (e: MouseEvent, el: HTMLDivElement) => void;
  children?: preact.ComponentChildren;
} & Omit<preact.ComponentProps<"div">, "onDragStart" | "onDrag" | "onDragEnd">> = (
  { onDrag, children, ...rest }
) => {
  const containerEl = useRef<HTMLDivElement>(null);
  const debounce = useRef(NaN);

  const handlers = useMemo(() => ({
    onMouseDown(e: MouseEvent & { currentTarget: HTMLDivElement }) {
      e.stopPropagation();
      debounce.current = e.timeStamp;
      if(containerEl.current) {
        onDrag(e, containerEl.current);
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
    <div
      ref={containerEl}
      className={cx(DraggableStyle, rest.className)}
      {...rest}
      onMouseDown={handlers.onMouseDown}
    >
      {children}
    </div>
  )
};

const DraggableStyle = css`
  cursor: pointer;
`;

export const calcAngle = (e: MouseEvent, el: HTMLDivElement) => {
  const clientRect = el.getBoundingClientRect();
  return Math.atan2(
    e.clientY - clientRect.top - (clientRect.height / 2),
    e.clientX - clientRect.left - (clientRect.width / 2),
  );
};
