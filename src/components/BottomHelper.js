import React, { useState, useCallback } from "react";
import { StyleSheet, ScrollView } from "react-native";
import {
  Text,
  View,
  ExpandableSection,
  Colors,
  Card,
} from "react-native-ui-lib";
import { AntDesign } from "@expo/vector-icons";

export default function BottomHelper({ utilityComponents, bodyText }) {
  const [helperExpanded, setExpanded] = useState(false);

  const Divider = () => {
    return <View style={styles.divider} />;
  };

  const helperHeader = useCallback(
    () => (
      <View>
        <View style={styles.helperHeaderRow}>
          <Text subheading>Reader box</Text>
          <AntDesign
            name={helperExpanded ? "downcircleo" : "upcircleo"}
            size={24}
            color={Colors.background}
          />
        </View>
        {utilityComponents()}
      </View>
    ),
    [helperExpanded]
  );

  const helperView = () => (
    <>
      <Divider />
      <View style={styles.helperBody}>
        <Text>{bodyText}</Text>
      </View>
    </>
  );

  return (
    <View style={styles.scrollMaster}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={false}
      >
        <Card>
          <ExpandableSection
            expanded={helperExpanded}
            onPress={() => setExpanded(!helperExpanded)}
            sectionHeader={helperHeader()}
            top={false}
          >
            {helperView()}
          </ExpandableSection>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollMaster: {
    position: "absolute",
    zIndex: 40,
    elevation: 40,
    width: "100%",
    bottom: 24,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  scrollContainer: {
    width: "100%",
  },
  scroll: {
    alignSelf: "flex-end",
  },
  helperHeaderRow: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  helperBody: {
    padding: 16,
    paddingTop: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "gray",
    width: "100%",
  },
});
