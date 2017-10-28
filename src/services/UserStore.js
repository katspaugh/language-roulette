import { createStore } from 'redux';

const getSavedState = () => {
  return JSON.parse(localStorage.getItem('user')) || {};
};

const saveState = () => {
  const state = store.getState();
  localStorage.setItem('user', JSON.stringify(state));
};

const userReducer = (state = {}, action) => {
  switch (action.type) {
      case 'login':
        return Object.assign({}, state, action.data);

      case 'logout':
        return {};

      case 'update':
        return Object.assign({}, state, action.data);
  }
  return state;
};

const store = createStore(
  userReducer,
  getSavedState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(saveState);

export default store;
