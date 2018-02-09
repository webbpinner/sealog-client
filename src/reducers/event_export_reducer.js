import {
  INIT_EVENT_EXPORT_TEMPLATE,
  UPDATE_EVENT_EXPORT_TEMPLATE,
  UPDATE_EVENT_EXPORT_TEMPLATE_SUCCESS,
  UPDATE_EVENT_EXPORT_TEMPLATE_ERROR,
  LEAVE_UPDATE_EVENT_EXPORT_TEMPLATE_FORM,
  CREATE_EVENT_EXPORT_TEMPLATE,
  CREATE_EVENT_EXPORT_TEMPLATE_SUCCESS,
  CREATE_EVENT_EXPORT_TEMPLATE_ERROR,
  LEAVE_CREATE_EVENT_EXPORT_TEMPLATE_FORM,
  FETCH_EVENT_EXPORT_TEMPLATES,

} from '../actions/types';

export default function(state={ event_export: {}, event_exports: [], event_export_message: "", event_export_error: "" }, action) {
  switch(action.type){

    case INIT_EVENT_EXPORT_TEMPLATE:
      let formatted_payload = action.payload;

      formatted_payload['event_export_template_eventvalue_filter'] = action.payload['event_export_template_eventvalue_filter'].join(',');
      formatted_payload['event_export_template_datasource_filter'] = action.payload['event_export_template_datasource_filter'].join(',');
      formatted_payload['event_export_template_author_filter'] = action.payload['event_export_template_author_filter'].join(',');
      
      //console.log(formatted_payload);
      return { ...state, event_export: formatted_payload };

    case UPDATE_EVENT_EXPORT_TEMPLATE:
      return { ...state, event_export: action.payload };

    case UPDATE_EVENT_EXPORT_TEMPLATE_SUCCESS:
      return { ...state, event_export_error: '', event_export_message: action.payload }

    case UPDATE_EVENT_EXPORT_TEMPLATE_ERROR:
      return { ...state, event_export_error: action.payload, event_export_message: '' }

    case LEAVE_UPDATE_EVENT_EXPORT_TEMPLATE_FORM:
      return { ...state, event_export: {}, event_export_error: '', event_export_message: '' };

    case CREATE_EVENT_EXPORT_TEMPLATE:
      return { ...state, event_export: action.payload };

    case CREATE_EVENT_EXPORT_TEMPLATE_SUCCESS:
      return { ...state, event_export_error: '', event_export_message: action.payload }

    case CREATE_EVENT_EXPORT_TEMPLATE_ERROR:
      return { ...state, event_export_error: action.payload, event_export_message: '' }

    case LEAVE_CREATE_EVENT_EXPORT_TEMPLATE_FORM:
      return { ...state, event_export: {}, event_export_error: '', event_export_message: '' }

    case FETCH_EVENT_EXPORT_TEMPLATES:
      return { ...state, event_exports: action.payload };

  }    
  return state;
}