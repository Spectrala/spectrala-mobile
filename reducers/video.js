import { createSlice } from '@reduxjs/toolkit';
import { SourceEnum } from '../views/video/source_select';

// Samples included in the moving average
const PIXEL_LINE_HISTORY_DEPTH = 5;

// Look for absolute maximum, and don't do this in video. this should be raw input.
const OVERSATURATION_CEILING = 98;
const isNotOversaturated = (val) => val < OVERSATURATION_CEILING;

/**
 * videoSlice variables
 *
 * The variable we care about here the most is pixelLine, which is an array
 * of objects representing each pixel along the line defined by the user.
 * The pixel line is of the form [{r: 233.0, g: 30.2, b: 2.9, a: 1.0 }, ...]
 *
 * Selectors can choose how they export this data to something more useful for other classes.
 */
export const videoSlice = createSlice({
    name: 'video',
    initialState: {
        pixelLineHistory: [],
        isOversaturated: false,
        lineCoords: {
            lowX: 0.1,
            lowY: 0.5,
            highX: 0.9,
            highY: 0.5,
        },
        selectedSource: SourceEnum.WEBCAM,
        uploadedImage: undefined,
        selectedWebcam: undefined,
    },
    reducers: {
        updateFeed: (state, action) => {
            const newline = action.payload.value;
            let lineHist = state.pixelLineHistory;
            /**
             * This maintains a history of a certain length
             * of pixel values in order to create a moving average of intensities.
             * There's obvious uncertainty when looking at the static bounce around.
             * Smoothing this out is better for UX and scientific accuracy.
             */
            if (lineHist.length > 0) {
                if (lineHist[0].length === newline.length) {
                    if (lineHist.length >= PIXEL_LINE_HISTORY_DEPTH)
                        lineHist = lineHist.slice(
                            PIXEL_LINE_HISTORY_DEPTH - lineHist.length + 1
                        );
                    lineHist.push(newline);
                } else {
                    lineHist = [newline];
                }
            } else {
                lineHist = [newline];
            }
            state.pixelLineHistory = lineHist;

            /**
             * Detect oversaturation
             */
            state.isOversaturated = !newline.every(isNotOversaturated);
        },
        updateLineCoords: (state, action) => {
            state.lineCoords[action.payload.targetKey] = action.payload.value;
        },
        updateAllLineCoords: (state, action) => {
            state.lineCoords = action.payload.value;
        },
        setSelectedSource: (state, action) => {
            state.selectedSource = action.payload.value;
            state.selectedWebcam = action.payload.webcam;
        },
        setUploadedImage: (state, action) => {
            // Done because going to data upload makes image blank.
            state.uploadedImage = action.payload.image;

        }
    },
});

export const {
    updateFeed,
    updateLineCoords,
    updateAllLineCoords,
    setSelectedSource,
    setUploadedImage,
} = videoSlice.actions;


export const selectUploadedImage = (state) => state.video.uploadedImage;

export const selectIntensities = (state) => {
    const pixels = state.video.pixelLineHistory;
    if (pixels && pixels.length > 0) {
        const pixelLines = pixels.map((line) =>
            line.map((obj) => (obj.r + obj.g + obj.b) / 3 / 2.55)
        );
        var averagedLine = [];
        const len = pixelLines[0].length;

        for (var i = 0; i < len; i++) {
            let column = [];
            for (var j = 0; j < pixelLines.length; j++) {
                column.push(pixelLines[j][i]);
            }

            averagedLine.push(
                column.reduce((a, b) => a + b, 0) / pixelLines.length
            );
        }
        return averagedLine;
    }
    return null;
};

export const selectSource = (state) => state.video.selectedSource;

export const selectWebcam = (state) => state.video.selectedWebcam;

export const selectOversaturation = (state) => state.video.isOversaturated;

export const selectLineCoords = (state) => state.video.lineCoords;

export const selectChartData = (state) => {
    const intensities = selectIntensities(state);
    if (!intensities) {
        return null;
    }
    return [
        {
            id: 'spectrum',
            color: '#00873E',
            data: intensities.map((y, idx) => {
                return {
                    x: idx / (intensities.length - 1),
                    y: y,
                };
            }),
        },
    ];
};

export default videoSlice.reducer;
