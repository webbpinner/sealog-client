import {
  INIT_DEFINITION,
  UPDATE_DEFINITION,
  UPDATE_DEFINITION_SUCCESS,
  UPDATE_DEFINITION_ERROR,
  LEAVE_UPDATE_DEFINITION_FORM,
  CREATE_DEFINITION,
  CREATE_DEFINITION_SUCCESS,
  CREATE_DEFINITION_ERROR,
  LEAVE_CREATE_DEFINITION_FORM,
  FETCH_DEFINITIONS,

} from '../actions/types';

export default function(state={ definition: {}, definitions: [] }, action) {
  switch(action.type){

    case INIT_DEFINITION:
      let formatted_payload = action.payload;

      //formatted_payload['event_definition_eventvalue_filter'] = action.payload['event_definition_eventvalue_filter'].join(',');
      //formatted_payload['event_definition_datasource_filter'] = action.payload['event_definition_datasource_filter'].join(',');
      //formatted_payload['event_definition_user_filter'] = action.payload['event_definition_user_filter'].join(',');
      
      //console.log(formatted_payload);
      return { ...state, definition: formatted_payload };

    case UPDATE_DEFINITION:
      return { ...state, definition: action.payload };

    case UPDATE_DEFINITION_SUCCESS:
      return { ...state, definition_error: '', definition_message: action.payload }

    case UPDATE_DEFINITION_ERROR:
      return { ...state, definition_error: action.payload, definition_message: '' }

    case LEAVE_UPDATE_DEFINITION_FORM:
      return { ...state, definition: {}, definition_error: '', definition_message: '' };

    case CREATE_DEFINITION:
      return { ...state, definition: action.payload };

    case CREATE_DEFINITION_SUCCESS:
      return { ...state, definition_error: '', definition_message: action.payload }

    case CREATE_DEFINITION_ERROR:
      return { ...state, definition_error: action.payload, definition_message: '' }

    case LEAVE_CREATE_DEFINITION_FORM:
      return { ...state, definition: {}, definition_error: '', definition_message: '' }

    case FETCH_DEFINITIONS:
      return { ...state, definitions: action.payload };

  }    
  return state;
}