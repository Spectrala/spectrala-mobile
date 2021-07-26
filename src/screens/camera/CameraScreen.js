import React, { useRef, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Slider from "react-native-ui-lib/slider";
import DraggablePointsContainer from "./DraggablePointsContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  selectReaderWidth,
  updateReaderWidth,
} from "../../redux/reducers/ReaderBox";
import BottomHelper from "../../components/BottomHelper";
import CameraLoader from "../../components/CameraLoader";
import { ScrollView } from "react-native";

export default function CameraScreen({ navigation }) {
  const { colors } = useTheme();
  const readerWidth = useSelector(selectReaderWidth);
  const initialWidth = useRef(readerWidth).current;
  const dispatch = useDispatch();

  return (
    <ScrollView style={styles.container }>
      <View style={styles.cameraMaster}>
        <View style={styles.cameraChild}>
          <CameraLoader capturesFrames={false} />
        </View>
        <View style={styles.cameraChild}>
          <DraggablePointsContainer width={readerWidth} />
        </View>
      </View>

      <Slider
        containerStyle={styles.slider}
        value={initialWidth}
        onValueChange={(value) => dispatch(updateReaderWidth({ value }))}
        minimumValue={10}
        maximumValue={200}
        step={5}
        minimumTrackTintColor={colors.primary}
        thumbTintColor={colors.primary}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  cameraChild: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    overflow: "hidden",
  },
  cameraMaster: {
    flex: 1,
    height: 300,
  },
  camera: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 500,
  },
  helperBody: {
    padding: 16,
    paddingTop: 0,
  },
  slider: {
    flex: 1,
  },
});
