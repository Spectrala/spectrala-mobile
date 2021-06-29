import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Text, View, Slider, Colors } from "react-native-ui-lib";
import DraggablePointsContainer from "./DraggablePointsContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  selectReaderWidth,
  updateReaderWidth,
} from "../../redux/reducers/video"
import BottomHelper from "../../components/BottomHelper";

export default function CameraScreen({ navigation }) {
  const readerWidth = useSelector(selectReaderWidth);
  const initialWidth = useRef(readerWidth).current;
  const dispatch = useDispatch();

  const helperHeader = useCallback(
    () => (
      <View style={styles.helperBody}>
        <Text>Width</Text>
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
    ),
    []
  );

  return (
    <View style={styles.container}>
      <DraggablePointsContainer width={readerWidth} />
      <BottomHelper
        utilityComponents={helperHeader}
        bodyText={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in\
nisi maximus, vehicula nibh pulvinar, pulvinar massa. Maecenas quis\
lectus elit. Aliquam tempus felis rutrum ex blandit, eu laoreet sapien\
tincidunt. Nam convallis, velit at rutrum rutrum, mauris nunc\
vestibulum velit, et mollis sapien elit eu nibh. Sed eget nulla orci.\
Etiam a lorem rhoncus, tempus erat nec, lobortis odio. Maecenas semper\
sagittis auctor."
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  helperBody: {
    padding: 16,
    paddingTop: 0,
  },
  slider: {
    flex: 1,
  },
});
