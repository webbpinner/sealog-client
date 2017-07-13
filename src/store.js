import { createStore, applyMiddleware } from 'redux';

import reduxThunk from 'redux-thunk';

//import { browserHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";

import reducers from './reducers';
import history from './history';

const reactRouterReduxMiddleware = routerMiddleware(history);

const middleware = [ reduxThunk, reactRouterReduxMiddleware ]

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
//const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

export default createStoreWithMiddleware(reducers);