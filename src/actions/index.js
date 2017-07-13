import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import fileDownload from 'react-file-download';
import queryString from 'querystring';
import { push } from 'react-router-redux';

import { ROOT_PATH, API_ROOT_URL} from '../url_config';

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
  FETCH_EVENT_DEFINITIONS_FOR_CHAT,
  FETCH_EVENTS,
  FETCH_FILTERED_EVENTS,
  CREATE_EVENT,
  LEAVE_AUTH_LOGIN_FORM,
  UPDATE_CHAT,
  HIDE_CHAT,
  SHOW_CHAT,
  SHOW_CHAT_FULLSCREEN,
  HIDE_EVENTLIST,
  SHOW_EVENTLIST,
  SHOW_EVENTLIST_FULLSCREEN,
  INIT_PROFILE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  LEAVE_UPDATE_PROFILE_FORM,
  INIT_EXPORT_TEMPLATE,
  UPDATE_EXPORT_TEMPLATE,
  UPDATE_EXPORT_TEMPLATE_SUCCESS,
  UPDATE_EXPORT_TEMPLATE_ERROR,
  LEAVE_UPDATE_EXPORT_TEMPLATE_FORM,
  CREATE_EXPORT_TEMPLATE,
  CREATE_EXPORT_TEMPLATE_SUCCESS,
  CREATE_EXPORT_TEMPLATE_ERROR,
  LEAVE_CREATE_EXPORT_TEMPLATE_FORM,
  FETCH_EXPORT_TEMPLATES,
  INIT_DEFINITION,
  UPDATE_DEFINITION,
  UPDATE_DEFINITION_SUCCESS,
  UPDATE_DEFINITION_ERROR,
  LEAVE_UPDATE_DEFINITION_FORM,
  CREATE_DEFINITION,
  CREATE_DEFINITION_SUCCESS,
  CREATE_DEFINITION_ERROR,
  LEAVE_CREATE_DEFINITION_FORM,
  FETCH_DEFINITIONS,

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
    axios.get(`${API_ROOT_URL}/validate`,
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

export function initExportTemplate(id) {
  return function (dispatch) {
    axios.get(`${API_ROOT_URL}/api/v1/event_export_templates/${id}`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    })
    .then((response) => {
      dispatch({ type: INIT_EXPORT_TEMPLATE, payload: response.data })
      //console.log("Initialized export template data successfully");
    })
    .catch((error)=>{
      console.log(error);
    });
  }
}

export function initDefinition(id) {
  return function (dispatch) {
    axios.get(`${API_ROOT_URL}/api/v1/event_definitions/${id}`,
    {
      headers: {
        authorization: cookies.get('token')
      }
    })
    .then((response) => {
      dispatch({ type: INIT_DEFINITION, payload: response.data })
      //console.log("Initialized event definition data successfully");
    })
    .catch((error)=>{
      console.log(error);
    });
  }
}

export function login({username, password = ''}) {

  return function (dispatch) {
    axios.post(`${API_ROOT_URL}/login`, {username, password})
    .then(response => {

      //console.log(response.data);

      // If request is good

      // Save the JWT token to LocalStorage
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

export function createEvent(eventValue, eventFreeText) {

  return function (dispatch) {
    axios.post(`${API_ROOT_URL}/api/v1/events`,
    {
      event_value: eventValue,
      event_free_text: eventFreeText,
    },
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
    axios.post(`${API_ROOT_URL}/register`, {username, fullname, password, email})
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

export function createUser({username, fullname, password = '', email, roles}) {
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

export function createExportTemplate(formProps) {

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
      dispatch(createExportTemplateSuccess('Template created'));
      dispatch(fetchExportTemplates());
//      dispatch(hideAddNewUserForm());

      // Redirect to login
      //this.context.router.history.push(`${ROOT_PATH}/login`);
    })
    .catch((error) => {

      // If request is unauthenticated
      console.log(error);
      dispatch(createExportTemplateError(error.response.data.message));

    });
  }
}

export function createDefinition(formProps) {

  let fields = {};

  if(!formProps.event_free_text_required) {
    fields.event_free_text_required = false;
  } else {
    fields.event_free_text_required = formProps.event_free_text_required;
  }

  fields.event_name = formProps.event_name;

  if(!formProps.event_options) {
    fields.event_options = [];
  } else {
    fields.event_options = formProps.event_options;
  }

  fields.event_value = formProps.event_value;

  //console.log(fields);

  return function (dispatch)

   {
    axios.post(`${API_ROOT_URL}/api/v1/event_definitions`,
      fields,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchDefinitions());
      dispatch(createDefinitionSuccess('Definition created'));

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
      dispatch(createDefinitionError(error.response.data.message));

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

export function updateExportTemplate(formProps) {

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

      dispatch(fetchExportTemplates());
      dispatch(updateExportTemplateSuccess('Template updated'));

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
      dispatch(updateExportTemplateError(error.response.data.message));

    });
  }
}

export function updateDefinition(formProps) {

  let fields = {};

  if(!formProps.event_free_text_required) {
    fields.event_free_text_required = false;
  } else {
    fields.event_free_text_required = formProps.event_free_text_required;
  }

  fields.event_name = formProps.event_name;

  if(!formProps.event_options) {
    fields.event_options = [];
  } else {
    fields.event_options = formProps.event_options;
  }

  fields.event_value = formProps.event_value;

  //console.log(fields);

  return function (dispatch)

   {
    axios.patch(`${API_ROOT_URL}/api/v1/event_definitions/${formProps.id}`,
      fields,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchDefinitions());
      dispatch(updateDefinitionSuccess('Definition updated'));

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
      dispatch(updateDefinitionError(error.response.data.message));

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

export function runExportTemplate(id) {

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

export function deleteExportTemplate(id) {

  return function (dispatch) {
    axios.delete(`${API_ROOT_URL}/api/v1/event_export_templates/${id}`,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchExportTemplates());
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

export function deleteDefinition(id) {

  return function (dispatch) {
    axios.delete(`${API_ROOT_URL}/api/v1/event_definitions/${id}`,
      {
        headers: {
        authorization: cookies.get('token')
        }
      }      
    )
    .then((response) => {

      dispatch(fetchDefinitions());
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
    dispatch({type: UNAUTH_USER });
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

export function createDefinitionSuccess(message) {
  return {
    type: CREATE_DEFINITION_SUCCESS,
    payload: message
  }
}

export function createDefinitionError(message) {
  return {
    type: CREATE_DEFINITION_ERROR,
    payload: message
  }
}

export function createExportTemplateSuccess(message) {
  return {
    type: CREATE_EXPORT_TEMPLATE_SUCCESS,
    payload: message
  }
}

export function createExportTemplateError(message) {
  return {
    type: CREATE_EXPORT_TEMPLATE_ERROR,
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

export function updateExportTemplateSuccess(message) {
  return {
    type: UPDATE_EXPORT_TEMPLATE_SUCCESS,
    payload: message
  }
}

export function updateExportTemplateError(message) {
  return {
    type: UPDATE_EXPORT_TEMPLATE_ERROR,
    payload: message
  }
}

export function fetchExportTemplates() {

  const request = axios.get(API_ROOT_URL + '/api/v1/event_export_templates', {
    headers: {
      authorization: cookies.get('token')
    }
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      dispatch({type: FETCH_EXPORT_TEMPLATES, payload: data});
    })
    .catch((error) => {
      if(error.response.status !== 404) {
        console.log(error);
      } else {
        dispatch({type: FETCH_EXPORT_TEMPLATES, payload: []});
      }
    });
  }
}

export function updateDefinitionSuccess(message) {
  return {
    type: UPDATE_DEFINITION_SUCCESS,
    payload: message
  }
}

export function updateDefinitionError(message) {
  return {
    type: UPDATE_DEFINITION_ERROR,
    payload: message
  }
}


export function fetchEventDefinitionsForChat() {

  const request = axios.get(API_ROOT_URL + '/api/v1/event_definitions', {
    headers: {
      authorization: cookies.get('token')
    }
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      //console.log(data);
      dispatch({type: FETCH_EVENT_DEFINITIONS_FOR_CHAT, payload: data})
    })
    .catch((error) => {
      console.log(error);
    });
  }
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
      console.log(error);
    });
  }
}

export function fetchDefinitions() {

  const request = axios.get(API_ROOT_URL + '/api/v1/event_definitions', {
    headers: {
      authorization: cookies.get('token')
    }
  });

  return function (dispatch) {
    
    request.then(({data}) => {
      dispatch({type: FETCH_DEFINITIONS, payload: data})
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

export function updateChat(update) {
  //console.log(update);

  return function (dispatch) {
    dispatch({type: UPDATE_CHAT, payload: update})
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

export function leaveUpdateExportTemplateForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_UPDATE_EXPORT_TEMPLATE_FORM, payload: null})
  }
}

export function leaveCreateExportTemplateForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_CREATE_EXPORT_TEMPLATE_FORM, payload: null})
  }
}

export function leaveUpdateDefinitionForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_UPDATE_DEFINITION_FORM, payload: null})
  }
}

export function leaveCreateDefinitionForm() {
  return function (dispatch) {
    dispatch({type: LEAVE_CREATE_DEFINITION_FORM, payload: null})
  }
}

export function hideChat() {
  return function (dispatch) {
    dispatch({type: HIDE_CHAT, payload: null})
  }
}

export function showChat() {
  return function (dispatch) {
    dispatch({type: SHOW_CHAT, payload: null})
  }
}

export function showChatFullscreen() {
  return function (dispatch) {
    dispatch({type: SHOW_CHAT_FULLSCREEN, payload: null})
  }
}

export function hideEvents() {
  return function (dispatch) {
    dispatch({type: HIDE_EVENTLIST, payload: null})
  }
}

export function showEvents() {
  return function (dispatch) {
    dispatch({type: SHOW_EVENTLIST, payload: null})
  }
}

export function showEventsFullscreen() {
  return function (dispatch) {
    dispatch({type: SHOW_EVENTLIST_FULLSCREEN, payload: null})
  }
}
