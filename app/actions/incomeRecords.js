import { Store, Dispatch } from "../reducers/types";

export const ADD_INCOME_RECORD = "ADD_INCOME_RECORD";
export const MODIFY_INCOME_RECORD_START_DAY = "MODIFY_INCOME_RECORD_START_DAY";
export const MODIFY_INCOME_RECORD_START_MONTH = "MODIFY_INCOME_RECORD_START_MONTH";
export const MODIFY_INCOME_RECORD_START_YEAR = "MODIFY_INCOME_RECORD_START_YEAR";
export const MODIFY_INCOME_RECORD_INCOME = "MODIFY_INCOME_RECORD_INCOME";
export const MODIFY_INCOME_RECORD_FREQUENCY = "MODIFY_INCOME_RECORD_FREQUENCY";
export const MODIFY_INCOME_RECORD_NOTE = "MODIFY_INCOME_RECORD_NOTE";
export const REMOVE_INCOME_RECORD = "REMOVE_INCOME_RECORD";
export const ENTRY_INCOME_RECORDS = "ENTRY_INCOME_RECORDS";

export const INCOME_RECORD_INITIAL_STATE = {
    id: "",
    startDay: 0,
    startMonth: 0,
    startYear: 0,
    income: 0,
    frequency: "",
    note: ""
};
export const INCOME_RECORDS_INITIAL_STATE = [
    
];

export const INCOME_RECORDS_FREQUENCY_MAP = {
    "0": "one time",
    "1": "every week",
    "2": "every 2 weeks",
    //"3": "first business day of month",
    //"4": "last business day of month"
}

var add_income_record = function(day: Number, month: Number, year: Number, income: Number, frequency: String, note: string){
    return {
        type: ADD_INCOME_RECORD,
        payload: {
            startDay: day,
            startMonth: month,
            startYear: year,
            income: income,
            frequency: frequency,
            note: note
        }
    };
}

var modify_income_record_start_day = function(id: String, day: number){
    return {
        type: MODIFY_INCOME_RECORD_START_DAY,
        payload: {
            id: id,
            startDay: day
        }
    };
}

var modify_income_record_start_month = function(id: String, month: number){
    return {
        type: MODIFY_INCOME_RECORD_START_MONTH,
        payload: {
            id: id,
            startMonth: month
        }
    };
}

var modify_income_record_start_year = function(id: String, year: number){
    return {
        type: MODIFY_INCOME_RECORD_START_YEAR,
        payload: {
            id: id,
            startYear: year
        }
    };
}

var modify_income_record_income = function(id: String, income: number){
    return {
        type: MODIFY_INCOME_RECORD_INCOME,
        payload: {
            id: id,
            income: income
        }
    };
}

var modify_income_record_frequency = function(id: String, frequency: string){
    return {
        type: MODIFY_INCOME_RECORD_FREQUENCY,
        payload: {
            id: id,
            frequency: frequency
        }
    };
}

var modify_income_record_note = function(id: String, note: string){
    return {
        type: MODIFY_INCOME_RECORD_NOTE,
        payload: {
            id: id,
            note: note
        }
    };
}

var remove_income_record = function(id: string){
    return {
        type: REMOVE_INCOME_RECORD,
        payload: {
            id: id
        }
    };
}
var entry_income_records = function(incomeRecords: any){
    return {
        type: ENTRY_INCOME_RECORDS,
        payload: {
            incomeRecords: incomeRecords
        }
    };
}

export function addIncomeRecord(day: Number, month: Number, year: Number, income: Number, frequency: String, note: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(add_income_record(day, month, year, income, frequency, note));
    }
}

export function modifyIncomeRecordStartDay(id: String, day: number){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_income_record_start_day(id, day));
    }
}

export function modifyIncomeRecordStartMonth(id: String, month: number){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_income_record_start_month(id, month));
    }
}

export function modifyIncomeRecordStartYear(id: String, year: number) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_income_record_start_year(id, year));
    }
}

export function modifyIncomeRecordIncome(id: String, income: number) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_income_record_income(id, income));
    }
}

export function modifyIncomeRecordFrequency(id: String, frequency: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_income_record_frequency(id, frequency));
    }
}

export function modifyIncomeRecordNote(id: String, note: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(modify_income_record_note(id, note));
    }
}

export function removeIncomeRecord(id: string){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(remove_income_record(id));
    }
}

export function entryIncomeRecords(incomeRecords: any){
    return (dispatch: Dispatch, store: Store) => {
        dispatch(entry_income_records(incomeRecords));
    }
}