import { combineReducers } from "redux";
import calibrationReducer from "./Calibration";
import readerBoxReducer from "./ReaderBox";
import spectrumReducer from "./RecordedSpectra";
import spectrumFeedReducer from "./SpectrumFeed";

const rootReducer = combineReducers({
  calibration: calibrationReducer,
  readerBox: readerBoxReducer,
  spectrumFeed: spectrumFeedReducer,
  spectra: spectrumReducer,
});

export default rootReducer;
