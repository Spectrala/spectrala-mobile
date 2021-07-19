import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { StyleSheet, Animated, PanResponder } from "react-native";
import { Svg, Line } from "react-native-svg";
import Victor from "victor";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLineCoords,
  updateReaderBoxData,
  selectCorners,
} from "../../redux/reducers/ReaderBox";
import { Colors, View } from "react-native-ui-lib";
import { fullDims } from "../../components/CameraLoader";

const CIRCLE_RADIUS = 20;

function DraggablePointsContainer({ width }) {
  const lineCoords = useSelector(selectLineCoords);
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
        },
      })
    );
  }, [p1, p2, width, viewDims]);

  useEffect(() => {
    updateStore();
  }, [width, viewDims, p1, p2]);

  const createCircle = useCallback(
    (point, setter) => {
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
            <View
              style={{ ...styles.circle, backgroundColor: Colors.primary }}
            />
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
            opacity={0.05}
            strokeWidth={width}
            strokeLinecap="round"
          />
          <Line
            x1={p1.x * viewDims.width}
            y1={p1.y * viewDims.height}
            x2={p2.x * viewDims.width}
            y2={p2.y * viewDims.height}
            stroke="white"
            opacity={0.3}
            strokeWidth={width}
          />
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
 * The entire dimensions of the GLView (rendering the camera) must be
 * covered by the points container.
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
    width: "100%",
    aspectRatio: fullDims.width / fullDims.height,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.32,
    elevation: 16,
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
