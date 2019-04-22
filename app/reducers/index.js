// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import counter from './counter';
import date from "./date";
//import category from "./category";
import passphrase from "./passphrase";
import categoryCollection from "./categoryCollection";
import itemCollection from "./itemCollection";
import transactionCollection from "./transactionCollection";
import createTransaction from "./createTransaction";
import bankSync from "./bankSync";
import importTransactionsOptions from "./importTransactionsOptions";
import pendingImport from "./pendingImport";
import income from "./income";
import modified from "./modified";

export default function createRootReducer(history: History) {
  return combineReducers({
    modified: modified,
    router: connectRouter(history),
    income: income,
    date: date,
    passphrase: passphrase,
    categories: categoryCollection,
    items: itemCollection,
    transactions: transactionCollection,
    createTransaction: createTransaction,
    bankSync: bankSync,
    importTransactionsOptions: importTransactionsOptions,
    pendingImport: pendingImport
  });
}
