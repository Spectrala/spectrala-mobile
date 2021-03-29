import { createSlice } from '@reduxjs/toolkit';
import { walkthroughSteps } from '../views/walkthrough/markdown';

export const widgets = {
    CAMERA: 'camera', // The live image view and the source select above it
    LINE: 'line', // The line that the spectrum is on
    POINTS: 'points', // The point that allow the movement of the line
    CALIB_PTS_CONFIG: 'calib-pts-config', // The "set points" menu without capability to place, but with capability to edit points
    CALIB_PTS_PLACE: 'calib-pts-place', // The "set points" menu stripped of everyhing except ability to place
    CALIB_CHART: 'calib-chart', // The chart to drag the points on
    SPECTRA: 'spectra-chart-tool', // The chart for viewing spectra with the x values on it and the helper menu for creating spectra
    DATA_EXPORT: 'data-export', // The currently non-existent widget for exporting data
};

/**
 * walkthroughConfig:
 *      Defines what is viewed in the bar on the right. Could be a card or a heading.
 *      The card is the one with the shadow, the heading is just the title without the shadow.
 *
 *      title: (string) the title of each card (or text of the heading)
 *      text: (string) the text to display in the body of an expanded card
 *      isHeading: (bool) if true, this is a heading and not a card
 *      actionIndex: (int) this is the order functioning cards go in.
 *                         Headings do not have this value.
 *      shows: (string[]) the widgets to render. See the constant 'widgets' for description
 */
export const walkthroughConfig = [
    { title: 'Set Camera', isHeading: true },

    {
        title: 'Set camera source',
        text: walkthroughSteps.CAMERA_SOURCE,
        actionIndex: 0,
        shows: [widgets.CAMERA],
    },

    {
        title: 'Optimize the spectrum',
        text: walkthroughSteps.GOOD_SPECTRUM,
        actionIndex: 1,
        shows: [widgets.CAMERA],
    },

    {
        title: 'Move reader line',
        text: walkthroughSteps.READER_LINE,
        actionIndex: 2,
        shows: [widgets.CAMERA, widgets.LINE, widgets.POINTS],
    },


    { title: 'Calibrate Spectrometer', isHeading: true },
    {
        title: 'Choose calibration type',
        text: walkthroughSteps.CALIBRATION_TYPE,
        actionIndex: 3,
        shows: [widgets.CAMERA, widgets.LINE, widgets.CALIB_PTS_CONFIG],
    },

    {
        title: 'Identify known peaks',
        text: walkthroughSteps.IDENTIFY_PEAKS,
        actionIndex: 4,
        shows: [
            widgets.CAMERA,
            widgets.LINE,
            widgets.CALIB_PTS_PLACE,
            widgets.CALIB_CHART,
        ],
    },

    { title: 'Record Spectra', isHeading: true },

    {
        title: 'Create a reference spectrum',
        text: walkthroughSteps.CREATE_REFERENCE,
        actionIndex: 5,
        shows: [widgets.CAMERA, widgets.LINE, widgets.SPECTRA],
    },

    {
        title: 'Record test spectra',
        text: walkthroughSteps.RECORD_TEST,
        actionIndex: 6,
        shows: [widgets.CAMERA, widgets.LINE, widgets.SPECTRA],
    },

    {
        title: 'Export data',
        text: walkthroughSteps.EXPORT,
        actionIndex: 7,
        shows: [widgets.DATA_EXPORT],
    },
];

export const lastActionIndex = () =>
    Math.max(...walkthroughConfig.map((c) => c.actionIndex).filter((x) => x));

export const isLastActionIndex = (index) => index === lastActionIndex();

export const walkthroughSlice = createSlice({
    name: 'walkthrough',
    initialState: {
        activeIndex: 0,
    },
    reducers: {
        gotoNextAction: (state) => {
            if (isLastActionIndex(state.activeIndex)) {
                console.error(
                    'Cannot go to next action, this is last in sequence'
                );
            } else {
                state.activeIndex += 1;
            }
        },
        rewindToAction: (state, action) => {
            const idx = action.payload.targetIndex;
            if (idx < 0 || idx > state.activeIndex) {
                console.error(
                    `Cannot jump to action ${idx}, currently on ${state.activeIndex}`
                );
            } else {
                state.activeIndex = idx;
            }
        },
    },
});

export const { gotoNextAction, rewindToAction } = walkthroughSlice.actions;

export const selectActiveIndex = (state) => state.walkthrough.activeIndex;


export const selectCanGotoNextAction = (state) =>
    !isLastActionIndex(selectActiveIndex(state));

export const selectCurrentWalkthroughItem = (state) => {
    const idx = selectActiveIndex(state);
    return walkthroughConfig.find((w) => w.actionIndex === idx);
};

export default walkthroughSlice.reducer;
