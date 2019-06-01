import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Fuse from "fuse.js";
import { withTranslation } from "react-i18next";
import * as SaveActions from "../../actions/save";
import * as ModifyActions from "../../actions/modify";
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import * as ItemCollectionActions from "../../actions/itemCollection";
import * as TransactionCollectionActions from "../../actions/transactionCollection";
import * as PendingImportActions from "../../actions/pendingImport";
import * as ImportTransactionsOptionsActions from "../../actions/importTransactionsOptions";
import styles from "./Save.css";
import bankSyncFetch from "../../utils/banksync";
import ImportBank from "../ImportBank/ImportBank";
import filehelper from "../../utils/filehelper";
import * as crypto from "../../crypto/code";
import { dateToMMDDYYYY } from "../../utils/readableDate";

const {dialog} = require('electron').remote;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

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
            allImport: true,
            exportModalActive: false
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
        this.toggleExportModal = this.toggleExportModal.bind(this);
        this.moveToStep = this.moveToStep.bind(this);
        this.toggleAllImport = this.toggleAllImport.bind(this);
        this.importTransactions = this.importTransactions.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.onFuzzyChange = this.onFuzzyChange.bind(this);
        this.handleFuzzySearch = this.handleFuzzySearch.bind(this);
        this.fuzzySelectChange = this.fuzzySelectChange.bind(this);
        this.dothemagic = this.dothemagic.bind(this);
        this.exportCSV = this.exportCSV.bind(this);
        this.thewaytheframeworkworks = this.thewaytheframeworkworks.bind(this);        
    }

    componentDidUpdate(){
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

            const toImport = this.props.pendingImport.filter(pi => pi.toImport);

            // Set [sub]categories
            for (let i = 0; i < toImport.length; i++){

                // default; matches ImportBank.js
                if (toImport[i].categoryName === ""){
                    toImport[i].categoryName = "default";
                }

                if (toImport[i].categoryId === ""){
                    const matched = this.props.categories.filter(c => c.dateId === toImport[i].dateId && c.name === toImport[i].categoryName);

                    toImport[i].categoryId = matched[0].id;
                    this.props.setCategoryId(toImport[i].tempId, toImport[i].categoryId);
                }
            }

            this.props.setReadyToCreateItems(true);
        }
        else if (this.props.importTransactionsOptions.readyToSetCategoryIds &&this.props.importTransactionsOptions.readyToCreateItems && this.lock && !this.lockAddItemIds){
            this.lockAddItemIds = true;
            
            const toImport = this.props.pendingImport.filter(pi => pi.toImport);
            const itemsToAdd = [];

            for (let i = 0; i < toImport.length; i++){

                // default; matches ImportBank.js
                if (toImport[i].itemName === ""){
                    toImport[i].itemName = "default";
                }

                // Assign/create item
                if (toImport[i].itemId === ""){
                    const matching = this.props.items.filter(j => j.dateId === toImport[i].dateId && j.categoryId === toImport[i].categoryId && j.name === toImport[i].itemName);

                    if (matching.length === 0){

                        if (itemsToAdd.length === 0){
                            itemsToAdd.push({
                                dateId: toImport[i].dateId,
                                categoryId: toImport[i].categoryId,
                                itemName: toImport[i].itemName
                            });
                        } else if (itemsToAdd.filter(j => j.dateId === toImport[i].dateId && j.categoryId === toImport[i].categoryId && j.itemName === toImport[i].itemName).length === 0){
                                itemsToAdd.push({
                                    dateId: toImport[i].dateId,
                                    categoryId: toImport[i].categoryId,
                                    itemName: toImport[i].itemName
                                });
                            }
                    }
                }
            }

            for (let i = 0; i < itemsToAdd.length; i++){            
                this.props.addItem2(itemsToAdd[i].dateId, itemsToAdd[i].categoryId, itemsToAdd[i].itemName);
            }

            this.props.setReadyToSetItemIds(true);
        } else if (this.props.importTransactionsOptions.readyToSetCategoryIds &&this.props.importTransactionsOptions.readyToCreateItems && this.props.importTransactionsOptions.readyToSetItemIds && this.lock && this.lockAddItemIds && !this.lockSetItemIds){
            this.lockSetItemIds = true;

            const toImport = this.props.pendingImport.filter(pi => pi.toImport);            

            // Set -sub-categories
            for (let i = 0; i < toImport.length; i++){

                // default; matches ImportBank.js
                if (toImport[i].itemName === ""){
                    toImport[i].itemName = "default";
                }

                if (toImport[i].itemId === ""){
                    const matched = this.props.items.filter(j => j.dateId === toImport[i].dateId && j.categoryId === toImport[i].categoryId && j.name === toImport[i].itemName);

                    if (matched.length === 0){
                        // ?
                    }
                    toImport[i].itemId = matched[0].id;
                    this.props.setItemId(toImport[i].tempId, toImport[i].itemId);
                }
            }

            this.props.setReadyToImport(true); 
        } else if (this.props.importTransactionsOptions.readyToSetCategoryIds &&this.props.importTransactionsOptions.readyToCreateItems && this.props.importTransactionsOptions.readyToSetItemIds && this.props.importTransactionsOptions.readyToImport && this.lock && this.lockAddItemIds && this.lockSetItemIds && !this.lockAddTransactions){                          
            this.lockAddTransactions = true;
            const toImport = this.props.pendingImport.filter(pi => pi.toImport);    

            // Add transactions
            for (let i = 0; i < toImport.length; i++){

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

    multi(){
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
            const imported = await bankSyncFetch(this.props.categories, this.state.selectedBank, this.state.username, this.state.password);
                    
            for (let i = 0; i < imported.length; i++){
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

        // eslint complained about this...
        this.setState(state => ({
            fuzzyResults: (new Fuse(state.validBanks, this.fuzzyOptions)).search(value)
        }));
    }

    fuzzySelectChange(event){        
        const value = event.target.selectedOptions[0].getAttribute("id");
        this.setState({
            selectedBank: value
        });        
    }

    export(){
        const { t } = this.props;

        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const year = today.getFullYear();

        const callback = function callback(filename){
            if (typeof filename !== "undefined"){

                try
                {                    

                    let fileContents = filehelper.get();

                    if (fileContents !== ""){
                        if (crypto.cryptoAvailable() && this.props.passphrase !== ""){
                            const decrypted = crypto.decrypt(fileContents, this.props.passphrase);
                                                        
                            fileContents = JSON.parse(decrypted);
                        } else {
                            fileContents = JSON.parse(fileContents);
                        }

                        // reset passphrase
                        fileContents.passphrase = "";

                        this.toggleExportModal();
                        fs.writeFile(filename, JSON.stringify(fileContents), "utf-8", () => {
                            alert(t("exportedDataSuccessfullyPeriod"));
                        });
                    } else {
                        this.toggleExportModal();
                        alert(t("noDataIsSavedTryAgainPeriod"));
                    }  
                }
                catch (exception){
                    this.toggleExportModal();
                    alert(t("couldNotExportDataPeriod"));
                }                                 
            }
        };
        const boundCallback = callback.bind(this);

        dialog.showSaveDialog(
            { 
                title: t("exportData"),
                defaultPath: `mybudgetdata_${year}${month}${day}.json`
            },
            boundCallback
        );
    }

    exportCSV(){
        const { t } = this.props;

        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const year = today.getFullYear();

        const callback = function(filename){
            if (typeof filename !== "undefined"){

                try
                {                    
                    const csvWriter = createCsvWriter({
                        path: filename,
                        header: [
                            {id: "date", title: t("Date")},
                            {id: "category", title: t("Category")},
                            {id: "subcategory", title: t("Subcategory")},
                            {id: "amount", title: t("Amount")},
                            {id: "note", title: t("Note")}
                        ]
                    });
            
                    const csvRecords = [];
            
                    for (let i = 0; i < this.props.transactions.length; i++){
                        let category = "";
                        let subcategory = "";
            
                        for (let j = 0; j < this.props.categories.length; j++){
                            if (this.props.transactions[i].dateId === this.props.categories[j].dateId &&
                                this.props.transactions[i].categoryId === this.props.categories[j].id){
                                    category = this.props.categories[j].name;
                                    break;
                                }
                        }
                        for (let j = 0; j < this.props.items.length; j++){
                            if (this.props.transactions[i].dateId === this.props.items[j].dateId &&
                                this.props.transactions[i].categoryId === this.props.items[j].categoryId &&
                                this.props.transactions[i].itemId === this.props.items[j].id){
                                    subcategory = this.props.items[j].name;
                                    break;
                                }
                        }
            
                        const split = this.props.transactions[i].dateId.split("-");
            
                        csvRecords.push({
                            date: dateToMMDDYYYY(split[0], this.props.transactions[i].day, split[1]),
                            category,
                            subcategory,
                            amount: parseFloat(this.props.transactions[i].amount),
                            note: this.props.transactions[i].note
                        });
                    }
            
                    csvRecords.sort((a, b) => {
                                                                    
                        const split1 = a.date.split('/');
                        const split2 = b.date.split('/');
                        const m1 = split1[0];
                        const d1 = split1[1];
                        const y1 = split1[2];
                        const m2 = split2[0];
                        const d2 = split2[1];
                        const y2 = split2[2];
            
                        if (y1 > y2){
                            return 1;
                        } if (y2 > y1) {
                            return -1;
                        } if (m1 > m2) {
                            return 1;
                        } if (m2 > m1) {
                            return -1;
                        } if (d1 > d2) {
                            return 1;
                        } if (d2 > d1) {
                            return -1;
                        }
                        return 0;
                    });
            
                    csvWriter.writeRecords(csvRecords)
                        .then(() => {
                            this.toggleExportModal();
                            alert(t("exportedDataAsCSVSuccessfully"));
                            return true; // eslint
                        })
                        .catch((err) => {
                            console.error(`${t("errorWritingCSVColon")} ${err}`);
                        });
                }
                catch (exception){
                    this.toggleExportModal();
                    alert(`${t("couldNotExportCSVDataPeriod")}`);
                }                                 
            }
        };
        const boundCallback = callback.bind(this);

        dialog.showSaveDialog(
            { 
                title: t("exportDataAsCSV"),
                defaultPath: `mybudgetcsv_${year}${month}${day}.csv`
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
        const toImport = this.props.pendingImport.filter(pi => pi.toImport);

        const categoriesToAdd = [];

        for (let i = 0; i < toImport.length; i++){

            // default; matches ImportBank.js
            if (toImport[i].categoryName === ""){
                toImport[i].categoryName = "default";
            }

            // Assign/create category 
            if (toImport[i].categoryId === ""){
                const matching = this.props.categories.filter(c => c.dateId === toImport[i].dateId && c.name === toImport[i].categoryName);

                if (matching.length === 0){
                    
                    if (categoriesToAdd.length === 0){
                        categoriesToAdd.push({
                            dateId: toImport[i].dateId,
                            categoryName: toImport[i].categoryName
                        });
                    } else if (categoriesToAdd.filter(c => c.dateId === toImport[i].dateId && c.categoryName === toImport[i].categoryName).length === 0){
                            categoriesToAdd.push({
                                dateId: toImport[i].dateId,
                                categoryName: toImport[i].categoryName
                            });
                        }                                        
                }
            }                      
        }

        // Bulk add categories
        for (let i = 0; i < categoriesToAdd.length; i++){            
            this.props.addCategory2(categoriesToAdd[i].dateId, categoriesToAdd[i].categoryName, false);
        }

        // Since redux updates the store sync, but react updates
        // the component async, we can't guarantee that our component
        // has the updates we made above.
        // So we also update a temp value in the redux store, and continue
        // with our logic in the componentDidUpdate() method
        this.props.setReadyToSetCategoryIds(true);
    }

    toggleBankSyncAdd(){
        this.setState((state) => {
            return {bankSyncAdd: !state.bankSyncAdd};                       
        });
    }

    toggleExportModal(){        
        this.setState((state) => {
            return {exportModalActive: !state.exportModalActive};
        });
    }

    toggleAllImport(){
        const current = this.state.allImport;
        this.setState({
            allImport: !current
        });
        this.props.modifyAllImportCheckbox(!current);
    }

    deleteAll(){
        const { t } = this.props;

        dialog.showMessageBox({
            title: t("deleteData"),
            type: "warning",
            buttons: [t("Yes"), t("No")],
            message: t("areYouSureYouWantToDeleteEverythingSaveModule")
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.deleteAll();                
            }
        });
    }

    renderBankSync(){
        if (this.state.bankSyncAdd){
            const { t } = this.props;

            if (this.state.step1){
                return (
                    <div className="modal active" id="modal-id">
                        <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()} />
                        <div className="modal-container">
                            <div className={`modal-header ${styles.h62}`}>
                                <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()} />
                                <div className="modal-title h4">{t("selectABank")}</div>
                            </div>
                            <div className="modal-body">
                                <div className="content">
                                    <div className={`${styles.mb}`}>
                                        {t("importTransactionsFromYourBank")}<br />
                                        {t("bankNotFoundAndGoodWCodeConsider")} <a target="_blank" rel="noopener noreferrer" href="https://github.com/reZach/my-budget/wiki/Creating-a-new-connector">{t("writingAConnector")}</a>.
                                    </div>
                                    <div className="columns">
                                        <div className="column col-12 col-mr-auto">
                                            <div className="form-group">
                                                <input type="text" className="form-input" placeholder={t("search")} onChange={this.onFuzzyChange} value={this.state.searchBank} />
                                                <select className="form-select" onChange={this.fuzzySelectChange}>
                                                    {this.state.fuzzyResults.length == 0 ? <option id="" key="" style={{color: "gray"}}>---</option> : <option id="" key="" style={{color: "gray"}}>{t("parenfoundResults")}</option>}
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
                                            <input type="button" className="btn btn-primary" value={t("next")} onClick={() => this.moveToStep(2)} />
                                        </React.Fragment> : <React.Fragment></React.Fragment>
                                    }
                                </div>                                
                            </div>
                        </div>
                    </div>
                );
            } if (this.state.step2){
                return (
                    <div className="modal active" id="modal-id">
                        <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()} />
                        <div className="modal-container">
                            <div className={`modal-header ${styles.h62}`}>
                                <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()} />
                                <div className="modal-title h5">{t("enterCredentials")}</div>
                            </div>
                            <div className="modal-body">
                                <div className="content">
                                    <div className="columns">
                                        <div className="column col-12">
                                            <div className="columns">
                                                <form className="form-horizontal" style={{width: "100%"}}>
                                                    <div className="form-group">
                                                        <div className="column col-3">
                                                            <label className="form-label" htmlFor="banksync-username-input">{t("Username")}</label>
                                                        </div>
                                                        <div className="column col-9">
                                                            <input className="form-input" id="banksync-username-input" type="text" value={this.state.username} onChange={this.changeUsername} placeholder={t("usernameLowercase")} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="column col-3">
                                                            <label className="form-label" htmlFor="banksync-password-input">{t("Password")}</label>
                                                        </div>
                                                        <div className="column col-9">
                                                            <input className="form-input" id="banksync-password-input" type="password" value={this.state.password} onChange={this.changePassword} placeholder={t("passwordLowercase")} />
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
                                    <input type="button" className="btn" value={t("Back")} onClick={() => this.moveToStep(1)} onKeyUp={() => this.moveToStep(1)} />
                                </div>
                                <div className="float-right text-right">
                                    {this.state.username !== "" && this.state.password !== "" ?
                                        <React.Fragment>
                                            <input className="btn btn-primary" type="submit" value={t("Next")} onClick={() => this.moveToStep(3)} onKeyUp={() => this.moveToStep(3)} />
                                        </React.Fragment> : <React.Fragment></React.Fragment>
                                    }
                                </div>                                
                            </div>
                        </div>
                    </div>
                );
            } if (this.state.step3){
                return (
                    <div className="modal active" id="modal-id">
                        <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()} />
                        <div className="modal-container">
                            <div className={`modal-header ${styles.h62}`}>
                                <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()} />
                                <div className="modal-title h5">{t("loadingTransactions")}</div>
                            </div>
                            <div className="modal-body">
                                <div className="content">
                                    <div className="columns">
                                        <div className="column col-12 text-center">
                                            <div className="loading loading-lg" />
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="float-left text-left">
                                    <input type="button" className="btn" value={t("Back")} onClick={() => this.moveToStep(1)} />
                                </div>                                
                            </div>
                        </div>
                    </div>
                );                
            } if (this.state.step4 && this.props.pendingImport.length > 0){
                return (
                    <div className="modal active" id="modal-id">
                        <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()} />
                        <div className="modal-container modal-large">
                            <div className={`modal-header ${styles.h62}`}>
                                <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()} />
                                <div className="modal-title h5">{t("importTransactions")}</div>
                            </div>
                            <div className="modal-body">
                                <div className="content">
                                    {/* Header for the table */}
                                    <div className={`columns ${styles.h48}`}>
                                        <div className="column col-1">
                                            <div>{t("Import")}</div>
                                        </div>                    
                                        <div className="column col-1">
                                            {t("Date")}
                                        </div>
                                        <div className="column col-1">
                                            {t("Amount")}
                                        </div>
                                        <div className="column col-2">
                                            {t("Category")}
                                        </div>
                                        <div className="column col-2">
                                            {t("Sub-category")}
                                        </div>
                                        <div className="column col-5">
                                            {t("Note")}
                                        </div>
                                    </div>
                                    <div className={`${styles.hrest}`}>
                                    {this.props.pendingImport.map((value, index) => <ImportBank key={value.tempId} value={index} {...value} defaultCategory={value.categoryName !== "" ? value.categoryName : "default"} defaultItem={value.itemName !== "" ? value.itemName : "default"} defaultNote={value.note} />)}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="column col-12">
                                    <div className="form-group float-left">
                                        <input className="btn" type="button" value={t("toggleImportAll")} onClick={() => this.toggleAllImport()} />
                                    </div>
                                    <div className="form-group float-right">
                                        <button type="button" className="btn btn-primary" onClick={() => this.importTransactions()}>{t("Import")}</button>
                                        <button type="button" className="btn" onClick={() => this.toggleBankSyncAdd()}>{t("Cancel")}</button>
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

    renderExportModal(){
        if (this.state.exportModalActive){
            const { t } = this.props;

            return (
                <div className="modal active" id="modal-id">
                    <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleExportModal()} />
                    <div className="modal-container">
                        <div className={`modal-header ${styles.h62}`}>
                            <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleExportModal()} />
                            <div className="modal-title h4">{t("exportYourData")}</div>
                        </div>
                        <div className="modal-body">
                            <div className="float-left text-left">                                        
                                <input type="button" className="btn btn-primary" value={t("applicationData")} onClick={() => this.export()} />
                            </div>
                            <div className="float-right text-right">
                                <input type="button" className="btn btn-primary" value={t("csv")} onClick={() => this.exportCSV()} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }


    render(){
        const { t } = this.props;
        return (
            <React.Fragment>
                <div className="columns">
                    <div className={`column col-12 ${styles['btn-fix']}`}>
                        <button className={`btn btn-primary ${styles['some-mr']}`} type="button" data-tooltip="saves pending changes" disabled={!this.props.modified} onClick={() => this.multi()}>{t("save")}</button>
                        <button className={`btn btn-primary ${styles['some-mr']}`} data-tooltip="syncs transactions from banks" type="button" onClick={() => this.sync()}>{t("bank")}</button>
                        <button className={`btn btn-primary ${styles['some-mr']}`} data-tooltip="syncs transactions from banks" type="button" onClick={() => this.toggleExportModal()}>{t("export")}</button>
                        <button className="btn btn-error" type="button" data-tooltip="deletes all data" onClick={() => this.deleteAll()}>{t("delete")}</button>
                    </div>
                </div>
                {this.renderBankSync()}  
                {this.renderExportModal()}              
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
        importTransactionsOptions: state.importTransactionsOptions,
        transactions: state.transactions
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...SaveActions,
        ...ModifyActions,
        ...CategoryCollectionActions,
        ...ItemCollectionActions,
        ...TransactionCollectionActions,
        ...PendingImportActions,
        ...ImportTransactionsOptionsActions
    }, dispatch);
}

const translatedComponent = withTranslation()(Save);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translatedComponent);