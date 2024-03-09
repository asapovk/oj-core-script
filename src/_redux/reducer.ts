import { combineReducers } from 'redux';
import { serieSlice } from '../serie/serie.module';
import { authSlice } from '../auth/auth.module';
import { wordStampsSlice } from '../wordStamp/wordStamps.module';
import { clientsSlice } from '../client/client.slice';

const rootReducer = combineReducers({
  ...serieSlice.reducer,
  ...authSlice.reducer,
  ...wordStampsSlice.reducer,
  ...clientsSlice.reducer,
});

export default rootReducer;
