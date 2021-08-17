import React from "react";
import { StyleSheet, Image, View, Button } from "react-native";
import CalibrationChart from "./CalibrationChart";
import { useSelector, useDispatch } from "react-redux";
import {
  selectActivePointPlacement,
  selectShowsHelp,
} from "../../redux/reducers/Calibration";
import { toggleIsFlipped } from "../../redux/reducers/ReaderBox";
import {
  resetIntensityArrayHistory,
} from "../../redux/reducers/SpectrumFeed";
import BottomHelper from "../../components/BottomHelper";
import CameraLoader from "../../components/CameraLoader";
import { useTheme } from "@react-navigation/native";
import PreviewImage from "../../components/PreviewImage";
const CHART_INSET = 24;

export default function CalibrationScreen() {
  const isActivelyPlacing = useSelector(selectActivePointPlacement);
  const dispatch = useDispatch();
  const showsHelp = useSelector(selectShowsHelp);
  const { colors } = useTheme();

  const helperHeader = () => <View style={styles.helperBody}></View>;

  return (
    <>
      <View style={{ ...styles.container, opacity: 0 }}>
        <CameraLoader collectsFrames={!isActivelyPlacing} />
      </View>

      <View style={{ ...styles.container, backgroundColor: colors.background }}>
        <PreviewImage />
        <Button
          title="Flip Image"
          color={colors.text}
          onPress={() => {
            dispatch(toggleIsFlipped());
            dispatch(resetIntensityArrayHistory());
          }}
          style={styles.flipButton}
        />
        <CalibrationChart horizontalInset={CHART_INSET} />
        {showsHelp && (
          <BottomHelper
            utilityComponents={helperHeader}
            bodyText={
              /***/
              'Use the above markers to assign wavelength values to the incoming \
spectrum. It may be necessary to use the "Flip Image" button to ensure the \
order of the colors of the spectrum in the app matches the order of the colors \
in the spectrometer itself. To assign wavelength values, first turn on the \
specific light source used for calibration. Then, drag the markers to their \
respective high peaks on the chart. '
            }
            titleText="Wavelength assignment"
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
    right: 0,
    left: 0,
    height: "100%",
  },
  chart: {
    width: "100%",
    height: 300,
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: 100,
    resizeMode: "stretch",
  },
  flipButton: {
    width: "40%",
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
  },
});
