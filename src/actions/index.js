import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import fileDownload from 'react-file-download';
import queryString from 'querystring';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { show, destroy } from 'redux-modal';
import {change, untouch} from 'redux-form';

import { API_ROOT_URL} from '../url_config';

import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
  LEAVE_CREATE_USER_FORM,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LEAVE_REGISTER_USER_FORM,
  INIT_USER,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  LEAVE_UPDATE_USER_FORM,
  DELETE_USER,
  FETCH_USERS,
  FETCH_EVENT_TEMPLATES_FOR_MAIN,
  FETCH_EVENTS,
  SET_SELECTED_EVENT,
  CLEAR_SELECTED_EVENT,
  FETCH_FILTERED_EVENTS,
  CREATE_EVENT,
  LEAVE_AUTH_LOGIN_FORM,
  FETCH_EVENT_HISTORY,
  UPDATE_EVENT_HISTORY,
  INIT_PROFILE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  LEAVE_UPDATE_PROFILE_FORM,
  INIT_EVENT_EXPORT_TEMPLATE,
  UPDATE_EVENT_EXPORT_TEMPLATE,
  UPDATE_EVENT_EXPORT_TEMPLATE_SUCCESS,
  UPDATE_EVENT_EXPORT_TEMPLATE_ERROR,
  LEAVE_UPDATE_EVENT_EXPORT_TEMPLATE_FORM,
  CREATE_EVENT_EXPORT_TEMPLATE,
  CREATE_EVENT_EXPORT_TEMPLATE_SUCCESS,
  CREATE_EVENT_EXPORT_TEMPLATE_ERROR,
  LEAVE_CREATE_EVENT_EXPORT_TEMPLATE_FORM,
  FETCH_EVENT_EXPORT_TEMPLATES,
  INIT_EVENT_TEMPLATE,
  FETCH_EVENT_TEMPLATES,
  UPDATE_EVENT_TEMPLATE,
  UPDATE_EVENT_TEMPLATE_SUCCESS,
  UPDATE_EVENT_TEMPLATE_ERROR,
  LEAVE_UPDATE_EVENT_TEMPLATE_FORM,
  CREATE_EVENT_TEMPLATE,
  CREATE_EVENT_TEMPLATE_SUCCESS,
  CREATE_EVENT_TEMPLATE_ERROR,
  LEAVE_CREATE_EVENT_TEMPLATE_FORM,
  INIT_EVENT_EXPORT,
  EVENT_EXPORT_FETCHING,
  UPDATE_EVENT_EXPORT_FILTER_FORM,
  LEAVE_EVENT_EXPORT_FILTER_FORM,
  UPDATE_EVENT_EXPORT,
  EVENT_EXPORT_SET_ACTIVE_PAGE,
  EVENT_EXPORT_SET_ACTIVE_EVENT,
  FETCH_CUSTOM_VARS,
  UPDATE_CUSTOM_VAR,

} from './types';

const cookies = new Cookies();

export function validateJWT() {

  //console.log("Verify JWT")

  const token = cookies.get('token')

  if(!token) {
    return function (dispatch) {
      console.log("JWT is missing, logging out");
      dispatch({type: UNAUTH_USER});
    };
  }

  return function (dispatch) {
    axios.get(`${API_ROOT_URL}/api/v1/validate`,
    {
      headers: {
        authorization: token
      }
    })
    .then((response) => {
      dispatch({type: AUTH_USER});
    })
    .catch((error)=>{
      console.log("JWT is invalid, logging out");
      dispatch(logout());
    });
  }
}

export function resetFields(formName, fieldsObj) {
  return function (dispatch) {
    Object.keys(fieldsObj).forEach(fieldKey => {
      //reset the field's value
      dispatch(change(formName, fieldKey, fieldsObj[fieldKey]));

     //reset the field's error
      dispatch(untouch(formName, fieldKey));
    })
  }
}

export function updateProfileState() {

  const id = cookies.get('id')
  return function (dispatch) {
    axios.get(`${API_ROOT_URL}/api/v1/users/${id}`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    })
    .then((response) => {
      dispatch({ type: UPDATE_PROFILE, payload: response.data })
      //console.log("Updated profile data successfully");
    })
    .catch((error)=>{
        console.log(error);
    });
  }
}

export function initUser(id) {
  return function (dispatch) {
    axios.get(`${API_ROOT_URL}/api/v1/users/${id}`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    })
    .then((response) => {
      dispatch({ type: INIT_USER, payload: response.data })
      //console.log("Initialized user data successfully");
    })
    .catch((error)=>{
      console.log(error);
    });
  }
}

export function initEventExportTemplate(id) {
  return function (dispatch) {
    axios.get(`${API_ROOT_URL}/api/v1/event_export_templates/${id}`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    })
    .then((response) => {
      dispatch({ type: INIT_EVENT_EXPORT_TEMPLATE, payload: response.data })
      //console.log("Initialized export template data successfully");
    })
    .catch((error)=>{
      console.log(error);
    });
  }
}

export function initEventTemplate(id) {
  return function (dispatch) {
    axios.get(`${API_ROOT_URL}/api/v1/event_templates/${id}`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    })
    .then((response) => {

      response.data.event_options = response.data.event_options.map(event_option => {
        event_option.event_option_values = event_option.event_option_values.join(',');
        return event_option;
      })

      dispatch({ type: INIT_EVENT_TEMPLATE, payload: response.data })
      //console.log("Initialized event template data successfully");
    })
    .catch((error)=>{
      console.log(error);
    });
  }
}

export function login({username, password = ''}) {

  return function (dispatch) {
    axios.post(`${API_ROOT_URL}/api/v1/login`, {username, password})
    .then(response => {

      // If request is good save the JWT token to a cookie
      cookies.set('token', response.data.token, { path: '/' });
      cookies.set('id', response.data.id, { path: '/' });

      dispatch(updateProfileState());
      dispatch({ type: AUTH_USER })

      // Redirect to chat
      //this.context.router.history.push(`${ROOT_PATH}/`);
    })
    .catch((error)=>{

      console.log(error);


      // If request is unauthenticated
      dispatch(authError('Bad login info'));

    });
  }
}

export function createEvent(eventValue, eventFreeText = '', eventOptions = [], eventTS = '') {

  let payload = {
    event_value: eventValue,
    event_free_text: eventFreeText,
    event_options: eventOptions
  }

  // console.log("eventTS:", eventTS)
  if(eventTS.length > 0){
    payload.ts = eventTS
  }

  // console.log("payload:", payload)

  return function (dispatch) {
    axios.post(`${API_ROOT_URL}/api/v1/events`,
    payload,
    {
      headers: {
        authorization: cookies.get('token')
      }
    })
    .then((response) => {
      //console.log("New event successfully created");
    })
    .catch((error)=>{
      console.log(error);
    });
  }
}

export function registerUser({username, fullname, password = '', email}) {
  return function (dispatch) {
    axios.post(`${API_ROOT_URL}/api/v1/register`, {username, fullname, password, email})
    .then((response) => {

      //console.log("New user successfully created");
      dispatch(registerUserSuccess('User created'));
      //dispatch(leaveRegisterForm());

      // Redirect to login
      //dispatch(push(`${ROOT_PATH}/login`));
    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      dispatch(registerUserError(error.response.data.message));

    });
  }
}

export function createUser({username, fullname, password = '', email, roles, system_user = false}) {
  return function (dispatch) {
    axios.post(`${API_ROOT_URL}/api/v1/users`,
    {username, fullname, password, email, roles},
    {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'application/json'
      }
    })
    .then((response) => {

      //console.log("New user successfully created");
      dispatch(createUserSuccess('Account created'));
      dispatch(fetchUsers());
//      dispatch(hideAddNewUserForm());

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      // If request is unauthenticated
      console.log(error);
      dispatch(createUserError(error.response.data.message));

    });
  }
}

export function createEventExportTemplate(formProps) {

  let fields = {}

  if(formProps.event_export_template_name) {
    fields.event_export_template_name = formProps.event_export_template_name;
  }

  if(formProps.event_export_template_eventvalue_filter) {
    fields.event_export_template_eventvalue_filter = formProps.event_export_template_eventvalue_filter.split(',');
  } else {
    fields.event_export_template_eventvalue_filter = []
  }

  if(formProps.event_export_template_freetext_filter) {
    fields.event_export_template_freetext_filter = formProps.event_export_template_freetext_filter;
  } else {
    fields.event_export_template_freetext_filter = ""
  }

  if(formProps.event_export_template_user_filter) {
    fields.event_export_template_user_filter = formProps.event_export_template_user_filter.split(',');
  } else {
    fields.event_export_template_user_filter = []
  }

  if(formProps.event_export_template_startTS) {
    fields.event_export_template_startTS = formProps.event_export_template_startTS;
  } else {
    fields.event_export_template_startTS = ""
  }

  if(formProps.event_export_template_stopTS) {
    fields.event_export_template_stopTS = formProps.event_export_template_stopTS;
  } else {
    fields.event_export_template_stopTS = ""
  }

  if(formProps.event_export_template_limit) {
    fields.event_export_template_limit = formProps.event_export_template_limit;
  } else {
    fields.event_export_template_limit = 0
  }

  if(formProps.event_export_template_offset) {
    fields.event_export_template_offset = formProps.event_export_template_offset;
  } else {
    fields.event_export_template_offset = 0
  }

  if(formProps.event_export_template_include_aux_data) {
    fields.event_export_template_include_aux_data = formProps.event_export_template_include_aux_data;

    if(formProps.event_export_template_datasource_filter) {
      fields.event_export_template_datasource_filter = formProps.event_export_template_datasource_filter.split(',');
    } else {
      fields.event_export_template_datasource_filter = []
    }
  } else {
    fields.event_export_template_include_aux_data = false;
    fields.event_export_template_datasource_filter = []
  }

  return function (dispatch) {
    axios.post(`${API_ROOT_URL}/api/v1/event_export_templates`,
    fields,
    {
      headers: {
        authorization: cookies.get('token'),
        'content-type': 'application/json'
      }
    })
    .then((response) => {

      //console.log("New export template successfully created");
      dispatch(createEventExportTemplateSuccess('Event Export Template created'));
      dispatch(fetchEventExportTemplates());
//      dispatch(hideAddNewUserForm());

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      // If request is unauthenticated
      console.log(error);
      dispatch(createEventExportTemplateError(error.response.data.message));

    });
  }
}

export function createEventTemplate(formProps) {

  let fields = {};

  fields.event_name = formProps.event_name;
  fields.event_value = formProps.event_value;

  if(!formProps.event_free_text_required) {
    fields.event_free_text_required = false;
  } else {
    fields.event_free_text_required = formProps.event_free_text_required;
  }

  if(!formProps.event_options) {
    fields.event_options = [];
  } else {
    fields.event_options = formProps.event_options;
    fields.event_options = fields.event_options.map(event_option => {

      if(!event_option.event_option_allow_freeform) {
        event_option.event_option_allow_freeform = false;
      } else {
        event_option.event_option_allow_freeform = event_option.event_option_allow_freeform;
      }

      if(!event_option.event_option_required) {
        event_option.event_option_required = false;
      } else {
        event_option.event_option_required = event_option.event_option_required;
      }

      if(event_option.event_option_type == 'dropdown') {
        event_option.event_option_values = event_option.event_option_values.split(',');
        event_option.event_option_values = event_option.event_option_values.map(string => {
          return string.trim();
        })
      } else if (event_option.event_option_type == 'text') {
        event_option.event_option_values = [];
      }

      return event_option;
    })
  }

  return function (dispatch)

   {
    axios.post(`${API_ROOT_URL}/api/v1/event_templates`,
      fields,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchEventTemplates());
      dispatch(createEventTemplateSuccess('Event Template created'));

      // if you change yourself, you have to re-login
      //if(cookies.get('id') === formProps.id) {
      //  dispatch(logout());
      //}

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      dispatch(createEventTemplateError(error.response.data.message));

    });
  }
}

export function updateProfile(formProps) {

  let fields = {}

  if(formProps.username) {
    fields.username = formProps.username;
  }

  if(formProps.fullname) {
    fields.fullname = formProps.fullname;
  }

  if(formProps.email) {
    fields.email = formProps.email;
  }

  if(formProps.password) {
    fields.password = formProps.password;
  }

  return function (dispatch) {
    axios.patch(`${API_ROOT_URL}/api/v1/users/${formProps.id}`,
      fields,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(updateProfileState());
      dispatch(updateProfileSuccess('Account updated'));

    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      dispatch(updateProfileError(error.response.data.message));

    });
  }
}

export function updateUser(formProps) {

  let fields = {}

  if(formProps.username) {
    fields.username = formProps.username;
  }

  if(formProps.fullname) {
    fields.fullname = formProps.fullname;
  }

  if(formProps.email) {
    fields.email = formProps.email;
  }

  if(formProps.password) {
    fields.password = formProps.password;
  }

  if(formProps.roles) {
    fields.roles = formProps.roles;
  }

  if(formProps.system_user) {
    fields.system_user = formProps.system_user;
  } else {
    fields.system_user = false;
  }

  return function (dispatch) {
    axios.patch(`${API_ROOT_URL}/api/v1/users/${formProps.id}`,
      fields,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchUsers());
      dispatch(updateUserSuccess('Account updated'));

      // if you change yourself, you have to re-login
      //if(cookies.get('id') === formProps.id) {
      //  dispatch(logout());
      //}

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      dispatch(updateUserError(error.response.data.message));

    });
  }
}

export function updateEventExportTemplate(formProps) {

  let fields = {}
  //console.log(formProps);

  if(formProps.event_export_template_name) {
    fields.event_export_template_name = formProps.event_export_template_name;
  }

  if(formProps.event_export_template_eventvalue_filter) {
    //console.log(formProps.event_export_template_eventvalue_filter)
    fields.event_export_template_eventvalue_filter = formProps.event_export_template_eventvalue_filter.split(',');
  } else {
    fields.event_export_template_eventvalue_filter = []
  }

  if(formProps.event_export_template_freetext_filter) {
    fields.event_export_template_freetext_filter = formProps.event_export_template_freetext_filter;
  } else {
    fields.event_export_template_freetext_filter = ""
  }

  if(formProps.event_export_template_user_filter) {
    fields.event_export_template_user_filter = formProps.event_export_template_user_filter.split(',');
  } else {
    fields.event_export_template_user_filter = []
  }

  if(formProps.event_export_template_startTS) {
    fields.event_export_template_startTS = formProps.event_export_template_startTS;
  } else {
    fields.event_export_template_startTS = ""
  }

  if(formProps.event_export_template_stopTS) {
    fields.event_export_template_stopTS = formProps.event_export_template_stopTS;
  } else {
    fields.event_export_template_stopTS = ""
  }

  if(formProps.event_export_template_limit) {
    fields.event_export_template_limit = formProps.event_export_template_limit;
  } else {
    fields.event_export_template_limit = 0
  }

  if(formProps.event_export_template_offset) {
    fields.event_export_template_offset = formProps.event_export_template_offset;
  } else {
    fields.event_export_template_offset = 0
  }

  if(formProps.event_export_template_include_aux_data) {
    fields.event_export_template_include_aux_data = formProps.event_export_template_include_aux_data;

    if(formProps.event_export_template_datasource_filter) {
      fields.event_export_template_datasource_filter = formProps.event_export_template_datasource_filter.split(',');
    }
  } else {
    fields.event_export_template_include_aux_data = false;
    fields.event_export_template_datasource_filter = []
  }

  return function (dispatch)

   {
    axios.patch(`${API_ROOT_URL}/api/v1/event_export_templates/${formProps.id}`,
      fields,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchEventExportTemplates());
      dispatch(updateEventExportTemplateSuccess('Event Export Template updated'));

      // if you change yourself, you have to re-login
      //if(cookies.get('id') === formProps.id) {
      //  dispatch(logout());
      //}

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      dispatch(updateEventExportTemplateError(error.response.data.message));

    });
  }
}

export function updateEventTemplate(formProps) {

  let fields = {};

  fields.event_name = formProps.event_name;
  fields.event_value = formProps.event_value;

  if(!formProps.event_free_text_required) {
    fields.event_free_text_required = false;
  } else {
    fields.event_free_text_required = formProps.event_free_text_required;
  }

  if(!formProps.event_options) {
    fields.event_options = [];
  } else {
    fields.event_options = formProps.event_options;
    fields.event_options = fields.event_options.map(event_option => {

      if(!event_option.event_option_allow_freeform) {
        event_option.event_option_allow_freeform = false;
      } else {
        event_option.event_option_allow_freeform = event_option.event_option_allow_freeform;
      }

      if(!event_option.event_option_required) {
        event_option.event_option_required = false;
      } else {
        event_option.event_option_required = event_option.event_option_required;
      }

      if(event_option.event_option_type == 'dropdown') {
        event_option.event_option_values = event_option.event_option_values.split(',');
        event_option.event_option_values = event_option.event_option_values.map(string => {
          return string.trim();
        })
      } else if (event_option.event_option_type == 'text') {
        event_option.event_option_values = [];
      }

      return event_option;
    })
  }

  //console.log(fields);

  return function (dispatch)

   {
    axios.patch(`${API_ROOT_URL}/api/v1/event_templates/${formProps.id}`,
      fields,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchEventTemplates());
      dispatch(updateEventTemplateSuccess('Event template updated'));

      // if you change yourself, you have to re-login
      //if(cookies.get('id') === formProps.id) {
      //  dispatch(logout());
      //}

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      dispatch(updateEventTemplateError(error.response.data.message));

    });
  }
}

export function deleteUser(id) {

  return function (dispatch) {
    axios.delete(`${API_ROOT_URL}/api/v1/users/${id}`,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchUsers());
//      dispatch(updateUserEditSuccess('Account updated'));

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      //dispatch(updateUserEditError(error.response.data.message));

    });
  }
}

export function runEventExportTemplate(id) {

  return function (dispatch) {
    axios.get(`${API_ROOT_URL}/api/v1/event_export_templates/${id}/run`,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      //console.log(response);

      fileDownload(JSON.stringify(response.data, null, "\t"), 'export.json');

//      dispatch(fetchTemplates());
//      dispatch(updateUserEditSuccess('Account updated'));

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      //dispatch(updateUserEditError(error.response.data.message));

    });
  }
}

export function deleteEventExportTemplate(id) {

  return function (dispatch) {
    axios.delete(`${API_ROOT_URL}/api/v1/event_export_templates/${id}`,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchEventExportTemplates());
//      dispatch(updateUserEditSuccess('Account updated'));

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      //dispatch(updateUserEditError(error.response.data.message));

    });
  }
}

export function deleteEventTemplate(id) {

  return function (dispatch) {
    axios.delete(`${API_ROOT_URL}/api/v1/event_templates/${id}`,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      // console.log(response);
      dispatch(fetchEventTemplates());
//      dispatch(updateUserEditSuccess('Account updated'));

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      console.log(error);

      // If request is unauthenticated
      //dispatch(updateUserEditError(error.response.data.message));

    });
  }
}

export function logout() {
  return function(dispatch) {
    cookies.remove('token', { path: '/' });
    cookies.remove('id', { path: '/' });
    return dispatch({type: UNAUTH_USER });
  }
}

export function switch2Guest() {
  return function(dispatch) {
    dispatch(login( { username:"guest", password: "" } ) );
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function createUserSuccess(message) {
  return {
    type: CREATE_USER_SUCCESS,
    payload: message
  }
}

export function createUserError(message) {
  return {
    type: CREATE_USER_ERROR,
    payload: message
  }
}

export function createEventTemplateSuccess(message) {
  return {
    type: CREATE_EVENT_TEMPLATE_SUCCESS,
    payload: message
  }
}

export function createEventTemplateError(message) {
  return {
    type: CREATE_EVENT_TEMPLATE_ERROR,
    payload: message
  }
}

export function createEventExportTemplateSuccess(message) {
  return {
    type: CREATE_EVENT_EXPORT_TEMPLATE_SUCCESS,
    payload: message
  }
}

export function createEventExportTemplateError(message) {
  return {
    type: CREATE_EVENT_EXPORT_TEMPLATE_ERROR,
    payload: message
  }
}

export function registerUserSuccess(message) {
  return {
    type: REGISTER_USER_SUCCESS,
    payload: message
  }
}

export function registerUserError(message) {
  return {
    type: REGISTER_USER_ERROR,
    payload: message
  }
}

export function updateProfileSuccess(message) {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: message
  }
}

export function updateProfileError(message) {
  return {
    type: UPDATE_PROFILE_ERROR,
    payload: message
  }
}

export function updateUserSuccess(message) {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: message
  }
}

export function updateUserError(message) {
  return {
    type: UPDATE_USER_ERROR,
    payload: message
  }
}

export function fetchUsers() {

  const request = axios.get(API_ROOT_URL + '/api/v1/users', {
    headers: {
      authorization: cookies.get('token')
    }
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      dispatch({type: FETCH_USERS, payload: data})
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function fetchCustomVars() {

  const request = axios.get(API_ROOT_URL + '/api/v1/custom_vars', {
    headers: {
      authorization: cookies.get('token')
    }
  });

  return function (dispatch) {
    
    request.then(({data}) => {

      // console.log("custom_vars_data:", data)
      dispatch({type: FETCH_CUSTOM_VARS, payload: data})
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function updateCustomVars(id, value) {
  
  return function(dispatch) {
    axios.patch(`${API_ROOT_URL}/api/v1/custom_vars/${id}`,
      value,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchCustomVars());
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function updateEventExportTemplateSuccess(message) {
  return {
    type: UPDATE_EVENT_EXPORT_TEMPLATE_SUCCESS,
    payload: message
  }
}

export function updateEventExportTemplateError(message) {
  return {
    type: UPDATE_EVENT_EXPORT_TEMPLATE_ERROR,
    payload: message
  }
}

export function fetchEventExportTemplates() {

  const request = axios.get(API_ROOT_URL + '/api/v1/event_export_templates', {
    headers: {
      authorization: cookies.get('token')
    }
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      dispatch({type: FETCH_EVENT_EXPORT_TEMPLATES, payload: data});
    })
    .catch((error) => {
      if(error.response.status !== 404) {
        console.log(error);
      } else {
        dispatch({type: FETCH_EVENT_EXPORT_TEMPLATES, payload: []});
      }
    });
  }
}

export function updateEventTemplateSuccess(message) {
  return {
    type: UPDATE_EVENT_TEMPLATE_SUCCESS,
    payload: message
  }
}

export function updateEventTemplateError(message) {
  return {
    type: UPDATE_EVENT_TEMPLATE_ERROR,
    payload: message
  }
}


export function fetchEventTemplatesForMain() {

  const request = axios.get(API_ROOT_URL + '/api/v1/event_templates', {
    headers: {
      authorization: cookies.get('token')
    }
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      //console.log(data);
      dispatch({type: FETCH_EVENT_TEMPLATES_FOR_MAIN, payload: data})
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function updateEventComment(id, comment){
  // const request = axios.patch(API_ROOT_URL + '/api/v1/events/' + id, {
  //   headers: {
  //     authorization: cookies.get('token')
  //   }
  // });

  // return function (dispatch) {
    
  //   request.then(({data}) => {
  //     //console.log(data);
  //     dispatch({type: FETCH_EVENT_TEMPLATES_FOR_MAIN, payload: data})
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }

  console.log("Update event:", id, "Comment:", comment);
}

export function fetchFilteredEvents(filterParams={}) {

  let params = queryString.stringify(filterParams);
  //console.log(params);

  const request = axios.get(API_ROOT_URL + '/api/v1/events' + '?' + params, {
    headers: {
      authorization: cookies.get('token')
    },
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      dispatch({type: FETCH_FILTERED_EVENTS, payload: data})
    })
    .catch((error) => {
      if(error.response.status !== 404) {
        console.log(error);
      } else {
        dispatch({type: FETCH_FILTERED_EVENTS, payload: []});
      }
    });
  }
}

export function fetchEvents() {

  const request = axios.get(API_ROOT_URL + '/api/v1/events', {
    headers: {
      authorization: cookies.get('token')
    },
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      dispatch({type: FETCH_EVENTS, payload: data})
    })
    .catch((error) => {
      if(error.response.status !== 404) {
        console.log(error);
      } else {
        dispatch({type: FETCH_EVENTS, payload: []});
      }
    });
  }
}

export function fetchSelectedEvent(id) {
  
  return function(dispatch) {

    axios.get(`${API_ROOT_URL}/api/v1/events/${id}`,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {
      // console.log("response:", response.data)
      dispatch({type: SET_SELECTED_EVENT, payload: response.data})
    })
    .catch((error) => {
      console.log(error);
      dispatch({type: SET_SELECTED_EVENT, payload: {}})
    });
  }
}

export function clearSelectedEvent() {
  return function(dispatch) {
    dispatch({type: CLEAR_SELECTED_EVENT, payload: null})
  }
}


export function fetchEventHistory(asnap = false) {

  let url = API_ROOT_URL + '/api/v1/events'
  if(!asnap) {
    url = url + '?value=!ASNAP'
  }

  const request = axios.get(url, {
    headers: {
      authorization: cookies.get('token')
    },
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      dispatch({type: FETCH_EVENT_HISTORY, payload: data})
    })
    .catch((error) => {
      if(error.response.status !== 404) {
        console.log(error);
      } else {
        dispatch({type: FETCH_EVENT_HISTORY, payload: []});
      }
    });
  }
}


export function fetchEventTemplates() {

  const request = axios.get(API_ROOT_URL + '/api/v1/event_templates', {
    headers: {
      authorization: cookies.get('token')
    }
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      dispatch({type: FETCH_EVENT_TEMPLATES, payload: data})
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function initEventExport() {
  return function (dispatch) {
    dispatch({ type: EVENT_EXPORT_FETCHING, payload: true})
    axios.get(`${API_ROOT_URL}/api/v1/events`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    }).then((response) => {
      // console.log("Init export:", response.data)
      dispatch({ type: INIT_EVENT_EXPORT, payload: response.data })
      dispatch({ type: EVENT_EXPORT_FETCHING, payload: false})

      //console.log("Initialized event template data successfully");
    }).catch((error)=>{
      dispatch({ type: EVENT_EXPORT_FETCHING, payload: false})
      console.log(error);
    })
  }
}

export function updateEventExportFilterForm(formProps) {

  return function (dispatch) {

    dispatch({type: UPDATE_EVENT_EXPORT_FILTER_FORM, payload: formProps})
    dispatch(eventExportUpdate())
  }
}

export function updateEventHistory(update) {
  //console.log(update);

  return function (dispatch) {
    dispatch({type: UPDATE_EVENT_HISTORY, payload: update})
  }
}

export function leaveLoginForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_AUTH_LOGIN_FORM, payload: null})
  }
}

export function leaveUpdateProfileForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_UPDATE_PROFILE_FORM, payload: null})
  }
}

export function leaveUpdateUserForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_UPDATE_USER_FORM, payload: null})
  }
}

export function leaveCreateUserForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_CREATE_USER_FORM, payload: null})
  }
}

export function leaveRegisterForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_REGISTER_USER_FORM, payload: null})
  }
}

export function leaveUpdateEventExportTemplateForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_UPDATE_EVENT_EXPORT_TEMPLATE_FORM, payload: null})
  }
}

export function leaveCreateEventExportTemplateForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_CREATE_EVENT_EXPORT_TEMPLATE_FORM, payload: null})
  }
}

export function leaveUpdateEventTemplateForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_UPDATE_EVENT_TEMPLATE_FORM, payload: null})
  }
}

export function leaveCreateEventTemplateForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_CREATE_EVENT_TEMPLATE_FORM, payload: null})
  }
}

export function leaveEventExportFilterForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_EVENT_EXPORT_FILTER_FORM, payload: null})
  }
}

export function showModal(modal, props) {
  return function(dispatch) {
    dispatch(show(modal, props));
  }
}

export function eventExportUpdate() {
  // console.log("event export update")
  return function (dispatch, getState) {
    let startTS = (getState().event_export.eventExportFilter.startTS)? `startTS=${getState().event_export.eventExportFilter.startTS}` : ''
    let stopTS = (getState().event_export.eventExportFilter.stopTS)? `&stopTS=${getState().event_export.eventExportFilter.stopTS}` : ''
    let value = (getState().event_export.eventExportFilter.value)? `&value=${getState().event_export.eventExportFilter.value.split(',').join("&value=")}` : ''
    let author = (getState().event_export.eventExportFilter.author)? `&author=${getState().event_export.eventExportFilter.author.split(',').join("&author=")}` : ''
    let freetext = (getState().event_export.eventExportFilter.freetext)? `&freetext=${getState().event_export.eventExportFilter.freetext}` : ''
    let datasource = (getState().event_export.eventExportFilter.datasource)? `&datasource=${getState().event_export.eventExportFilter.datasource}` : ''

    dispatch({ type: EVENT_EXPORT_FETCHING, payload: true})
    axios.get(`${API_ROOT_URL}/api/v1/events?${startTS}${stopTS}${value}${author}${freetext}${datasource}`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    }).then((response) => {
      // console.log("search results:", response.data)
      dispatch({ type: UPDATE_EVENT_EXPORT, payload: response.data })
      dispatch({ type: EVENT_EXPORT_FETCHING, payload: false})
    }).catch((error)=>{
      console.log(error);
      if(error.response.data.statusCode == 404){
        dispatch({type: UPDATE_EVENT_EXPORT, payload: []})
      } else {
        console.log(error.response);
      }
      dispatch({ type: EVENT_EXPORT_FETCHING, payload: false})
    });
  }
}

export function eventExportSetActivePage(page) {
  return function(dispatch) {
    dispatch({type: EVENT_EXPORT_SET_ACTIVE_PAGE, payload: page})
  }
}

export function eventExportSetActiveEvent(id) {
  return function(dispatch) {
    // console.log("set active event to:", id)
    axios.get(`${API_ROOT_URL}/api/v1/event_exports/${id}`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    }).then((response) => {
      dispatch({ type: EVENT_EXPORT_SET_ACTIVE_EVENT, payload: response.data})
    }).catch((error)=>{
      console.log(error.response);
      if(error.response.data.statusCode == 404){
        dispatch({type: EVENT_EXPORT_SET_ACTIVE_EVENT, payload: {} })
      } else {
        console.log(error.response);
      }
    });
  }
}

export function deleteAllEvents() {
  return function(dispatch) {
    // console.log("set active event to:", id)
    axios.delete(`${API_ROOT_URL}/api/v1/events/all`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    }).then((response) => {
      dispatch(fetchEventHistory())
    }).catch((error)=>{
      console.log(error.response);
    });
  }
}