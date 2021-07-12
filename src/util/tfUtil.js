import * as tf from "@tensorflow/tfjs";
import * as jpeg from "jpeg-js";
const convert = require("color-convert");

const FLAG_PIXEL_OFFSET = -2;
const PADDING = 5;

const getPaddedRange = (coordinates, idx, padding, limit) => {
  const vals = coordinates.map((val) => val[idx]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return {
    min: Math.max(0, min - padding),
    max: Math.min(limit || Infinity, max + padding),
  };
};

const crudeSliceCrop = (img, coordinates, padding) => {
  const { width, height } = { width: img.shape[1], height: img.shape[0] };
  const yRng = getPaddedRange(coordinates, 0, padding, height);
  const xRng = getPaddedRange(coordinates, 1, padding, width);
  const sliceBegin = [yRng.min, xRng.min, 0];
  const sliceSize = [yRng.max - yRng.min, xRng.max - xRng.min, 3];
  return img.slice(sliceBegin, sliceSize);
};

const tensorToImageUrl = async (imageTensor) => {
  const [height, width] = imageTensor.shape;

  const buffer = await imageTensor.toInt().data();
  const frameData = new Uint8Array(width * height * 4);

  let offset = 0;
  for (let i = 0; i < frameData.length; i += 4) {
    frameData[i] = buffer[offset];
    frameData[i + 1] = buffer[offset + 1];
    frameData[i + 2] = buffer[offset + 2];
    frameData[i + 3] = 0xff;

    offset += 3;
  }

  const rawImageData = {
    data: frameData,
    width,
    height,
  };
  const jpegImageData = jpeg.encode(rawImageData, 100);
  const base64Encoding = tf.util.decodeString(jpegImageData.data, "base64");
  return base64Encoding;
};

const getPreviewUri = async (img) => {
  const base64 = await tensorToImageUrl(img.mul(255));
  const imageUri = `data:image/jpeg;base64,${base64}`;
  return imageUri;
};

const logPreview = async (img) => {
  const url = await getPreviewUri(img);
  console.log(`\n${url}\n`);
};

const getImageInfo = (img) => {
  return {
    img,
    height: img.shape[0],
    width: img.shape[1],
  };
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~STEPS~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 1. Accessing the image has already been done.
// 2. Crude crop
const flagAndCrop = (tensor, corners) => {
  // Convert from 0-255 to 0-1
  const { img, height, width } = getImageInfo(tensor.mul(1 / 255));

  // Shape is [yIndex, xIndex, 3 for rgb]
  const cornerIndicies = corners.map(({ x, y }) => [
    Math.round(y * height),
    Math.round(x * width),
  ]);

  // Add tensor holding "flags," or negative pixel values to later detect to find corners
  const sparseIndicies = cornerIndicies.map((arr) => [...arr, 0]);
  const sparseVals = Array(sparseIndicies.length).fill(FLAG_PIXEL_OFFSET);
  const flags = tf.sparseToDense(sparseIndicies, sparseVals, tensor.shape);
  const imgFlagged = img.add(flags);

  // Get a "crude" take on a cropped image, unaccounting for rotation
  const crudeImg = crudeSliceCrop(imgFlagged, cornerIndicies, PADDING);

  return crudeImg;
};

// 3. Apply padding
const pad = (imgCrude) => {
  // Pad the crude image. This allows enough room (in any case) for the rotation.
  const crude = getImageInfo(imgCrude);
  const longest = Math.max(crude.height, crude.width);
  const getPad = (x) => Math.round(Math.max(longest - x, 0) / 2) + PADDING;
  const padHoriz = Array(2).fill(getPad(crude.width));
  const padVert = Array(2).fill(getPad(crude.height));
  const imgPad = tf.pad(crude.img, [padVert, padHoriz, [0, 0]]);
  return imgPad;
};

// 4. Rotate
const rotate = (imgPad, boxAngle) => {
  // Rotate the padded image such that the reader box is vertical
  const rotateRadians = (boxAngle * Math.PI) / 180;
  const pad4d = imgPad.expandDims(); // Next command requires 4d
  const imgRotated = tf.image.rotateWithOffset(pad4d, rotateRadians);
  const imgRotated3d = imgRotated.squeeze(); // Go back to 3d
  return imgRotated3d;
};

// 5. Crop
const trim = async (imgRotated) => {
  // Find the flags previously put in the image and crop around them
  const maskFlags = imgRotated.less([0]).asType("bool");
  const flagCoordinates = await tf.whereAsync(maskFlags);
  const flagCoordTensor = flagCoordinates.slice([0, 0], [-1, 2]);
  const flagCoordArr = await flagCoordTensor.array();
  const trimmedImg = crudeSliceCrop(imgRotated, flagCoordArr, 0);
  return trimmedImg;
};

// TODO: does not work (see issue). Not necessary, but would be nice.
// // 6. Resize
// const MAX_WIDTH = 100;
// const resize = (imgTrimmed) => {
//   const { img, height, width } = getImageInfo(imgTrimmed);
//   if (width < MAX_WIDTH) return imgTrimmed;
//   const newWidth = MAX_WIDTH;
//   const newHeight = newWidth * (height / width);
//   const resizedImg = tf.image.resizeBilinear(img, [newHeight, newWidth]);
//   return resizedImg;
// };

/**
 * Function used to extract intensity from any given pixel
 * during reading an image from the box.
 *
 * Takes r,g,b from (0,255) and returns an intensity from 0-100.
 *
 * @param {number} r red value from 0 to 255
 * @param {number} g green value from 0 to 255
 * @param {number} b blue value from 0 to 255
 * @returns {number} intensity
 */
const rgbToIntensity = (r, g, b) => {
  // Take brightness to be "value" in HSV color space, 0-100.
  const hsv = convert.rgb.hsv.raw(r, g, b);
  // Indicies described: https://github.com/Qix-/color-convert/blob/HEAD/conversions.js
  const value = hsv[2];
  return value;
};

const convertIntensityAsync = async (imgTrimmed) => {
  const arr = await imgTrimmed.mul(255).array();
  return arr.map((strip) =>
    strip.map((pixel) => rgbToIntensity(pixel[0], pixel[1], pixel[2]))
  );
};

/**
 * Function to map a 2d reader box to a 1d reader line. Each
 * line perpendicular to the reader line (between the two dots)
 * and is represented by a 1d array of intensities (from rgbToIntensity).
 *
 * @param {array} intensities array of intensities from rgbToIntensity
 * @returns {number} single intensity value from the given horizontal.
 */
const reduceHorizontal = (intensities) => Math.round(Math.max(...intensities));

export const getLineData = async (tensor, readerBox) => {
  // if (tensor.max().arraySync() === 0) return null;
  const { corners, angle } = readerBox;
  const rotated = tf.tidy(() => {
    const crude = flagAndCrop(tensor, corners);
    const padded = pad(crude);
    return rotate(padded, angle);
  });
  const trimmed = await trim(rotated);
  const previewUri = await getPreviewUri(trimmed);

  const transposed = trimmed.transpose([1, 0, 2]);
  const intensities2d = await convertIntensityAsync(transposed);
  tf.engine().endScope(); // Tensorflow operations are over; clean up.
  const intensities1d = intensities2d.map((row) => reduceHorizontal(row));
  return { intensities: intensities1d, previewUri };
};
