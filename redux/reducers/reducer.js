import { combineReducers } from 'redux';
import adjustmentsReducer from './adjustments';
import calibrationReducer from './calibration/calibration';
import videoReducer from './video';
import spectrumReducer from './spectrum';

const rootReducer = combineReducers({
    adjustments: adjustmentsReducer,
    calibration: calibrationReducer,
    video: videoReducer,
    spectra: spectrumReducer,
});

export default rootReducer;
