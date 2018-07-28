import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import { reducer as modalReducer } from 'redux-modal';
import authReducer from './auth_reducer';
import customVarReducer from './custom_var_reducer';
import eventExportReducer from './event_export_reducer';
import eventHistoryReducer from './event_history_reducer';
import eventTemplateReducer from './event_template_reducer';
import loweringReducer from './lowering_reducer';
import userReducer from './user_reducer';

const rootReducer = combineReducers({
  form: reduxFormReducer,
  routing: routerReducer,
  modal: modalReducer,
  auth: authReducer,
  custom_var: customVarReducer,
  event_export: eventExportReducer,
  event_history: eventHistoryReducer,
  event_template: eventTemplateReducer,
  lowering: loweringReducer,
  user: userReducer,
});

export default rootReducer;
