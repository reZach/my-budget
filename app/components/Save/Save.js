import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const {dialog} = require('electron').remote;
import Fuse from "fuse.js";
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
const fs = require("fs");
import filehelper from "../../utils/filehelper";
import * as crypto from "../../crypto/code";

class Save extends Component<Props>{
    props: Props;

    constructor(){
        super();

        this.state = {
            bankSyncAdd: false,
            step1: true,
            step2: false,
            step3: false,
            step4: false,
            username: "",
            password: "",
            validBanks: [
                {
                    name: "discover",
                    url: "www.discover.com"
                }
            ],
            fuzzyResults: [],
            searchBank: "",
            selectedBank: "",
            importedData: [],
            allImport: true
        };
        this.lock = false;
        this.lockAddItemIds = false;
        this.lockSetItemIds = false;
        this.lockAddTransactions = false;
        this.puppeteerLock = false;

        this.fuzzyOptions = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "name",
                "url"
            ]
        }

        this.multi = this.multi.bind(this);
        this.sync = this.sync.bind(this);
        this.export = this.export.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.toggleBankSyncAdd = this.toggleBankSyncAdd.bind(this);
        this.moveToStep = this.moveToStep.bind(this);
        this.toggleAllImport = this.toggleAllImport.bind(this);
        this.importTransactions = this.importTransactions.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.onFuzzyChange = this.onFuzzyChange.bind(this);
        this.handleFuzzySearch = this.handleFuzzySearch.bind(this);
        this.fuzzySelectChange = this.fuzzySelectChange.bind(this);
        this.dothemagic = this.dothemagic.bind(this);
        this.thewaytheframeworkworks = this.thewaytheframeworkworks.bind(this);        
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if (this.state.step3 && !this.puppeteerLock){
            this.dothemagic();
        }
        if (this.state.step4 && this.puppeteerLock){
            this.puppeteerLock = false;
        }
    }

    thewaytheframeworkworks(){
        if (this.props.importTransactionsOptions.readyToSetCategoryIds && !this.lock){
            this.lock = true;            

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
        }
    }

    multi(event){
        this.props.falseModify();
        this.props.save();        
    }    

    sync(){
        this.setState({
            bankSyncAdd: true
        });                        
    }

    async dothemagic(){

        if (!this.puppeteerLock){
            this.puppeteerLock = true;
            var imported = await bankSyncFetch(this.props.categories, this.props.items, this.state.selectedBank, this.state.username, this.state.password);
                    
            for (var i = 0; i < imported.length; i++){
                this.props.addImportTransaction(imported[i].tempId, imported[i].toImport, imported[i].dateId, imported[i].categoryId, imported[i].categoryName, imported[i].itemId, imported[i].itemName, imported[i].day, imported[i].amount, imported[i].note, imported[i].overwriteCategoryName, imported[i].overwriteItemName, imported[i].overwriteNote);
            }
            this.props.sortImportTransactions();
            this.setState({
                step3: false,
                step4: true
            });
        }        
    }

    moveToStep(step){        
        this.setState({
            step1: step === 1,
            step2: step === 2,
            step3: step === 3,
            step4: step === 4
        });
    }

    onFuzzyChange(event){
        this.setState({
            searchBank: event.target.value
        }, () => {
            this.handleFuzzySearch(this.state.searchBank)
        });
    }

    handleFuzzySearch(value){
        const fuse = new Fuse(this.state.validBanks, this.fuzzyOptions);
        this.setState({
            fuzzyResults: fuse.search(value)
        });
    }

    fuzzySelectChange(event){        
        var value = event.target.selectedOptions[0].getAttribute("id");
        this.setState({
            selectedBank: value
        });        
    }

    export(event){
        var today = new Date();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var year = today.getFullYear();

        var callback = function(filename, bookmark){
            if (typeof filename !== "undefined"){

                try
                {
                    var fileContents = filehelper.get();

                    if (fileContents !== ""){
                        if (crypto.cryptoAvailable() && this.props.passphrase !== ""){
                            var decrypted = crypto.decrypt(fileContents, this.props.passphrase);
                                                        
                            fileContents = JSON.parse(decrypted);
                        } else {
                            fileContents = JSON.parse(fileContents);
                        }

                        // reset passphrase
                        fileContents.passphrase = "";

                        fs.writeFile(filename, JSON.stringify(fileContents), "utf-8", function(){
                            alert("Exported data successfully.");
                        });
                    } else {
                        alert("No data is saved, try saving and export again.");
                    }  
                }
                catch (exception){
                    alert("Could not export data.")
                }                                 
            }
        };
        var boundCallback = callback.bind(this);

        dialog.showSaveDialog(
            { 
                title: "Export data",
                defaultPath: `mybudgetdata_${year}${month}${day}.json`
            },
            boundCallback
        );
    }

    changeUsername(event){
        this.setState({
            username: event.target.value
        });
    }

    changePassword(event){
        this.setState({
            password: event.target.value
        });
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
            this.props.addCategory2(categoriesToAdd[i].dateId, categoriesToAdd[i].categoryName, false);
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
            title: "Delete data",
            type: "warning",
            buttons: ["Yes", "No"],
            message: "Are you sure you want to delete everything? We can't recover it if you do. (this does not delete exported data)."
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.deleteAll();                
            }
        });
    }

    renderBankSync(){
        if (this.state.bankSyncAdd){
            if (this.state.step1){
                return (
                    <div className="modal active" id="modal-id">
                        <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                        <div className={`modal-container`}>
                            <div className={`modal-header ${styles.h62}`}>
                                <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                                <div className="modal-title h4">Select a bank</div>
                            </div>
                            <div className="modal-body">
                                <div className="content">
                                    <div className={`${styles.mb}`}>
                                        Import transactions from your bank.<br />
                                        Bank not found and you are good with code? Consider <a target="_blank" href={"https://github.com/reZach/my-budget/wiki/Creating-a-new-connector"}>writing a connector</a>.
                                    </div>
                                    <div className="columns">
                                        <div className="column col-12 col-mr-auto">
                                            <div className="form-group">
                                                <input type="text" className="form-input" placeholder="search" onChange={this.onFuzzyChange} value={this.state.searchBank}></input>
                                                <select className="form-select" onChange={this.fuzzySelectChange}>
                                                    {this.state.fuzzyResults.length == 0 ? <option id="" key="" style={{color: "gray"}}>---</option> : <option id="" key="" style={{color: "gray"}}>(found result/s)</option>}
                                                    {this.state.fuzzyResults.map((result) => <option id={result.name} key={result.url} selected={this.state.selectedBank === result.name}>{result.name} - ({result.url})</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="float-right text-right">
                                    {this.state.selectedBank !== ""  ?
                                        <React.Fragment>
                                            <input type="button" className="btn btn-primary" value="Next" onClick={() => this.moveToStep(2)}></input>
                                        </React.Fragment> : <React.Fragment></React.Fragment>
                                    }
                                </div>                                
                            </div>
                        </div>
                    </div>
                );
            } else if (this.state.step2){
                return (
                    <div className="modal active" id="modal-id">
                        <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                        <div className={`modal-container`}>
                            <div className={`modal-header ${styles.h62}`}>
                                <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                                <div className="modal-title h5">Enter credentials</div>
                            </div>
                            <div className="modal-body">
                                <div className="content">
                                    <div className="columns">
                                        <div className="column col-12">
                                            <div className="columns">
                                                <form className="form-horizontal" style={{width: "100%"}}>
                                                    <div className="form-group">
                                                        <div className="column col-3">
                                                            <label className="form-label">Username</label>
                                                        </div>
                                                        <div className="column col-9">
                                                            <input className="form-input" type="text" value={this.state.username} onChange={this.changeUsername} placeholder="username"></input>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="column col-3">
                                                            <label className="form-label">Password</label>
                                                        </div>
                                                        <div className="column col-9">
                                                            <input className="form-input" type="password" value={this.state.password} onChange={this.changePassword} placeholder="password"></input>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="float-left text-left">                                        
                                    <input type="button" className="btn" value="Back" onClick={() => this.moveToStep(1)}></input>
                                </div>
                                <div className="float-right text-right">
                                    {this.state.username !== "" && this.state.password !== "" ?
                                        <React.Fragment>
                                            <input className="btn btn-primary" type="submit" value="Next" onClick={() => this.moveToStep(3)}></input>
                                        </React.Fragment> : <React.Fragment></React.Fragment>
                                    }
                                </div>                                
                            </div>
                        </div>
                    </div>
                );
            } else if (this.state.step3){
                return (
                    <div className="modal active" id="modal-id">
                        <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                        <div className={`modal-container`}>
                            <div className={`modal-header ${styles.h62}`}>
                                <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                                <div className="modal-title h5">Loading transactions</div>
                            </div>
                            <div className="modal-body">
                                <div className="content">
                                    <div className="columns">
                                        <div className="column col-12 text-center">
                                            <div className="loading loading-lg"></div>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="float-left text-left">
                                    <input type="button" className="btn" value="Back" onClick={() => this.moveToStep(1)}></input>
                                </div>                                
                            </div>
                        </div>
                    </div>
                );                
            } else if (this.state.step4 && this.props.pendingImport.length > 0){
                return (
                    <div className="modal active" id="modal-id">
                        <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                        <div className={`modal-container modal-large`}>
                            <div className={`modal-header ${styles.h62}`}>
                                <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                                <div className="modal-title h5">Import transactions</div>
                            </div>
                            <div className="modal-body">
                                <div className="content">
                                    {/* Header for the table */}
                                    <div className={`columns ${styles.h48}`}>
                                        <div className="column col-1">
                                            <div>Import</div>
                                        </div>                    
                                        <div className="column col-1">
                                            Date
                                        </div>
                                        <div className="column col-1">
                                            Amount
                                        </div>
                                        <div className="column col-2">
                                            Category
                                        </div>
                                        <div className="column col-2">
                                            Sub-category
                                        </div>
                                        <div className={`column col-5`}>
                                            Note
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
                                        <input className="btn" type="button" value="Toggle import all" onClick={() => this.toggleAllImport()}></input>
                                    </div>
                                    <div className="form-group float-right">
                                        <button className="btn btn-primary" onClick={() => this.importTransactions()}>Import</button>
                                        <button className="btn" onClick={() => this.toggleBankSyncAdd()}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.thewaytheframeworkworks()}
                    </div>
                );
            }
        }
    }

    render(){
        return (
            <React.Fragment>
                <div className="columns">
                    <div className={`column col-12 ${styles['btn-fix']}`}>
                        <button className={`btn btn-primary ${styles['some-mr']}`} type="button" data-tooltip="saves pending changes" disabled={!this.props.modified} onClick={() => this.multi()}>Save</button>
                        <button className={`btn btn-primary ${styles['some-mr']}`} data-tooltip="syncs transactions from banks" type="button" onClick={() => this.sync()}>Bank</button>
                        <button className={`btn btn-primary ${styles['some-mr']}`} data-tooltip="syncs transactions from banks" type="button" onClick={() => this.export()}>Export</button>
                        <button className={`btn btn-error`} type="button" data-tooltip="deletes all data" onClick={() => this.deleteAll()}>Delete</button>
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
        passphrase: state.passphrase,
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