import React, { memo, useEffect, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

import { FIELD_HEIGHT, FIELD_WIDTH, STARS } from "./AuthStarField";

/* -------------------------------------------------------------------------- */
/*  Tunables: change these, not the logic below                               */
/* -------------------------------------------------------------------------- */

// How far the stars lean to the RIGHT, in degrees clockwise from upright.
// 0 = upright. 31 mirrors the Figma artwork, whose stars lean 31 degrees to the left.
const TILT_DEG = -31;

// Star shape. 0 = a thin, sharp spike; larger = fatter and less hollow.
const CURVE = 0.17;

// Same colour and opacity as the Figma export (#9DAFB7 at 50%).
const STAR_COLOR = "#9DAFB7";
const GLOW_COLOR = "#C4D6E8";
const REST_OPACITY = 0.5;

// How many stars twinkle at once-ish. The rest stay still. More = busier, and
// heavier on low-end phones. 30 to 60 is a sensible range.
const TWINKLE_COUNT = 25;

// A star's size swings between (1 - SWING) and (1 + SWING) of its normal size.
const SWING = 0.25;

// Glow radius as a multiple of the star's biggest size.
const GLOW_RADIUS = 2.6;

// Timing. The master clock loops every LOOP_MS. Each star picks a whole number
// of cycles per loop, so periods are LOOP_MS / cycles (here 3 to 8 seconds) and
// the loop point is seamless. DUTY is the fraction of each cycle a star spends
// twinkling; the rest of the time it sits at rest.
const LOOP_MS = 24000;
const CYCLE_CHOICES = [3, 4, 5, 6, 7, 8];
const DUTY_MIN = 0.22;
const DUTY_MAX = 0.4;

// Change to reshuffle which stars twinkle and when.
const SEED = 7;

const PEAK = 1 + SWING;

/* -------------------------------------------------------------------------- */
/*  Helpers (pure functions)                                                  */
/* -------------------------------------------------------------------------- */

// Small seeded random generator so the pattern is the same on every render.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// SVG path for one four-point star with concave sides, tipped to lean right.
export function starPath(cx, cy, r, tiltDeg = TILT_DEG, curve = CURVE) {
  const base = ((-90 + tiltDeg) * Math.PI) / 180; // screen coords: y points down
  const ctrlR = r * curve * Math.SQRT2;
  const pt = (ang, rad) =>
    `${(cx + Math.cos(ang) * rad).toFixed(2)} ${(cy + Math.sin(ang) * rad).toFixed(2)}`;

  let d = `M${pt(base, r)}`;
  for (let j = 0; j < 4; j += 1) {
    const a0 = base + (j * Math.PI) / 2;
    d += `Q${pt(a0 + Math.PI / 4, ctrlR)} ${pt(a0 + Math.PI / 2, r)}`;
  }
  return `${d}Z`;
}

// Picks which stars twinkle. Bigger stars are somewhat more likely to be picked,
// but small ones still get a turn so the shimmer reaches the whole field.
export function pickTwinklers(stars, count, seed) {
  const rand = mulberry32(seed);
  const keyed = stars.map((s, i) => ({
    i,
    key: Math.pow(rand(), 1 / Math.pow(s[2], 0.6)),
  }));
  keyed.sort((a, b) => b.key - a.key);
  return new Set(keyed.slice(0, Math.min(count, stars.length)).map((k) => k.i));
}

// Random timing for one star.
export function makeParams(index, seed = SEED) {
  const rand = mulberry32(seed * 7919 + index * 977);
  return {
    cycles: CYCLE_CHOICES[Math.floor(rand() * CYCLE_CHOICES.length)],
    offset: rand(),
    duty: DUTY_MIN + rand() * (DUTY_MAX - DUTY_MIN),
    amp: 0.6 + 0.4 * rand(), // how strongly this particular star twinkles
  };
}

// Returns -amp..+amp: positive = bigger and brighter (glowing), negative = a
// little smaller and dimmer, 0 = resting. Runs on the UI thread.
function twinkleLevel(t, cycles, offset, duty, amp) {
  "worklet";
  const p = (t * cycles + offset) % 1;
  return p < duty ? amp * Math.sin((2 * Math.PI * p) / duty) : 0;
}

/* -------------------------------------------------------------------------- */
/*  One twinkling star: a glow layer and a star layer                         */
/* -------------------------------------------------------------------------- */

const Twinkler = memo(function Twinkler({ clock, k, x, y, r, params, index }) {
  const { cycles, offset, duty, amp } = params;

  // The star is drawn at its biggest size and scaled down, so it never looks
  // soft when it grows.
  const peakR = r * PEAK * k;
  const starBox = Math.ceil(peakR * 2 + 2);
  const glowR = peakR * GLOW_RADIUS;
  const glowBox = Math.ceil(glowR * 2);
  const cx = x * k;
  const cy = y * k;

  const starD = useMemo(
    () => starPath(starBox / 2, starBox / 2, peakR),
    [starBox, peakR],
  );

  const starStyle = useAnimatedStyle(() => {
    const s = twinkleLevel(clock.value, cycles, offset, duty, amp);
    const f = 1 + SWING * s;
    return {
      opacity: s >= 0 ? REST_OPACITY + 0.45 * s : REST_OPACITY + 0.15 * s,
      transform: [{ scale: f / PEAK }],
    };
  });

  // The glow only shows while the star is bigger than normal, and it grows and
  // brightens with the star's size.
  const glowStyle = useAnimatedStyle(() => {
    const s = twinkleLevel(clock.value, cycles, offset, duty, amp);
    const f = 1 + SWING * s;
    return {
      opacity: s > 0 ? Math.min(1, s) : 0,
      transform: [{ scale: f / PEAK }],
    };
  });

  const gradientId = `glow-${index}`;

  return (
    <>
      <Animated.View
        style={[
          styles.abs,
          {
            left: cx - glowBox / 2,
            top: cy - glowBox / 2,
            width: glowBox,
            height: glowBox,
          },
          glowStyle,
        ]}
      >
        <Svg width={glowBox} height={glowBox}>
          <Defs>
            <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={GLOW_COLOR} stopOpacity="0.5" />
              <Stop offset="0.4" stopColor={GLOW_COLOR} stopOpacity="0.2" />
              <Stop offset="1" stopColor={GLOW_COLOR} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle
            cx={glowBox / 2}
            cy={glowBox / 2}
            r={glowBox / 2}
            fill={`url(#${gradientId})`}
          />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.abs,
          {
            left: cx - starBox / 2,
            top: cy - starBox / 2,
            width: starBox,
            height: starBox,
          },
          starStyle,
        ]}
      >
        <Svg width={starBox} height={starBox}>
          <Path d={starD} fill={STAR_COLOR} />
        </Svg>
      </Animated.View>
    </>
  );
});

/* -------------------------------------------------------------------------- */
/*  The star field                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Props
 *  - width:        field width in dp. Defaults to the screen width.
 *  - mirror:       false (default) keeps the Figma layout, with the big stars at the
 *                  top right, and only the lean of each star changes. true flips the
 *                  whole layout left to right.
 *  - twinkleCount: how many stars twinkle. Defaults to TWINKLE_COUNT.
 *  - style:        extra style for the wrapper (e.g. position it).
 */
export default function TwinkleStars({
  width,
  mirror = false,
  twinkleCount = TWINKLE_COUNT,
  style,
}) {
  const { width: windowWidth } = useWindowDimensions();
  const w = width ?? windowWidth;
  const k = w / FIELD_WIDTH;
  const h = FIELD_HEIGHT * k;

  const reduceMotion = useReducedMotion();
  const clock = useSharedValue(0);

  // Split the field once: still stars go into ONE svg path (cheap), the chosen
  // few become individually animated twinklers.
  const { staticD, twinklers } = useMemo(() => {
    const field = STARS.map(([x, y, r]) => [mirror ? FIELD_WIDTH - x : x, y, r]);
    const chosen = reduceMotion
      ? new Set()
      : pickTwinklers(field, twinkleCount, SEED);

    let d = "";
    const list = [];
    field.forEach(([x, y, r], i) => {
      if (chosen.has(i)) {
        list.push({ x, y, r, params: makeParams(i) });
      } else {
        d += starPath(x, y, r);
      }
    });
    return { staticD: d, twinklers: list };
  }, [mirror, twinkleCount, reduceMotion]);

  // One shared clock drives every star; each star turns it into its own timing.
  useEffect(() => {
    if (reduceMotion || twinklers.length === 0) return undefined;
    clock.value = 0;
    clock.value = withRepeat(
      withTiming(1, { duration: LOOP_MS, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(clock);
  }, [clock, reduceMotion, twinklers.length]);

  return (
    <View
      pointerEvents="none"
      style={[{ width: w, height: h, overflow: "hidden" }, style]}
    >
      <Svg width={w} height={h} viewBox={`0 0 ${FIELD_WIDTH} ${FIELD_HEIGHT}`}>
        <Path d={staticD} fill={STAR_COLOR} fillOpacity={REST_OPACITY} />
      </Svg>

      {twinklers.map((t, i) => (
        <Twinkler
          key={i}
          index={i}
          clock={clock}
          k={k}
          x={t.x}
          y={t.y}
          r={t.r}
          params={t.params}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  abs: { position: "absolute" },
});