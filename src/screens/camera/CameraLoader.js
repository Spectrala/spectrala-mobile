import * as tf from "@tensorflow/tfjs";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera } from "expo-camera";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {
  updateFeed,
  selectCorners,
  selectAngle,
  selectReaderWidth,
  selectReaderLength,
  selectSecondCropBox,
  tfUpdateFrame,
  selectPreviewImg,
} from "../../redux/reducers/video";

export const CAMERA_VISIBILITY_OPTIONS = {
  full: "full",
  none: "none",
};
const getTextureDimensions = (scale) => {
  if (Platform.OS === "ios") {
    return {
      height: 1920 * scale,
      width: 1080 * scale,
    };
  } else {
    return {
      height: 1200 * scale,
      width: 1600 * scale,
    };
  }
};

const SCALE = 0.1;

export const fullDims = getTextureDimensions(1);
const scaledDims = getTextureDimensions(SCALE);

/**
 * Get image tensors from the camera using tfjs-react-native:
 * https://js.tensorflow.org/api_react_native/latest/#cameraWithTensors
 *
 * A slightly outdated example implementation can be found here:
 * https://github.com/tafsiri/tfjs-expo-managed-example
 *
 * @returns camera view which feeds a stream to redux.
 */

export default function CameraLoader({ visibility, TensorCamera }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);

  const dispatch = useDispatch();

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleCameraStream = (images, updatePreview, gl) => {
    const loop = async () => {
      // Call when starting a session with tensors to prevent leaks
      tf.engine().startScope();
      dispatch(tfUpdateFrame({ tensor: images.next().value }));
      requestAnimationFrame(loop);
    };
    loop();
  };

  return (
    hasCameraPermission && (
      <TensorCamera
        style={styles.camera}
        type={cameraType}
        zoom={0}
        cameraTextureHeight={fullDims.height}
        cameraTextureWidth={fullDims.width}
        resizeHeight={scaledDims.height}
        resizeWidth={scaledDims.width}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
      />
    )
  );
}

CameraLoader.propTypes = {
  TensorCamera: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    aspectRatio: scaledDims.width / scaledDims.height,
  },
  image: {
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "black",
    width: "100%",
    height: 250,
  },
});
