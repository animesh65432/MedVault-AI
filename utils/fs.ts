import { Dimensions, PixelRatio } from "react-native";
import { scale } from "./scale";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')

export const fs = (size: number) => Math.round(PixelRatio.roundToNearestPixel(scale(size)))

export { SCREEN_H, SCREEN_W };
