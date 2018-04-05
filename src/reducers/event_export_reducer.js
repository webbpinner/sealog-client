import {
  INIT_EVENT_EXPORT,
  UPDATE_EVENT_EXPORT,
  UPDATE_EVENT_EXPORT_FILTER_FORM,
  LEAVE_EVENT_EXPORT_FILTER_FORM,
  EVENT_EXPORT_FETCHING,
  EVENT_EXPORT_SET_ACTIVE_PAGE,
  EVENT_EXPORT_SET_ACTIVE_EVENT,

} from '../actions/types';

export default function( state={ eventExportMoment: {}, events: [], eventExportFilter: {}, fetching: false, activePage: 1}, action) {
  switch(action.type){

    case INIT_EVENT_EXPORT:
      return { ...state, events: action.payload };

    case UPDATE_EVENT_EXPORT:
      // console.log("huh?", action.payload[0])
      // let updateeventExportMoment = (action.payload.length > 0)? action.payload[0] : {}
      let updateEvents = action.payload
      return { ...state, eventExportMoment: {}, events: updateEvents, activePage: 1 };

    case UPDATE_EVENT_EXPORT_FILTER_FORM:
      // console.log("Update Filter")
      return { ...state, eventExportFilter: action.payload }

    case LEAVE_EVENT_EXPORT_FILTER_FORM:
      // console.log("Clear Filter")
      return { ...state, eventExportFilter: {} }

    case EVENT_EXPORT_FETCHING:
      // console.log("Set fetch flag to:", action.payload)
      return { ...state, fetching: action.payload }

    case EVENT_EXPORT_SET_ACTIVE_PAGE:
      // console.log("Set active page to:", action.payload)
      return { ...state, activePage: action.payload }

    case EVENT_EXPORT_SET_ACTIVE_EVENT:
      return { ...state, eventExportMoment: action.payload }
  }    
  return state;
}