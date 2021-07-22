import React from "react";
import { StyleSheet, Image, View, Text, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import SwitchableSpectrumChart from "../../components/SwitchableSpectrumChart";
import { useSelector, useDispatch } from "react-redux";
import CaptureButton from "./CaptureButton";
import {
  selectPreviewImg,
  selectIntensityChart,
} from "../../redux/reducers/SpectrumFeed";
import {
  recordSpectrum,
  selectReferenceSpectrum,
} from "../../redux/reducers/RecordedSpectra";
import CameraLoader from "../../components/CameraLoader";
import { Ionicons } from "@expo/vector-icons";
import CapturedList, { CapturedCell } from "./CapturedList";
import * as Spectrum from "../../types/Spectrum";
const CHART_INSET = 24;

export default function CaptureScreen({ navigation }) {
  const { colors } = useTheme();
  const previewImage = useSelector(selectPreviewImg);
  const intensityChart = useSelector(selectIntensityChart);
  const referenceSpectrum = useSelector(selectReferenceSpectrum);
  const dispatch = useDispatch();

  const waterDrop = (
    <Ionicons
      style={styles.alignSelf}
      name={"water-outline"}
      size={20}
      color={colors.primary}
    />
  );

  const refPlaceholder = (
    <View
      style={{
        ...styles.refPlaceholder,
        backgroundColor: colors.primary + "10",
        borderColor: colors.primary,
      }}
    >
      <Text style={{ ...styles.refText, color: colors.primary }}>
        Select a spectrum and press {waterDrop} to use as reference
      </Text>
    </View>
  );

  const getReferenceCell = () => {
    if (referenceSpectrum) {
      return <CapturedCell spectrum={referenceSpectrum} />;
    } else {
      return refPlaceholder;
    }
  };

  return (
    <>
      <View style={{ ...styles.container, opacity: 0 }}>
        <CameraLoader collectsFrames />
      </View>

      <ScrollView
        style={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        <Image
          style={styles.previewImage}
          fadeDuration={0}
          source={{ uri: previewImage }}
        />
        <SwitchableSpectrumChart
          style={styles.chart}
          spectrum={Spectrum.construct(null, null, intensityChart)}
        />

        <View style={styles.tableMaster}>
          <Text text50>Reference</Text>
          {getReferenceCell()}
          <Text text50>Test</Text>
          <CapturedList navigation={navigation} style={styles.list} />
        </View>
      </ScrollView>
      <CaptureButton style={styles.captureButton} onPress={recordSpectrum} />
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
  list: {
    marginBottom: 120,
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
