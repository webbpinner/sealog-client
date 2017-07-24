import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import { reducer as modalReducer } from 'redux-modal';
import authReducer from './auth_reducer';
import chatReducer from './chat_reducer';
import userReducer from './user_reducer';
import eventReducer from './event_reducer';
import exportReducer from './export_reducer';
import definitionReducer from './definition_reducer';

const rootReducer = combineReducers({
  form: reduxFormReducer,
  routing: routerReducer,
  modal: modalReducer,
  auth: authReducer,
  chat: chatReducer,
  user: userReducer,
  event: eventReducer,
  export: exportReducer,
  definition: definitionReducer,
});

export default rootReducer;
