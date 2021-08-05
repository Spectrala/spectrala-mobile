import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import * as Session from "../../types/Session";
import StackedChart from "./StackedChart";
import { useDispatch } from "react-redux";
import { restoreCalibration } from "../../redux/reducers/Calibration";
import { restoreBox } from "../../redux/reducers/ReaderBox";
import { restoreSpectra } from "../../redux/reducers/RecordedSpectra";
import { editSession } from "../../redux/reducers/Sessions";

export default function SessionDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { session } = route.params;
  const dispatch = useDispatch();

  const date = new Date(Session.getLastEditDateUnix(session));
  const name = Session.getName(session);
  const spectra = Session.getSpectraList(session);

  const ActionOption = ({ iconName, text, onPress }) => {
    return (
      <TouchableOpacity style={styles.actionRow} onPress={onPress}>
        <Ionicons style={styles.icon} name={iconName} size={27} />
        <Text style={styles.actionText}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const editSessionName = () => {
    console.log("session name edit ");
  };

  const beginEditingSession = () => {
    dispatch(editSession({ value: session }));
    const calibration = Session.getReduxCalibration(session);
    const box = Session.getReduxReaderBox(session);
    const spectra = Session.getReduxSpectra(session);
    dispatch(restoreCalibration({ value: calibration }));
    dispatch(restoreBox({ value: box }));
    dispatch(restoreSpectra({ value: spectra }));
    navigation.navigate("CaptureScreen");
  };

  return (
    <View
      style={{ ...styles.container, backgroundColor: colors.background + "ee" }}
    >
      <StackedChart style={styles.chart} spectra={spectra} />
      <TouchableOpacity onPress={editSessionName}>
        <Text style={{ ...styles.sectionTitle, color: colors.primary + "CC" }}>
          {name}
        </Text>
      </TouchableOpacity>
      <Text style={styles.sectionSubtitle}>
        {format(date, "h:mmaaa eeee, MMMM d, yyyy")}
      </Text>
      <View style={styles.actionContainer}>
        <ActionOption
          iconName="arrow-forward"
          text="Re-enter Session"
          onPress={beginEditingSession}
        />
        <ActionOption
          iconName="share-outline"
          text="Export Data"
          onPress={() => console.log("asdf")}
        />
        <ActionOption
          iconName="pencil"
          text="Rename"
          onPress={editSessionName}
        />
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.popToTop()}
        hitSlop={{ left: 60, right: 60, top: 20, bottom: 60 }}
      >
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#888",
    fontSize: 26,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontWeight: "500",
    color: "#666",
    fontSize: 16,
  },
  actionContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  icon: {
    marginRight: 16,
  },
  closeButton: {
    marginBottom: 48,
    alignItems: "center",
  },
  actionText: {
    fontSize: 16,
  },
  chart: {
    marginBottom: 16,
  },
});
