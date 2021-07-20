import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

const INNER_CIRCLE_SIZE = 70;
const CIRCLE_RING_SPACE = 10;

export default function CaptureButton({ onPress, style }) {
  const { colors } = useTheme();
  return (
    <View style={{ ...styles.captureButtonContainer, ...style }}>
      <TouchableOpacity
        onPress={onPress}
        style={{ ...styles.captureButtonArea, borderColor: colors.primary }}
      >
        <View
          style={{
            ...styles.cameraCircle,
            backgroundColor: colors.primary,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  captureButtonContainer: {
    height: INNER_CIRCLE_SIZE,
    width: "100%",
    alignItems: "center",
  },
  captureButtonArea: {
    height: INNER_CIRCLE_SIZE + CIRCLE_RING_SPACE,
    width: INNER_CIRCLE_SIZE + CIRCLE_RING_SPACE,
    borderRadius: (CIRCLE_RING_SPACE + INNER_CIRCLE_SIZE) / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraCircle: {
    width: INNER_CIRCLE_SIZE,
    height: INNER_CIRCLE_SIZE,
    borderRadius: INNER_CIRCLE_SIZE / 2,
  },
});
