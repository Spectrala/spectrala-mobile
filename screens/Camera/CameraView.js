import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, AppState } from "react-native";
import { Camera } from "expo-camera";
import { PropTypes } from "prop-types";

export default function CameraView(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  let interval;

  const takeAndSendFrame = async () => {
    console.log("frame");
  };

  const requestPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    requestPermission();
    if (!interval) {
      interval = setInterval(function () {
        takeAndSendFrame();
      }, props.captureIntervalSeconds * 1000);
      AppState.addEventListener('change', state => {
        if (state !== 'active') {
          clearInterval(interval);
          interval = null;
        } 
      });
    }
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{...styles.container, opacity: props.isActive ? 1.0 : 0}}>
      <Camera style={styles.camera} type={type} />
    </View>
  );
}

CameraView.propTypes = {
  captureIntervalSeconds: PropTypes.number.isRequired,
  onCaptureFrame: PropTypes.func.isRequired,
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
