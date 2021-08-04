import React from "react";
import { Text } from "react-native";

export default function TitleHeader({ title, color }) {
  return (
    <Text
      style={{
        fontSize: 22,
        fontWeight: "500",
        color,
      }}
    >
      {title}
    </Text>
  );
}
