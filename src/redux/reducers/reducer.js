import { combineReducers } from "redux";
import calibrationReducer from "./calibration/Calibration";
import videoReducer from "./Video";
import spectrumReducer from "./Spectrum";

const rootReducer = combineReducers({
  calibration: calibrationReducer,
  video: videoReducer,
  spectra: spectrumReducer,
});

export default rootReducer;
