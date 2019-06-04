import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as TransactionActions from "../../actions/transactionCollection";
import * as CreateTransaction from "../../actions/createTransaction";
import * as ModifyActions from "../../actions/modify";
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import styles from "./TransactionCollection.css";
import Transaction from "../Transaction/Transaction";

const {dialog} = require('electron').remote;

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
        const newValue = event.target.value;
        if (newValue.match(/^$/) !== null ||
            newValue.match(/^\d+\.?\d?\d?$/) !== null){
            this.props.modifyAmount(newValue);
        } else {
            this.props.modifyAmount(this.props.createTransaction.amount);
        }
    }

    modifyDay(event){
        const day = event.target.value;
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
        const category = this.props.categories.find(c => c.name === event.target.value);
        
        const newCategoryId = (typeof category !== "undefined") ? category.id : "";

        // find item
        let item = "";
        let newItemId = "";
        if (this.props.items.length > 0){
            const exists = this.props.items.sort((a, b) => {
                const a1 = a.name.toLowerCase();
                const b1 = b.name.toLowerCase();
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
        const item = this.props.items.find(i => i.categoryId === this.props.createTransaction.selectedCategoryId && i.name === event.target.value);

        if (typeof item !== "undefined"){
            this.props.modifySelectedItem(item.id, item.name);
        } else {
            this.props.modifySelectedItem("", "");
        }
    }

    createNewTransaction(){
        this.props.addTransaction(this.props.createTransaction.selectedCategoryId, 
            this.props.createTransaction.selectedItemId, this.props.createTransaction.day, this.props.createTransaction.amount, this.props.createTransaction.note);

        // Recalculate spent for all categories in the same month
        for (let i = 0; i < this.props.categories.length; i++){
            this.props.recalculateCategorySpent(this.props.date.id, this.props.categories[i].id); 
        }

        this.props.resetCreateNewTransaction();
        this.props.trueModify();
    }

    deleteTransaction(categoryId: string, itemId: string, transactionId: string, amount: number){

        dialog.showMessageBox({
            title: "Delete transaction",
            type: "warning",
            buttons: ["Yes", "No"],
            message: `Are you sure you want to delete this transaction of $${amount}?`
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
            title: "Delete all transactions",
            type: "warning",
            buttons: ["Yes", "No"],
            message: `Are you sure you want to delete all transactions for this month?`
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.removeAllTransactions();
                this.props.trueModify();
            }
        });
    }

    createCategoriesDropDown(){
        const {categories} = this.props;
        return categories.sort((a, b) => {
            const a1 = a.name.toLowerCase();
            const b1 = b.name.toLowerCase();
            if (a1 > b1) return 1;
            if (a1 < b1) return -1;
            return 0;            
        }).map((category) =>
            <option key={`${category.dateId}.${category.id}.${category.name}`} value={category.name}>{category.name}</option>
        );
    }

    createItemsDropDown(){
        const {items} = this.props;
        return items.filter(i => i.categoryId === this.props.createTransaction.selectedCategoryId).sort((a, b) => {
            const a1 = a.name.toLowerCase();
            const b1 = b.name.toLowerCase();
            if (a1 > b1) return 1;
            if (a1 < b1) return -1;
            return 0;
        }).map((item) => 
            <option key={`${item.dateId}.${item.id}.${item.name}`} value={item.name}>{item.name}</option>
        );
    }

    render() {
        const { t } = this.props;

        return (
            <div className={`${styles.h100}`}>
                <div className={`${styles.h350}`}>
                    <div className="columns">
                        <div className="column col-12 text-left">
                            <form className="form-horizontal" onSubmit={() => this.createNewTransaction()}>
                                <div className="form-group">
                                    <div className="col-4">
                                        <span className="form-label">{t("Category")}</span>
                                    </div>
                                    <div className="col-8">
                                        <select className="form-select" value={this.props.createTransaction.selectedCategory} onChange={this.modifyCategory}>
                                            <option value="">---</option>
                                            {this.createCategoriesDropDown()}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-4">
                                        <span className="form-label">{t("SubHypencategory")}</span>
                                    </div>
                                    <div className="col-8">
                                        <select className="form-select" value={this.props.createTransaction.selectedItem} onChange={this.modifyItem}>
                                            <option value="">---</option>
                                            {this.createItemsDropDown()}  
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-4">
                                        <label className="form-label" htmlFor="transaction-create-amount">{t("Amount")}</label>
                                    </div>
                                    <div className="col-8">
                                        <input className="form-input" id="transaction-create-amount" type="text" placeholder={t("amount")} value={this.props.createTransaction.amount} onChange={this.modifyAmount} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-4">
                                        <label className="form-label" htmlFor="transaction-create-date">{t("Date")}</label>
                                    </div>
                                    <div className="col-8">
                                        <input className="form-input" id="transaction-create-date" type="number" placeholder={t("date")} value={this.props.createTransaction.day} onChange={this.modifyDay} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-4">
                                        <label className="form-label" htmlFor="transaction-create-note">{t("Note")}</label>
                                    </div>
                                    <div className="col-8">
                                        <input className="form-input" id="transaction-create-note" type="text" placeholder={t("note")} value={this.props.createTransaction.note} onChange={this.modifyNote} />
                                    </div>
                                </div>
                                <div className="column col-12">
                                    <div className={`form-group float-left ${styles["delete-all-btn"]}`}>
                                        <input className="btn btn-lg btn-error" type="button" value={t("DeleteAll")} onClick={() => this.deleteAllTransactions()} disabled={this.props.transactions.length <= 0} />
                                    </div>
                                    <div className={`form-group float-right ${styles["add-new-btn"]}`}>
                                        <input className="btn btn-lg btn-primary" type="submit" disabled={this.props.createTransaction.selectedCategoryId === "" || this.props.createTransaction.selectedItemId === "" || this.props.createTransaction.amount === ""} value={t("addNew")} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>                
                <div className={`${styles['transaction-container']}`}>
                    {this.props.transactions.sort((a, b) => {
                        
                        if (a.day > b.day) return 1;
                        if (b.day > a.day) return -1;                        
                        return 0;
                    }).map((value) => 
                        <Transaction key={`${value.dateId}-${value.id}-${value.amount}`} {...value} delete={this.deleteTransaction} />
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
        ...ModifyActions,
        ...CategoryCollectionActions
    }, dispatch);
}

const translatedComponent = withTranslation()(TransactionCollection);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translatedComponent);