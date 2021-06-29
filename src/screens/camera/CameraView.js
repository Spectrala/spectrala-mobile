// import { Camera } from "expo-camera";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { GLView } from "expo-gl";
// import * as FileSystem from "expo-file-system";
// import * as ImageManipulator from "expo-image-manipulator";
// import { StyleSheet, TouchableOpacity, Image } from "react-native";
// import { Text, View } from "react-native-ui-lib";
// import Canvas, { Image as CanvasImage } from "react-native-canvas";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   updateFeed,
//   selectCorners,
//   selectAngle,
//   selectWidth,
//   selectLength,
//   selectSecondCropBox,
// } from "../../redux/reducers/video";


// export const CAMERA_VISIBILITY_OPTIONS = {
//   full: "full",
//   none: "none",
// };

// // When true, the preview of the selected area is visible.
// const IN_DEBUG_MODE = false;

// const vertShaderSource = `#version 300 es
// precision highp float;
// in vec2 position;
// out vec2 uv;
// void main() {
//   uv = position;
//   gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
// }`;

// const fragShaderSource = `#version 300 es
// precision highp float;
// uniform sampler2D cameraTexture;
// in vec2 uv;
// out vec4 fragColor;
// void main() {
//   fragColor = vec4(texture(cameraTexture, uv).rgb, 1.0);
// }`;

// const FRAME_INTERVAL_MS = 5000;

// // png or jpeg. Jpeg is faster but creates (bad) innacuracies.
// const IMG_FORMAT = "png";

// function CameraView() {
//   // Camera mode. Either front or rear camera.
//   const type = Camera.Constants.Type.rear;

//   let _rafID, camera, glView, texture;

//   const [glContext, setGlContext] = useState(undefined);
//   const [canvas, setCanvas] = useState(undefined);

//   const [imgUri, setImgUri] = useState(null);

//   const corners = useSelector(selectCorners, () => false);
//   const boxAngle = useSelector(selectAngle);
//   const secondCropBox = useSelector(selectSecondCropBox);
//   const [hasPermission, setHasPermission] = useState(null);

//   useInterval(() => {
//     !glContext || tick(glContext);
//   }, FRAME_INTERVAL_MS);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, [hasPermission]);

//   /**
//    * Clean up the screen. Returning from useEffect is equivalent to
//    * onComponentUnmount for a class component.
//    */
//   useEffect(() => {
//     return () => {
//       if (_rafID !== undefined) {
//         cancelAnimationFrame(_rafID);
//       }
//       if (glContext) {
//         GLView.destroyContextAsync(glContext);
//       }
//       glView = null;
//       camera = null;
//       setGlContext(null);
//     };
//   }, []);

//   // Function used in the expo demo
//   const createCameraTexture = async () => {
//     if (glView && camera) {
//       return glView.createCameraTextureAsync(camera);
//     }
//   };

//   // GL work from here: https://github.com/expo/expo/blob/master/apps/native-component-list/src/screens/GL/GLCameraScreen.tsx
//   // Expo uses MIT license. https://github.com/expo/expo#license
//   const onContextCreate = async (gl) => {
//     setGlContext(gl);
//     texture = await createCameraTexture();
//     const cameraTexture = texture;

//     // Compile vertex and fragment shaders
//     const vertShader = gl.createShader(gl.VERTEX_SHADER);
//     gl.shaderSource(vertShader, vertShaderSource);
//     gl.compileShader(vertShader);

//     const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
//     gl.shaderSource(fragShader, fragShaderSource);
//     gl.compileShader(fragShader);

//     // Link, use program, save and enable attributes
//     const program = gl.createProgram();
//     gl.attachShader(program, vertShader);
//     gl.attachShader(program, fragShader);
//     gl.linkProgram(program);
//     gl.validateProgram(program);

//     gl.useProgram(program);

//     const positionAttrib = gl.getAttribLocation(program, "position");
//     gl.enableVertexAttribArray(positionAttrib);

//     // Create, bind, fill buffer
//     const buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     const verts = new Float32Array([-2, 0, 0, -2, 2, 2]);
//     gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

//     // Bind 'position' attribute
//     gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

//     // Set 'cameraTexture' uniform
//     gl.uniform1i(gl.getUniformLocation(program, "cameraTexture"), 0);

//     // Activate unit 0
//     gl.activeTexture(gl.TEXTURE0);

//     // Render loop
//     const loop = () => {
//       this._rafID = requestAnimationFrame(loop);

//       // Clear
//       gl.clearColor(0, 0, 1, 1);
//       // tslint:disable-next-line: no-bitwise
//       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//       // Bind texture if created
//       gl.bindTexture(gl.TEXTURE_2D, cameraTexture);

//       // Draw!
//       gl.drawArrays(gl.TRIANGLES, 0, verts.length / 2);

//       // Submit frame
//       gl.endFrameEXP();
//     };
//     loop();
//   };

//   const tick = async (gl) => {
//     const { uri, width, height } = await takeFrame(gl);
//     await cropFrame(uri, width, height);
//   };

//   /**
//    * Takes a snapshot of the camera view and saves it to a URI.
//    *
//    * Uses Expo's takeSnapshotAsync:
//    * https://docs.expo.io/versions/latest/sdk/gl-view/#glviewtakesnapshotasyncgl-options
//    *
//    * @param {WebGLRenderingContext} context rendering context for gl
//    * @return the URI with the image of the entire camera view.
//    */
//   const takeFrame = async (context) => {
//     const snapshot = await GLView.takeSnapshotAsync(context, {
//       format: "png",
//       compress: 0,
//     });
//     return snapshot;
//   };

//   const cropFrame = async (uri, width, height) => {
//     // TODO: Unsure why SCALE is necessary.
//     const xVals = corners.map((c) => width * c.x);
//     const yVals = corners.map((c) => height * c.y);
//     const minX = Math.min(...xVals);
//     const maxX = Math.max(...xVals);
//     const minY = Math.min(...yVals);
//     const maxY = Math.max(...yVals);

//     const result = await ImageManipulator.manipulateAsync(uri, [
//       {
//         crop: {
//           originX: minX,
//           originY: minY,
//           width: maxX - minX,
//           height: maxY - minY,
//         },
//       },
//       {
//         rotate: Math.ceil(90 - boxAngle),
//       },
//     ]);

//     FileSystem.deleteAsync(uri, { idempotent: true });

//     const final = await ImageManipulator.manipulateAsync(result.uri, [
//       {
//         crop: {
//           originX: Math.floor(secondCropBox.originXPct * result.width),
//           originY: Math.floor(secondCropBox.originYPct * result.height),
//           width: Math.ceil(secondCropBox.widthPct * result.width),
//           height: Math.ceil(secondCropBox.heightPct * result.height),
//         },
//       },
//       {
//         resize: {
//           height: 100,
//         },
//       },
//     ]);

//     FileSystem.deleteAsync(result.uri, { idempotent: true });

//     readImage(final.uri, final.width, final.height);
//   };

//   const updateDisplayImage = async (imgSrc) => {
//     const rotatedLengthwise = await ImageManipulator.manipulateAsync(imgSrc, [
//       { rotate: -90 },
//     ]);
//     FileSystem.deleteAsync(imgSrc, { idempotent: true });
//     setImgUri(rotatedLengthwise.uri);
//   };

//   const readImage = async (imgSrc, width, height) => {
//     updateDisplayImage(imgSrc);
//     canvas.width = width;
//     canvas.height = height;
//     const context = canvas.getContext("2d");
//     const image = new CanvasImage(canvas);

//     const options = { encoding: FileSystem.EncodingType.Base64 };
//     const base64 = await FileSystem.readAsStringAsync(imgSrc, options);
//     const src = "data:image/" + IMG_FORMAT + ";base64," + base64;
//     image.src = src;
//     image.addEventListener("load", () => {
//       context.drawImage(image, 0, 0);
//       context
//         .getImageData(0, 0, canvas.width, canvas.height)
//         .then((imageData) => {
//           return {
//             data: Object.values(imageData.data),
//             dataWidth: imageData.width,
//           };
//         })
//         .then(({ data, dataWidth }) => {
//           dispatch(
//             updateFeed({
//               imageData: data,
//               width: dataWidth,
//             })
//           );

//           FileSystem.deleteAsync(imgSrc, { idempotent: true });
//         })
//         .catch((e) => {
//           console.error("Error with fetching image data:", e);
//         });
//     });
//   };

//   return (
//     <View style={styles.container}>
//       {/* Implementation of expo camera (expo-camera) */}
//       <Camera
//         style={StyleSheet.absoluteFill}
//         type={type}
//         ref={(ref) => (camera = ref)}
//       />

//       {/* View to grab (expo-gl) */}
//       <GLView
//         style={StyleSheet.absoluteFill}
//         onContextCreate={onContextCreate}
//         ref={(ref) => (glView = ref)}
//       />

//       <Image
//         style={{ ...styles.image, opacity: IN_DEBUG_MODE ? 1.0 : 0 }}
//         source={{
//           uri: imgUri,
//         }}
//         resizeMode="contain"
//       />

//       <Canvas ref={setCanvas} style={styles.canvas} />
//     </View>
//   );
// }

// // Hooks don't work with setInterval. Use this instead.
// // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// function useInterval(callback, delay) {
//   const savedCallback = useRef();

//   // Remember the latest callback.
//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);

//   // Set up the interval.
//   useEffect(() => {
//     function t() {
//       savedCallback.current();
//     }
//     if (delay !== null) {
//       let id = setInterval(t, delay);
//       return () => clearInterval(id);
//     }
//   }, [delay]);
// }

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     aspectRatio: 3 / 4,
//     flexDirection: "column",
//   },
//   canvas: {
//     opacity: 0,
//   },
//   image: {
//     paddingHorizontal: 10,
//     borderWidth: 2,
//     borderColor: "black",
//     width: "100%",
//     height: 100,
//   },
// });

// export default CameraView;
