import React, { useState, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Text, View, Slider, Button } from "react-native-ui-lib";

import { StackNavigationProp } from "@react-navigation/stack";
import DraggablePointsContainer from "./DraggablePointsContainer";
import CameraView from "./CameraView";
import { useDispatch, useSelector } from "react-redux";
import {
  selectReaderWidth,
  updateReaderWidth,
} from "../../redux/reducers/video";

// TODO: stop using expo in order to figure out the camera stuff
export default function CameraScreen({ navigation }) {
  const readerWidth = useSelector(selectReaderWidth);
  const initialWidth = useRef(readerWidth).current;
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <CameraView captureIntervalSeconds={5} isActive={true} />
      <DraggablePointsContainer width={readerWidth} />

      <View style={styles.modalView}>
        <View style={styles.modalRow}>
          <Text>Width: {readerWidth}</Text>
          <Button
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.textStyle}>Hide</Text>
          </Button>
        </View>
        <Slider
          containerStyle={styles.slider}
          value={initialWidth}
          onValueChange={(value) => dispatch(updateReaderWidth({ value }))}
          minimumValue={10}
          maximumValue={200}
          step={5}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
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
