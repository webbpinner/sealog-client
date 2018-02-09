import {
  FETCH_EVENT_TEMPLATES_FOR_MAIN,
  FETCH_EVENT_HISTORY,
  UPDATE_EVENT_HISTORY,
  HIDE_EVENT_HISTORY,
  SHOW_EVENT_HISTORY,
  SHOW_EVENT_HISTORY_FULLSCREEN
} from '../actions/types';

export default function(state={event_templates: [], history: [], showEventHistory: true, showEventHistoryFullscreen: false}, action) {
  switch(action.type){
    case FETCH_EVENT_TEMPLATES_FOR_MAIN:
      return {...state, event_templates: action.payload };
    case FETCH_EVENT_HISTORY:
      return { ...state, history: action.payload };
    case UPDATE_EVENT_HISTORY:
      return {...state, history:[...state.history, action.payload ] };
    case HIDE_EVENT_HISTORY:
      return {...state, showEventHistory: false, showEventHistoryFullscreen: false };
    case SHOW_EVENT_HISTORY:
      return {...state, showEventHistory: true, showEventHistoryFullscreen: false };
    case SHOW_EVENT_HISTORY_FULLSCREEN:
      return {...state, showEventHistory: true, showEventHistoryFullscreen: true };
  }
  return state;
}