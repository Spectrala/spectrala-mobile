import { combineReducers } from 'redux';
import adjustmentsReducer from './adjustments';
import calibrationReducer from './calibration/calibration';
import videoReducer from './video';
import spectrumReducer from './spectrum';
import walkthroughReducer from './walkthrough';

const rootReducer = combineReducers({
    adjustments: adjustmentsReducer,
    calibration: calibrationReducer,
    video: videoReducer,
    spectra: spectrumReducer,
    walkthrough: walkthroughReducer,
});

export default rootReducer;
