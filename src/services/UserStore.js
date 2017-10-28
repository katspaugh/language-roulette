import { createStore } from 'redux';

const getSavedState = () => {
  return JSON.parse(localStorage.getItem('user')) || {};
};

const saveState = () => {
  localStorage.setItem('user', JSON.stringify(store.getState()));
};

const userReducer = (state = {}, action) => {
  let newState = Object.assign({}, state);

  switch (action.type) {
      case 'loginNeeded':
        newState.loginNeeded = !state.userId;
        break;

      case 'login':
        Object.assign(newState, action.data);
        break;

      case 'logout':
        newState = {};
        break;

      case 'expire':
        Object.assign(newState, { userId: null, userAccessToken: null, expiresAt: null });
        break;

      case 'update':
        Object.assign(newState, action.data);
        break;
  }

  if (newState.points == null) {
    newState.points = 50;
  }

  if (newState.userId) {
    newState.loginNeeded = false;
  }

  return newState;
};

const store = createStore(
  userReducer,
  getSavedState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(saveState);

export default store;
