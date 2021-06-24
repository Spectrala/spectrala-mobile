import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, ScrollView } from "react-native";
import {
  Text,
  View,
  Slider,
  ExpandableSection,
  Colors,
  Card,
} from "react-native-ui-lib";

import { StackNavigationProp } from "@react-navigation/stack";
import DraggablePointsContainer from "./DraggablePointsContainer";
import CameraView from "./CameraView";
import { useDispatch, useSelector } from "react-redux";
import {
  selectReaderWidth,
  updateReaderWidth,
} from "../../redux/reducers/video";
import { AntDesign } from "@expo/vector-icons";

// TODO: stop using expo in order to figure out the camera stuff
export default function CameraScreen({ navigation }) {
  const readerWidth = useSelector(selectReaderWidth);
  const initialWidth = useRef(readerWidth).current;
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [helperExpanded, setExpanded] = useState(true);

  const Divider = () => {
    return <View style={styles.divider} />;
  };
  const helperHeader = useCallback(
    () => (
      <View style={styles.helperHeader}>
        <Text>Reader box</Text>
        <AntDesign
          name={helperExpanded ? "upcircleo" : "downcircleo"}
          size={24}
          color={Colors.background}
        />
      </View>
    ),
    [helperExpanded]
  );

  const helperView = () => (
    <View style={styles.helperBody}>
      <Divider />
      <Text>Width: {readerWidth}</Text>
      <Slider
        containerStyle={styles.slider}
        value={initialWidth}
        onValueChange={(value) => dispatch(updateReaderWidth({ value }))}
        minimumValue={10}
        maximumValue={200}
        step={5}
        minimumTrackTintColor={Colors.primary}
        thumbTintColor={Colors.primary}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CameraView captureIntervalSeconds={5} isActive={true} />
      <DraggablePointsContainer width={readerWidth} />
      <ScrollView>
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
  container: {
    flex: 1,
    height: "100%",
  },

  helperHeader: {
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

  modalView: {
    flex: 1,
    width: "90%",
    margin: 20,
    padding: 20,
    alignItems: "center",

    backgroundColor: "white",

    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  slider: {
    width: "90%",
  },
});
