import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as TransactionActions from "../../actions/transactionCollection";
import * as CreateTransaction from "../../actions/createTransaction";
import styles from "./TransactionCollection.css";
import Transaction from "../Transaction/Transaction";

class TransactionCollection extends Component<Props> {
    props: Props;

    constructor(){
        super();

        this.modifyNote = this.modifyNote.bind(this);
        this.modifyAmount = this.modifyAmount.bind(this);
        this.modifyDay = this.modifyDay.bind(this);
        this.modifyCategory = this.modifyCategory.bind(this);
        this.modifyItem = this.modifyItem.bind(this);        
        this.createNewTransaction = this.createNewTransaction.bind(this);
    }

    modifyNote(event){
        this.props.modifyNote(event.target.value);        
    }

    modifyAmount(event){        
        let newValue = event.target.value;
        if (newValue.match(/^$/) !== null ||
            newValue.match(/^\d+\.?\d?\d?$/) !== null){
            this.props.modifyAmount(newValue);
        } else {
            this.props.modifyAmount(this.props.createTransaction.amount);
        }
    }

    modifyDay(event){
        let day = event.target.value;
        if (day.match(/^$/) !== null ||
            day.match(/^[1-9]$/) !== null ||
            day.match(/^[12][0-9]$/) !== null ||   
            day.match(/^3[01]$/) !== null){
            this.props.modifyDay(day);
        } else {
            this.props.modifyDay(this.props.createTransaction.day);
        }        
    }

    modifyCategory(event){

        // find category
        var category = this.props.categories.find(c => c.name === event.target.value);
        
        var newCategoryId = (typeof category !== "undefined") ? category.id : "";

        // find item
        var item = "";
        var newItemId = "";
        if (this.props.items.length > 0){
            var exists = this.props.items.sort((a, b) => a.name > b.name).find(i => i.categoryId === newCategoryId);

            if (typeof exists !== "undefined"){
                item = exists.name;
                newItemId = exists.id;
            }

            this.props.modifySelectedItem(newItemId, item);
        }
        
        this.props.modifySelectedCategory(newCategoryId, event.target.value);        
    }

    modifyItem(event){
        var item = this.props.items.find(i => i.categoryId === this.props.createTransaction.selectedCategoryId && i.name === event.target.value);

        if (typeof item !== "undefined"){
            this.props.modifySelectedItem(item.id, item.name);
        } else {
            this.props.modifySelectedItem("", "");
        }
    }

    createNewTransaction(event){
        this.props.addTransaction(this.props.createTransaction.selectedCategoryId, 
            this.props.createTransaction.selectedItemId, this.props.createTransaction.day, this.props.createTransaction.amount, this.props.createTransaction.note);

        this.props.resetCreateNewTransaction();
    }

    createCategoriesDropDown(){
        let categories = this.props.categories;
        return categories.sort((a, b) => a.name > b.name).map((category) =>
            <option key={`${category.dateId}.${category.id}.${category.name}`}>{category.name}</option>
        );
    }

    createItemsDropDown(){
        let items = this.props.items;
        return items.filter(i => i.categoryId === this.props.createTransaction.selectedCategoryId).sort((a, b) => a.name > b.name).map((item) => 
            <option key={`${item.dateId}.${item.id}.${item.name}`}>{item.name}</option>
        );
    }

    render() {
        return (
            <React.Fragment>

                <form onSubmit={() => this.createNewTransaction()}>
                    <select value={this.props.createTransaction.selectedCategory} onChange={this.modifyCategory}>
                        <option value="">---</option>
                        {this.createCategoriesDropDown()}
                    </select><br />  
                    <select value={this.props.createTransaction.selectedItem} onChange={this.modifyItem}>
                        <option value="">---</option>
                        {this.createItemsDropDown()}  
                    </select>                 
                    <input type="text" placeholder="amount" value={this.props.createTransaction.amount} onChange={this.modifyAmount}></input><br />
                    <input type="text" placeholder="note" value={this.props.createTransaction.note} onChange={this.modifyNote}></input>
                    <input type="number" placeholder="day" value={this.props.createTransaction.day} onChange={this.modifyDay}></input>
                    <input type="submit" disabled={this.props.createTransaction.selectedCategory === "" || this.props.createTransaction.selectedItem === ""} value="Add">
                    </input>
                </form>

                {this.props.transactions.map((value, index, array) => 
                <Transaction key={index} {...value}></Transaction>
                )}
            </React.Fragment>
        );
    }
}




function mapStateToProps(state){
    return {
        date: state.date,
        categories: state.categories.filter(c => c.dateId === state.date.id),
        items: state.items.filter(i => i.dateId === state.date.id),
        transactions: state.transactions.filter(t => t.dateId === state.date.id),
        createTransaction: state.createTransaction
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...TransactionActions,
        ...CreateTransaction
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionCollection);