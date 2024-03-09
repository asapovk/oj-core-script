import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { useSystem } from '@reflexio/reflexio-on-redux';
import rootReducer from './reducer';
import { serieSlice } from '../serie/serie.module';
import { authSlice } from '../auth/auth.module';
import { wordStampsSlice } from '../wordStamp/wordStamps.module';
import { clientsSlice } from '../client/client.slice';

function configureStore() {
  const middlewares: Middleware[] = [
    serieSlice.middleware,
    authSlice.middleware,
    wordStampsSlice.middleware,
    clientsSlice.middleware,
  ];
  const system = useSystem();
  system.setConfig({
    env: 'dev',
  });
  const store = createStore(
    rootReducer,
    compose(applyMiddleware(...middlewares))
  );

  return store;
}
const store = configureStore();

export default store;
