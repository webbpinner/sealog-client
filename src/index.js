import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { ThemeSwitcher } from 'react-bootstrap-theme-switcher';
import "typeface-roboto";

import { AUTH_USER } from './actions/types';

import Header from './components/header';
import Footer from './components/footer';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Profile from './components/auth/profile';
import Register from './components/auth/register';
import RequireAuth from './components/auth/require_auth';
import RequireUnauth from './components/auth/require_unauth';
import Main from './components/main';
import Users from './components/users';
import Tasks from './components/tasks';
import Lowerings from './components/lowerings';
import EventExports from './components/event_exports';
import EventTemplates from './components/event_templates';

require("font-awesome-webpack");

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
    <ThemeSwitcher themePath={ `${ROOT_PATH}/themes` } defaultTheme="cyborg" storeThemeKey="theme">
      <ConnectedRouter history={history}>
          <div>
            <Header />
            <Route path={`/github`} exact={true} component={() => window.location = 'https://github.com/webbpinner/sealog-client'}/>
            <Route path={`/license`} exact={true} component={() => window.location = 'http://www.gnu.org/licenses/gpl-3.0.html'}/>
            <Route path={ `/` } exact={true} component={RequireAuth(Main)}/>
            <Route path={ `/tasks` } exact={true} component={RequireAuth(Tasks)} />
            <Route path={ `/lowerings` } exact={true} component={RequireAuth(Lowerings)} />
            <Route path={ `/users` } exact={true} component={RequireAuth(Users)} />
            <Route path={ `/profile` } exact={true} component={RequireAuth(Profile)} />
            <Route path={ `/event_exports` } exact={true} component={RequireAuth(EventExports)} />
            <Route path={ `/event_templates` } exact={true} component={RequireAuth(EventTemplates)} />
            <Route path={ `/login` } exact={true} component={RequireUnauth(Login)} />
            <Route path={ `/logout` } exact={true} component={Logout} />
            <Route path={ `/register` } exact={true} component={Register} />
            <Footer />
          </div>
      </ConnectedRouter>
    </ThemeSwitcher>
  </Provider>
  , document.querySelector('.container'));
