import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  BackHandler,
  StyleSheet,
  Animated,
  PanResponder,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Button, Text, View } from "react-native-ui-lib";
import { useTheme } from "@react-navigation/native";
import { Svg, Line, Rect } from "react-native-svg";
import * as CalibPt from "../../redux/reducers/calibration/calibration_point";
import { setPlacement } from "../../redux/reducers/calibration/calibration";

const TICK_WIDTH = 40;
const VERTICAL_SLOP = 20;

function Tick({
  targetIdx,
  calibrationPoints,
  yPosition,
  isBottom,
  onPress,
  viewDims,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [bounds, setBounds] = useState({ min: undefined, max: undefined });
  const dispatch = useDispatch();
  const placement = () => calibrationPoints[targetIdx].placement;
  const wavelength = useCallback(
    () => calibrationPoints[targetIdx].wavelength,
    [calibrationPoints, targetIdx]
  );

  const [localX, setLocalX] = useState(placement());

  // Make sure the lines from the bottom ones don't cross the top ones
  const zPosition = isBottom ? 10 : 20;

  const getScreenX = (x) => (viewDims ? x * viewDims.width : 0);

  const getLeft = useCallback(() => getScreenX(localX), [viewDims, localX]);

  const getSlop = useCallback(() => {
    const screenMin = getScreenX(bounds.min);
    const screenPos = getLeft();
    const screenMax = getScreenX(bounds.max);
    return {
      left: screenPos - screenMin,
      right: screenMax - screenPos,
      top: isBottom ? 0 : VERTICAL_SLOP,
      bottom: isBottom ? VERTICAL_SLOP : 0,
    };
  }, [bounds]);

  useEffect(() => {
    let _bounds = { min: undefined, max: undefined };
    if (targetIdx === 0) {
      _bounds.min = TICK_WIDTH / 2;
    } else {
      _bounds.min = calibrationPoints[targetIdx - 1].placement;
    }
    if (targetIdx === calibrationPoints.length - 1) {
      _bounds.max = viewDims ? viewDims.width - TICK_WIDTH / 2 : undefined;
    } else {
      _bounds.max = calibrationPoints[targetIdx + 1].placement;
    }
    setBounds(_bounds);
  }, [calibrationPoints, viewDims]);

  const initial = useRef(placement()).current;

  pan.addListener(({ x }) => {
    !viewDims || setLocalX(initial + x / viewDims.width);
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          const dx = pan.x._value;
          pan.setOffset({ x: dx });
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: () => {
          pan.flattenOffset();
          dispatch(setPlacement({ placement: localX, targetIndex: targetIdx }));
        },
      }),
    [viewDims]
  );

  return (
    <>
      <Animated.View
        style={{
          ...styles.thumb,
          left: getLeft(),
          top: yPosition,
          zIndex: zPosition, // works on ios
          elevation: zPosition, // works on android
        }}
        {...panResponder.panHandlers}
      >
        <Pressable onPress={onPress} hitSlop={getSlop()}>
          <Text text70>{wavelength()}</Text>
        </Pressable>
      </Animated.View>

      <View
        style={{
          borderColor: "black",
          borderWidth: StyleSheet.hairlineWidth,
          height: yPosition,
          position: "absolute",
          top: 0,
          width: 0,
          left: getLeft() + TICK_WIDTH / 2,
        }}
      />
    </>
  );
}

Tick.propTypes = {
  targetIdx: PropTypes.number,
  calibrationPoints: PropTypes.array,
  yPosition: PropTypes.number,
  isBottom: PropTypes.bool,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  thumb: {
    width: TICK_WIDTH,
    height: 30,
    position: "absolute",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
});

export default Tick;
