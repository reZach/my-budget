import { Store, Dispatch } from "../reducers/types";

export const ADD_CATEGORY_ITEM = "ADD_CATEGORY_ITEM";
export const REMOVE_CATEGORY_ITEM = "REMOVE_CATEGORY_ITEM";


export const CATEGORY_INITIAL_STATE = {
    id: "",
    dateId: "",
    name: "",
    collapse: false
};


var add_category_item = function(categoryName: string, name: string){
    return {
        type: ADD_CATEGORY_ITEM,
        payload: {
            categoryName: categoryName,
            name: name
        }        
    };
}
var remove_category_item = function(categoryName: string, name: string){
    return {
        type: REMOVE_CATEGORY_ITEM,
        payload: {
            categoryName: categoryName,
            name: name
        }        
    };
}



export function addCategoryItem(categoryName: string, name: string) {
    return (dispatch: Dispatch) => {
        dispatch(add_category_item(categoryName, name));
    }
}

export function removeCategoryItem(categoryName: string, name: string) {
    return (dispatch: Dispatch) => {
        dispatch(remove_category_item(categoryName, name));
    }
}

