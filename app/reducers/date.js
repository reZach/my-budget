import { INCREMENT_MONTH, DECREMENT_MONTH, RESET_MONTH_1, RESET_MONTH_12, INCREMENT_YEAR, DECREMENT_YEAR } from "../actions/date";
import type { Action } from "./types";

export default function date(state: any = {}, action: Action) {
    switch (action.type) {
        case INCREMENT_MONTH:
            return Object.assign({}, state, {
                months: state.months + 1
            });
        case DECREMENT_MONTH:
            return Object.assign({}, state, {
                months: state.months - 1
            });
        case RESET_MONTH_1:
            return Object.assign({}, state, {
                months: 1
            });
        case RESET_MONTH_12:
            return Object.assign({}, state, {
                months: 12
            });
        case INCREMENT_YEAR:
            return Object.assign({}, state, {
                years: state.years + 1
            });
        case DECREMENT_YEAR:
            return Object.assign({}, state, {
                years: state.years - 1
            });
        default:
            return state;
    }
}