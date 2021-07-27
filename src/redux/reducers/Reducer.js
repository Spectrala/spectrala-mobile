import { combineReducers } from "redux";
import calibrationReducer from "./Calibration";
import readerBoxReducer from "./ReaderBox";
import spectrumFeedReducer from "./SpectrumFeed";
import spectrumReducer from "./RecordedSpectra";

const rootReducer = combineReducers({
  calibration: calibrationReducer,
  readerBox: readerBoxReducer,
  spectrumFeed: spectrumFeedReducer,
  spectra: spectrumReducer,
});

export default rootReducer;
