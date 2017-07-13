import {
  INIT_EXPORT_TEMPLATE,
  UPDATE_EXPORT_TEMPLATE,
  UPDATE_EXPORT_TEMPLATE_SUCCESS,
  UPDATE_EXPORT_TEMPLATE_ERROR,
  LEAVE_UPDATE_EXPORT_TEMPLATE_FORM,
  CREATE_EXPORT_TEMPLATE,
  CREATE_EXPORT_TEMPLATE_SUCCESS,
  CREATE_EXPORT_TEMPLATE_ERROR,
  LEAVE_CREATE_EXPORT_TEMPLATE_FORM,
  FETCH_EXPORT_TEMPLATES,

} from '../actions/types';

export default function(state={ export: {}, exports: [] }, action) {
  switch(action.type){

    case INIT_EXPORT_TEMPLATE:
      let formatted_payload = action.payload;

      formatted_payload['event_export_template_eventvalue_filter'] = action.payload['event_export_template_eventvalue_filter'].join(',');
      formatted_payload['event_export_template_datasource_filter'] = action.payload['event_export_template_datasource_filter'].join(',');
      formatted_payload['event_export_template_user_filter'] = action.payload['event_export_template_user_filter'].join(',');
      
      //console.log(formatted_payload);
      return { ...state, export: formatted_payload };

    case UPDATE_EXPORT_TEMPLATE:
      return { ...state, export: action.payload };

    case UPDATE_EXPORT_TEMPLATE_SUCCESS:
      return { ...state, export_error: '', export_message: action.payload }

    case UPDATE_EXPORT_TEMPLATE_ERROR:
      return { ...state, export_error: action.payload, export_message: '' }

    case LEAVE_UPDATE_EXPORT_TEMPLATE_FORM:
      return { ...state, export: {}, export_error: '', export_message: '' };

    case CREATE_EXPORT_TEMPLATE:
      return { ...state, export: action.payload };

    case CREATE_EXPORT_TEMPLATE_SUCCESS:
      return { ...state, export_error: '', export_message: action.payload }

    case CREATE_EXPORT_TEMPLATE_ERROR:
      return { ...state, export_error: action.payload, export_message: '' }

    case LEAVE_CREATE_EXPORT_TEMPLATE_FORM:
      return { ...state, export: {}, export_error: '', export_message: '' }

    case FETCH_EXPORT_TEMPLATES:
      return { ...state, exports: action.payload };

  }    
  return state;
}