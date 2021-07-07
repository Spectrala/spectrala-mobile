import * as tf from "@tensorflow/tfjs";
import * as jpeg from "jpeg-js";

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
  const jpegImageData = jpeg.encode(rawImageData, 75);
  const base64Encoding = tf.util.decodeString(jpegImageData.data, "base64");
  return base64Encoding;
}

const getPreviewUri = async (img) => {
  const base64 = await tensorToImageUrl(img.mul(255));
  const imageUri = `data:image/jpeg;base64,${base64}`;
  return imageUri
};

const logPreview = async (img) => {
  const url = await getPreviewUri(img);
  console.log(`\n${url}\n`);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~STEPS~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const flagAndCrop = (tensor, corners) => {
  // Convert from 0-255 to 0-1
  const img = tensor.mul(1 / 255);

  // Shape is [yIndex, xIndex, 3 for rgb]
  const imgHeight = tensor.shape[0];
  const imgWidth = tensor.shape[1];

  const cornerIndicies = corners.map(({ x, y }) => [
    Math.round(y * imgHeight),
    Math.round(x * imgWidth),
  ]);
  // Add tensor holding "flags," or negative pixel values to later detect to find corners
  const sparseIndicies = cornerIndicies.map((arr) => [...arr, 0]);
  const sparseVals = Array(sparseIndicies.length).fill(FLAG_PIXEL_OFFSET);
  const flags = tf.sparseToDense(sparseIndicies, sparseVals, tensor.shape);
  const imgFlagged = img.add(flags);

  // Get a "crude" take on a cropped image, unaccounting for rotation
  const crudeImg = crudeSliceCrop(imgFlagged, cornerIndicies, PADDING);

  // logPreview(crudeImg);
  console.log(corners);

  return {
    img: crudeImg,
    height: crudeImg.shape[0],
    width: crudeImg.shape[1],
  };
};

const pad = (crude) => {
  // Pad the crude image. This allows enough room (in any case) for the rotation.
  const longest = Math.max(crude.height, crude.width);
  const getPad = (x) => Math.round(Math.max(longest - x, 0) / 2) + PADDING;
  const padHoriz = Array(2).fill(getPad(crude.width));
  const padVert = Array(2).fill(getPad(crude.height));
  const imgPad = tf.pad(crude.img, [padVert, padHoriz, [0, 0]]);
  return imgPad;
};

const rotate = (imgPad, boxAngle) => {
  // Rotate the padded image such that the reader box is vertical
  const rotateRadians = (boxAngle * Math.PI) / 180;
  const pad4d = imgPad.expandDims(); // Next command requires 4d
  const imgRotated = tf.image.rotateWithOffset(pad4d, rotateRadians);
  const imgRotated3d = imgRotated.squeeze(); // Go back to 3d
  return imgRotated3d;
};

const trim = async (imgRotated) => {
  // Find the flags previously put in the image and crop around them
  const maskFlags = imgRotated.less([0]).asType("bool");
  const flagCoordinates = await tf.whereAsync(maskFlags);
  const flagCoordArr = await flagCoordinates.slice([0, 1], [-1, 2]).array();
  const trimmedImg = crudeSliceCrop(imgRotated, flagCoordArr, 0);
  return trimmedImg;
};

export const getLineData = (tensor, readerBox, setPreviewImg) => {
  const { corners, boxAngle } = readerBox;
  const rotated = tf.tidy(() => {
    const crude = flagAndCrop(tensor, corners);
    // const padded = pad(crude);
    // return rotate(padded, boxAngle);
  })
  // const trimmed = trim(rotated);
};
