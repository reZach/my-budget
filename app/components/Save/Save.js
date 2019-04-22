import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const {dialog} = require('electron').remote;
import * as SaveActions from "../../actions/save";
import * as ModifyActions from "../../actions/modify";
import * as BankSyncActions from "../../actions/bankSync";
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import * as ItemCollectionActions from "../../actions/itemCollection";
import * as TransactionCollectionActions from "../../actions/transactionCollection";
import * as PendingImportActions from "../../actions/pendingImport";
import * as ImportTransactionsOptionsActions from "../../actions/importTransactionsOptions";
import styles from "./Save.css";
import { bankSyncFetch } from "../../utils/banksync";
import ImportBank from "../ImportBank/ImportBank";

class Save extends Component<Props>{
    props: Props;

    constructor(){
        super();

        this.state = {
            bankSyncAdd: false,
            importedData: [],
            allImport: true
        };
        this.lock = false;
        this.lockAddItemIds = false;
        this.lockSetItemIds = false;
        this.lockAddTransactions = false;

        this.multi = this.multi.bind(this);
        this.sync = this.sync.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.toggleBankSyncAdd = this.toggleBankSyncAdd.bind(this);
        this.toggleAllImport = this.toggleAllImport.bind(this);
        this.importTransactions = this.importTransactions.bind(this);
        this.thewaytheframeworkworks = this.thewaytheframeworkworks.bind(this);        
    }

    thewaytheframeworkworks(){
        if (this.props.importTransactionsOptions.readyToSetCategoryIds && !this.lock){
            this.lock = true;
            console.log("A");

            let toImport = this.props.pendingImport.filter(pi => pi.toImport);

            // Set [sub]categories
            for (var i = 0; i < toImport.length; i++){

                // default; matches ImportBank.js
                if (toImport[i].categoryName === ""){
                    toImport[i].categoryName = "default";
                }

                if (toImport[i].categoryId === ""){
                    var matched = this.props.categories.filter(c => c.dateId === toImport[i].dateId && c.name === toImport[i].categoryName);

                    toImport[i].categoryId = matched[0].id;
                    this.props.setCategoryId(toImport[i].tempId, toImport[i].categoryId);
                }
            }

            this.props.setReadyToCreateItems(true);
        }
        else if (this.props.importTransactionsOptions.readyToSetCategoryIds &&this.props.importTransactionsOptions.readyToCreateItems && this.lock && !this.lockAddItemIds){
            this.lockAddItemIds = true;

            console.log("B");
            let toImport = this.props.pendingImport.filter(pi => pi.toImport);
            let itemsToAdd = [];

            for (var i = 0; i < toImport.length; i++){

                // default; matches ImportBank.js
                if (toImport[i].itemName === ""){
                    toImport[i].itemName = "default";
                }

                // Assign/create item
                if (toImport[i].itemId === ""){
                    var matching = this.props.items.filter(j => j.dateId === toImport[i].dateId && j.categoryId === toImport[i].categoryId && j.name === toImport[i].itemName);

                    if (matching.length === 0){

                        if (itemsToAdd.length === 0){
                            itemsToAdd.push({
                                dateId: toImport[i].dateId,
                                categoryId: toImport[i].categoryId,
                                itemName: toImport[i].itemName
                            });
                        } else {
                            if (itemsToAdd.filter(j => j.dateId === toImport[i].dateId && j.categoryId === toImport[i].categoryId && j.itemName === toImport[i].itemName).length === 0){
                                itemsToAdd.push({
                                    dateId: toImport[i].dateId,
                                    categoryId: toImport[i].categoryId,
                                    itemName: toImport[i].itemName
                                });
                            } 
                        }
                    }
                }
            }

            for (var i = 0; i < itemsToAdd.length; i++){            
                this.props.addItem2(itemsToAdd[i].dateId, itemsToAdd[i].categoryId, itemsToAdd[i].itemName);
            }

            this.props.setReadyToSetItemIds(true);
        } else if (this.props.importTransactionsOptions.readyToSetCategoryIds &&this.props.importTransactionsOptions.readyToCreateItems && this.props.importTransactionsOptions.readyToSetItemIds && this.lock && this.lockAddItemIds && !this.lockSetItemIds){
            this.lockSetItemIds = true;

            let toImport = this.props.pendingImport.filter(pi => pi.toImport);
            console.log("C");

            // Set -sub-categories
            for (var i = 0; i < toImport.length; i++){

                // default; matches ImportBank.js
                if (toImport[i].itemName === ""){
                    toImport[i].itemName = "default";
                }

                if (toImport[i].itemId === ""){
                    var matched = this.props.items.filter(j => j.dateId === toImport[i].dateId && j.categoryId === toImport[i].categoryId && j.name === toImport[i].itemName);

                    if (matched.length === 0){
                        debugger;
                    }
                    toImport[i].itemId = matched[0].id;
                    this.props.setItemId(toImport[i].tempId, toImport[i].itemId);
                }
            }

            this.props.setReadyToImport(true); 
        } else if (this.props.importTransactionsOptions.readyToSetCategoryIds &&this.props.importTransactionsOptions.readyToCreateItems && this.props.importTransactionsOptions.readyToSetItemIds && this.props.importTransactionsOptions.readyToImport && this.lock && this.lockAddItemIds && this.lockSetItemIds && !this.lockAddTransactions){                          
            this.lockAddTransactions = true;
            let toImport = this.props.pendingImport.filter(pi => pi.toImport);    
            console.log("D");        

            // Add transactions
            for (var i = 0; i < toImport.length; i++){

                this.props.addTransaction2(toImport[i].dateId, toImport[i].categoryId, toImport[i].itemId, toImport[i].day, toImport[i].amount, toImport[i].note);
            }

            // Empty pending import collection
            this.props.removeAllImportTransactions();
            this.toggleBankSyncAdd();

            this.props.setReadyToSetCategoryIds(false);
            this.props.setReadyToCreateItems(false);
            this.props.setReadyToSetItemIds(false);
            this.props.setReadyToImport(false); 
        } else if (!this.props.importTransactionsOptions.readyToSetCategoryIds &&!this.props.importTransactionsOptions.readyToCreateItems && !this.props.importTransactionsOptions.readyToSetItemIds && !this.props.importTransactionsOptions.readyToImport && this.lock && this.lockAddItemIds && this.lockSetItemIds && this.lockAddTransactions){                        
            this.lock = false;
            this.lockAddItemIds = false;
            this.lockSetItemIds = false;
            this.lockAddTransactions = false;

            console.log("E");
        }
    }

    multi(event){
        this.props.falseModify();
        this.props.save();        
    }    

    async sync(){
        var imported = await bankSyncFetch(this.props.categories, this.props.items, "discover", "", "");
        
        for (var i = 0; i < imported.length; i++){
            this.props.addImportTransaction(imported[i].tempId, imported[i].toImport, imported[i].dateId, imported[i].categoryId, imported[i].categoryName, imported[i].itemId, imported[i].itemName, imported[i].day, imported[i].amount, imported[i].note, imported[i].overwriteCategoryName, imported[i].overwriteItemName, imported[i].overwriteNote);
        }
        this.props.sortImportTransactions();
        
        this.setState({
            bankSyncAdd: true
        });
    }

    export(event){
        dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
    }

    importTransactions(){        
        let toImport = this.props.pendingImport.filter(pi => pi.toImport);

        let categoriesToAdd = [];
        
        let toCreate = [];

        for (var i = 0; i < toImport.length; i++){

            // default; matches ImportBank.js
            if (toImport[i].categoryName === ""){
                toImport[i].categoryName = "default";
            }

            // Assign/create category 
            if (toImport[i].categoryId === ""){
                var matching = this.props.categories.filter(c => c.dateId === toImport[i].dateId && c.name === toImport[i].categoryName);

                if (matching.length === 0){
                    
                    if (categoriesToAdd.length === 0){
                        categoriesToAdd.push({
                            dateId: toImport[i].dateId,
                            categoryName: toImport[i].categoryName
                        });
                    } else {
                        if (categoriesToAdd.filter(c => c.dateId === toImport[i].dateId && c.categoryName === toImport[i].categoryName).length === 0){
                            categoriesToAdd.push({
                                dateId: toImport[i].dateId,
                                categoryName: toImport[i].categoryName
                            });
                        }
                    }                                        
                }
            }                      
        }

        // Bulk add categories
        for (var i = 0; i < categoriesToAdd.length; i++){            
            this.props.addCategory2(categoriesToAdd[i].dateId, categoriesToAdd[i].categoryName);
        }

        // Since redux updates the store sync, but react updates
        // the component async, we can't guarantee that our component
        // has the updates we made above.
        // So we also update a temp value in the redux store, and continue
        // with our logic in the componentDidUpdate() method
        this.props.setReadyToSetCategoryIds(true);
    }

    toggleBankSyncAdd(event){
        let newState = !this.state.bankSyncAdd;

        this.setState({
            bankSyncAdd: newState
        });
    }

    toggleAllImport(){
        let current = this.state.allImport;
        this.setState({
            allImport: !current
        });
        this.props.modifyAllImportCheckbox(!current);
    }

    deleteAll(event){
        
        dialog.showMessageBox({
            title: "delete data",
            type: "warning",
            buttons: ["Yes", "No"],
            message: "are you sure you want to delete everything? we can't recover it if you do."
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.deleteAll();                
            }
        });
    }

    renderBankSync(){
        if (this.state.bankSyncAdd && this.props.pendingImport.length > 0){
            return (
                <div className="modal active" id="modal-id">
                    <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                    <div className={`modal-container modal-large`}>
                        <div className={`modal-header ${styles.h62}`}>
                            <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                            <div className="modal-title h5">import transactions</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                {/* Header for the table */}
                                <div className={`columns ${styles.h48}`}>
                                    <div className="column col-1">
                                        <div>import</div>
                                    </div>                    
                                    <div className="column col-1">
                                        date
                                    </div>
                                    <div className="column col-1">
                                        amount
                                    </div>
                                    <div className="column col-2">
                                        category
                                    </div>
                                    <div className="column col-2">
                                        sub-category
                                    </div>
                                    <div className={`column col-5`}>
                                        note
                                    </div>
                                </div>
                                <div className={`${styles.hrest}`}>
                                {this.props.pendingImport.map((value, index, array) => {
                                    return <ImportBank key={index} value={index} {...value} defaultCategory={value.categoryName !== "" ? value.categoryName : "default"} defaultItem={value.itemName !== "" ? value.itemName : "default"} defaultNote={value.note} />
                                })}
                                </div>                                
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="column col-12">
                                <div className="form-group float-left">
                                    <input className="btn" type="button" value="toggle import all" onClick={() => this.toggleAllImport()}></input>
                                </div>
                                <div className="form-group float-right">
                                    <button className="btn btn-primary" onClick={() => this.importTransactions()}>import</button>
                                    <button className="btn" onClick={() => this.toggleBankSyncAdd()}>cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.thewaytheframeworkworks()}
                </div>
            );
        }
    }

    render(){
        return (
            <React.Fragment>
                <div className="columns">
                    <div className={`column col-12 ${styles['btn-fix']}`}>
                        <button className={`btn btn-primary ${styles['some-mr']}`} type="button" data-tooltip="saves pending changes" disabled={!this.props.modified} onClick={() => this.multi()}>save</button>
                        <button className={`btn btn-primary tooltip tooltip-top ${styles['some-mr']}`} data-tooltip="syncs transactions from banks" type="button" onClick={() => this.sync()}>sync</button>
                        <button className={`btn btn-error`} type="button" data-tooltip="deletes all data" onClick={() => this.deleteAll()}>delete</button>
                    </div>
                </div>
                {this.renderBankSync()}                
            </React.Fragment>
        );
    }
}



function mapStateToProps(state){    
    return {
        modified: state.modified,
        bankSync: state.bankSync,
        categories: state.categories,
        items: state.items,
        pendingImport: state.pendingImport,
        importTransactionsOptions: state.importTransactionsOptions
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...SaveActions,
        ...ModifyActions,
        ...BankSyncActions,
        ...CategoryCollectionActions,
        ...ItemCollectionActions,
        ...TransactionCollectionActions,
        ...PendingImportActions,
        ...ImportTransactionsOptionsActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Save);