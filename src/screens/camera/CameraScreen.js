import React, { useRef, useCallback, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Slider } from "react-native-ui-lib";
import DraggablePointsContainer from "./DraggablePointsContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  restoreBox,
  selectCornersAreValid,
  selectReaderWidth,
  updateReaderWidth,
  DEFAULT_READER_BOX,
} from "../../redux/reducers/ReaderBox";
import BottomHelper from "../../components/BottomHelper";
import CameraLoader from "../../components/CameraLoader";
import Toast from "react-native-ui-lib/toast";
import { selectShowsHelp } from "../../redux/reducers/Calibration";

export default function CameraScreen({ navigation }) {
  const { colors } = useTheme();
  const readerWidth = useSelector(selectReaderWidth);
  const initialWidth = useRef(readerWidth).current;
  const dispatch = useDispatch();
  const cornersAreValid = useSelector(selectCornersAreValid);
  const showsHelp = useSelector(selectShowsHelp);

  const helperHeader = useCallback(
    () => (
      <View style={styles.helperBody}>
        <Text>Width</Text>
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
      </View>
    ),
    []
  );

  return (
    <>
      <View
        style={{
          backgroundColor: "black",
          flex: 1,
        }}
      />
      <View style={{ ...styles.container, elevation: 1 }}>
        <CameraLoader capturesFrames={false} />
      </View>
      <View style={{ ...styles.container, elevation: 3 }}>
        <Toast
          visible={!cornersAreValid}
          position={"top"}
          backgroundColor={colors.primary}
          style={styles.toast}
          showDismiss={true}
        >
          <Text style={styles.toastText}>
            Corners of box must be within the screen.
          </Text>
          <TouchableOpacity
            onPress={() => {
              dispatch(restoreBox({ value: DEFAULT_READER_BOX }));
              navigation.goBack();
              navigation.push("CameraScreen");
            }}
          >
            <Text style={styles.toastButtonText}>Reset</Text>
          </TouchableOpacity>
        </Toast>
        <DraggablePointsContainer width={readerWidth} />
        {showsHelp && (
          <BottomHelper
            utilityComponents={helperHeader}
            bodyText={
              "To begin calibrating the spectrometer, attatch the spectrometer to your \
device and let light through the slit. Given a quality spectrum in view of \
the device's camera, Spectrala works by measuring the brightness of each \
pixel across a line through the spectrum. \n\nThis screen allows you to set \
this line accuratly by dragging the circles over the extreme ends of the \
spectrum. Ensure the rectangular box encloses the red part on one side and \
the blue part of the spectrum on the other side. "
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
    height: "100%",
  },
  helperBody: {
    padding: 16,
    paddingTop: 0,
  },
  slider: {
    flex: 1,
  },
  toast: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  toastText: {
    color: "white",
  },
  toastButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 32,
  },
});
