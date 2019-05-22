import type { Store, Dispatch } from "../reducers/types";
import { saveIncome } from "./income";

export const INCREMENT_MONTH = "INCREMENT_MONTH";
export const DECREMENT_MONTH = "DECREMENT_MONTH";
export const RESET_MONTH_1 = "RESET_MONTH_1";
export const RESET_MONTH_12 = "RESET_MONTH_12";
export const INCREMENT_YEAR = "INCREMENT_YEAR";
export const DECREMENT_YEAR = "DECREMENT_YEAR";
export const SET_DATE = "SET_DATE";

const increment_month = function(){
    return {
        type: INCREMENT_MONTH
    };
}
const decrement_month = function(){
    return {
        type: DECREMENT_MONTH
    };
}
const reset_month_1 = function(){
    return {
        type: RESET_MONTH_1
    };
}
const reset_month_12 = function(){
    return {
        type: RESET_MONTH_12
    };
}
const increment_year = function(){
    return {
        type: INCREMENT_YEAR
    };
}
const decrement_year = function(){
    return {
        type: DECREMENT_YEAR
    };
}
const set_date = function(month: number, year: number){
    return {
        type: SET_DATE,
        payload: {
            month,
            year
        }
    };
}

export function increment() {
    return (dispatch: Dispatch, store: Store) => {
        const {month} = store().date;

        if (month === 12){
            dispatch(reset_month_1());
            dispatch(increment_year());
        }
        else if (month >= 1){
            dispatch(increment_month());
        }
    };
}
export function increment6() {
    return (dispatch: Dispatch, store: Store) => {
        const {month} = store().date;
        const {year} = store().date;

        if (month < 6){
            dispatch(set_date(month + 6, year));
        } else {
            const rem = (month + 6) % 12;
            dispatch(set_date(rem, year + 1));
        }
    };
}
export function increment12() {
    return (dispatch: Dispatch) => {
        dispatch(increment_year());
    };
}

export function now() {
    return (dispatch: Dispatch) => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        dispatch(set_date(month, year));
    };
}

export function decrement() {
    return (dispatch: Dispatch, store: Store) => {
        const {month} = store().date;

        if (month === 1){
            dispatch(reset_month_12());
            dispatch(decrement_year());
        }
        else if (month <= 12){
            dispatch(decrement_month());
        }
    };
}
export function decrement6() {
    return (dispatch: Dispatch, store: Store) => {
        const {month} = store().date;
        const {year} = store().date;

        if (month > 6){
            dispatch(set_date(month - 6, year));
        } else {
            const rem = 12 - (6 - month);
            dispatch(set_date(rem, year - 1));
        }
    };
}
export function decrement12() {
    return (dispatch: Dispatch) => {
        dispatch(decrement_year());
    };
}