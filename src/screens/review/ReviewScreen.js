import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import * as Spectrum from "../../types/Spectrum";
import {
  updateSpectrum,
  selectReferenceSpectrum,
  setReference,
  removeReference,
  selectAllSpectra,
} from "../../redux/reducers/RecordedSpectra";
import SwitchableSpectrumChart from "../../components/SwitchableSpectrumChart";
import { SafeAreaView } from "react-native";

const SPECTRUM_NAME_REGEX = "[A-Z,a-z,-,_,0-9]+";
const SPECTRUM_NAME_REGEX_ERROR =
  "Name must be non-empty and alphanumeric. Hyphen and underscore are also allowed.";
const SPECTRUM_NAME_DUPLICATE_ERROR =
  "New name must not be a duplicate of another spectrum name.";

const CLOSE_BUTTON_DIAMETER = 64;

export default function ReviewScreen({ route, navigation }) {
  const { colors } = useTheme();
  const spectrumKey = Spectrum.getKey(route.params.spectrum);
  const allSpectra = useSelector(selectAllSpectra);
  const spectrum = useMemo(() => allSpectra[spectrumKey], [allSpectra]);
  const dispatch = useDispatch();
  const referenceSpectrum = useSelector(selectReferenceSpectrum);
  const [renameErrorMessage, setRenameErrorMessage] = useState(null);
  const [editedName, setEditedName] = useState(Spectrum.getName(spectrum));

  /**
   * Check if an attempted spectrum rename is a duplicate of an existant spectrum.
   * @param {String} name attempted naming of a new spectrum
   * @returns {bool} true if there is already a spectrum named name
   */
  const nameIsDuplicate = (name) => {
    const otherSpectra = Object.values(allSpectra).filter(
      (s) => Spectrum.getKey(s) !== spectrumKey
    );
    const otherSameNameSpectra = otherSpectra.filter(
      (s) => Spectrum.getName(s) === name
    );
    return otherSameNameSpectra.length > 0;
  };

  /**
   * Returns true if the focal spectrum is the reference spectrum.
   */
  const isReference = useCallback(
    () =>
      referenceSpectrum &&
      Spectrum.getKey(referenceSpectrum) === Spectrum.getKey(spectrum),
    [allSpectra, referenceSpectrum]
  );

  /**
   * Updates the redux store according to the result of isReference().
   */
  const onToggleReference = () => {
    if (isReference()) {
      dispatch(removeReference());
    } else {
      dispatch(setReference({ spectrum: spectrum }));
    }
  };

  /**
   * Provides a toggleable button to represent setting the reference spectrum.
   * @returns {TouchableOpacity} Pressable reference spectrum icon
   */
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

  const endTextEdit = () => {
    if (spectrum && !renameErrorMessage) {
      dispatch(
        updateSpectrum({ spectrum: Spectrum.rename(spectrum, editedName) })
      );
    }
  };

  return (
    <SafeAreaView
      style={{ ...styles.master, backgroundColor: colors.background + "e0" }}
    >
      <View style={{ ...styles.container, backgroundColor: colors.background }}>
        <View style={styles.header}>
          <TextInput
            onChangeText={(text) => {
              // Should be able to edit a temp value and only save on dismiss.
              if (!new RegExp(SPECTRUM_NAME_REGEX).test(text)) {
                setRenameErrorMessage(SPECTRUM_NAME_REGEX_ERROR);
              } else if (nameIsDuplicate(text)) {
                setRenameErrorMessage(SPECTRUM_NAME_DUPLICATE_ERROR);
              } else {
                setRenameErrorMessage(null);
              }
              setEditedName(text);
            }}
            onFocus={() => setEditedName(Spectrum.getName(spectrum))}
            onEndEditing={() => {
              endTextEdit();
            }}
            value={editedName}
            style={styles.textField}
          />
          <TouchableOpacity>{waterIconButton()}</TouchableOpacity>
        </View>
        {renameErrorMessage && (
          <Text style={styles.renameErrorText}>{renameErrorMessage}</Text>
        )}
        <SwitchableSpectrumChart spectrum={spectrum} />
      </View>
      <TouchableOpacity
        style={{ ...styles.closeButton, backgroundColor: colors.background }}
        onPress={() => {
          navigation.pop();
          endTextEdit();
        }}
      >
        <Ionicons name="close" size={32} color={colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  master: {
    flex: 1,
  },
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 16,
    shadowColor: "black",
    shadowRadius: 64,
    shadowOpacity: 0.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    marginHorizontal: 8,
  },
  textField: {
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 4,
    marginRight: 16,
    flex: 1,
    padding: 4,

    fontSize: 22,
    fontWeight: "500",
  },
  renameErrorText: {
    color: "red",
    marginVertical: 4,
  },
  dismissText: {
    fontWeight: "600",
  },
  closeButton: {
    borderRadius: CLOSE_BUTTON_DIAMETER / 2,
    width: CLOSE_BUTTON_DIAMETER,
    height: CLOSE_BUTTON_DIAMETER,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowRadius: 16,
    shadowOpacity: 0.2,
  },
});
