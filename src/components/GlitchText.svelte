<script lang="ts">
  import { timeout } from "emnorst";
  import { readable } from "svelte/store";

  export let text: string;

  const timeRandom = <T,>(init: T, get: (prev: T) => T, ms = 1000) => readable(init, set => {
    let prev = init;
    const f = async () => {
      await timeout(Math.random() * ms);
      set(prev = get(prev));
      f();
    };
    f();
  });
  const glitching = timeRandom(false, glitching => !glitching);
  
  const TAU = Math.PI * 2;

  const colorShadow = (rad: number, color: string) =>
    `${(Math.cos(rad) / 80).toFixed(4)}em ${(Math.sin(rad) / 80).toFixed(4)}em 0 ${color}`;
  const glitchColorShadow2 = (rad: number) => [
    colorShadow(rad + TAU / 3 * 0, "magenta"),
    colorShadow(rad + TAU / 3 * 1, "cyan"),
    colorShadow(rad + TAU / 3 * 2, "yellow"),
  ].join();

  const randPattern = () => glitchColorShadow2(Math.random() * TAU);
  const pattern = timeRandom(randPattern(), randPattern, 400);
  
  const x1 = timeRandom(Math.random(), Math.random, 400);
  const x2 = timeRandom(Math.random(), Math.random, 400);
  const x3 = timeRandom(Math.random(), Math.random, 400);
  const x4 = timeRandom(Math.random(), Math.random, 400);

  const reduceMotion = matchMedia("(prefers-reduced-motion: no-preference)");
</script>

<span
  data-glitching={reduceMotion.matches && $glitching}
  data-text={text}
  style:--pattern={$pattern}
  style:--before-clip-path="inset({$x1 * 100}% 0 {$x2 * 100}% 0)"
  style:--after-clip-path="inset({$x3 * 100}% 0 {$x4 * 100}% 0)"
>
  {text}
</span>

<style>
  span {
    font-weight: bold;
    position: relative;
  }
  ::before, ::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
  }
  ::before {
    clip-path: var(--before-clip-path);
    --glitch-translate: -4px;
  }
  ::after {
    clip-path: var(--after-clip-path);
    --glitch-translate: 4px;
  }
  [data-glitching="true"]::before, [data-glitching="true"]::after {
    text-shadow: var(--pattern);
    transform: translateX(var(--glitch-translate));
  }
</style>
