import {
  FETCH_FILTERED_EVENTS,
  HIDE_EVENTLIST,
  SHOW_EVENTLIST,
  SHOW_EVENTLIST_FULLSCREEN
} from '../actions/types';

export default function(state={list: [], showEventList: true, showEventListFullscreen: false}, action) {
  switch(action.type){
    case FETCH_FILTERED_EVENTS:
      return { ...state, list: action.payload };
    case HIDE_EVENTLIST:
      return {...state, showEventList: false, showEventListFullscreen: false };
    case SHOW_EVENTLIST:
      return {...state, showEventList: true, showEventListFullscreen: false };
    case SHOW_EVENTLIST_FULLSCREEN:
      return {...state, showEventList: true, showEventListFullscreen: true };
  }
  return state;
}