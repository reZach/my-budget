import { ADD_INCOME_RECORD,
    MODIFY_INCOME_RECORD_START_DAY,
    MODIFY_INCOME_RECORD_START_MONTH,
    MODIFY_INCOME_RECORD_START_YEAR,
    MODIFY_INCOME_RECORD_INCOME,
    MODIFY_INCOME_RECORD_FREQUENCY,
    MODIFY_INCOME_RECORD_NOTE,
    REMOVE_INCOME_RECORD,
    ENTRY_INCOME_RECORDS,    
    INCOME_RECORDS_FREQUENCY_MAP } from "../actions/incomeRecords";
import update, { Action } from "./types";

export default function incomeRecords(state: array = [], action: Action){
    switch(action.type){
        case ADD_INCOME_RECORD:
            if (state.length === 0){
                return update(state,
                    [{
                        id: "1",
                        startDay: action.payload.startDay,
                        startMonth: action.payload.startMonth,
                        startYear: action.payload.startYear,
                        income: action.payload.income,
                        frequency: action.payload.frequency,
                        frequencyName: INCOME_RECORDS_FREQUENCY_MAP[action.payload.frequency],
                        note: action.payload.note
                    }]
                );
            } 
                return update(state,
                    [{
                        id: (state.reduce((accumulator, current) => {
                            const id = parseInt(current.id);

                            if (id > accumulator) {
                                return id;
                            }

                            // Should never get into this, but still
                            return accumulator;
                        }, 0) + 1).toString(),
                        startDay: action.payload.startDay,
                        startMonth: action.payload.startMonth,
                        startYear: action.payload.startYear,
                        income: action.payload.income,
                        frequency: action.payload.frequency,
                        frequencyName: INCOME_RECORDS_FREQUENCY_MAP[action.payload.frequency],
                        note: action.payload.note
                    }]
                );
            
        case MODIFY_INCOME_RECORD_START_DAY:
            return update([], 
                state.map(i => {
                    if (i.id === action.payload.id){
                        i.startDay = action.payload.startDay;
                    }

                    return i;
                })
            );
        case MODIFY_INCOME_RECORD_START_MONTH:
            return update([], 
                state.map(i => {
                    if (i.id === action.payload.id){
                        i.startMonth = action.payload.startMonth;
                    }

                    return i;
                })
            );
        case MODIFY_INCOME_RECORD_START_YEAR:
            return update([], 
                state.map(i => {
                    if (i.id === action.payload.id){
                        i.startYear = action.payload.startYear;
                    }

                    return i;
                })
            );
        case MODIFY_INCOME_RECORD_INCOME:
            return update([], 
                state.map(i => {
                    if (i.id === action.payload.id){
                        i.income = action.payload.income;
                    }

                    return i;
                })
            );
        case MODIFY_INCOME_RECORD_FREQUENCY:
            return update([], 
                state.map(i => {
                    if (i.id === action.payload.id){
                        i.frequency = action.payload.frequency;
                        i.frequencyName = INCOME_RECORDS_FREQUENCY_MAP[action.payload.frequency];
                    }

                    return i;
                })
            ); 
        case MODIFY_INCOME_RECORD_NOTE:
            return update([], 
                state.map(i => {
                    if (i.id === action.payload.id){
                        i.note = action.payload.note;
                    }

                    return i;
                })
            );    
        case REMOVE_INCOME_RECORD:        
            return update([], state.filter(i => i.id !== action.payload.id));
        case ENTRY_INCOME_RECORDS:        
            return update([], action.payload.incomeRecords);
        default:
            return state;
    }
}