export function getSinglePixel(imageData, initial, current) {
  let dist = 0;
  for (let i = 0; i < initial.length; i++) {
    dist += (current[i] - initial[i]) * (current[i] - initial[i]);
  }
  dist = Math.sqrt(dist);
  let offset = (current[1] * imageData.width + current[0]) * 4;
  const r = imageData.data[offset];
  const g = imageData.data[offset + 1];
  const b = imageData.data[offset + 2];
  const a = imageData.data[offset + 3];
  return {
    dist,
    r,
    g,
    b,
    a,
  };
}

// coordinates are 0-1.0 values. Returns array of {dist: , r: ...} values
export function extractPixelData(imageData, beginX, beginY, finalX, finalY) {
  // we basically compute how we would raster a line, but sample instead of rasterizing
  // https://classic.csunplugged.org/wp-content/uploads/2014/12/Lines.pdf
  // https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm

  // https://github.com/thejonwithnoh/bresenham-js/blob/master/bresenham-js.js
  // Modified from code under the following license:
  // """
  // The MIT License (MIT)
  //
  // Copyright (c) 2016 Jonathan Faulch
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy of
  // this software and associated documentation files (the "Software"), to deal in
  // the Software without restriction, including without limitation the rights to
  // use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  // the Software, and to permit persons to whom the Software is furnished to do so,
  // subject to the following conditions:
  //
  // The above copyright notice and this permission notice shall be included in all
  // copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  // FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  // COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  // IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  // CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  // """

  let pos1 = [
    Math.round(imageData.width * beginX),
    Math.round(imageData.height * beginY),
  ];
  let pos2 = [
    Math.round(imageData.width * finalX),
    Math.round(imageData.height * finalY),
  ];
  // ensure we don't exceed image boundaries on a 1.0 value
  pos2[0] = Math.min(pos2[0], imageData.width - 1);
  pos2[1] = Math.min(pos2[1], imageData.height - 1);

  let delta = pos2.map(function (value, index) {
    return value - pos1[index];
  });
  let increment = delta.map(Math.sign);
  let absDelta = delta.map(Math.abs);
  let absDelta2 = absDelta.map(function (value) {
    return 2 * value;
  });
  let maxIndex = absDelta.reduce(function (accumulator, value, index) {
    return value > absDelta[accumulator] ? index : accumulator;
  }, 0);
  let error = absDelta2.map(function (value) {
    return value - absDelta[maxIndex];
  });

  var result = [];
  var current = pos1.slice();
  for (var j = 0; j < absDelta[maxIndex]; j++) {
    result.push(getSinglePixel(imageData, pos1, current));
    for (var i = 0; i < error.length; i++) {
      if (error[i] > 0) {
        current[i] += increment[i];
        error[i] -= absDelta2[maxIndex];
      }
      error[i] += absDelta2[i];
    }
  }
  result.push(getSinglePixel(imageData, pos1, current));
  return result;
}
