import React from "react";
import { Text } from "react-native";

export default function TitleHeader({ title, color }) {
  return (
    <Text
      style={{
        fontSize: 24,
        fontWeight: "600",
        color,
      }}
    >
      {title}
    </Text>
  );
}
