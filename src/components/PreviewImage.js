import React, { useMemo } from "react";
import { StyleSheet, Image, View, Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { selectRowPct, setRowPct } from "../redux/reducers/ReaderBox";
import { selectPreviewImg } from "../redux/reducers/SpectrumFeed";

const INDICATOR_HEIGHT = 2;

export default function PreviewImage({ height = 100 }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const rowPct = useSelector(selectRowPct);
  const uri = useSelector(selectPreviewImg);

  const indicatorTop = useMemo(
    () => Math.floor(rowPct * height) - INDICATOR_HEIGHT / 2,
    [rowPct]
  );

  return (
    <Pressable
      onPressIn={(event) => {
        const verticalLocation = event.nativeEvent.locationY;
        const verticalPct = verticalLocation / height;
        dispatch(setRowPct({ value: verticalPct }));
      }}
      style={{ height }}
    >
      <Image
        style={{ ...styles.previewImage, height }}
        fadeDuration={0}
        source={{ uri }}
      />
      <View
        style={{
          ...styles.indicator,
          top: indicatorTop || 0,
          backgroundColor: colors.primary,
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  previewImage: {
    width: "100%",
    resizeMode: "stretch",
  },
  indicator: {
    height: INDICATOR_HEIGHT,
    width: "100%",
    position: "absolute",
  },
});
