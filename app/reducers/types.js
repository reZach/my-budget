import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type counterStateType = {
  counter: number
};

export type Action = {
  type: string,
  payload: object
};

export function update(state, mutations){
  return Object.assign({}, state, mutations);
}

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
