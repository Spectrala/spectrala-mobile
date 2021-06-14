import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { PropTypes } from "prop-types";
import * as jpeg from "jpeg-js";
import { extractPixelData } from "./CameraUtil";
import { useDispatch, useSelector } from "react-redux";
import { selectLineCoords, updateFeed } from "../../redux/reducers/video";
import { PIXI } from "expo-pixi";

import SpectralaCameraScreen from "./SpectralaCameraScreen";

/**
 * Quality of photos taken from expo camera.
 * https://docs.expo.io/versions/latest/sdk/camera/
 * quality (number) -- Specify the quality of compression,
 * from 0 to 1. 0 means compress for small size, 1 means
 * compress for maximum quality.
 */
const PHOTO_QUALITY = 0;

/**
 * Taken from https://stackoverflow.com/a/64586990
 * @param {string} base64data image data, without 'data:image/png;base64,'
 */

function imageDataObjectFromRandom() {
  // const width = 640;
  // const height = 480;
  const width = 6;
  const height = 4;
  const totalEle = width * height * 4;
  const rands = Array.from({ length: totalEle }, () =>
    Math.floor(Math.random() * 255)
  );

  return {
    data: Uint8ClampedArray.from(rands),
    height: height,
    width: width,
  };
}

export default function CameraView(props) {

  return (<SpectralaCameraScreen />);

  const calibCoords = useSelector(selectLineCoords);
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [interval, setLocalInterval] = useState(null);
  const [readyForNextFrame, setReadyForNextFrame] = useState(false);

  const sendFrame = async () => {
    if (
      !calibCoords ||
      calibCoords.lowX === null ||
      calibCoords.lowY === null ||
      calibCoords.highX === null ||
      calibCoords.highY === null
    ) {
      return;
    }
  };

  const takeAndSendFrame = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync({
        base64: true,
        quality: PHOTO_QUALITY,
      });

      const context = await GLView.createContextAsync();
      const app = new PIXI.Application({ context });



      const imgData = imageDataObjectFromPhoto(photo);
      console.log(imgData);

      // Data is of different length each time. Must do jpeg decoding.
      // console.log(imageData.data.length);

      dispatch(
        updateFeed({
          value: extractPixelData(
            imageDataObjectFromRandom(),
            calibCoords.lowX,
            calibCoords.lowY,
            calibCoords.highX,
            calibCoords.highY
          ),
        })
      );

      setReadyForNextFrame(true);
    }
  };

  const requestPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const setupCamera = () => {
    if (!interval) {
      setReadyForNextFrame(true);
      setLocalInterval(
        setInterval(takeAndSendFrame, props.captureIntervalSeconds * 1000)
      );
    }
  };

  useEffect(() => {
    requestPermission();
    return () => {
      if (interval) {
        clearInterval(interval);
        setLocalInterval(null);
      }
    };
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ ...styles.container, opacity: props.isActive ? 1.0 : 0 }}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
        onCameraReady={setupCamera}
      />
    </View>
  );
}

CameraView.propTypes = {
  captureIntervalSeconds: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-start",
    alignItems: "center",
    elevation: 30,
    zIndex: 30,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
