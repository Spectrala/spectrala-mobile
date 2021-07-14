import React from "react";
import { StyleSheet, Image } from "react-native";
import { View, Card } from "react-native-ui-lib";
import CalibrationChart from "./CalibrationChart";
import { useSelector } from "react-redux";
import { selectActivePointPlacement } from "../../redux/reducers/calibration/calibration";
import { selectPreviewImg } from "../../redux/reducers/video";
import CameraLoader from "../../components/CameraLoader";

const CHART_INSET = 24;

export default function CalibrationScreen({ navigation }) {
  const previewImage = useSelector(selectPreviewImg);
  const isActivelyPlacing = useSelector(selectActivePointPlacement);

  return (
    <>
      <View style={{ ...styles.container, opacity: 0 }}>
        <CameraLoader collectsFrames={!isActivelyPlacing} />
      </View>

      <View style={styles.container}>
        <Card style={styles.previewImageCard}>
          <Image style={styles.previewImage} source={{ uri: previewImage }} />
        </Card>

        <Card style={styles.chart}>
          <CalibrationChart horizontalInset={CHART_INSET} />
        </Card>
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
  previewImageCard: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  previewImage: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: CHART_INSET,
    resizeMode: "stretch",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  picker: {
    zIndex: 30, // works on ios
    elevation: 30, // works on android
  },
});
