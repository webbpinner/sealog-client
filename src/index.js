import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { AUTH_USER } from './actions/types';
import Header from './components/header';
import Footer from './components/footer';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Profile from './components/auth/profile';
import Register from './components/auth/register';
import RequireAuth from './components/auth/require_auth';
import RequireUnauth from './components/auth/require_unauth';
import Users from './components/users';
import Tasks from './components/tasks';
import EventLogging from './components/event_logging';
import EventTemplates from './components/event_templates';
import Replay from './components/replay';
import Search from './components/search';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand';
import { faCompress } from '@fortawesome/free-solid-svg-icons/faCompress';
import { faStepBackward } from '@fortawesome/free-solid-svg-icons/faStepBackward';
import { faBackward } from '@fortawesome/free-solid-svg-icons/faBackward';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause';
import { faForward } from '@fortawesome/free-solid-svg-icons/faForward';
import { faStepForward } from '@fortawesome/free-solid-svg-icons/faStepForward';

library.add(faUser, faArrowLeft, faArrowRight, faPencilAlt, faTrash, faEye, faEyeSlash, faDownload, faComment, faExpand, faCompress, faStepBackward, faBackward, faPlay, faPause, faForward, faStepForward);

require('typeface-roboto');

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
            <Route path={ `/` } exact={true} component={RequireAuth(EventLogging)}/>
            <Route path={ `/github`} exact={true} component={() => window.location = 'https://github.com/webbpinner/sealog-client'}/>
            <Route path={ `/license`} exact={true} component={() => window.location = 'http://www.gnu.org/licenses/gpl-3.0.html'}/>
            <Route path={ `/profile` } exact={true} component={RequireAuth(Profile)} />
            <Route path={ `/register` } exact={true} component={Register} />
            <Route path={ `/login` } exact={true} component={RequireUnauth(Login)} />
            <Route path={ `/logout` } exact={true} component={Logout} />
            <Route path={ `/users` } exact={true} component={RequireAuth(Users)} />
            <Route path={ `/tasks` } exact={true} component={RequireAuth(Tasks)} />
            <Route path={ `/replay` } exact={true} component={RequireAuth(Replay)} />
            <Route path={ `/search` } exact={true} component={RequireAuth(Search)} />
            <Route path={ `/event_templates` } exact={true} component={RequireAuth(EventTemplates)} />
            <Footer />
          </div>
      </ConnectedRouter>
  </Provider>
  , document.querySelector('.container'));
