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
            clientId: "",
            development: "",
            publicKey: ""
        };

        this.multi = this.multi.bind(this);
        this.sync = this.sync.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.toggleBankSyncAdd = this.toggleBankSyncAdd.bind(this);
        this.saveBankInfo = this.saveBankInfo.bind(this);
        this.modifyClientId = this.modifyClientId.bind(this);
        this.modifyDevelopment = this.modifyDevelopment.bind(this);
        this.modifyPublicKey = this.modifyPublicKey.bind(this);
    }

    multi(event){
        this.props.falseModify();
        this.props.save();        
    }    

    async sync(){
        await bankSyncFetch("discover", "", "");
    }

    export(event){
        dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
    }

    modifyClientId(event){
        this.setState({
            clientId: event.target.value
        });
    }

    modifyDevelopment(event){
        this.setState({
            development: event.target.value
        });
    }

    modifyPublicKey(event){
        this.setState({
            publicKey: event.target.value
        });
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
        if (this.state.bankSyncAdd){
            return (
                <div className="modal active" id="modal-id">
                    <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                    <div className="modal-container">
                        <div className="modal-header">
                            <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={() => this.toggleBankSyncAdd()}></a>
                            <div className="modal-title h5">Plaid information</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">                            
                                <div className="form-group">
                                    <div className="columns">
                                        <div className="column col-3">client id</div>
                                        <div className="column col-9">
                                            <input className="form-input" type="text" placeholder="client id" value={this.state.clientId} onChange={this.modifyClientId}></input>
                                        </div>
                                    </div>                                    
                                </div>
                                <div className="form-group">
                                    <div className="columns">
                                        <div className="column col-3">public key</div>
                                        <div className="column col-9">
                                            <input className="form-input" type="text" placeholder="public key" value={this.state.publicKey} onChange={this.modifyPublicKey}></input>
                                        </div>
                                    </div>                                    
                                </div>
                                <div className="form-group">
                                    <div className="columns">
                                        <div className="column col-3">development</div>
                                        <div className="column col-9">
                                            <input className="form-input" type="text" placeholder="development" value={this.state.development} onChange={this.modifyDevelopment}></input>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={() => this.saveBankInfo()} disabled={this.state.clientId === "" || this.state.publicKey === "" || this.state.development === ""}>save</button>
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