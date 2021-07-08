import * as tf from "@tensorflow/tfjs";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateFeed } from "../../redux/reducers/video";
import { getLineData } from "../../redux/reducers/tfUtil";
import { store } from "../../redux/store/store";
import { Camera } from "expo-camera";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
export const TensorCamera = cameraWithTensors(Camera);

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

const SCALE = 1;

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

export default function CameraLoader({ visibility }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const cameraType = Camera.Constants.Type.back;

  const dispatch = useDispatch();

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const updateLineData = async (imgTensor) => {
    if (!imgTensor) return;
    const state = store.store.getState();
    const readerBox = state.video.readerBoxData;
    const nextLine = await getLineData(imgTensor, readerBox);
    dispatch(updateFeed({ value: nextLine }));
  };

  const handleCameraStream = (images, updatePreview, gl) => {
    const loop = async () => {
      // Call when starting a session with tensors to prevent leaks
      tf.engine().startScope();
      console.log("start");
      updateLineData(images.next().value);
      requestAnimationFrame(loop);
    };
    loop();
  };

  console.log("render");

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
