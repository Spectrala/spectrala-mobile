import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import * as Spectrum from "../../types/Spectrum";
import { updateSpectrum } from "../../redux/reducers/RecordedSpectra";

export default function ReviewScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { spectrum, targetIndex } = route.params;
  const dispatch = useDispatch();
  const [name, setName] = useState(Spectrum.getName(spectrum));

  const getWaterIcon = (isSelected) => (
    <Ionicons
      name={isSelected ? "water" : "water-outline"}
      size={30}
      color={colors.primary}
    />

    //Spectrum.rename(spectrum, text)
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
      <TouchableOpacity>{getWaterIcon(true)}</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
