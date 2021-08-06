import React, { useState, useCallback, useEffect } from "react";
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
  selectAllSpectrumNames,
} from "../../redux/reducers/RecordedSpectra";
import SwitchableSpectrumChart from "../../components/SwitchableSpectrumChart";
import { SafeAreaView } from "react-native";

const SPECTRUM_NAME_REGEX = "[A-Z,a-z, ,-,_,0-9]+";
const SPECTRUM_NAME_REGEX_ERROR =
  "Name must be non-empty and alphanumeric. Space, hyphen, and underscore are also allowed.";
const SPECTRUM_NAME_DUPLICATE_ERROR =
  "New name must not be a duplicate of another spectrum name.";

const CLOSE_BUTTON_DIAMETER = 64;

export default function ReviewScreen({ route, navigation }) {
  const { colors } = useTheme();
  const [spectrum, setSpectrum] = useState(route.params.spectrum);
  const [textIsEditing, setTextIsEditing] = useState(false);
  const dispatch = useDispatch();
  const referenceSpectrum = useSelector(selectReferenceSpectrum);
  const [renameErrorMessage, setRenameErrorMessage] = useState(null);
  const spectrumNames = useSelector(selectAllSpectrumNames);
  const [editedName, setEditedName] = useState(null);

  useEffect(() => {
    if (textIsEditing) {
      setEditedName(Spectrum.getName(spectrum));
    } else {
      setEditedName(null);
    }
  }, [textIsEditing]);

  /**
   * Check if an attempted spectrum rename is a duplicate of an existant spectrum.
   * @param {String} name attempted naming of a new spectrum
   * @returns {bool} true if there is already a spectrum named name
   */
  const nameIsDuplicate = (name) => {
    return spectrumNames.includes(name);
  };

  useEffect(() => {
    return () => dispatch(updateSpectrum({ spectrum }));
  }, []);

  /**
   * Update the focal spectrum of the review screen in both the
   * local state and the redux state.
   * @param {Spectrum} newSpectrum the updated spectrum to replace spectrum.
   */
  const changeSpectrum = (newSpectrum) => {
    setSpectrum(newSpectrum);
  };

  /**
   * Returns true if the focal spectrum is the reference spectrum.
   */
  const isReference = useCallback(
    () =>
      referenceSpectrum &&
      Spectrum.getKey(referenceSpectrum) === Spectrum.getKey(spectrum),
    [spectrum, referenceSpectrum]
  );

  /**
   * Updates the redux store according to the result of isReference().
   */
  const onToggleReference = () => {
    if (isReference()) {
      dispatch(removeReference());
    } else {
      dispatch(setReference({ spectrum }));
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
            onFocus={() => setTextIsEditing(true)}
            onEndEditing={() => {
              setTextIsEditing(false);
              if (!renameErrorMessage) {
                changeSpectrum(Spectrum.rename(spectrum, editedName));
              }
            }}
            value={textIsEditing ? editedName : Spectrum.getName(spectrum)}
            style={styles.textField}
          />
          <TouchableOpacity>{waterIconButton()}</TouchableOpacity>
        </View>
        {textIsEditing && renameErrorMessage && (
          <Text style={styles.renameErrorText}>{renameErrorMessage}</Text>
        )}
        <SwitchableSpectrumChart spectrum={spectrum} />
      </View>
      <TouchableOpacity
        style={{ ...styles.closeButton, backgroundColor: colors.background }}
        onPress={() => navigation.pop()}
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
