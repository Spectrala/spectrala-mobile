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

  const [p1, setP1] = useState(T1_INIT.x);

  const createCircle = (initial, setter) => {
    const circleStyle = { ...styles.circle, backgroundColor: colors.border };

    const pan = useRef(new Animated.ValueXY()).current;

    pan.addListener(({ x }) =>
      setter(initial.x + x)
    );

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

    return (
      <Animated.View
        style={{
          position: "absolute",
          left: initial.x,
          transform: [{ translateX: pan.x }],
        }}
        {...panResponder.panHandlers}
      >
        <View style={circleStyle} />
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
          y2={200}
          stroke="black"
          strokeWidth="2"
        />
      </Svg>
    );
  }, [p1]);

  return (
    <>
      <View style={styles.container}>{readerLine()}</View>
      <View style={styles.container}>{createCircle(T1_INIT, setP1)}</View>
    </>
  );
}

TickContainer.propTypes = {
  style: PropTypes.object,
  height: PropTypes.number,
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold",
  },
  circle: {
    height: CIRCLE_RADIUS * 2,
    width: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
  },
});

export default TickContainer;
