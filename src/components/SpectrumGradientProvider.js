import React, { useEffect, useState } from "react";
import { LinearGradient, Stop } from "react-native-svg";
import * as ChartPt from "../types/ChartPoint";
import { wavelengthToRGB } from "../util/colorUtil";

const GRADIENT_COLOR_STOPS = 20;

/**
 * Defines a color gradient to map wavelengths to visibile light colors.
 * To be used in react-native-svg-charts charts.
 * Usage: set svg={{ fill: "url(#grad)" }}
 *
 * @param {Array<ChartPt>} chartData intensity/transmittance/absorption data
 * @param {String} id the CSS id to assign the gardient. Defaults to "grad".
 * @returns <LinearGradient> svg component with id "grad"
 */
function SpectrumGradientProvider({ chartData, id = "grad" }) {
  /**
   * To be filled with
   * {
   *  offset: Array<Number> with range [0-1],
   *  color: Array<String> with form [#AABBCC]
   * }
   */
  const [colorStops, setColorStops] = useState([]);

  useEffect(() => {
    let newColors = [];
    for (let stop = 0; stop < GRADIENT_COLOR_STOPS; stop++) {
      const x = stop / GRADIENT_COLOR_STOPS;
      const idx = Math.floor(x * chartData.length);
      const w = ChartPt.getWavelength(chartData[idx]);
      const color = wavelengthToRGB(w);
      newColors.push({ offset: x, color });
    }
    newColors && setColorStops(newColors);
  }, [chartData]);

  return (
    <LinearGradient id={id} x1={0} y1={0} x2={1} y2={0}>
      {colorStops.map(({ offset, color }, idx) => (
        <Stop offset={offset} stopColor={color} stopOpacity="1" key={idx} />
      ))}
    </LinearGradient>
  );
}

export default SpectrumGradientProvider;
