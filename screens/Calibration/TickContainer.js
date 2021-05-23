import React, { useCallback, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  View,
  BackHandler,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Svg, Line, Rect } from "react-native-svg";
import * as CalibPt from "../../redux/reducers/calibration/calibration_point";

const CIRCLE_RADIUS = 20;

function TickContainer(props) {
  const { colors } = useTheme();

  const createTick = (initial, setter) => {
    const circleStyle = {
      ...styles.tick,
      backgroundColor: colors.primary,
    };

    const pan = useRef(new Animated.ValueXY()).current;

    pan.addListener(({ x }) => setter(initial + x));

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: () => {
          pan.flattenOffset();
        },
      })
    ).current;

    // TODO: fix hardcoded style (10)
    return (
      <Animated.View
        style={{
          position: "absolute",
          left: initial - 10,
          transform: [{ translateX: pan.x }],
        }}
        {...panResponder.panHandlers}
      >
        <View
          style={{
            ...circleStyle,
            height: props.tickHeight - 2 * props.tickMargin,
            width: props.tickWidth,
            transform: [{ translateY: props.tickMargin }],
          }}
        >
          <Text style={styles.tickText}>{props.activeWavelength}</Text>
        </View>
      </Animated.View>
    );
  };

  const activeLine = useCallback(
    (xPosition) => {
      return (
        <Svg height="100%" width="100%">
          <Line
            x1={xPosition + CIRCLE_RADIUS}
            y1={0}
            x2={xPosition + CIRCLE_RADIUS}
            y2={props.chartHeight + props.tickMargin}
            stroke={colors.primary}
            strokeWidth="2"
          />
        </Svg>
      );
    },
    [props.activeXPosition]
  );

  const inactiveTick = useCallback(
    (idx, wavelength, xPosition) => {
      return (
        <Svg key={idx} height="100%" width="100%">
          <Line
            x1={xPosition + CIRCLE_RADIUS}
            y1={0}
            x2={xPosition + CIRCLE_RADIUS}
            y2={props.chartHeight + props.tickMargin}
            stroke={colors.primary}
            strokeWidth="2"
          />
        </Svg>
      );
    },
    [props.previouslySetPoints]
  );

  return (
    <>
      <View style={styles.container}>{activeLine(props.activeXPosition)}</View>

      <View
        style={{
          ...styles.tickContainer,
          height: props.tickHeight,
          top: 0,
        }}
      >
        {props.previouslySetPoints.map((pt, idx) => {
          return inactiveTick(
            idx,
            CalibPt.getWavelengthDescription(pt),
            CalibPt.getPlacement(pt)
          );
        })}
      </View>
      <View
        style={{
          ...styles.tickContainer,
          height: props.chartHeight,
          top: props.chartHeight,
        }}
      >
        {createTick(props.initialXPosition, props.setActiveXPosition)}
      </View>
    </>
  );
}

TickContainer.propTypes = {
  style: PropTypes.object,
  chartHeight: PropTypes.number.isRequired,
  tickHeight: PropTypes.number.isRequired,
  tickMargin: PropTypes.number.isRequired,
  tickWidth: PropTypes.number.isRequired,
  chartMargin: PropTypes.number.isRequired,
  activeWavelength: PropTypes.string.isRequired,
  setActiveXPosition: PropTypes.func.isRequired,
  activeXPosition: PropTypes.number.isRequired,
  initialXPosition: PropTypes.number.isRequired,
  previouslySetPoints: PropTypes.array,
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  tickContainer: {
    position: "absolute",
    left: 0,
    width: "100%",
  },
  tickText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold",
  },
  tick: {
    height: CIRCLE_RADIUS * 2,
    width: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TickContainer;
