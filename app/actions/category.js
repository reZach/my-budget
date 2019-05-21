import { Store, Dispatch } from "../reducers/types";

export const ADD_CATEGORY_ITEM = "ADD_CATEGORY_ITEM";
export const REMOVE_CATEGORY_ITEM = "REMOVE_CATEGORY_ITEM";


export const CATEGORY_INITIAL_STATE = {
    id: "",
    dateId: "",
    name: "",
    collapse: false
};


const addCategoryItemPrivate = function addCategoryItemPrivate(categoryName: string, name: string){
    return {
        type: ADD_CATEGORY_ITEM,
        payload: {
            categoryName,
            name
        }        
    };
}
const removeCategoryItemPrivate = function removeCategoryItemPrivate(categoryName: string, name: string){
    return {
        type: REMOVE_CATEGORY_ITEM,
        payload: {
            categoryName,
            name
        }        
    };
}



export function addCategoryItem(categoryName: string, name: string) {
    return (dispatch: Dispatch) => {
        dispatch(addCategoryItemPrivate(categoryName, name));
    }
}

export function removeCategoryItem(categoryName: string, name: string) {
    return (dispatch: Dispatch) => {
        dispatch(removeCategoryItemPrivate(categoryName, name));
    }
}

