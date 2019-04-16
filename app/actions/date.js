import type { Store, Dispatch } from "../reducers/types";
import { saveIncome } from "./income";

export const INCREMENT_MONTH = "INCREMENT_MONTH";
export const DECREMENT_MONTH = "DECREMENT_MONTH";
export const RESET_MONTH_1 = "RESET_MONTH_1";
export const RESET_MONTH_12 = "RESET_MONTH_12";
export const INCREMENT_YEAR = "INCREMENT_YEAR";
export const DECREMENT_YEAR = "DECREMENT_YEAR";
export const SET_DATE = "SET_DATE";

var increment_month = function(){
    return {
        type: INCREMENT_MONTH
    };
}
var decrement_month = function(){
    return {
        type: DECREMENT_MONTH
    };
}
var reset_month_1 = function(){
    return {
        type: RESET_MONTH_1
    };
}
var reset_month_12 = function(){
    return {
        type: RESET_MONTH_12
    };
}
var increment_year = function(){
    return {
        type: INCREMENT_YEAR
    };
}
var decrement_year = function(){
    return {
        type: DECREMENT_YEAR
    };
}
var set_date = function(month: number, year: number){
    return {
        type: SET_DATE,
        payload: {
            month: month,
            year: year
        }
    };
}

export function increment() {
    return (dispatch: Dispatch, store: Store) => {
        const month = store().date.month;

        if (month == 12){
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
        const month = store().date.month;
        const year = store().date.year;

        if (month < 6){
            dispatch(set_date(month + 6, year));
        } else {
            let rem = (month + 6) % 12;
            dispatch(set_date(rem, year + 1));
        }
    };
}
export function increment12() {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(increment_year());
    };
}

export function now() {
    return (dispatch: Dispatch, store: Store) => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        dispatch(set_date(month, year));
    };
}

export function decrement() {
    return (dispatch: Dispatch, store: Store) => {
        const month = store().date.month;

        if (month == 1){
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
        const month = store().date.month;
        const year = store().date.year;

        if (month > 6){
            dispatch(set_date(month - 6, year));
        } else {
            let rem = 12 - (6 - month);
            dispatch(set_date(rem, year - 1));
        }
    };
}
export function decrement12() {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(decrement_year());
    };
}