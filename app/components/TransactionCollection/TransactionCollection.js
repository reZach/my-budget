import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const {dialog} = require('electron').remote;
import * as TransactionActions from "../../actions/transactionCollection";
import * as CreateTransaction from "../../actions/createTransaction";
import * as ModifyActions from "../../actions/modify";
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
        this.deleteTransaction = this.deleteTransaction.bind(this);
        this.deleteAllTransactions = this.deleteAllTransactions.bind(this);
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
            var exists = this.props.items.sort(function(a, b){
                var a1 = a.name.toLowerCase();
                var b1 = b.name.toLowerCase();
                if (a1 > b1) return 1;
                if (a1 < b1) return -1;
                return 0;
            }).find(i => i.categoryId === newCategoryId);

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
        this.props.trueModify();
    }

    deleteTransaction(categoryId: string, itemId: string, transactionId: string, amount: number){

        dialog.showMessageBox({
            title: "delete transaction",
            type: "warning",
            buttons: ["Yes", "No"],
            message: `are you sure you want to delete this transaction of $${amount}?`
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.removeTransaction(categoryId, itemId, transactionId);
                this.props.trueModify();
            }
        });        
    }

    deleteAllTransactions(){
        dialog.showMessageBox({
            title: "delete all transactions",
            type: "warning",
            buttons: ["Yes", "No"],
            message: `are you sure you want to delete all transactions for this month?`
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.removeAllTransactions();
                this.props.trueModify();
            }
        });
    }

    createCategoriesDropDown(){
        let categories = this.props.categories;
        return categories.sort(function(a, b){
            var a1 = a.name.toLowerCase();
            var b1 = b.name.toLowerCase();
            if (a1 > b1) return 1;
            if (a1 < b1) return -1;
            return 0;            
        }).map((category) =>
            <option key={`${category.dateId}.${category.id}.${category.name}`} value={category.name}>{category.name}</option>
        );
    }

    createItemsDropDown(){
        let items = this.props.items;
        return items.filter(i => i.categoryId === this.props.createTransaction.selectedCategoryId).sort(function(a, b){
            var a1 = a.name.toLowerCase();
            var b1 = b.name.toLowerCase();
            if (a1 > b1) return 1;
            if (a1 < b1) return -1;
            return 0;
        }).map((item) => 
            <option key={`${item.dateId}.${item.id}.${item.name}`} value={item.name}>{item.name}</option>
        );
    }

    render() {
        return (
            <div className={`${styles.h100}`}>
                <div className={`${styles.h350}`}>
                    <div className="columns">
                        <div className="column col-12 text-left">
                            <h2>transactions</h2>
                        </div>
                    </div>
                    <div className={`columns`}>
                        <div className="column col-12 text-left">
                            <form className="form-horizontal" onSubmit={() => this.createNewTransaction()}>
                                <div className="form-group">
                                    <div className="col-3">category</div>
                                    <div className="col-9">
                                        <select className="form-select" value={this.props.createTransaction.selectedCategory} onChange={this.modifyCategory}>
                                            <option value="">---</option>
                                            {this.createCategoriesDropDown()}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-3">sub-category</div>
                                    <div className="col-9">
                                        <select className="form-select" value={this.props.createTransaction.selectedItem} onChange={this.modifyItem}>
                                            <option value="">---</option>
                                            {this.createItemsDropDown()}  
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-3">amount</div>
                                    <div className="col-9">
                                        <input className="form-input" type="text" placeholder="amount" value={this.props.createTransaction.amount} onChange={this.modifyAmount}></input>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-3">date</div>
                                    <div className="col-9">
                                        <input className="form-input" type="number" placeholder="date" value={this.props.createTransaction.day} onChange={this.modifyDay}></input>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-3">note</div>
                                    <div className="col-9">
                                        <input className="form-input" type="text" placeholder="note" value={this.props.createTransaction.note} onChange={this.modifyNote}></input>
                                    </div>
                                </div>
                                <div className="column col-12">
                                    <div className="form-group float-left">
                                        <input className="btn btn-lg btn-error" type="button" value="delete all" onClick={() => this.deleteAllTransactions()} disabled={this.props.transactions.length <= 0}></input>
                                    </div>
                                    <div className="form-group float-right">
                                        <input className="btn btn-lg btn-primary" type="submit" disabled={this.props.createTransaction.selectedCategoryId === "" || this.props.createTransaction.selectedItemId === "" || this.props.createTransaction.amount === ""} value="add new"></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>                
                <div className={`${styles['transaction-container']}`}>
                    {this.props.transactions.sort(function(a, b){
                        
                        if (a.day > b.day) return 1;
                        if (b.day > a.day) return -1;                        
                        return 0;
                    }).map((value, index, array) => 
                        <Transaction key={index} {...value} delete={this.deleteTransaction}></Transaction>
                    )}
                </div>                                
            </div>
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
        ...CreateTransaction,
        ...ModifyActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionCollection);