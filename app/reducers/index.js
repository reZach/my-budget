// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import date from "./date";
//import category from "./category";
import categoryCollection from "./categoryCollection";
import itemCollection from "./itemCollection";
import transactionCollection from "./transactionCollection";

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    date: date,
    categories: categoryCollection,
    items: itemCollection,
    transactions: transactionCollection
  });
}
