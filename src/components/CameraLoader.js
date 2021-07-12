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

const SCALE = 0.1;

export const fullDims = getTextureDimensions(1);
const scaledDims = getTextureDimensions(SCALE);

const TensorCamera = cameraWithTensors(Camera);

let rafID = null;

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

  const [cameraKey, setCameraKey] = useState(0);

  const unsubscribeTensorCamera = () => {
    cancelAnimationFrame(rafID);
  };

  // try {
  //   collectsFrames || unsubscribeTensorCamera();
  // } catch (err) {
  //   console.log(err);
  // }

  useFocusEffect(
    useCallback(() => {
      setCameraKey(Math.floor(Math.random() * 10000));
      return () => {
        unsubscribeTensorCamera();
      };
    }, [])
  );

  useEffect(() => {
    requestCameraPermission();
  }, [collectsFrames]);

  // useEffect(() => {
  //   setCameraKey(cameraKey + 1);
  //   console.log(`Camera key: ${cameraKey}`);
  // }, []);

  const updateLineData = async (imgTensor, state) => {
    if (!imgTensor) return;
    if (collectsFrames) {
      const readerBox = state.video.readerBoxData;
      const { intensities, previewUri } = await getLineData(
        imgTensor,
        readerBox
      );
      if (intensities && Math.max(...intensities) > 0) {
        dispatch(updateFeed({ intensities, previewUri }));
      }
    }
  };

  const handleCameraStream = (images, updatePreview, gl) => {
    const loop = () => {
      // Call when starting a session with tensors to prevent leaks
      tf.engine().startScope();
      const state = store.store.getState();
      // console.log(state.calibration.activePointPlacement);
      if (!state.calibration.activePointPlacement) {
        const nextImg = images.next().value;
        collectsFrames && nextImg && updateLineData(nextImg, state);
      }
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
  const getTensorCameraComponent = () => {
    return (
      <TensorCamera
        style={styles.camera}
        key={cameraKey}
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
  };

  return hasCameraPermission && getTensorCameraComponent();
}

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
