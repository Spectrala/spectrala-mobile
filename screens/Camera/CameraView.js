import { Camera } from "expo-camera";
import React, { useState, useEffect } from "react";
import { GLView } from "expo-gl";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Canvas, { Image as CanvasImage } from "react-native-canvas";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLineCoords,
  updateAllLineCoords,
  selectCorners,
  setCorners,
} from "../../redux/reducers/video";

// GL work from here: https://github.com/expo/expo/blob/master/apps/native-component-list/src/screens/GL/GLCameraScreen.tsx
// Expo uses MIT license. https://github.com/expo/expo#license

// Pixel extraction from snack developed by expo team here: https://snack.expo.io/@bacon/raw-pixel-data
// Source on reddit (of all places): https://www.reddit.com/r/reactnative/comments/9lb540/get_the_color_of_a_pixel/e7jb39e?utm_source=share&utm_medium=web2x&context=3

const vertShaderSource = `#version 300 es
precision highp float;
in vec2 position;
out vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
}`;

const fragShaderSource = `#version 300 es
precision highp float;
uniform sampler2D cameraTexture;
in vec2 uv;
out vec4 fragColor;
void main() {
  fragColor = vec4(texture(cameraTexture, uv).rgb, 1.0);
}`;

function CameraView(props) {
  // Camera mode. Either front or rear camera.
  const type = Camera.Constants.Type.front;

  // Class variables for
  let _rafID, camera, glView, texture, canvas;

  const [imgUri, setImgUri] = useState(
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.diversivore.com%2Fwp-content%2Fuploads%2F2015%2F11%2FOrange-Bitter-Header-tester-1024x512.jpg&f=1&nofb=1"
  );

  const corners = useSelector(selectCorners);

  /**
   * Clean up the screen. Returning from useEffect is equivalent to
   * onComponentUnmount for a class component.
   */
  useEffect(() => {
    return () => {
      if (_rafID !== undefined) {
        cancelAnimationFrame(_rafID);
      }
    };
  }, []);

  // Function used in the expo demo
  const createCameraTexture = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    if (status !== "granted") {
      throw new Error("Denied camera permissions!");
    }

    if (glView && camera) {
      return glView.createCameraTextureAsync(camera);
    }
  };

  const onContextCreate = async (gl) => {
    /**
     * IF UNCOMMENTED, ATTEMPTS TO GRAB THE SCREEN AFTER 5 SECONDS.
     * note setTimeout is for debugging. This way, it can be seen if the setup works as expected
     * and exactly the issue takeFrame is causing.
     */
    texture = await createCameraTexture();
    const cameraTexture = texture;

    // Compile vertex and fragment shaders
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertShaderSource);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragShaderSource);
    gl.compileShader(fragShader);

    // Link, use program, save and enable attributes
    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    gl.useProgram(program);

    const positionAttrib = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttrib);

    // Create, bind, fill buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const verts = new Float32Array([-2, 0, 0, -2, 2, 2]);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    // Bind 'position' attribute
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

    // Set 'cameraTexture' uniform
    gl.uniform1i(gl.getUniformLocation(program, "cameraTexture"), 0);

    // Activate unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Render loop
    const loop = () => {
      this._rafID = requestAnimationFrame(loop);

      // Clear
      gl.clearColor(0, 0, 1, 1);
      // tslint:disable-next-line: no-bitwise
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Bind texture if created
      gl.bindTexture(gl.TEXTURE_2D, cameraTexture);

      // Draw!
      gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);

      // Submit frame
      gl.endFrameEXP();
    };
    loop();
    setInterval(() => {
      tick(gl);
    }, 2000);
  };

  const tick = async (gl) => {
    const screen = await takeFrame(gl);
    const cropped = await cropFrame(screen);
  };

  /**
   * Takes a snapshot of the camera view and saves it to a URI.
   *
   * Uses Expo's takeSnapshotAsync:
   * https://docs.expo.io/versions/latest/sdk/gl-view/#glviewtakesnapshotasyncgl-options
   *
   * @param {WebGLRenderingContext} context rendering context for gl
   * @return the URI with the image of the entire camera view.
   */
  const takeFrame = async (context) => {
    const snapshot = await GLView.takeSnapshotAsync(context, {
      format: "jpeg",
    });
    return snapshot.uri;
  };

  const cropFrame = async (uri) => {
    const xVals = corners.map((c) => c.x);
    const yVals = corners.map((c) => c.y);
    const minX = Math.min(...xVals);
    const maxX = Math.max(...xVals);
    const minY = Math.min(...yVals);
    const maxY = Math.max(...yVals);
    console.log("Corners in copyFrame");
    console.log(corners);

    const result = await ImageManipulator.manipulateAsync(uri, [
      {
        crop: {
          originX: minX,
          originY: minY,
          width: maxX - minX,
          height: maxY - minY,
        },
      },
    ]);

    setImgUri(result.uri);
  };

  const readAndSendImage = (imgSrc, width, height) => {
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    const image = new CanvasImage(canvas);
    image.src = imgSrc;
    image.addEventListener("load", () => {
      context.drawImage(image, 0, 0);
      context
        .getImageData(0, 0, canvas.height, canvas.width)
        .then((imageData) => {
          console.log(
            "Image data:",
            imageData,
            Object.values(imageData.data).length
          );
        })
        .catch((e) => {
          console.error("Error with fetching image data:", e);
        });
    });
  };

  return (
    <View style={styles.container}>
      <Canvas ref={(ref) => (canvas = ref)} />

      {/* Implementation of expo camera (expo-camera) */}
      <Camera
        style={StyleSheet.absoluteFill}
        type={type}
        ref={(ref) => (camera = ref)}
      />

      {/* View to grab (expo-gl) */}
      <GLView
        style={StyleSheet.absoluteFill}
        onContextCreate={onContextCreate}
        ref={(ref) => (glView = ref)}
      />

      <Image
        style={styles.image}
        source={{
          uri: imgUri,
        }}
        resizeMode="contain"
      />
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
  image: {
    paddingHorizontal: 10,
    height: 100,
    borderWidth: 2,
    borderColor: "black",
  },
});

export default CameraView;
