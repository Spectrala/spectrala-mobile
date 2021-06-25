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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Text, View } from "react-native-ui-lib";
import { useTheme } from "@react-navigation/native";
import { Svg, Line, Rect } from "react-native-svg";
import * as CalibPt from "../../redux/reducers/calibration/calibration_point";
import { setCalibrationPoints } from "../../redux/reducers/calibration/calibration";

const TICK_WIDTH = 40;

function Tick({ targetIdx, calibrationPoints, yPosition, onPress, viewDims }) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [bounds, setBounds] = useState({ min: undefined, max: undefined });
  const dispatch = useDispatch();
  const placement = () => calibrationPoints[targetIdx].placement;
  const wavelength = useCallback(
    () => calibrationPoints[targetIdx].wavelength,
    [calibrationPoints, targetIdx]
  );

  const [localX, setLocalX] = useState(placement());

  const getLeft = useCallback(() => {
    return viewDims ? localX * viewDims.width : 0;
  }, [viewDims, localX]);

  const dispatchX = () => {
    let pts = [...calibrationPoints];
    pts[targetIdx] = { ...pts[targetIdx], placement: localX };
    dispatch(setCalibrationPoints({ value: pts }));
  };

  useEffect(() => {
    let _bounds = { min: undefined, max: undefined };
    if (targetIdx === 0) {
      _bounds.min = TICK_WIDTH / 2;
    } else {
      _bounds.min = calibrationPoints[targetIdx - 1].placement;
    }
    if (targetIdx === calibrationPoints.length - 1) {
      _bounds.max = viewDims.width - TICK_WIDTH / 2;
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
          dispatchX();
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
        }}
        {...panResponder.panHandlers}
      >
        <Text text70>{wavelength()}</Text>
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
