import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import * as Spectrum from "../../types/Spectrum";
import {
  updateSpectrum,
  selectReferenceKey,
  setReference,
  removeReference,
} from "../../redux/reducers/RecordedSpectra";

export default function ReviewScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { spectrum, targetIndex } = route.params;
  const dispatch = useDispatch();
  const [name, setName] = useState(Spectrum.getName(spectrum));
  const referenceKey = useSelector(selectReferenceKey);

  const isReference = useCallback(
    () => referenceKey === Spectrum.getKey(spectrum),
    [spectrum, referenceKey]
  );

  const onToggleReference = () => {
    if (isReference()) {
      dispatch(setReference({ key: Spectrum.getKey(spectrum) }));
    }
  };

  const waterIconButton = () => (
    <TouchableOpacity onPress={onToggleReference}>
      <Ionicons
        name={isReference() ? "water" : "water-outline"}
        size={30}
        color={colors.primary}
      />
    </TouchableOpacity>
  );

  return (
    <View>
      <TextInput
        onChangeText={(text) => {
          setName(text);
          dispatch(
            updateSpectrum({
              targetIndex,
              spectrum: Spectrum.rename(spectrum, text),
            })
          );
        }}
        value={name}
      />
      <TouchableOpacity>{waterIconButton()}</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
