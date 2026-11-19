import React from "react";
import Svg, { Path } from "react-native-svg";

import { starPath } from "../TwinkleStars";
import { card, cardColors } from "../../styles/style";

// The faded star pattern in the top-right corner of the featured card.
// Stars sit on a tilted grid (the same one as the auth background) and shrink
// with distance from the corner until they disappear.
const WIDTH = 170;
const HEIGHT = 125;
const SPACING = 7; // distance between neighbouring stars
const FADE = 190; // distance from the corner at which stars vanish
const MAX_RADIUS = 2.8; // star size at the corner
const MIN_RADIUS = 0.5; // anything smaller is skipped

const rad = (deg) => (deg * Math.PI) / 180;

// Returns one SVG path with every star, plus how many there are.
export function buildHalftone() {
    // Grid directions, the same 75 and 165 degree axes as the Figma artwork.
    const a = [SPACING * Math.cos(rad(75)), -SPACING * Math.sin(rad(75))];
    const b = [SPACING * Math.cos(rad(165)), -SPACING * Math.sin(rad(165))];

    let d = "";
    let count = 0;
    for (let i = -40; i <= 40; i += 1) {
        for (let j = -40; j <= 40; j += 1) {
            // The grid starts at the top-right corner of the box.
            const x = WIDTH + i * a[0] + j * b[0];
            const y = i * a[1] + j * b[1];
            if (x < 0 || x > WIDTH || y < 0 || y > HEIGHT) continue;

            const t = 1 - Math.hypot(WIDTH - x, y) / FADE;
            const r = MAX_RADIUS * t;
            if (t <= 0 || r < MIN_RADIUS) continue;

            d += starPath(x, y, r);
            count += 1;
        }
    }
    return { d, count };
}

const HALFTONE = buildHalftone();

export default function HalftoneCorner({ style }) {
    return (
        <Svg
            pointerEvents="none"
            width={WIDTH}
            height={HEIGHT}
            style={[card.halftone, style]}
        >
            <Path d={HALFTONE.d} fill={cardColors.halftone} fillOpacity={0.9} />
        </Svg>
    );
}