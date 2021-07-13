import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { StyleSheet, PanResponder, Pressable, Animated } from "react-native";
// import { Animated } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { Text, View } from "react-native-ui-lib";
import {
  setActivePointPlacement,
  setPlacement,
} from "../../redux/reducers/calibration/calibration";
import { wavelengthToRGB } from "../../util/colorUtil";

const TICK_WIDTH = 40;
const VERTICAL_SLOP = 20;

function Tick({
  targetIdx: targetIndex,
  calibrationPoints,
  yPosition,
  isBottom,
  onPress,
  viewDims,
  horizontalInset,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [bounds, setBounds] = useState({ min: undefined, max: undefined });
  const dispatch = useDispatch();

  const placement = useMemo(
    () => calibrationPoints[targetIndex].placement,
    [calibrationPoints, targetIndex]
  );

  const wavelength = useMemo(
    () => calibrationPoints[targetIndex].wavelength,
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
    return {
      left: (screenPos - screenMin) / 2,
      right: (screenMax - screenPos) / 2,
      top: isBottom ? 0 : VERTICAL_SLOP,
      bottom: isBottom ? VERTICAL_SLOP : 0,
    };
  }, [bounds]);

  useEffect(() => {
    let _bounds = { min: undefined, max: undefined };
    if (targetIndex === 0) {
      _bounds.min = 0;
    } else {
      _bounds.min = calibrationPoints[targetIndex - 1].placement;
    }
    if (targetIndex === calibrationPoints.length - 1) {
      _bounds.max = 1;
    } else {
      _bounds.max = calibrationPoints[targetIndex + 1].placement;
    }
    setBounds(_bounds);
  }, [calibrationPoints, viewDims]);

  useEffect(() => {
    const panDx = pan.x._value;
    const screenX = screenXFrom(initial);
    if (screenX && panDx !== initial) {
      pan.setValue({ x: screenX, y: 0 });
      setLocalX(initial);
    }
  }, [viewDims]);

  const initial = useRef(placement).current;

  const placementXFromDx = (dx) => {
    if (!viewDims) return null;
    const screenX = initial + dx;
    return placementXFrom(screenX);
  };

  pan.addListener(({ x }) => {
    const placement = placementXFromDx(x);
    placement && setLocalX(placement);
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          const dx = pan.x._value;
          pan.setOffset({ x: dx });
          dispatch(setActivePointPlacement({ value: true }));
        },
        onPanResponderMove: (e, gesture) =>
          Animated.event([null, { dx: pan.x }], {
            useNativeDriver: false,
          })(e, gesture),
        onPanResponderRelease: (e, gesture) => {
          pan.flattenOffset();
          dispatch(setActivePointPlacement({ value: false }));

          let placement = placementXFromDx(pan.x._value);
          if (placement) {
            if (placement < bounds.min || placement > bounds.max) {
              placement = Math.max(Math.min(placement, bounds.max), bounds.min);
              Animated.spring(pan, {
                toValue: screenXFrom(placement),
                // friction: 3,
              }).start();
            }
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
