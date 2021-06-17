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
  Pressable,
  Modal,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Svg, Line, Rect, Circle } from "react-native-svg";
import Victor from "victor";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLineCoords,
  updateAllLineCoords,
  selectCorners,
  setCorners,
} from "../../redux/reducers/video";
const CIRCLE_RADIUS = 20;

function DraggablePointsContainer({ width }) {
  const { colors } = useTheme();
  const lineCoords = useSelector(
    selectLineCoords,
    (a, b) => false // TODO: fix hack
  );
  const corners = useSelector(
    selectCorners,
    (a, b) => false // TODO: fix hack
  );
  const dispatch = useDispatch();

  // const P1_INIT = {
  //   x: lineCoords.lowX,
  //   y: lineCoords.lowY,
  // };

  // const P2_INIT = {
  //   x: lineCoords.highX,
  //   y: lineCoords.highY,
  // };

  // TODO: See how above code can be used to get an initial value from redux.
  const P1_INIT = {
    x: 100,
    y: 200,
  };

  const P2_INIT = {
    x: 200,
    y: 600,
  };

  const [p1, setP1] = useState(P1_INIT);

  const [p2, setP2] = useState(P2_INIT);

  const updateStore = useCallback(() => {
    dispatch(
      updateAllLineCoords({
        value: {
          lowX: p1.x,
          lowY: p1.y,
          highX: p2.x,
          highY: p2.y,
        },
      })
    );
  }, [p1, p2]);

  const updateCorners = useCallback(() => {
    let x1 = new Victor(p1.x + CIRCLE_RADIUS, p1.y + CIRCLE_RADIUS);
    let x2 = new Victor(p2.x + CIRCLE_RADIUS, p2.y + CIRCLE_RADIUS);
    const l = x2.subtract(x1);
    const theta = l.horizontalAngle();

    // Four corners of rectangle with extremes (0, -width/2) and (length, width/2)
    const yRange = [-width / 2, width / 2];
    const xRange = [0, l.magnitude()];
    const rect = xRange.map((x) => yRange.map((y) => new Victor(x, y))).flat();

    // Rotate the box to match the rotation of the line
    rect.forEach((corner) => corner.rotate(theta));

    // Translate the box to be on the line
    rect.forEach((corner) => corner.add(x1));

    const serializable = rect.map((corner) => {
      return { x: corner.x, y: corner.y };
    });

    dispatch(setCorners({ value: serializable }));
  }, [p1, p2, width]);

  useEffect(() => {
    updateCorners();
  }, [p1, p2, width]);

  const createCircle = (initial, setter) => {
    if (!initial) return;
    const circleStyle = { ...styles.circle, backgroundColor: colors.primary };

    const pan = useRef(new Animated.ValueXY()).current;

    pan.addListener(({ x, y }) => {
      setter({
        x: initial.x + x,
        y: initial.y + y,
      });
      updateStore();
    });

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
          top: initial.y,
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
          stroke="white"
          opacity={0.3}
          strokeWidth={width}
        />
        {!corners ||
          corners.map((vec, idx) => {
            return <Circle key={idx} cx={vec.x} cy={vec.y} r={5} fill="pink" />;
          })}
      </Svg>
    );
  }, [p1, p2, width, corners]);

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
  width: PropTypes.number.isRequired,
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
  sliderContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 60,
  },
  slider: {
    width: "90%",
  },
});

export default DraggablePointsContainer;
