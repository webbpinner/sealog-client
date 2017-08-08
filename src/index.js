import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Cookies from 'universal-cookie';

import { AUTH_USER } from './actions/types';

import Header from './components/header';
import Footer from './components/footer';
import Feature from './components/feature';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Profile from './components/auth/profile';
import Register from './components/auth/register';
import RequireAuth from './components/auth/require_auth';
import RequireUnauth from './components/auth/require_unauth';
import Welcome from './components/welcome';
import Chat from './components/chat';
import Users from './components/users';
import Events from './components/events';
import UpdateUser from './components/update_user';
import CreateUser from './components/create_user';
import Exports from './components/exports';
import UpdateExportTemplate from './components/update_export';
import CreateExportTemplate from './components/create_export';
import Definitions from './components/definitions';
import UpdateDefinition from './components/update_definition';
import CreateDefinition from './components/create_definition';

import { ROOT_PATH } from './url_config';

import store from './store';
import history from './history';

const cookies = new Cookies();

const token = cookies.get('token');
if (token) {

  store.dispatch({ type: AUTH_USER });

}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
        <div>
          <Header />
          <Route path={ `${ROOT_PATH}/` } exact={true} component={RequireAuth(Chat)}/>
          <Route path={ `${ROOT_PATH}/feature` } exact={true} component={RequireAuth(Feature)} />
          <Route path={ `${ROOT_PATH}/events` } exact={true} component={RequireAuth(Events)} />
          <Switch>
            <Route path={ `${ROOT_PATH}/users` } exact={true} component={RequireAuth(Users)} />
            <Route path={ `${ROOT_PATH}/users/new` } exact={true} component={RequireAuth(CreateUser)} />
            <Route path={ `${ROOT_PATH}/users/:id` } exact={true} component={RequireAuth(UpdateUser)} />
          </Switch>
          <Route path={ `${ROOT_PATH}/profile` } exact={true} component={RequireAuth(Profile)} />
          <Switch>
            <Route path={ `${ROOT_PATH}/exports` } exact={true} component={RequireAuth(Exports)} />
            <Route path={ `${ROOT_PATH}/exports/new` } exact={true} component={RequireAuth(CreateExportTemplate)} />
            <Route path={ `${ROOT_PATH}/exports/:id` } exact={true} component={RequireAuth(UpdateExportTemplate)} />
          </Switch>
          <Switch>
            <Route path={ `${ROOT_PATH}/definitions` } exact={true} component={RequireAuth(Definitions)} />
            <Route path={ `${ROOT_PATH}/definitions/new` } exact={true} component={RequireAuth(CreateDefinition)} />
            <Route path={ `${ROOT_PATH}/definitions/:id` } exact={true} component={RequireAuth(UpdateDefinition)} />
          </Switch>
          <Route path={ `${ROOT_PATH}/login` } exact={true} component={RequireUnauth(Login)} />
          <Route path={ `${ROOT_PATH}/logout` } exact={true} component={Logout} />
          <Route path={ `${ROOT_PATH}/register` } exact={true} component={Register} />
          <Footer />
        </div>
    </ConnectedRouter>
  </Provider>
  , document.querySelector('.container'));
