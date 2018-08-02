import {
  FETCH_EVENT_TEMPLATES_FOR_MAIN,
  FETCH_EVENT_HISTORY,
  UPDATE_EVENT_HISTORY,
} from '../actions/types';

const historyLimit = 20

export default function(state={event_templates: [], history: []}, action) {
  switch(action.type){
    case FETCH_EVENT_TEMPLATES_FOR_MAIN:
      return {...state, event_templates: action.payload };
    case FETCH_EVENT_HISTORY:
      if(action.payload.length > historyLimit) {
        action.payload = action.payload.slice(action.payload.length-historyLimit)
      }
      return { ...state, history: action.payload };
    case UPDATE_EVENT_HISTORY:
      let completeHistory = [...state.history, action.payload ]
      let recentHistory = []
      if(completeHistory.length > historyLimit) {
        recentHistory = completeHistory.slice(completeHistory.length-historyLimit)
      } else {
        recentHistory = completeHistory
      }
      return {...state, history: recentHistory };
  }
  return state;
}