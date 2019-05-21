import type {
    Dispatch as ReduxDispatch, Store as ReduxStore
} from 'redux';

export type counterStateType = {
    counter: number
};

export type Action = {
    type: string,
    payload: object
};

export function update(state, mutations) {
    if (Array.isArray(state) && Array.isArray(mutations)) {
        return state.concat(mutations);
    } 
        return Object.assign({}, state, mutations);
    
}

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action> ;

export type Store = ReduxStore<GetState, Action> ;