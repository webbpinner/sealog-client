import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  LEAVE_AUTH_LOGIN_FORM,
  REFRESH_AUTH_LOGIN_FORM
} from '../actions/types';

export default function(state={}, action) {
  switch(action.type){
    case AUTH_USER:
      return { ...state, error: '', message: '', authenticated: true};

    case UNAUTH_USER:
      return { ...state, authenticated: false};

    case AUTH_ERROR:
      return { ...state, error: action.payload, message: '' };

    case REFRESH_AUTH_LOGIN_FORM:
      return { ...state, message: '' }

    case LEAVE_AUTH_LOGIN_FORM:
      return { ...state, error: '', message: '' }

  }
  return state;
}