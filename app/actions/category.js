import { Store, Dispatch } from "../reducers/types";

export const RENAME_CATEGORY = "RENAME_CATEGORY";
export const ADD_CATEGORY_ITEM = "ADD_CATEGORY_ITEM";
export const REMOVE_CATEGORY_ITEM = "REMOVE_CATEGORY_ITEM";
export const RENAME_CATEGORY_ITEM = "RENAME_CATEGORY_ITEM";

export const CATEGORY_INITIAL_STATE = {
    id: "",
    dateId: "",
    name: ""
};

var rename_category = function(dateId: string, categoryId: string, newName: string){
    return {
        type: RENAME_CATEGORY,
        payload: {
            dateId: dateId,
            categoryId: categoryId,
            newName: newName
        }        
    };
}
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
var rename_category_item = function(categoryName: string, oldName: string, newName: string){
    return {
        type: RENAME_CATEGORY_ITEM,
        payload: {
            categoryName: categoryName,
            oldName: oldName,
            newName: newName
        }        
    };
}

export function renameCategory(categoryId:string, newName: string) {
    return (dispatch: Dispatch, store: Store) => {
        dispatch(rename_category(
            store().date.id, categoryId, newName));
    }
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

export function renameCategoryItem(categoryName: string, oldName: string, newName: string) {
    return (dispatch: Dispatch) => {
        dispatch(rename_category_item(categoryName, oldName, newName));
    }
}