import {
  INIT_EVENT,
  UPDATE_EVENT,
  UPDATE_EVENT_FILTER_FORM,
  LEAVE_EVENT_FILTER_FORM,
  SET_SELECTED_EVENT,
  EVENT_FETCHING

} from '../actions/types';

export default function( state={ selected_event: {}, events: [], eventFilter: {}, fetching: false}, action) {
  switch(action.type){

    case INIT_EVENT:
      return { ...state, events: action.payload, selected_event: action.payload[0] };

    case UPDATE_EVENT:
      // console.log("Update event")
      let updateEvents = action.payload
      return { ...state, selected_event: {}, events: updateEvents };

    case UPDATE_EVENT_FILTER_FORM:
      // console.log("Update Filter")
      return { ...state, eventFilter: action.payload }

    case LEAVE_EVENT_FILTER_FORM:
      // console.log("Clear Filter")
      return { ...state, eventFilter: {} }

    case SET_SELECTED_EVENT:
      // console.log("Select event")
      return { ...state, selected_event: action.payload}

    case EVENT_FETCHING:
      // console.log("Set fetch flag to:", action.payload)
      return { ...state, fetching: action.payload }
  }
  
  return state;
}