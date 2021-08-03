import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

export default function SessionDetailScreen({ route }) {
  const { colors } = useTheme();
  const { name, date: dateUnix } = route.params;

  const date = new Date(dateUnix);

  const actionOption = () => {
    return (
      <TouchableOpacity style={styles.actionRow}>
        <Ionicons
          style={styles.icon}
          name={"enter-outline"}
          size={27}
          // color={colors.primary}
        />
        <Text style={styles.actionText}>Re-enter Session</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.sectionTitle, color: colors.primary + "CC" }}>
        {name}
      </Text>
      <Text style={styles.sectionSubtitle}>
        {format(date, "h:mmaaa eeee, MMMM d, yyyy")}
      </Text>
      <View style={styles.actionContainer}>
        {actionOption()}
        {actionOption()}
        {actionOption()}
        {actionOption()}
      </View>
      <TouchableOpacity style={styles.closeButton}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    padding: 16,
  },

  sectionTitle: {
    fontWeight: "600",
    color: "#888",
    fontSize: 26,
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
    padding: 18,
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
  },
  actionText: {
    fontSize: 16,
  },
});
