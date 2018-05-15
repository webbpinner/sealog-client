import {
  FETCH_EVENT_DEFINITIONS_FOR_CHAT,
  FETCH_EVENTS,
  UPDATE_CHAT,
  HIDE_CHAT,
  SHOW_CHAT,
  SHOW_CHAT_FULLSCREEN
} from '../actions/types';

export default function(state={event_definitions: [], history: [], showChat: true, showChatFullscreen: false}, action) {
  switch(action.type){
    case FETCH_EVENT_DEFINITIONS_FOR_CHAT:
      return {...state, event_definitions: action.payload };
    case FETCH_EVENTS:
      return { ...state, history: action.payload };
    case UPDATE_CHAT:
      return {...state, history:[...state.history, action.payload ] };
    case HIDE_CHAT:
      return {...state, showChat: false, showChatFullscreen: false };
    case SHOW_CHAT:
      return {...state, showChat: true, showChatFullscreen: false };
    case SHOW_CHAT_FULLSCREEN:
      return {...state, showChat: true, showChatFullscreen: true };
  }
  return state;
}