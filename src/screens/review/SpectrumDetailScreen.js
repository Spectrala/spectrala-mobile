import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import SwitchableSpectrumChart from "../../components/SwitchableSpectrumChart";
import {
  ActionOption,
  ConfirmDeleteToast,
} from "../sessionDetail/SessionDetailScreen";
import { useDispatch, useSelector } from "react-redux";
import * as Spectrum from "../../types/Spectrum";
import {
  updateSpectrum,
  selectReferenceSpectrum,
  setReference,
  removeReference,
  selectAllSpectra,
  deleteSpectrumWithKey,
} from "../../redux/reducers/RecordedSpectra";

const SPECTRUM_NAME_REGEX = "[A-Z,a-z,-,_,0-9]+";
const SPECTRUM_NAME_REGEX_ERROR =
  "Name must be non-empty and alphanumeric. Hyphen and underscore are also allowed.";
const SPECTRUM_NAME_DUPLICATE_ERROR =
  "New name must not be a duplicate of another spectrum name.";

export default function SpectrumDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const spectrumKey = Spectrum.getKey(route.params.spectrum);
  const allSpectra = useSelector(selectAllSpectra);
  const spectrum = useMemo(() => allSpectra[spectrumKey], [allSpectra]);

  const dispatch = useDispatch();
  const referenceSpectrum = useSelector(selectReferenceSpectrum);
  const [renameErrorMessage, setRenameErrorMessage] = useState(null);
  const [editedName, setEditedName] = useState(
    spectrum && Spectrum.getName(spectrum)
  );
  const [showsDeleteToast, setShowsDeleteToast] = useState(false);
  const renameInput = useRef(null);
  /**
   * Check if an attempted spectrum rename is a duplicate of an existant spectrum.
   * @param {String} name attempted naming of a new spectrum
   * @returns {bool} true if there is already a spectrum named name
   */
  const nameIsDuplicate = (name) => {
    const otherSpectra = Object.values(allSpectra).filter(
      (s) => s && Spectrum.getKey(s) !== spectrumKey
    );
    const otherSameNameSpectra = otherSpectra.filter(
      (s) => s && Spectrum.getName(s) === name
    );
    return otherSameNameSpectra.length > 0;
  };

  /**
   * Returns true if the focal spectrum is the reference spectrum.
   */
  const isReference = useMemo(
    () =>
      referenceSpectrum &&
      spectrum &&
      Spectrum.getKey(referenceSpectrum) === Spectrum.getKey(spectrum),
    [allSpectra, referenceSpectrum]
  );

  /**
   * Updates the redux store according to the result of isReference().
   */
  const onToggleReference = () => {
    if (isReference) {
      dispatch(removeReference());
    } else if (spectrum) {
      dispatch(setReference({ spectrum: spectrum }));
    }
  };

  useFocusEffect(
    useCallback(() => {
      return async () => {
        if (
          spectrum &&
          editedName !== Spectrum.getName(spectrum) &&
          !renameErrorMessage
        ) {
          dispatch(
            updateSpectrum({ spectrum: Spectrum.rename(spectrum, editedName) })
          );
        }
      };
    }, [editedName, spectrum])
  );

  const editSessionName = () => {
    renameInput.current.focus();
  };

  return (
    <>
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: colors.background + "ee",
        }}
      >
        <ConfirmDeleteToast
          showsDeleteToast={showsDeleteToast}
          setShowsDeleteToast={setShowsDeleteToast}
          backgroundColor={colors.danger}
          promptText="Delete spectrum?"
          onDelete={async () => {
            navigation.pop();
            dispatch(deleteSpectrumWithKey({ key: spectrumKey }));
          }}
        />
        {spectrum && <SwitchableSpectrumChart spectrum={spectrum} />}

        <TextInput
          style={{ ...styles.sectionTitle, color: colors.primary + "CC" }}
          value={editedName}
          ref={renameInput}
          onChangeText={(text) => {
            if (!new RegExp(SPECTRUM_NAME_REGEX).test(text)) {
              setRenameErrorMessage(SPECTRUM_NAME_REGEX_ERROR);
            } else if (nameIsDuplicate(text)) {
              setRenameErrorMessage(SPECTRUM_NAME_DUPLICATE_ERROR);
            } else {
              setRenameErrorMessage(null);
            }
            setEditedName(text);
          }}
        />
        {renameErrorMessage && (
          <Text style={styles.renameErrorText}>{renameErrorMessage}</Text>
        )}

        <View style={styles.actionContainer}>
          <ActionOption
            iconName={isReference ? "water" : "water-outline"}
            text={
              isReference
                ? "Stop using as reference spectrum"
                : "Use as reference spectrum"
            }
            onPress={onToggleReference}
          />
          <ActionOption
            iconName="pencil"
            text="Rename"
            onPress={editSessionName}
          />
          <ActionOption
            iconName="trash"
            text="Delete"
            onPress={() => setShowsDeleteToast(true)}
          />
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            navigation.pop();
            setShowsDeleteToast(false);
          }}
          hitSlop={{ left: 60, right: 60, top: 20, bottom: 60 }}
        >
          <Text>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: "center",
    flex: 1,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#888",
    fontSize: 26,
    marginTop: 16,
  },
  renameErrorText: {
    color: "red",
    marginBottom: 8,
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
  toast: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  toastText: {
    color: "black",
  },
  toastButtonText: {
    color: "black",
    fontWeight: "600",
    marginLeft: 32,
  },
  toastButtonContainer: {
    flexDirection: "row",
  },
});
