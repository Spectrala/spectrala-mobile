import React, { useMemo } from "react";
import { StyleSheet, Image, View, Text, FlatList } from "react-native";
import { useTheme } from "@react-navigation/native";
import SwitchableSpectrumChart from "../../components/SwitchableSpectrumChart";
import { useSelector, useDispatch } from "react-redux";
import CaptureButton from "./CaptureButton";
import {
  selectPreviewImg,
  selectIntensityChart,
} from "../../redux/reducers/SpectrumFeed";
import {
  selectReferenceSpectrum,
  selectRecordedSpectra,
} from "../../redux/reducers/RecordedSpectra";
import CameraLoader from "../../components/CameraLoader";
import { Ionicons } from "@expo/vector-icons";
import { CapturedCell } from "./CapturedCell";
import * as Spectrum from "../../types/Spectrum";
import Toast from "react-native-ui-lib/toast";
import { TouchableOpacity } from "react-native";
import {
  selectShowsOnExitToast,
  setShowsOnExitToast,
  endEditingSession,
  dismissRecalibrateHint,
} from "../../redux/reducers/Sessions";

export function exitCaptureScreen(dispatch, navigation) {
  dispatch(setShowsOnExitToast({ value: false }));
  dispatch(dismissRecalibrateHint());
  dispatch(endEditingSession());
  navigation.canGoBack() && navigation.popToTop();
}

export default function CaptureScreen({ navigation }) {
  const { colors } = useTheme();
  const previewImage = useSelector(selectPreviewImg);
  const intensityChart = useSelector(selectIntensityChart);
  const referenceSpectrum = useSelector(selectReferenceSpectrum);
  const dispatch = useDispatch();
  const showsOnExitToast = useSelector(selectShowsOnExitToast);
  const recordedSpectra = useSelector(selectRecordedSpectra);

  const spectrumIsReference = (spectrum) => {
    return (
      referenceSpectrum &&
      spectrum &&
      Spectrum.getKey(spectrum) === Spectrum.getKey(referenceSpectrum)
    );
  };

  const nonReferenceSpectra = useMemo(
    () => recordedSpectra.filter((spectrum) => !spectrumIsReference(spectrum)),
    [recordedSpectra]
  );

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
            <Text style={styles.toastButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => exitCaptureScreen(dispatch, navigation)}
          >
            <Text style={styles.toastButtonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </Toast>

      <Image
        style={styles.previewImage}
        fadeDuration={0}
        source={{ uri: previewImage }}
      />

      <View
        style={{
          ...styles.container,
          opacity: showsOnExitToast ? 0.5 : 1,
        }}
      >
        <FlatList
          data={nonReferenceSpectra}
          renderItem={({ item: spectrum }) => (
            <CapturedCell
              navigation={navigation}
              spectrum={spectrum}
              style={styles.cell}
              key={`sm${Spectrum.getKey(spectrum)}`}
            />
          )}
          ListHeaderComponent={
            <View
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={!showsOnExitToast}
            >
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
              </View>
            </View>
          }
          ListFooterComponent={<View style={styles.listFooter} />}
          keyExtractor={(item) => Spectrum.getKey(item)}
        />
      </View>

      <CaptureButton style={styles.captureButton} disabled={showsOnExitToast} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    paddingTop: 20,
    left: 0,
    right: 0,
    bottom: 0,
  },
  list: {
    marginBottom: 120,
  },
  testMaster: {
    paddingTop: 16,
    paddingLeft: 16,
    marginTop: 8,
    marginHorizontal: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 52,
    backgroundColor: "white",
    shadowColor: "gray",
    shadowRadius: 10,
    shadowOpacity: 0.12,
  },
  cell: {
    marginHorizontal: 8,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  listFooter: {
    marginHorizontal: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    height: 16,
    marginBottom: 120,
    backgroundColor: "white",
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
    position: "absolute",
    width: "100%",
    height: 80,
    top: 0,
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
    marginLeft: 32,
  },
  toastButtonContainer: {
    flexDirection: "row",
  },
});
