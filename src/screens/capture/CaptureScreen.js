import React from "react";
import { StyleSheet, Image } from "react-native";
import { View, Text, Colors } from "react-native-ui-lib";
import CaptureChart from "./CaptureChart";
import { useSelector, useDispatch } from "react-redux";
import CaptureButton from "./CaptureButton";
import {
  selectPreviewImg,
  selectIntensityChart,
} from "../../redux/reducers/SpectrumFeed";
import CameraLoader from "../../components/CameraLoader";
import { TouchableOpacity } from "react-native";
const CHART_INSET = 24;
const INNER_CIRCLE_SIZE = 70;
const CIRCLE_RING_SPACE = 10;

export default function CaptureScreen() {
  const previewImage = useSelector(selectPreviewImg);
  const intensityChart = useSelector(selectIntensityChart);
  const dispatch = useDispatch();

  return (
    <>
      <View style={{ ...styles.container, opacity: 0 }}>
        <CameraLoader collectsFrames />
      </View>

      <View style={styles.container}>
        <Image
          style={styles.previewImage}
          fadeDuration={0}
          source={{ uri: previewImage }}
        />
        <CaptureChart
          style={styles.chart}
          horizontalInset={CHART_INSET}
          data={intensityChart}
        />
        <Text text50>Reference</Text>
        <View
          style={{
            ...styles.refPlaceholder,
            backgroundColor: Colors.primary + "50",
            borderColor: Colors.primary,
          }}
        >
          <Text style={{color: Colors.primary}}>hi  </Text>
        </View>
        <Text text50>Test</Text>

        <CaptureButton
          style={styles.captureButton}
          onPress={() => console.log("button press")}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: "100%",
  },
  chart: {
    marginBottom: 30,
  },
  refPlaceholder: {
    height: 40,
    backgroundColor: "blue",
    marginHorizontal: 10,
    borderWidth: 2,
    borderStyle: "dotted"
  },
  previewImage: {
    width: "100%",
    height: 80,
    marginBottom: 20,
    resizeMode: "stretch",
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
  },
});
