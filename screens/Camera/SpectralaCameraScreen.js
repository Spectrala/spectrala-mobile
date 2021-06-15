import { Camera } from "expo-camera";
import React, { useState, useEffect } from "react";
import { GLView } from "expo-gl";
import * as Permissions from "expo-permissions";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PIXI } from "expo-pixi";

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
  fragColor = vec4(1.0 - texture(cameraTexture, uv).rgb, 1.0);
}`;

// See: https://github.com/expo/expo/pull/10229#discussion_r490961694
// eslint-disable-next-line @typescript-eslint/ban-types
export default function SpectralaCameraScreen() {

  // Zoom level for the camera filter 
  const [zoom, setZoom] = useState(0);

  // Camera mode. Either front or rear camera.
  const [type, setType] = useState(Camera.Constants.Type.back);

  // Class variables for 
  let _rafID, camera, glView, texture;


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
    // IF UNCOMMENTED, INVERTS COLORS:
    // Create texture asynchronously
    // texture = await createCameraTexture();
    // const cameraTexture = texture;

    // // Compile vertex and fragment shaders
    // const vertShader = gl.createShader(gl.VERTEX_SHADER);
    // gl.shaderSource(vertShader, vertShaderSource);
    // gl.compileShader(vertShader);

    // const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // gl.shaderSource(fragShader, fragShaderSource);
    // gl.compileShader(fragShader);

    // // Link, use program, save and enable attributes
    // const program = gl.createProgram();
    // gl.attachShader(program, vertShader);
    // gl.attachShader(program, fragShader);
    // gl.linkProgram(program);
    // gl.validateProgram(program);

    // gl.useProgram(program);

    // const positionAttrib = gl.getAttribLocation(program, "position");
    // gl.enableVertexAttribArray(positionAttrib);

    // // Create, bind, fill buffer
    // const buffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // const verts = new Float32Array([-2, 0, 0, -2, 2, 2]);
    // gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    // // Bind 'position' attribute
    // gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

    // // Set 'cameraTexture' uniform
    // gl.uniform1i(gl.getUniformLocation(program, "cameraTexture"), 0);

    // // Activate unit 0
    // gl.activeTexture(gl.TEXTURE0);

    // // Render loop
    // const loop = () => {
    //   _rafID = requestAnimationFrame(loop);

    //   // Clear
    //   gl.clearColor(0, 0, 1, 1);
    //   // tslint:disable-next-line: no-bitwise
    //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //   // Bind texture if created
    //   gl.bindTexture(gl.TEXTURE_2D, cameraTexture);

    //   // Draw!
    //   gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);

    //   // Submit frame
    //   gl.endFrameEXP();
    // };
    // loop();

    /**
     * IF UNCOMMENTED, ATTEMPTS TO GRAB THE SCREEN AFTER 5 SECONDS.
     * note setTimeout is for debugging. This way, it can be seen if the setup works as expected
     * and exactly the issue takeFrame is causing. 
     */
    setTimeout(() => {
      takeFrame(gl);
    }, 5000);
  };

  /**
   * Takes a snapshot of the camera view and logs the number of scanned pixels
   * @param {WebGLRenderingContext} context rendering context for gl
   */
  const takeFrame = async (context) => {
    // TODO: Crop region of interest.

    // Docs for takeSnapshotAsync:
    // https://docs.expo.io/versions/latest/sdk/gl-view/#glviewtakesnapshotasyncgl-options
    const snapshot = await GLView.takeSnapshotAsync(context);
    const pixels = await readPixelsAsync(context, snapshot);
    console.log(`Number of pixels: ${pixels.length}`);
    console.log(pixels);

    // For getting a particular pixel
    // const getPixel = (index) => {
    //   const pixel = index * 4;
    //   return pixels.slice(pixel, pixel + 4);
    // };

    // const [r, g, b, a] = getPixel(0);
    // console.log({ r, g, b, a });
  };

  /**
   * 
   * @param {WebGLRenderingContext} context 
   * @param {*} snapshot 
   * @returns 
   */
  const readPixelsAsync = async (context, snapshot) => {
    let pixels;
    try {
      // expo-pixi docs here: https://github.com/expo/expo-pixi 
      const app = new PIXI.Application({ context });

      /**
       * expo-pixi says it should work by simply passing in our
       * snapshot variable. 
       * 
       * The following attempt to call Image before expo-pixi does
       * prevents a crash, but only one pixel is returned. 
       */
      let myImage = new Image(snapshot.width, snapshot.height);
      myImage.src = snapshot.localUri;

      // If converting to image:
      const sprite = await PIXI.Sprite.fromExpoAsync(myImage);

      // If going by what the docs say:
      // const sprite = await PIXI.Sprite.fromExpoAsync(snapshot);

      // See end of docs (https://github.com/expo/expo-pixi). This line should be okay.
      // This is what makes me think things work like canvas.
      app.stage.addChild(sprite);

      // From the snack: https://snack.expo.io/@bacon/raw-pixel-data
      pixels = app.renderer.extract.pixels(sprite);
    } catch (err) {
      // The app will crash and not even log this error if using the "if going by what the docs say" line
      console.error(err);
    }
    return pixels;
  };

  /** button event handlers ~~~~~~~~~~~~~~~~v */
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
  /** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^ */

  return (
    <View style={styles.container}>

      {/* Implementation of expo camera (expo-camera) */}
      <Camera
        style={StyleSheet.absoluteFill}
        type={type}
        zoom={zoom}
        ref={(ref) => (camera = ref)}
      />

      {/* View to grab (expo-gl) */}
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
