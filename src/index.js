import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { ThemeSwitcher } from 'react-bootstrap-theme-switcher';

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
import Main from './components/main';
import Users from './components/users';
import Events from './components/events';
import UpdateUser from './components/update_user';
import CreateUser from './components/create_user';
import EventExports from './components/event_exports';
import UpdateEventExportTemplate from './components/update_event_export';
import CreateEventExportTemplate from './components/create_event_export';
import EventTemplates from './components/event_templates';
import UpdateEventTemplate from './components/update_event_template';
import CreateEventTemplate from './components/create_event_template';

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
    <ThemeSwitcher themePath={ `${ROOT_PATH}/themes` } defaultTheme="yeti" storeThemeKey="theme">
      <ConnectedRouter history={history}>
          <div>
            <Header />
            <Route path='/github' component={() => window.location = 'https://github.com/webbpinner/sealog-client'}/>
            <Route path='/license' component={() => window.location = 'http://www.gnu.org/licenses/gpl-3.0.html'}/>
            <Route path={ `${ROOT_PATH}/` } exact={true} component={RequireAuth(Main)}/>
            <Route path={ `${ROOT_PATH}/feature` } exact={true} component={RequireAuth(Feature)} />
            <Route path={ `${ROOT_PATH}/events` } exact={true} component={RequireAuth(Events)} />
            <Route path={ `${ROOT_PATH}/users` } exact={true} component={RequireAuth(Users)} />
            <Route path={ `${ROOT_PATH}/profile` } exact={true} component={RequireAuth(Profile)} />
            <Switch>
              <Route path={ `${ROOT_PATH}/event_exports` } exact={true} component={RequireAuth(EventExports)} />
              <Route path={ `${ROOT_PATH}/event_exports/new` } exact={true} component={RequireAuth(CreateEventExportTemplate)} />
              <Route path={ `${ROOT_PATH}/event_exports/:id` } exact={true} component={RequireAuth(UpdateEventExportTemplate)} />
            </Switch>
            <Route path={ `${ROOT_PATH}/event_templates` } exact={true} component={RequireAuth(EventTemplates)} />
            <Route path={ `${ROOT_PATH}/login` } exact={true} component={RequireUnauth(Login)} />
            <Route path={ `${ROOT_PATH}/logout` } exact={true} component={Logout} />
            <Route path={ `${ROOT_PATH}/register` } exact={true} component={Register} />
            <Footer />
          </div>
      </ConnectedRouter>
    </ThemeSwitcher>
  </Provider>
  , document.querySelector('.container'));
