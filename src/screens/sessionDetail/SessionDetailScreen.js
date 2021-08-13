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
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import * as Session from "../../types/Session";
import StackedChart from "./StackedChart";
import { useDispatch } from "react-redux";
import { restoreCalibration } from "../../redux/reducers/Calibration";
import { restoreBox } from "../../redux/reducers/ReaderBox";
import { restoreSpectra } from "../../redux/reducers/RecordedSpectra";
import {
  editSession,
  setShowsOnExitToast,
  dismissRecalibrateHint,
  updateSessionStoreNameEditNumber,
} from "../../redux/reducers/Sessions";
import * as SessionExport from "../../types/SessionExport";
import { emailSessionXLSX, shareSessionXLSX } from "../../util/fileUtil";
import {
  deleteSession,
  updateSessionWithSameKey,
} from "../../navigation/SessionStorage";
import Toast from "react-native-ui-lib/toast";

const SESSION_NAME_REGEX = "[A-Z,a-z,-,_,0-9]+";
const SESSION_NAME_REGEX_ERROR =
  "Name must be non-empty and alphanumeric. Hyphen and underscore are also allowed.";
const SESSION_NAME_DUPLICATE_ERROR =
  "New name must not be a duplicate of another session name.";

export const ActionOption = ({
  iconName,
  text,
  onPress,
  disabled: disabledProp,
  showsDeleteToast,
}) => {
  const disabled = disabledProp || showsDeleteToast;
  return (
    <TouchableOpacity
      style={{ ...styles.actionRow, opacity: disabled ? 0.3 : 1 }}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons style={styles.icon} name={iconName} size={27} />
      <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
  );
};

/**
 * Provides a toast to allow the user to confirm intention to delete something.
 * Automatically dismisses itself using setShowsDeleteToast.
 * 
 * The following params are props, all actually passed as one object param. 
 *
 * @param {bool} showsDeleteToast toast is visible, from useState
 * @param {function} setShowsDeleteToast set toast visible, from useState
 * @param {color} backgroundColor Color to set the background of the toast
 * @param {String} promptText "Are you sure" message on the toast
 * @param {function} onDelete method to call when delete is confirmed.
 * @returns {Toast}
 */
export const ConfirmDeleteToast = ({
  showsDeleteToast,
  setShowsDeleteToast,
  backgroundColor,
  promptText,
  onDelete
}) => (
  <Toast
    visible={showsDeleteToast}
    position={"top"}
    backgroundColor={backgroundColor}
    style={styles.toast}
  >
    <Text style={styles.toastText}>{promptText}</Text>
    <View style={styles.toastButtonContainer}>
      <TouchableOpacity onPress={() => setShowsDeleteToast(false)}>
        <Text style={styles.toastButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          setShowsDeleteToast(false);
          onDelete();
        }}
      >
        <Text style={styles.toastButtonText}>Yes</Text>
      </TouchableOpacity>
    </View>
  </Toast>
);

export default function SessionDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { session: originalSession, allSessions } = route.params;

  const dispatch = useDispatch();

  const renameInput = useRef(null);
  const [renameErrorMessage, setRenameErrorMessage] = useState(null);
  const originalName = Session.getName(originalSession);
  const [name, setName] = useState(originalName);

  const date = new Date(Session.getLastEditDateUnix(originalSession));
  const spectra = Session.getSpectraList(originalSession);

  const session = useMemo(
    () => Session.editName(originalSession, name),
    [name, originalSession]
  );

  useFocusEffect(
    useCallback(() => {
      return async () => {
        if (name !== originalName && !renameErrorMessage) {
          await updateSessionWithSameKey(session);
          dispatch(updateSessionStoreNameEditNumber());
        }
      };
    }, [session])
  );

  const beginEditingSession = () => {
    dispatch(editSession({ value: originalSession }));
    dispatch(setShowsOnExitToast({ value: false }));
    dispatch(dismissRecalibrateHint());

    const calibration = Session.getReduxCalibration(originalSession);
    const box = Session.getReduxReaderBox(originalSession);
    const spectra = Session.getReduxSpectra(originalSession);
    dispatch(restoreCalibration({ value: calibration }));
    dispatch(restoreBox({ value: box }));
    dispatch(restoreSpectra({ value: spectra }));
    navigation.push("CaptureScreen");
  };

  const exportData = () => {
    const exp = SessionExport.construct(name, originalSession);
    shareSessionXLSX(exp);
  };

  const mailData = () => {
    const exp = SessionExport.construct(name, originalSession);
    emailSessionXLSX(exp);
  };

  const editSessionName = () => {
    renameInput.current.focus();
  };

  const nameIsDuplicate = (text) => {
    const otherSessions = Object.values(allSessions).filter(
      (s) => Session.getKey(s) !== Session.getKey(originalSession)
    );
    const otherSameNameSessions = otherSessions.filter(
      (s) => Session.getName(s) === text
    );
    return otherSameNameSessions.length > 0;
  };

  const [showsDeleteToast, setShowsDeleteToast] = useState(false);

  const hasSpectra = useMemo(() => spectra.length > 0, [spectra]);

  return (
    <>
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: colors.background + "ee",
        }}
      >
        <Toast
          visible={showsDeleteToast}
          position={"top"}
          backgroundColor={colors.danger}
          style={styles.toast}
          showDismiss={true}
        >
          <Text style={styles.toastText}>Delete session?</Text>
          <View style={styles.toastButtonContainer}>
            <TouchableOpacity onPress={() => setShowsDeleteToast(false)}>
              <Text style={styles.toastButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                setShowsDeleteToast(false);
                await deleteSession(session, allSessions);
                navigation.popToTop();
              }}
            >
              <Text style={styles.toastButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </Toast>
        <StackedChart style={styles.chart} spectra={spectra} />

        <TextInput
          style={{ ...styles.sectionTitle, color: colors.primary + "CC" }}
          value={name}
          ref={renameInput}
          onChangeText={(text) => {
            if (!new RegExp(SESSION_NAME_REGEX).test(text)) {
              setRenameErrorMessage(SESSION_NAME_REGEX_ERROR);
            } else if (nameIsDuplicate(text)) {
              setRenameErrorMessage(SESSION_NAME_DUPLICATE_ERROR);
            } else {
              setRenameErrorMessage(null);
            }
            setName(text);
          }}
        />
        {renameErrorMessage && (
          <Text style={styles.renameErrorText}>{renameErrorMessage}</Text>
        )}

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
            onPress={exportData}
            disabled={!hasSpectra}
          />
          <ActionOption
            iconName="mail-outline"
            text="Mail Data"
            onPress={mailData}
            disabled={!hasSpectra}
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
            navigation.canGoBack() && navigation.popToTop();
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
    marginBottom: 8,
  },
  renameErrorText: {
    color: "red",
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
