import { combineReducers } from "redux";
import calibrationReducer from "./Calibration";
import readerBoxReducer from "./ReaderBox";
import spectrumFeedReducer from "./SpectrumFeed";
import spectrumReducer from "./RecordedSpectra";
import sessionsRedcer from "./Sessions";

const rootReducer = combineReducers({
  calibration: calibrationReducer,
  readerBox: readerBoxReducer,
  spectrumFeed: spectrumFeedReducer,
  spectra: spectrumReducer,
  sessions: sessionsRedcer,
});

export default rootReducer;
