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
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
const CHART_INSET = 24;
const INNER_CIRCLE_SIZE = 70;
const CIRCLE_RING_SPACE = 10;

export default function CaptureScreen() {
  const previewImage = useSelector(selectPreviewImg);
  const intensityChart = useSelector(selectIntensityChart);
  const dispatch = useDispatch();
  
  const waterDrop = (
    <Ionicons
      style={styles.alignSelf}
      name={"water-outline"}
      size={20}
      color={Colors.primary}
    />
  );

  const refPlaceholder = (
    <View
      style={{
        ...styles.refPlaceholder,
        backgroundColor: Colors.primary + "10",
        borderColor: Colors.primary,
      }}
    >
      <Text style={{ ...styles.refText, color: Colors.primary }}>
        Select a spectrum and press {waterDrop}
        to use as reference{" "}
      </Text>
    </View>
  );

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

        <View style={styles.tableMaster}>
          <Text text50>Reference</Text>
          {refPlaceholder}
          <Text text50>Test</Text>
        </View>

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
    marginBottom: 16,
  },
  tableMaster: {
    marginHorizontal: 8,
  },
  refPlaceholder: {
    height: 48,
    borderWidth: 2,
    marginBottom: 8,
    borderStyle: "dotted",
    justifyContent: "center",
    lineHeight: 100,
  },
  refText: {
    alignSelf: "center",
    textAlignVertical: "center",
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
