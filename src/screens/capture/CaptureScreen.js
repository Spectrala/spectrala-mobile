import React, { useState } from "react";
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
import Toast from "react-native-ui-lib/toast";
import { TouchableOpacity } from "react-native";
import {
  selectShowsOnExitToast,
  setShowsOnExitToast,
  endEditingSession
} from "../../redux/reducers/Sessions";

const CHART_INSET = 24;

export default function CaptureScreen({ navigation }) {
  const { colors } = useTheme();
  const previewImage = useSelector(selectPreviewImg);
  const intensityChart = useSelector(selectIntensityChart);
  const referenceSpectrum = useSelector(selectReferenceSpectrum);
  const dispatch = useDispatch();
  const showsOnExitToast = useSelector(selectShowsOnExitToast);

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
      return (
        <View style={styles.referenceCellContainer}>
          <CapturedCell navigation={navigation} spectrum={referenceSpectrum} />
        </View>
      );
    } else {
      return refPlaceholder;
    }
  };

  return (
    <>
      <View style={{ ...styles.container, opacity: 0 }}>
        <CameraLoader collectsFrames />
      </View>

      <Toast
        visible={showsOnExitToast}
        position={"top"}
        backgroundColor={colors.primary}
        style={styles.toast}
        showDismiss={true}
      >
        <Text style={styles.toastText}>Exit without saving?</Text>
        <View style={styles.toastButtonContainer}>
          <TouchableOpacity
            onPress={() => dispatch(setShowsOnExitToast({ value: false }))}
          >
            <Text style={styles.toastButtonText}>Stay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(setShowsOnExitToast({ value: false }));
              dispatch(endEditingSession());
              navigation.popToTop();
            }}
          >
            <Text style={styles.toastButtonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </Toast>

      <ScrollView
        style={{ ...styles.container, opacity: showsOnExitToast ? 0.5 : 1 }}
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

        <View style={styles.referenceMaster}>
          <Text style={styles.sectionText}>Reference</Text>
          {getReferenceCell()}
        </View>
        <View style={styles.testMaster}>
          <Text style={styles.sectionText}>Test</Text>
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
  list: {
    marginBottom: 120,
  },
  testMaster: {
    padding: 16,
    margin: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: "100%",
    backgroundColor: "white",
    shadowColor: "gray",
    shadowRadius: 10,
    shadowOpacity: 0.12,
  },
  referenceMaster: {
    padding: 16,
    margin: 8,
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "gray",
    shadowRadius: 10,
    shadowOpacity: 0.25,
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
  sectionText: {
    fontWeight: "600",
    color: "#777",
    fontSize: 20,
    marginBottom: 8,
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
    marginLeft: 16,
  },
  toastButtonContainer: {
    flexDirection: "row",
  },
});
