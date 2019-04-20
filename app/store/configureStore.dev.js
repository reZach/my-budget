import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createRootReducer from '../reducers';
import * as counterActions from '../actions/counter';
import * as dateActions from "../actions/date";
import * as categoryActions from "../actions/category";
import * as categoryCollectionActions from "../actions/categoryCollection";
import * as itemCollectionActions from "../actions/itemCollection";
import * as createTransactionActions from "../actions/createTransaction";
import * as incomeActions from "../actions/income";
import * as pendingImportActions from "../actions/pendingImport";
import * as transactionCollectionActions from "../actions/transactionCollection";
import * as saveActions from "../actions/save";
import * as modifyActions from "../actions/modify";
import category from '../reducers/category';

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = (initialState?: any) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...counterActions,
    ...dateActions,
    ...categoryActions,
    ...categoryCollectionActions,
    ...itemCollectionActions,
    ...transactionCollectionActions,
    ...saveActions,
    ...modifyActions,
    ...createTransactionActions,
    ...incomeActions,
    ...pendingImportActions,
    ...routerActions
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
};

export default { configureStore, history };
