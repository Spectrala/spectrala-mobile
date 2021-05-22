import { store, recreateStore } from './store';

// Recreate redux state using the passed state, as if initializing the store for the first time.
export const recreateUsingState = (state) => {
    // defer to store.js, which handles creation of the store itself
    recreateStore(state);
};

// returns a JSON string representing data that ought to be saved
// from the current state
export const serializedState = () => {
    const state = store.store.getState();
    console.log(`Serialized state: ${state}`);
    try {
        return JSON.stringify({
            video: {
                lineCoords: state.video.lineCoords,
                pixelLineHistory: [],
            },
            calibration: {
                calibrationPoints: state.calibration.calibrationPoints,
            },
        });
    } catch (err) {
        console.error(err);
        return null;
    }
};
