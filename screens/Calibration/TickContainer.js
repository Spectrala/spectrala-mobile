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

const CIRCLE_RADIUS = 20;

function TickContainer(props) {
  const { colors } = useTheme();

  const T1_INIT = { id: "t1", x: 100 };
  const SELECTED_TICK_COLOR = "#29b6f6";

  const [p1, setP1] = useState(T1_INIT.x);

  const createTick = (initial, setter) => {
    const circleStyle = { ...styles.tick, backgroundColor: SELECTED_TICK_COLOR };

    const pan = useRef(new Animated.ValueXY()).current;

    pan.addListener(({ x }) => setter(initial.x + x));

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
          left: initial.x - 10,
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
          <Text style={styles.tickText}>410</Text>
        </View>
      </Animated.View>
    );
  };

  const readerLine = useCallback(() => {
    return (
      <Svg height="100%" width="100%">
        <Line
          x1={p1 + CIRCLE_RADIUS}
          y1={0}
          x2={p1 + CIRCLE_RADIUS}
          y2={props.chartHeight + props.tickMargin}
          stroke={SELECTED_TICK_COLOR}
          strokeWidth="2"
        />
      </Svg>
    );
  }, [p1]);

  return (
    <>
      <View style={styles.container}>{readerLine()}</View>
      <View
        style={{
          ...styles.tickContainer,
          height: props.tickHeight,
          top: props.chartHeight,
        }}
      >
        {createTick(T1_INIT, setP1)}
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
  wavelengths: PropTypes.array,
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
