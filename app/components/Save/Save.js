import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const {dialog} = require('electron').remote;
import * as SaveActions from "../../actions/save";
import * as ModifyActions from "../../actions/modify";
import * as BankSyncActions from "../../actions/bankSync";
import * as TransactionCollectionActions from "../../actions/transactionCollection";
import * as PendingImportActions from "../../actions/pendingImport";
import styles from "./Save.css";
import { bankSyncFetch } from "../../utils/banksync";
import ImportBank from "../ImportBank/ImportBank";

class Save extends Component<Props>{
    props: Props;

    constructor(){
        super();

        this.state = {
            bankSyncAdd: false,
            importedData: []
        };

        this.multi = this.multi.bind(this);
        this.sync = this.sync.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.toggleBankSyncAdd = this.toggleBankSyncAdd.bind(this);
        this.setNewCategory = this.setNewCategory.bind(this);
        this.importTransactions = this.importTransactions.bind(this);
        this.toggleImport = this.toggleImport.bind(this);
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

    toggleImport(id){
        let importedData = this.state.importedData;

        for (var i = 0; i < importedData.length; i++){
            if (importedData[i].tempId === id){
                importedData[i].import = !importedData[i].import;

                this.setState({
                    importedData: importedData
                });
                break;
            }
        }
    }

    setNewCategory(id, categoryName){
        //let 
    }

    export(event){
        dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
    }

    importTransactions(){
        
        let toImport = this.state.importedData.filter(d => d.import === true);

        this.props
    }

    toggleBankSyncAdd(event){
        let newState = !this.state.bankSyncAdd;

        this.setState({
            bankSyncAdd: newState
        });
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
                                    return <ImportBank key={index} value={index} {...value} defaultCategory={value.categoryName} defaultItem={value.itemName} defaultNote={value.note} />
                                })}
                                </div>                                
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary">import</button>
                            <button className="btn" onClick={() => this.toggleBankSyncAdd()}>cancel</button>
                        </div>
                    </div>
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
        pendingImport: state.pendingImport
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...SaveActions,
        ...ModifyActions,
        ...BankSyncActions,
        ...TransactionCollectionActions,
        ...PendingImportActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Save);