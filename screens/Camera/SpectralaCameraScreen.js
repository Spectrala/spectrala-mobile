import { Camera } from "expo-camera";
import React, { useState, useEffect } from "react";
import * as GL from "expo-gl";
import { GLView } from "expo-gl";
import * as Permissions from "expo-permissions";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PIXI } from "expo-pixi";

// From here: https://github.com/expo/expo/blob/master/apps/native-component-list/src/screens/GL/GLCameraScreen.tsx
// Expo uses MIT license. https://github.com/expo/expo#license

// See: https://github.com/expo/expo/pull/10229#discussion_r490961694
// eslint-disable-next-line @typescript-eslint/ban-types
export default function SpectralaCameraScreen() {
  const [zoom, setZoom] = useState(0);
  const [type, setType] = useState(Camera.Constants.Type.back);

  let _rafID, camera, glView, texture;

  const onUnmount = () => {
    if (_rafID !== undefined) {
      cancelAnimationFrame(_rafID);
    }
  };

  useEffect(() => {
    return onUnmount;
  }, []);

  const createCameraTexture = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status !== "granted") {
      throw new Error("Denied camera permissions!");
    }

    if (glView && camera) {
      return glView.createCameraTextureAsync(camera);
    }
  };

  const onContextCreate = async (glContext) => {
    // Create texture asynchronously
    texture = await createCameraTexture();
    takeFrame(glContext);
  };

  const takeFrame = async (context) => {
    // TODO: Crop region of interest
    // https://docs.expo.io/versions/latest/sdk/gl-view/#glviewtakesnapshotasyncgl-options

    console.log("take frame");
    const snapshot = await GLView.takeSnapshotAsync(context);
    console.log(snapshot);
    const pixels = await readPixelsAsync(context, snapshot.uri);
    // console.log(`Number of pixels: ${pixels.length}`);

    // const getPixel = (index) => {
    //   const pixel = index * 4;
    //   return pixels.slice(pixel, pixel + 4);
    // };

    // const [r, g, b, a] = getPixel(0);
    // console.log({ r, g, b, a });
  };

  const readPixelsAsync = async (context, uri) => {
    const app = new PIXI.Application({ context });

    try {
      const sprite = await PIXI.Sprite.fromExpoAsync(
        "http://i.imgur.com/uwrbErh.png"
      );
    } catch (err) {
      console.error(err);
    }
    // app.stage.addChild(sprite);

    // return app.renderer.extract.pixels(sprite);
  };

  const toggleFacing = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const zoomOut = () => {
    setZoom(zoom - 0.1 < 0 ? 0 : zoom - 0.1);
  };

  const zoomIn = () => {
    setZoom(zoom + 0.1 > 1 ? 1 : zoom + 0.1);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        type={type}
        zoom={zoom}
        ref={(ref) => (camera = ref)}
      />
      <GLView
        style={StyleSheet.absoluteFill}
        onContextCreate={onContextCreate}
        ref={(ref) => (glView = ref)}
      />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={toggleFacing}>
          <Text>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={zoomIn}>
          <Text>Zoom in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={zoomOut}>
          <Text>Zoom out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  buttons: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    height: 40,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
