import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import * as Spectrum from "../../types/Spectrum";
import Dialog from "react-native-ui-lib/dialog";
import Button from "react-native-ui-lib/button";
import {
  updateSpectrum,
  selectReferenceSpectrum,
  setReference,
  removeReference,
} from "../../redux/reducers/RecordedSpectra";
import SwitchableSpectrumChart from "../../components/SwitchableSpectrumChart";
import { CapturedCell } from "../capture/CapturedList";

export default function ReviewScreen({ route, navigation }) {
  const { colors } = useTheme();
  const [spectrum, setSpectrum] = useState(route.params.spectrum);
  const [renameDialogVisible, setRenameVisible] = useState(false);
  const dispatch = useDispatch();
  const referenceSpectrum = useSelector(selectReferenceSpectrum);

  const changeSpectrum = (newSpectrum) => {
    setSpectrum(newSpectrum);
    dispatch(
      updateSpectrum({
        spectrum: newSpectrum,
      })
    );
  };

  const isReference = useCallback(
    () =>
      referenceSpectrum &&
      Spectrum.getKey(referenceSpectrum) === Spectrum.getKey(spectrum),
    [spectrum, referenceSpectrum]
  );

  const onToggleReference = () => {
    if (isReference()) {
      dispatch(removeReference());
    } else {
      dispatch(setReference({ spectrum }));
    }
  };

  const waterIconButton = () => {
    const ref = isReference();
    return (
      <TouchableOpacity onPress={onToggleReference}>
        <Ionicons
          name={ref ? "water" : "water-outline"}
          size={ref ? 30 : 27}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const renameDialog = () => (
    <Dialog
      top
      centerH
      visible={renameDialogVisible}
      migrate
      useSafeArea
      onDismiss={() => setRenameVisible(false)}
    >
      <View
        style={{
          ...styles.dialogView,
          backgroundColor: colors.background,
        }}
      >
        <Text>Edit Spectrum name</Text>
        <TextInput
          onChangeText={(text) =>
            changeSpectrum(Spectrum.rename(spectrum, text))
          }
          value={Spectrum.getName(spectrum)}
        />
        <Text>Tap away to dismiss</Text>
      </View>
    </Dialog>
  );

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.nameButton}
          onPress={() => setRenameVisible(true)}
        >
          <Ionicons name={"pencil"} size={20} color={colors.primary} />
        </TouchableOpacity>
        {renameDialog()}
        <TouchableOpacity>{waterIconButton()}</TouchableOpacity>
      </View>
      <SwitchableSpectrumChart spectrum={spectrum} />
    </View>
  );
}

const styles = StyleSheet.create({
  dialogView: {
    height: 200,
    width: "100%",
    marginTop: 100,
    borderRadius: 16,
    justifyContent: "space-around",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  nameButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
