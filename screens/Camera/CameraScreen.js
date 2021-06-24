import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, Modal, Pressable } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import DraggablePointsContainer from "./DraggablePointsContainer";
import CameraView from "./CameraView";
import Slider from "@react-native-community/slider";

// TODO: stop using expo in order to figure out the camera stuff
export default function CameraScreen({ navigation }) {
  const [width, setWidth] = useState(90);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <CameraView captureIntervalSeconds={5} isActive={true} />
      <DraggablePointsContainer width={width} />

      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalRow}>
            <Text>Width: {width}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide</Text>
            </Pressable>
          </View>
          <Slider
            style={styles.slider}
            value={width}
            onValueChange={setWidth}
            minimumValue={10}
            maximumValue={200}
            step={5}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },

  buttons: {
    position: "absolute",
    left: 0,
    bottom: 20,
    width: "100%",
    height: 60,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    height: 40,
    width: 100,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  modalView: {
    flex: 1,
    width: "90%",
    margin: 20,
    padding: 20,
    alignItems: "center",


    backgroundColor: "white",

    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  slider: {
    width: "90%",
  },
});
