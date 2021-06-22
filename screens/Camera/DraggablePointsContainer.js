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
    if (!viewDims) return;

    let x1 = new Victor(p1.x * viewDims.width, p1.y * viewDims.height);
    let x2 = new Victor(p2.x * viewDims.width, p2.y * viewDims.height);
    const l = x2.subtract(x1);
    const theta = l.horizontalAngleDeg();
    const length = l.magnitude();

    // Four corners of rectangle with extremes (0, -width/2) and (length, width/2)
    const yRange = [-width / 2, width / 2];
    const xRange = [0, l.magnitude()];
    const rect = xRange.map((x) => yRange.map((y) => new Victor(x, y))).flat();

    // Rotate the box to match the rotation of the line
    rect.forEach((corner) => corner.rotateDeg(theta));

    // Translate the box to be on the line
    rect.forEach((corner) => corner.add(x1));

    const derivedCorners = rect.map((corner) => {
      return { x: corner.x / viewDims.width, y: corner.y / viewDims.height };
    });

    // Follow same steps as here: https://github.com/leimao/Rotated-Rectangle-Crop-OpenCV
    // These constants for secondCropBox compute the bounds of the 
    // rectangle for the(Crop the "rotated rectangle") step
    const degreesToRadians = Math.PI / 180;
    const scaleFactor = 0.5 * Math.abs(Math.sin(2 * degreesToRadians * theta));
    const horizontalMargin = scaleFactor * length;
    const verticalMargin = scaleFactor * width;
    const boxWidth = width + 2 * horizontalMargin;
    const boxHeight = length + 2 * verticalMargin;

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
          angle: theta,
          secondCropBox: {
            originXPct: horizontalMargin / boxWidth,
            originYPct: verticalMargin / boxHeight,
            widthPct: width / boxWidth,
            heightPct: length / boxHeight,
          },
        },
      })
    );
  }, [p1, p2, width, viewDims]);

  useEffect(() => {
    updateStore();
  }, [width, viewDims, p1, p2]);

  const createCircle = useCallback(
    (point, setter) => {
      const circleStyle = { ...styles.circle, backgroundColor: colors.primary };

      const pan = useRef(new Animated.ValueXY()).current;
      const initial = useRef(point).current;

      pan.addListener(({ x, y }) => {
        !viewDims ||
          setter({
            x: initial.x + x / viewDims.width,
            y: initial.y + y / viewDims.height,
          });
      });

      const panResponder = useMemo(
        () =>
          PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
              let dx = pan.x._value;
              let dy = pan.y._value;
              pan.setOffset({ x: dx, y: dy });
            },
            onPanResponderMove: Animated.event(
              [null, { dx: pan.x, dy: pan.y }],
              {
                useNativeDriver: false,
              }
            ),
            onPanResponderRelease: () => {
              pan.flattenOffset();
            },
          }),
        [viewDims]
      );

      return (
        !viewDims || (
          <Animated.View
            style={{
              position: "absolute",
              left: initial.x * viewDims.width - CIRCLE_RADIUS,
              top: initial.y * viewDims.height - CIRCLE_RADIUS,
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
          >
            <View style={circleStyle} />
          </Animated.View>
        )
      );
    },
    [viewDims, p1, p2, width]
  );

  const readerLine = useCallback(() => {
    return (
      !viewDims || (
        <Svg height="100%" width="100%">
          <Line
            x1={p1.x * viewDims.width}
            y1={p1.y * viewDims.height}
            x2={p2.x * viewDims.width}
            y2={p2.y * viewDims.height}
            stroke="white"
            opacity={0.3}
            strokeWidth={width}
          />
          {!corners ||
            corners.map((vec, idx) => {
              return (
                <Circle
                  key={idx}
                  cx={vec.x * viewDims.width}
                  cy={vec.y * viewDims.height}
                  r={5}
                  fill="pink"
                />
              );
            })}
        </Svg>
      )
    );
  }, [p1, p2, width, corners, viewDims]);

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

/**
 * NOTE:
 *
 * The entire dimensions of the GLView (rendering the camrea) must be
 * covered by the
 *
 */
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
    bottom: 0,
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
