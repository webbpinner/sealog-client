import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { reducer as modalReducer } from 'redux-modal';
import authReducer from './auth_reducer';
import customVarReducer from './custom_var_reducer';
import eventReducer from './event_reducer';
import eventHistoryReducer from './event_history_reducer';
import eventTemplateReducer from './event_template_reducer';
import userReducer from './user_reducer';

const rootReducer = combineReducers({
  form: reduxFormReducer,
  modal: modalReducer,
  auth: authReducer,
  custom_var: customVarReducer,
  event: eventReducer,
  event_history: eventHistoryReducer,
  event_template: eventTemplateReducer,
  user: userReducer,
});

export default rootReducer;
