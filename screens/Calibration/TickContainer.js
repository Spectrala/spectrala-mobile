import React, { useCallback, useRef, useState, useEffect } from "react";
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
import { Text, View } from "react-native-ui-lib";
import { useTheme } from "@react-navigation/native";
import { Svg, Line, Rect } from "react-native-svg";
import * as CalibPt from "../../redux/reducers/calibration/calibration_point";

const CIRCLE_RADIUS = 20;
const INACTIVE_TEXT_WIDTH = 60;

function TickContainer(props) {
  const { colors } = useTheme();

  const createTick = (initial, setter) => {
    const circleStyle = {
      ...styles.tick,
      backgroundColor: colors.primary,
    };

    const tickThumbHeight = props.tickHeight - 2 * props.tickMargin;

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

    return props.pointIsBeingPlaced ? (
      <Animated.View
        style={{
          position: "absolute",
          left: initial - props.chartInset,
          transform: [{ translateX: pan.x }],
        }}
        {...panResponder.panHandlers}
      >
        <View
          style={{
            ...circleStyle,
            height: tickThumbHeight,
            width: props.tickWidth,
            transform: [{ translateY: props.tickMargin }],
          }}
        >
          <Text style={styles.tickText}>{props.activeWavelength}</Text>
          
        </View>
      </Animated.View>
    ) : null;
  };

  const activeLine = useCallback(
    (xPosition) => {
      return (
        <Line
          key={"active"}
          x1={xPosition}
          y1={0}
          x2={xPosition}
          y2={props.chartHeight + props.tickMargin}
          stroke={colors.primary}
          strokeWidth="2"
        />
      );
    },
    [props.activeXPosition]
  );

  const inactiveTick = (idx, wavelength, xPosition) => {
    return (
      <Line
        key={`line-${idx}`}
        x1={xPosition}
        y1={0}
        x2={xPosition}
        y2={props.chartHeight + props.tickMargin}
        stroke={"black"}
        strokeWidth="2"
        strokeDasharray="2"
      />
    );
  };

  const inactiveText = (idx, wavelength, xPosition) => {
    const left = xPosition - INACTIVE_TEXT_WIDTH / 2;
    return (
      <View key={idx} style={{ ...styles.inactiveTextContainer, left: left }}>
        <Text style={styles.inactiveText}>{wavelength}</Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Svg height="100%" width="100%">
          {props.pointIsBeingPlaced ? activeLine(props.activeXPosition) : null}
          {props.previouslySetPoints.map((pt, idx) => {
            return inactiveTick(
              idx,
              CalibPt.getWavelengthDescription(pt),
              props.chartXFromCalibX(CalibPt.getPlacement(pt))
            );
          })}
        </Svg>
      </View>
      {props.previouslySetPoints.map((pt, idx) => {
        return inactiveText(
          idx,
          CalibPt.getWavelengthDescription(pt),
          props.chartXFromCalibX(CalibPt.getPlacement(pt))
        );
      })}

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
  chartInset: PropTypes.number.isRequired,
  activeWavelength: PropTypes.string.isRequired,
  pointIsBeingPlaced: PropTypes.bool.isRequired,
  setActiveXPosition: PropTypes.func.isRequired,
  activeXPosition: PropTypes.number.isRequired,
  initialXPosition: PropTypes.number.isRequired,
  previouslySetPoints: PropTypes.array,
  chartXFromCalibX: PropTypes.func,
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
  inactiveText: {
    fontSize: 14,
    lineHeight: 24,
  },
  inactiveTextContainer: {
    backgroundColor: "white",
    borderWidth: 2,
    height: 30,
    width: INACTIVE_TEXT_WIDTH,
    top: 20,
    justifyContent: "center",
    alignItems: "center",
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
