import StarsSvg from "./stars.svg";
import MountainsFrontSvg from "./mountains-front.svg";

// SVG Image at homescreen, layer goes from back to front
export const HEADER_LAYERS = [
  {
    source: require("./sky.png"),
    anchor: "top",
    speed: 0.25,
    fill: true,
  },
  {
    source: <StarsSvg width="100%" height="100%" />,
    aspectRatio: 390 / 157,
    anchor: "top",
    speed: 0.1,
    stretch: false,
  },
  {
    source: require("./mountains-back.png"),
    aspectRatio: 390.62 / 65,
    anchor: "bottom",
    speed: 0.7,
  },
  {
    source: <MountainsFrontSvg width="100%" height="100%" />,
    aspectRatio: 390 / 43,
    anchor: "bottom",
    speed: 1,
  },
];

export default HEADER_LAYERS;