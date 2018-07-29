import {
  INIT_EVENT_EXPORT,
  UPDATE_EVENT_EXPORT,
  UPDATE_EVENT_EXPORT_FILTER_FORM,
  LEAVE_EVENT_EXPORT_FILTER_FORM,
  SET_SELECTED_EVENT,
  EVENT_EXPORT_FETCHING

} from '../actions/types';

export default function( state={ selected_event: {}, events: [], eventExportFilter: {}, fetching: false}, action) {
  switch(action.type){

    case INIT_EVENT_EXPORT:
      return { ...state, events: action.payload };

    case UPDATE_EVENT_EXPORT:
      // console.log("huh?", action.payload[0])
      // let updateeventExportMoment = (action.payload.length > 0)? action.payload[0] : {}
      let updateEvents = action.payload
      return { ...state, selected_event: {}, events: updateEvents };

    case UPDATE_EVENT_EXPORT_FILTER_FORM:
      // console.log("Update Filter")
      return { ...state, eventExportFilter: action.payload }

    case LEAVE_EVENT_EXPORT_FILTER_FORM:
      // console.log("Clear Filter")
      return { ...state, eventExportFilter: {} }

    case SET_SELECTED_EVENT:
      // console.log("Select event")
      return { ...state, selected_event: action.payload}

    case EVENT_EXPORT_FETCHING:
      // console.log("Set fetch flag to:", action.payload)
      return { ...state, fetching: action.payload }
  }
  
  return state;
}