import * as tf from "@tensorflow/tfjs";
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFeed,
  selectAngle,
  selectReaderWidth,
} from "../redux/reducers/video";
import { getLineData } from "../util/tfUtil";
import { store } from "../redux/store/store";
import { Camera } from "expo-camera";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Button } from "react-native";

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
      width: 1200 * scale,
      height: 1600 * scale,
    };
  }
};

const SCALE = 0.05;

export const fullDims = getTextureDimensions(1);
const scaledDims = getTextureDimensions(SCALE);

const TensorCamera = cameraWithTensors(Camera);

/**
 * Get image tensors from the camera using tfjs-react-native:
 * https://js.tensorflow.org/api_react_native/latest/#cameraWithTensors
 *
 * A slightly outdated example implementation can be found here:
 * https://github.com/tafsiri/tfjs-expo-managed-example
 *
 * @returns camera view which feeds a stream to redux.
 */

export default function CameraLoader({ collectsFrames }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const cameraType = Camera.Constants.Type.back;
  const dispatch = useDispatch();

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  // const unsubscribeTensorCamera = () => cancelAnimationFrame(rafID);

  const unsubscribeTensorCamera = () => {
    cancelAnimationFrame(rafID);
  };

  try {
    collectsFrames || unsubscribeTensorCamera();
  } catch (err) {
    console.log(err);
  }

  useFocusEffect(
    useCallback(() => {
      return () => {
        unsubscribeTensorCamera();
      };
    }, [])
  );

  useEffect(() => {
    requestCameraPermission();
  }, [collectsFrames]);

  const updateLineData = async (imgTensor) => {
    if (!imgTensor) return;
    const state = store.store.getState();
    if (collectsFrames) {
      const readerBox = state.video.readerBoxData;
      const nextLine = await getLineData(imgTensor, readerBox);
      if (nextLine && Math.max(...nextLine) > 0) {
        nextLine && dispatch(updateFeed({ value: nextLine }));
      }
    }
  };

  const handleCameraStream = (images, updatePreview, gl) => {
    const loop = () => {
      // Call when starting a session with tensors to prevent leaks
      tf.engine().startScope();
      const nextImg = images.next().value;
      collectsFrames && nextImg && updateLineData(nextImg);
      rafID = requestAnimationFrame(loop);
    };
    loop();
  };

  /**
   * TODO: Find a smoother way to pause live image manipulaiton 
   * when adjusting the ticks. The pan-responder and image 
   * manipulation are CPU-heavy; doing both simultaneously
   * is not fluid. This setup forces TensorCamera to rerender when
   * collectsFrames changes through an unstable key (hack), producing
   * potentially unnecessary windows of no data upon mounting again. 
   * The camera is black for a second before the images start loading.
   */
  const getTensorCameraComponent = useCallback(() => {
    return (
      <TensorCamera
        style={styles.camera}
        key={collectsFrames ? 0 : 1}
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
    );
  }, [collectsFrames]);

  return hasCameraPermission && getTensorCameraComponent();
}

const styles = StyleSheet.create({
  camera: {
    width: "100%",
    // aspectRatio: scaledDims.width / scaledDims.height,
    height: 350,
  },
  image: {
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "black",
    width: "100%",
    height: 250,
  },
});