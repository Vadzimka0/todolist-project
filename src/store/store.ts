import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { authReducer, appReducer, todolistsReducer, tasksReducer } from './reducers';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  todolists: todolistsReducer,
  tasks: tasksReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export type AppRootStateType = ReturnType<typeof rootReducer>;

// @ts-ignore
window.store = store;
