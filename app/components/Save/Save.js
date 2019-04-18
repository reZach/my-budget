import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const {dialog} = require('electron').remote;
import * as SaveActions from "../../actions/save";
import * as ModifyActions from "../../actions/modify";
import * as BankSyncActions from "../../actions/bankSync";
import styles from "./Save.css";
import { bankSyncFetch } from "../../utils/banksync";

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
        this.saveBankInfo = this.saveBankInfo.bind(this);
    }

    multi(event){
        this.props.falseModify();
        this.props.save();        
    }    

    async sync(){
        var imported = await bankSyncFetch("discover", "", "");
        
        this.setState({
            importedData: imported,
            bankSyncAdd: true
        });
    }

    export(event){
        dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
    }

    saveBankInfo(){
        this.props.addBankSyncKeys(this.state.clientId, this.state.publicKey, this.state.development);
        this.toggleBankSyncAdd();
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
        if (this.state.bankSyncAdd && this.state.importedData.length > 0){
            return (
                <div className="modal active" id="modal-id">
                    <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                    <div className="modal-container">
                        <div className="modal-header">
                            <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                            <div className="modal-title h5">import transactions</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">                            
                                {this.state.importedData.map((value, index, array) => {
                                    return <div key={index}>{value.note}</div>
                                })}
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
        bankSync: state.bankSync
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...SaveActions,
        ...ModifyActions,
        ...BankSyncActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Save);