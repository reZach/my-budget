import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./Entry.css";
import { Redirect } from "react-router";
const {dialog} = require('electron').remote;
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import * as ItemCollectionActions from "../../actions/itemCollection";
import * as TransactionCollectionActions from "../../actions/transactionCollection";
import * as PassphraseActions from "../../actions/passphrase";
import * as IncomeRecordActions from "../../actions/incomeRecords";
import * as ModifyActions from "../../actions/modify";
import * as IncomeActions from "../../actions/income";
import * as SaveActions from "../../actions/save";
import * as BankSyncActions from "../../actions/bankSync";
const fs = require("fs");
import filehelper from "../../utils/filehelper";
import * as crypto from "../../crypto/code";

class Entry extends Component<Props>{
    props: Props;

    constructor(){
        super();        

        this.state = {
            passphrase: "",
            dataImported: false,
            dataToImport: "",
            goHome: false,
            importedModal: false
        };

        this.changePassphrase = this.changePassphrase.bind(this);
        this.go = this.go.bind(this);
        this.importData = this.importData.bind(this);
        this.emptyImport = this.emptyImport.bind(this);
        this.closeImportModal = this.closeImportModal.bind(this);
        this.resetData = this.resetData.bind(this);
        this.fixBug = this.fixBug.bind(this);
        this.changePassphraseModal = this.changePassphraseModal.bind(this);
    }

    changePassphrase(event){
        this.setState({
            passphrase: event.target.value
        });        
    }

    resetData(event){
        dialog.showMessageBox({
            title: "Delete data",
            type: "warning",
            buttons: ["Yes", "No"],
            message: "Are you sure you want to delete all data?"
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.deleteAll(true);
                this.setState({
                    passphrase: ""
                });

                alert("Deleted all data.");                
            }
        });
    }

    closeImportModal(){
        this.setState({
            importedModal: false
        });
    }

    go(event){
        var date: Date = (new Date());
        var month: string = date.getMonth() + 1;
        var year: string = date.getFullYear();

        var success = false;
        var fileContents;
        var localpath = filehelper.localpath();
        try
        {
            var hash = this.props.setPassphrase(this.state.passphrase);

            // Create file if not exist
            if (!filehelper.exists()){

                filehelper.setSync("", function(error){
                    if (error){
                        console.error("could not write new key");
                    }
                });
            }
            
            if (!this.state.dataImported){
                fileContents = filehelper.get();

                if (fileContents !== ""){
                    if (crypto.cryptoAvailable() && hash !== ""){
                        var decrypted = crypto.decrypt(fileContents, hash);
        
                        success = true;
                        fileContents = JSON.parse(decrypted);
                    } else {
                        success = true;
                        fileContents = JSON.parse(fileContents);
                    }
                } 
            } else {
                fileContents = JSON.parse(this.state.dataToImport);            
                success = true;
            }
                       

            // set everything in the store
            let setModify = success && fileContents.modified;
            if (setModify){
                this.props.trueModify();
            } else {
                this.props.falseModify();
            }

            // OLD income object
            let setIncome = [{
                id: "1",
                dateId: `${month}-${year}`,
                amount: 0
            }];
            if (success){
                setIncome = fileContents.income;
            }
            this.props.entryIncome(setIncome);


            // NEW income object
            let setNewIncome = [];
            if (success){
                setNewIncome = fileContents.incomeRecords;
            }
            this.props.entryIncomeRecords(setNewIncome);

            let setCategories = [];
            if (success){
                setCategories = fileContents.categories;
            }
            this.props.entryCategories(setCategories);

            let setItems = [];
            if (success){
                setItems = fileContents.items;
            }
            this.props.entryItems(setItems);

            let setTransactions = [];
            if (success){
                setTransactions = fileContents.transactions;
            }
            this.props.entryTransactions(setTransactions);
            
            let pendingImport = [];
            if (success){
                pendingImport = fileContents.pendingImport;
            }
            
            let importTransactionsOptions = {};
            if (success){
                importTransactionsOptions = fileContents.importTransactionsOptions;
            }
            
            let bankSync = {
                clientId: "",
                publicKey: "",
                development: ""
            };
            if (success){
                bankSync = fileContents.bankSync;
            }
            this.props.entryBankSyncKeys(bankSync.clientId, bankSync.publicKey, bankSync.development);

            // Lets us save when we navigate to the main screen
            if (this.state.dataImported && success){
                this.props.trueModify();
            }

            // set redirect
            this.setState({
                goHome: true
            });            
        }
        catch (error)
        {
            console.error(error);

            dialog.showMessageBox({
                title: "Error loading data",
                type: "warning",
                buttons: ["Ok"],
                message: `Wrong passphrase, if you cannot remember your passphrase, reset your data by clicking the delete button above. You may set a new passphrase after resetting your data.`
            }, (i) => {
                    
            });             
        }
    }

    importData(event){
        var callback = function(filePaths, bookmark){
            if (typeof filePaths !== "undefined"){

                try
                {
                    if (filePaths[0].match(/.+\.json$/) === null)
                        throw "error";

                    let file = fs.readFileSync(filePaths[0], "utf-8");
                    
                    this.setState({
                        dataToImport: file,
                        dataImported: true,
                        importedModal: true
                    });
                    this.onetimemodal = true;
                }
                catch (exception){
                    alert("Could not import data.")
                }                                 
            }
        };
        var boundCallback = callback.bind(this);

        dialog.showOpenDialog(
            { 
                title: "Import data",
                properties: ["openFile"]
            },
            boundCallback
        );
    }

    emptyImport(event){
        this.setState({
            dataImported: false,
            dataToImport: "",
        });
    }

    componentDidMount(){
        this.fixbuginput.click();
    }

    fixBug(){

    }

    changePassphraseModal(){

        if (this.state.importedModal){
            return (
                <div className="modal active" id="modal-id">
                    <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.closeImportModal()}></a>
                    <div className={`modal-container`}>
                        <div className={`modal-header ${styles.h62}`}>
                            <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.closeImportModal()}></a>
                            <div className="modal-title h4">Import successful</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                <div>
                                    By continuing to use My Budget with your imported data, your passphrase will be reset to the new passphrase you provide. the passphrase is optional if you do not want to set a passphrase.
                                </div>                                
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="text-center">
                                If you decide not to import existing data, please click the "clear loaded data" button and continue to use My Budget as you have.
                            </div>
                        </div>
                    </div>
                </div>
            );
        }        
    }

    render() {
        if (this.state.goHome){
            return <Redirect to="/Home"></Redirect>
        }

        return (
            <div className={`container ${styles.h100}`}>
                <div className={`columns ${styles.header} ${styles.h50}`}>
                    <div className={`column col-8 ${styles["btn-fix"]}`}>
                        <button onClick={this.importData} className={`btn btn-primary`}>Import data</button>
                        <button onClick={this.emptyImport} disabled={!this.state.dataImported && this.state.dataToImport === ""} className={`btn ${styles["ml"]}`}>Clear loaded data</button>
                    </div>
                    <div className={`column col-4 text-right ${styles["btn-fix"]}`}>
                        <button onClick={this.resetData} className={`btn btn-error ${styles["ml"]}`}>Delete data</button>
                    </div>                    
                </div>
                <div className={`columns text-center ${styles.top}`}>
                    <div className="column col-4 col-mx-auto">
                        <h1>My Budget</h1>
                        <div>
                            Let's start
                        </div>                        
                        <div className={`columns ${styles.less}`}>
                            <div className="column col-12">
                                <form onSubmit={() => this.go()}>
                                    <div className="input-group">
                                        <input className="form-input input-lg" type="password" placeholder="passphrase" autoFocus value={this.state.passphrase} onChange={this.changePassphrase}></input>
                                        <button className="btn btn-lg btn-primary" type="submit">Go</button>
                                    </div>
                                </form>                                                                
                            </div>
                        </div>
                        <div className={`columns ${styles.smaller}`}>
                            <div className="column col-12">
                                <div className="popover popover-top">
                                    <button className="btn">New user?</button>
                                    <div className="popover-container">
                                        <div className="card">
                                            {/* <div className="card-body">
                                                If this is your first time using MyBudget, you can choose to encrypt your data with a passphrase. If you do so, you must enter in your passphrase every time you use this app. You cannot change your passphrase once it's been set! If you don't choose a passphrase, your data will be saved unencrypted on your computer.
                                            </div> */}
                                            <div className="card-footer" style={{fontStyle: "italic"}}>
                                                Please visit the <a target="_blank" href={"https://github.com/reZach/my-budget/wiki/First-time-user-guide"}>new user's guide</a> if you'd like a walkthrough how to use My Budget.
                                            </div>
                                        </div>
                                    </div>
                                </div>                             
                            </div>
                        </div>
                        <form style={{display: "none"}} onSubmit={() => this.fixBug()}>
                            <button ref={input => this.fixbuginput = input}  type="submit"></button>
                        </form>
                        {this.changePassphraseModal()}
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state){
    return {
        passphrase: state.passphrase
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...CategoryCollectionActions,
        ...ItemCollectionActions,
        ...PassphraseActions,
        ...ModifyActions,
        ...IncomeActions,
        ...SaveActions,
        ...IncomeRecordActions,
        ...BankSyncActions,
        ...TransactionCollectionActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Entry);