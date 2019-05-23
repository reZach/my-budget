import { Dispatch } from "../reducers/types";

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
    // "3": "first business day of month",
    // "4": "last business day of month"
}

const add_income_record = function(day: number, month: number, year: number, income: number, frequency: string, note: string){
    return {
        type: ADD_INCOME_RECORD,
        payload: {
            startDay: day,
            startMonth: month,
            startYear: year,
            income,
            frequency,
            note
        }
    };
}

const modify_income_record_start_day = function(id: string, day: number){
    return {
        type: MODIFY_INCOME_RECORD_START_DAY,
        payload: {
            id,
            startDay: day
        }
    };
}

const modify_income_record_start_month = function(id: string, month: number){
    return {
        type: MODIFY_INCOME_RECORD_START_MONTH,
        payload: {
            id,
            startMonth: month
        }
    };
}

const modify_income_record_start_year = function(id: string, year: number){
    return {
        type: MODIFY_INCOME_RECORD_START_YEAR,
        payload: {
            id,
            startYear: year
        }
    };
}

const modify_income_record_income = function(id: string, income: number){
    return {
        type: MODIFY_INCOME_RECORD_INCOME,
        payload: {
            id,
            income
        }
    };
}

const modify_income_record_frequency = function(id: string, frequency: string){
    return {
        type: MODIFY_INCOME_RECORD_FREQUENCY,
        payload: {
            id,
            frequency
        }
    };
}

const modify_income_record_note = function(id: string, note: string){
    return {
        type: MODIFY_INCOME_RECORD_NOTE,
        payload: {
            id,
            note
        }
    };
}

const remove_income_record = function(id: string){
    return {
        type: REMOVE_INCOME_RECORD,
        payload: {
            id
        }
    };
}
const entry_income_records = function(incomeRecords: array){
    return {
        type: ENTRY_INCOME_RECORDS,
        payload: {
            incomeRecords
        }
    };
}

export function addIncomeRecord(day: number, month: number, year: number, income: number, frequency: string, note: string){
    return (dispatch: Dispatch) => {
        dispatch(add_income_record(day, month, year, income, frequency, note));
    }
}

export function modifyIncomeRecordStartDay(id: string, day: number){
    return (dispatch: Dispatch) => {
        dispatch(modify_income_record_start_day(id, day));
    }
}

export function modifyIncomeRecordStartMonth(id: string, month: number){
    return (dispatch: Dispatch) => {
        dispatch(modify_income_record_start_month(id, month));
    }
}

export function modifyIncomeRecordStartYear(id: string, year: number) {
    return (dispatch: Dispatch) => {
        dispatch(modify_income_record_start_year(id, year));
    }
}

export function modifyIncomeRecordIncome(id: string, income: number) {
    return (dispatch: Dispatch) => {
        dispatch(modify_income_record_income(id, income));
    }
}

export function modifyIncomeRecordFrequency(id: string, frequency: string) {
    return (dispatch: Dispatch) => {
        dispatch(modify_income_record_frequency(id, frequency));
    }
}

export function modifyIncomeRecordNote(id: string, note: string) {
    return (dispatch: Dispatch) => {
        dispatch(modify_income_record_note(id, note));
    }
}

export function removeIncomeRecord(id: string){
    return (dispatch: Dispatch) => {
        dispatch(remove_income_record(id));
    }
}

export function entryIncomeRecords(incomeRecords: any){
    return (dispatch: Dispatch) => {
        dispatch(entry_income_records(incomeRecords));
    }
}