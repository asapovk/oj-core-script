import { combineReducers } from 'redux';
import { serieSlice } from '../serie/serie.module';
import { authSlice } from '../auth/auth.module';
import { wordStampsSlice } from '../wordStamp/wordStamps.module';

const rootReducer = combineReducers({
  ...serieSlice.reducer,
  ...authSlice.reducer,
  ...wordStampsSlice.reducer,
});

export default rootReducer;
