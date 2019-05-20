import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const {dialog} = require('electron').remote;
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import * as ItemCollectionActions from "../../actions/itemCollection";
import * as ModifyActions from "../../actions/modify";
import styles from "./CategoryCollection.css";
import Category from "../Category/Category";
import { dateToReadble } from "../../utils/readableDate";

class CategoryCollection extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            newCategoryName: "",
            copyPreviousCategoriesActive: false,
            previousCategoryDates: [],
            selectedPreviousDateForCategories: "",
            collapseState: false
        };

        this.modifyNewCategoryName = this.modifyNewCategoryName.bind(this);
        this.createNewCategory = this.createNewCategory.bind(this);
        this.renameCategory = this.renameCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.toggleAllCategoryState = this.toggleAllCategoryState.bind(this);
        this.prepPreviousCategories = this.prepPreviousCategories.bind(this);
        this.sortAlpha = this.sortAlpha.bind(this);
        this.sortReverseAlpha = this.sortReverseAlpha.bind(this);
        this.sortSpendDescending = this.sortSpendDescending.bind(this);
        this.sortSpendAscending = this.sortSpendAscending.bind(this);
        this.modifySelectedDateForCategories = this.modifySelectedDateForCategories.bind(this);
        this.toggleCopyPreviousCategories = this.toggleCopyPreviousCategories.bind(this);
        this.copyPreviousCategories = this.copyPreviousCategories.bind(this);
        this.handleEscapeKey = this.handleEscapeKey.bind(this);
    }
    
    modifyNewCategoryName(event){
        this.setState({
            newCategoryName: event.target.value
        });
    }

    createNewCategory(event) {        
        if (this.state.newCategoryName !== "") {

            // Don't create duplicate categories
            if (typeof this.props.categories.filter(c => c.dateId === this.props.date.id).find(c => c.name === this.state.newCategoryName) === "undefined") {
                this.props.addCategory(this.state.newCategoryName, false);
                this.props.trueModify();

                this.setState({
                    newCategoryName: ""
                });
            }

        }
    }

    renameCategory(id, newName){
        let categories = this.props.categories.filter(c => c.dateId === this.props.date.id);

        if (typeof categories.find(c => c.name === newName) === "undefined"){
            this.props.renameCategory(id, newName);
            this.props.trueModify();
        }        
    }

    toggleAllCategoryState(value){
        this.props.setCollapseCategoryAll(value)
        this.setState({
            collapseState: value
        });
    }

    deleteCategory(id, name){

        dialog.showMessageBox({
            title: "Delete category",
            type: "warning",
            buttons: ["Yes", "No"],
            message: `Are you sure you want to delete '${name}'?`
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.removeCategory(id);

                let items = this.props.items.filter(i => i.categoryId === id && i.dateId === this.props.date.id);
        
                // delete items
                if (items.length > 0){
                    for (var i = 0; i < items.length; i++){
                        this.props.removeItem(id, items[i].id);
                    }
                }
                this.props.trueModify();
            }
        });        
    }

    prepPreviousCategories(){
        var dates = [];

        for (var i = 0; i < this.props.categories.length; i++){
            if (dates.indexOf(this.props.categories[i].dateId) < 0){
                dates.push(this.props.categories[i].dateId);
            }
        }

        this.setState({
            previousCategoryDates: dates
        });
    }

    sortAlpha(event){
        this.props.sortAlphabetically(this.props.date.id);
        this.props.trueModify();
    }

    sortReverseAlpha(event){
        this.props.sortReverseAlphabetically(this.props.date.id);
        this.props.trueModify();
    }

    sortSpendDescending(event){
        this.props.sortSpentDescending(this.props.date.id);
        this.props.trueModify();
    }

    sortSpendAscending(event){
        this.props.sortSpentAscending(this.props.date.id);
        this.props.trueModify();
    }

    modifySelectedDateForCategories(event){
        this.setState({
            selectedPreviousDateForCategories: event.target.value
        });
    }

    toggleCopyPreviousCategories(event){
        let newState = !this.state.copyPreviousCategoriesActive;
        if (newState){
            this.prepPreviousCategories();
        }

        this.setState({
            copyPreviousCategoriesActive: newState
        });
    }

    copyPreviousCategories(event){
        let target = this.state.selectedPreviousDateForCategories;

        // copy all categories
        for (var i = 0; i < this.props.categories.length; i++){
            if (this.props.categories[i].dateId === target){
                this.props.addCategory(this.props.categories[i].name, false);
            }            
        }

        // copy all items
        for (var i = 0; i < this.props.items.length; i++){
            if (this.props.items[i].dateId === target){
                this.props.addItem(this.props.items[i].categoryId, this.props.items[i].name);
            }
        }

        this.props.trueModify();
        this.setState({
            copyPreviousCategoriesActive: false,
            previousCategoryDates: [],
            selectedPreviousDateForCategories: ""
        });
    }

    handleEscapeKey(event){
        let code = event.keyCode || event.which;
        if (code === 27){
            event.target.blur();
            this.setState({
                newCategoryName: ""
            });
        }
    }

    createPreviousCategoriesDropdown(){
        let dates = this.state.previousCategoryDates;

        return dates.sort(function(a, b){
            var split1 = a.split('-');
            var split2 = b.split('-');
            var m1 = split1[0];
            var y1 = split1[1];
            var m2 = split2[0];
            var y2 = split2[1];

            if (y1 > y2){
                return 1;
            } else if (y2 > y1) {
                return -1;
            } else if (m1 > m2) {
                return 1;
            } else if (m2 > m1) {
                return -1;
            }
            return 0;
        }).map((date) =>
            <option key={`${date}`} value={date}>{`${dateToReadble(date)}`}</option>
        );
    }

    renderCopyPreviousCategories(){
        if (!this.state.copyPreviousCategoriesActive){
            return (
                <div className="columns">
                    <div className="column col-12 text-left">
                        <form onSubmit={() => this.toggleCopyPreviousCategories()}>
                            <button className="btn btn-primary btn-lg" type="submit">Copy previous categories</button>
                        </form>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="columns">
                    <div className="column col-6 col-mr-auto col-auto text-left">
                        <div className="input-group">
                            <select className="form-select form-input" value={this.state.selectedPreviousDateForCategories} onChange={this.modifySelectedDateForCategories}>
                                <option value="">---</option>
                                {this.createPreviousCategoriesDropdown()}  
                            </select>
                            <button className="btn btn-primary input-group-btn" type="button" onClick={() => this.copyPreviousCategories()} disabled={this.state.selectedPreviousDateForCategories === ""}>Copy</button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className={`columns`}>
                <div className={`column col-12 text-left`}>
                    <div className="columns col-gapless">
                        <div className="column col-12 text-left">
                            <h2>Categories</h2>                        
                        </div>                    
                        <div className={`column col-6 text-left ${styles['category-input']}`}>      
                            <form onSubmit={() => this.createNewCategory()}>
                                <div className="input-group">
                                    <input className="form-input input-lg" type="text" placeholder="category" value={this.state.newCategoryName} onChange={this.modifyNewCategoryName} onKeyUp={this.handleEscapeKey}></input>
                                    <button className="btn btn-primary btn-lg input-group-btn" type="submit">Add new</button>
                                </div>
                            </form>
                        </div>
                        <div className={`column col-1 text-center tooltip tooltip-top ${styles["control-parent"]}`} data-tooltip="Sort alphabetically" onClick={() => this.sortAlpha()}>
                            <i className={`fas fa-sort-alpha-down ${styles.control}`}></i>
                        </div>
                        <div className={`column col-1 text-center tooltip tooltip-top ${styles["control-parent"]}`} data-tooltip="Sort reverse-alphabetically" onClick={() => this.sortReverseAlpha()}>
                            <i className={`fas fa-sort-alpha-up ${styles.control}`}></i>
                        </div>
                        <div className={`column col-1 text-center tooltip tooltip-top ${styles["control-parent"]}`} data-tooltip="Sort spent descending" onClick={() => this.sortSpendDescending()}>
                            <i className={`fas fa-sort-amount-down ${styles.control}`}></i>
                        </div>
                        <div className={`column col-1 text-center tooltip tooltip-top ${styles["control-parent"]}`} data-tooltip="Sort spent ascending" onClick={() => this.sortSpendAscending()}>
                            <i className={`fas fa-sort-amount-up ${styles.control}`}></i>
                        </div>                        
                        <div className={`column col-1 text-center tooltip tooltip-top ${styles["control-parent"]}`} data-tooltip="Collapses all categories" onClick={() => this.toggleAllCategoryState(true)}>
                            <i className={`fas fa-compress ${styles.control}`}></i>
                        </div>
                        <div className={`column col-1 text-center tooltip tooltip-top ${styles["control-parent"]}`} data-tooltip="Expands all categories" onClick={() => this.toggleAllCategoryState(false)}>
                        <i className={`fas fa-expand ${styles.control}`}></i>
                        </div>                         
                    </div>
                </div>
                <div className={`column ${styles['category-container']}`}>
                    {this.props.categories.filter(c => c.dateId === this.props.date.id).sort(function(a, b){
                        var a1 = a.order;
                        var b1 = b.order;
                        if (a1 > b1) return 1;
                        if (a1 < b1) return -1;
                        return 0;
                    }).map((value, index, array) => {
                        return value.dateId === this.props.date.id &&
                            <div className={`column col-12 text-left ${styles.category}`} key={this.props.date.id + "-" + value.id}>
                                <Category {...value} dateId={this.props.date.id} rename={this.renameCategory} delete={this.deleteCategory}></Category>
                            </div>
                    })}
                    {this.props.categories.filter(c => c.dateId === this.props.date.id).length === 0 && this.renderCopyPreviousCategories()}
                </div>                
            </div>
        );
    }
}



function mapStateToProps(state){
    return {
        date: state.date,
        categories: state.categories,
        items: state.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {...CategoryCollectionActions, 
        ...ItemCollectionActions,
        ...ModifyActions}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryCollection);