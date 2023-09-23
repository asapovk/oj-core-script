import { combineReducers } from 'redux';
import { serieSlice } from '../serie/serie.module';
import { authSlice } from '../auth/auth.module';

const rootReducer = combineReducers({
  ...serieSlice.reducer,
  ...authSlice.reducer
});

export default rootReducer;
