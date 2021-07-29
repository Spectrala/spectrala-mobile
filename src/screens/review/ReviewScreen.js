import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import * as Spectrum from "../../types/Spectrum";
import Dialog from "react-native-ui-lib/dialog";
import {
  updateSpectrum,
  selectReferenceSpectrum,
  setReference,
  removeReference,
} from "../../redux/reducers/RecordedSpectra";
import SwitchableSpectrumChart from "../../components/SwitchableSpectrumChart";
import TitleHeader from "../../components/TitleHeader";

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
          size={27}
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
      onDismiss={() => {
        setRenameVisible(false), changeSpectrum(spectrum);
      }}
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.nameButton}
          onPress={() => setRenameVisible(true)}
        >
          <TitleHeader title={Spectrum.getName(spectrum)} />
        </TouchableOpacity>
        {renameDialog()}
        <TouchableOpacity>{waterIconButton()}</TouchableOpacity>
      </View>
      <SwitchableSpectrumChart spectrum={spectrum} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "white",
    height: "100%",
  },
  dialogView: {
    height: 200,
    width: "100%",
    marginTop: 40,
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
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 4,
    marginRight: 16,
    flex: 1,
    padding: 4,
  },
});
