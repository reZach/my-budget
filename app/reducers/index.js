// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import date from "./date";
import categoryCollection from "./categoryCollection";

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    date: date,
    categoryCollection: categoryCollection
  });
}
