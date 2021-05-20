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

function DraggablePointsContainer(props) {
  const { colors } = useTheme();

  const P1_INIT = { id: "c1", pos: { x: 100, y: 150 } };
  const P2_INIT = { id: "c2", pos: { x: 200, y: 200 } };

  const [p1, setP1] = useState(P1_INIT.pos);
  const [p2, setP2] = useState(P2_INIT.pos);

  const createCircle = (initial, setter) => {
    const circleStyle = { ...styles.circle, backgroundColor: colors.primary };

    const pan = useRef(new Animated.ValueXY()).current;

    pan.addListener(({ x, y }) =>
      setter({
        x: initial.pos.x + x,
        y: initial.pos.y + y,
      })
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
          left: initial.pos.x,
          top: initial.pos.y,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
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
          x1={p1.x + CIRCLE_RADIUS}
          y1={p1.y + CIRCLE_RADIUS}
          x2={p2.x + CIRCLE_RADIUS}
          y2={p2.y + CIRCLE_RADIUS}
          stroke="black"
          strokeWidth="2"
        />
      </Svg>
    );
  }, [p1, p2]);

  return (
    <>
      <View style={styles.container}>{readerLine()}</View>
      <View style={styles.container}>
        {createCircle(P1_INIT, setP1)}
        {createCircle(P2_INIT, setP2)}
      </View>
    </>
  );
}

DraggablePointsContainer.propTypes = {
  style: PropTypes.object,
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

export default DraggablePointsContainer;
