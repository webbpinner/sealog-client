import {
  FETCH_FILTERED_EVENTS,
  HIDE_EVENTS,
  SHOW_EVENTS,
  SHOW_EVENTS_FULLSCREEN
} from '../actions/types';

export default function(state={events: [], showEvents: true, showEventsFullscreen: false}, action) {
  switch(action.type){
    case FETCH_FILTERED_EVENTS:
      return { ...state, events: action.payload };
    case HIDE_EVENTS:
      return {...state, showEvents: false, showEventsFullscreen: false };
    case SHOW_EVENTS:
      return {...state, showEvents: true, showEventsFullscreen: false };
    case SHOW_EVENTS_FULLSCREEN:
      return {...state, showEvents: true, showEventsFullscreen: true };
  }
  return state;
}