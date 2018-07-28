import {
  INIT_LOWERING,
  UPDATE_LOWERING,
  CLEAR_LOWERING,
  UPDATE_LOWERING_SUCCESS,
  UPDATE_LOWERING_ERROR,
  LEAVE_UPDATE_LOWERING_FORM,
  CREATE_LOWERING_SUCCESS,
  CREATE_LOWERING_ERROR,
  LEAVE_CREATE_LOWERING_FORM,
  FETCH_LOWERINGS,

} from '../actions/types';

export default function(state={ lowering: {}, lowerings: [], lowering_message: '', lowering_error: '' }, action) {
  switch(action.type){

    case INIT_LOWERING:
      return { ...state, lowering: action.payload };

    case UPDATE_LOWERING:
      return { ...state, lowering: action.payload };

    case CLEAR_LOWERING:
      return { ...state, lowering: {} };

    case UPDATE_LOWERING_SUCCESS:
      return { ...state, lowering_error: '', lowering_message: action.payload }

    case UPDATE_LOWERING_ERROR:
      return { ...state, lowering_error: action.payload, lowering_message: '' }

    case LEAVE_UPDATE_LOWERING_FORM:
      return { ...state, lowering: {}, lowering_error: '', lowering_message: '' }

    case CREATE_LOWERING_SUCCESS:
      return { ...state, lowering_error: '', lowering_message: action.payload }

    case CREATE_LOWERING_ERROR:
      return { ...state, lowering_error: action.payload, lowering_message: '' }

    case LEAVE_CREATE_LOWERING_FORM:
      return { ...state, lowering_error: '', lowering_message: '' }

    case FETCH_LOWERINGS:
      return { ...state, lowerings: action.payload };

  }    
  return state;
}