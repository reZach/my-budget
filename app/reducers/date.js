import { INCREMENT_MONTH, DECREMENT_MONTH, RESET_MONTH_1, RESET_MONTH_12, INCREMENT_YEAR, DECREMENT_YEAR, SET_DATE } from "../actions/date";
import { Action, update } from "./types";

export default function date(state: object = {}, action: Action) {
    switch (action.type) {
        case INCREMENT_MONTH:
            return update(state, {
                id: `${state.month + 1}-${state.year}`, 
                month: state.month + 1 
            });
        case DECREMENT_MONTH:
            return update(state, { 
                id: `${state.month - 1}-${state.year}`, 
                month: state.month - 1 
            });
        case RESET_MONTH_1:
            return update(state, { 
                id: `1-${state.year}`, 
                month: 1 
            });
        case RESET_MONTH_12:
            return update(state, { 
                id: `12-${state.year}`, 
                month: 12 
            });
        case INCREMENT_YEAR:
            return update(state, { 
                id: `${state.month}-${state.year + 1}`, 
                year: state.year + 1 
            });
        case DECREMENT_YEAR:
            return update(state, { 
                id: `${state.month}-${state.year - 1}`, 
                year: state.year - 1 
            });
        case SET_DATE:
            return update(state, {
                id: `${action.payload.month}-${action.payload.year}`, 
                month: action.payload.month,
                year: action.payload.year
            });
        default:
            return state;
    }
}