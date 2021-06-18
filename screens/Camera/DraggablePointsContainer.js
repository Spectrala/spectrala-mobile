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
  updateReaderBoxData,
  selectCorners,
} from "../../redux/reducers/video";
const CIRCLE_RADIUS = 20;

function DraggablePointsContainer({ width }) {
  const { colors } = useTheme();
  const lineCoords = useSelector(
    selectLineCoords,
    (a, b) => false // TODO: fix hack
  );
  const corners = useSelector(selectCorners);
  const dispatch = useDispatch();

  const [viewDims, setViewDims] = useState(null);

  const [p1, setP1] = useState({
    x: lineCoords.lowX,
    y: lineCoords.lowY,
  });
  const [p2, setP2] = useState({
    x: lineCoords.highX,
    y: lineCoords.highY,
  });

  const updateStore = useCallback(() => {
    let x1 = new Victor(p1.x, p1.y);
    let x2 = new Victor(p2.x, p2.y);
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

    const derivedCorners = rect.map((corner) => {
      return { x: corner.x, y: corner.y };
    });

    dispatch(
      updateReaderBoxData({
        value: {
          lineCoords: {
            lowX: p1.x,
            lowY: p1.y,
            highX: p2.x,
            highY: p2.y,
          },
          corners: derivedCorners,
          width,
          length: l.magnitude(),
        },
      })
    );
  }, [p1, p2, width]);

  useEffect(() => {
    updateStore();
  }, [width]);

  const createCircle = useCallback(
    (point, setter) => {
      const circleStyle = { ...styles.circle, backgroundColor: colors.primary };

      const pan = useRef(new Animated.ValueXY()).current;
      const initial = useRef(point).current;

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
            let dx = pan.x._value;
            let dy = pan.y._value;
            pan.setOffset({ x: dx, y: dy });
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
            left: initial.x - CIRCLE_RADIUS,
            top: initial.y - CIRCLE_RADIUS,
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          }}
          {...panResponder.panHandlers}
        >
          <View style={circleStyle} />
        </Animated.View>
      );
    },
    [viewDims, p1, p2, width]
  );

  const readerLine = useCallback(() => {
    return (
      <Svg height="100%" width="100%">
        <Line
          x1={p1.x}
          y1={p1.y}
          x2={p2.x}
          y2={p2.y}
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
      <View
        style={styles.container}
        onLayout={(event) => setViewDims(event.nativeEvent.layout)}
      >
        {createCircle(p1, setP1)}
        {createCircle(p2, setP2)}
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
    bottom: 100,
    width: "100%",
    borderWidth: 4,
    borderColor: "black",
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
