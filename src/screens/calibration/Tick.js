import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { StyleSheet, PanResponder, Pressable, Animated } from "react-native";
import { useDispatch } from "react-redux";
import { Text, View } from "react-native-ui-lib";
import {
  setActivePointPlacement,
  setPlacement,
} from "../../redux/reducers/Calibration";
import { wavelengthToRGB } from "../../util/colorUtil";

const TICK_WIDTH = 40;
const VERTICAL_SLOP = 20;
const BOUNDS_PADDING = 0.055;

function Tick({
  targetIdx: targetIndex,
  calibrationPoints,
  yPosition,
  isBottom,
  onPress,
  viewDims,
  horizontalInset,
}) {
  const pan = useRef(new Animated.Value(0)).current;
  const [bounds, setBounds] = useState({ min: undefined, max: undefined });
  const dispatch = useDispatch();

  const placement = useMemo(
    () => calibrationPoints[targetIndex].x,
    [calibrationPoints, targetIndex]
  );

  const wavelength = useMemo(
    () => calibrationPoints[targetIndex].w,
    [calibrationPoints, targetIndex]
  );

  const shadowColor = useMemo(() => wavelengthToRGB(wavelength), [wavelength]);

  const [localX, setLocalX] = useState(placement);

  // Make sure the lines from the bottom ones don't cross the top ones
  const zPosition = isBottom ? 10 : 20;

  const screenXFrom = (placementX) => {
    if (!viewDims) return null;
    const deadHorizontalSpace = 2 * horizontalInset;
    const freeWidth = viewDims.width - deadHorizontalSpace;
    return placementX * freeWidth + horizontalInset;
  };

  const placementXFrom = useCallback(
    (screenX) => {
      if (!viewDims) return null;
      const deadHorizontalSpace = 2 * horizontalInset;
      const freeWidth = viewDims.width - deadHorizontalSpace;
      return screenX / freeWidth;
    },
    [viewDims, localX]
  );

  const getLeft = () => screenXFrom(localX);

  const getSlop = useCallback(() => {
    const screenMin = screenXFrom(bounds.min);
    const screenPos = getLeft();
    const screenMax = screenXFrom(bounds.max);
    if (screenMin && screenPos && screenMax) {
      return {
        left: (screenPos - screenMin) / 2,
        right: (screenMax - screenPos) / 2,
        top: isBottom ? 0 : VERTICAL_SLOP,
        bottom: isBottom ? VERTICAL_SLOP : 0,
      };
    }
  }, [bounds]);

  useEffect(() => {
    let _bounds = { min: undefined, max: undefined };
    if (targetIndex === 0) {
      _bounds.min = 0;
    } else {
      _bounds.min = calibrationPoints[targetIndex - 1].x + BOUNDS_PADDING;
    }
    if (targetIndex === calibrationPoints.length - 1) {
      _bounds.max = 1;
    } else {
      _bounds.max = calibrationPoints[targetIndex + 1].x - BOUNDS_PADDING;
    }
    setBounds(_bounds);
  }, [calibrationPoints, viewDims]);

  useEffect(() => {
    const panDx = pan._value;
    const screenX = screenXFrom(initial);
    if (screenX && panDx !== initial) {
      pan.setValue(screenX);
      pan.flattenOffset();
      setLocalX(initial);
    }
  }, [viewDims]);

  pan.removeAllListeners();
  pan.addListener(({ value }) => {
    const placement = placementXFromDx(value);
    placement && setLocalX(placement);
  });

  useEffect(() => {
    return () => pan.removeAllListeners();
  }, []);
  const initial = useRef(placement).current;

  const placementXFromDx = (dx) => {
    if (!viewDims) return null;
    const screenX = initial + dx;
    return placementXFrom(screenX);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          const dx = pan._value;
          pan.setOffset(dx);
          dispatch(setActivePointPlacement({ value: true }));
        },
        onPanResponderMove: (e, gesture) =>
          Animated.event([null, { dx: pan }], {
            useNativeDriver: false,
          })(e, gesture),
        onPanResponderRelease: (e, gesture) => {
          pan.flattenOffset();
          dispatch(setActivePointPlacement({ value: false }));

          let placement = placementXFromDx(pan._value);
          if (placement) {
            if (placement < bounds.min || placement > bounds.max) {
              placement = Math.max(Math.min(placement, bounds.max), bounds.min);
              const screenX = screenXFrom(placement);
              if (screenX) {
                pan.setValue(screenX);
                pan.flattenOffset();
              }
            }
            setLocalX(placement);
            dispatch(setPlacement({ placement, targetIndex }));
          }
        },
      }),
    [viewDims, bounds]
  );

  return (
    <>
      <Animated.View
        style={{
          ...styles.thumb,
          shadowColor: shadowColor,
          borderColor: shadowColor,
          left: getLeft() - TICK_WIDTH / 2,
          top: yPosition,
          zIndex: zPosition, // works on ios
          elevation: zPosition, // works on android
        }}
        {...panResponder.panHandlers}
      >
        <Pressable onPress={onPress} hitSlop={getSlop()}>
          <Text text70>{wavelength}</Text>
        </Pressable>
      </Animated.View>
      <View
        style={{
          ...styles.tickLine,
          height: yPosition,
          left: getLeft(),
        }}
      />
    </>
  );
}

Tick.propTypes = {
  targetIdx: PropTypes.number,
  calibrationPoints: PropTypes.array,
  yPosition: PropTypes.number,
  isBottom: PropTypes.bool,
  onPress: PropTypes.func,
  horizontalInset: PropTypes.number,
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
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.45,
    shadowRadius: 5,
    elevation: 3,
  },
  tickLine: {
    borderColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
    position: "absolute",
    top: 0,
    width: 0,
  },
});

export default Tick;
