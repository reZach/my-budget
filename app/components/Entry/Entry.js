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
import * as ModifyActions from "../../actions/modify";
import * as IncomeActions from "../../actions/income";
const fs = require("fs");
import filehelper from "../../utils/filehelper";
import * as crypto from "../../crypto/code";

class Entry extends Component<Props>{
    props: Props;

    constructor(){
        super();

        this.state = {
            passphrase: "",
            goHome: false
        };

        this.changePassphrase = this.changePassphrase.bind(this);
        this.go = this.go.bind(this);
        this.fixBug = this.fixBug.bind(this);
    }

    changePassphrase(event){
        this.setState({
            passphrase: event.target.value
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
            this.props.setPassphrase(this.state.passphrase);

            // Create file if not exist
            if (!filehelper.exists()){

                filehelper.setSync("", function(error){
                    if (error){
                        console.error("could not write new key");
                    }
                });
            }
            
            fileContents = filehelper.get();

            if (fileContents !== ""){
                if (crypto.cryptoAvailable() && this.props.passphrase !== ""){
                    var decrypted = crypto.decrypt(fileContents, this.props.passphrase);
    
                    success = true;
                    fileContents = JSON.parse(decrypted);
                } else {
                    success = true;
                    fileContents = JSON.parse(fileContents);
                }
            }            

            // set everything in the store
            let setModify = success && fileContents.modified;
            if (setModify){
                this.props.trueModify();
            } else {
                this.props.falseModify();
            }

            let setIncome = [{
                id: "1",
                dateId: `${month}-${year}`,
                amount: 0
            }];
            if (success){
                setIncome = fileContents.income
            }
            this.props.entryIncome(setIncome);

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

            // set redirect
            this.setState({
                goHome: true
            });            
        }
        catch (error)
        {
            console.error(error);

            dialog.showMessageBox({
                title: "error loading data",
                type: "warning",
                buttons: ["Ok"],
                message: `wrong passphrase, we could not load your data. please delete this your data file found here '${localpath}' and restart this app.`
            }, (i) => {
                    
            });             
        }
    }

    componentDidMount(){
        this.fixbuginput.click();
    }

    fixBug(){

    }

    render() {
        if (this.state.goHome){
            return <Redirect to="/Home"></Redirect>
        }

        return (
            <div className={`container ${styles.top}`}>
                <div className={`columns text-center`}>
                    <div className="column col-4 col-mx-auto">
                        <h1>My Budget</h1>
                        <div>
                            let's start
                        </div>
                        <div className={`columns ${styles.less}`}>
                            <div className="column col-12">
                                <form onSubmit={() => this.go()}>
                                    <div className="input-group">
                                        <input className="form-input input-lg" type="password" placeholder="passphrase" autoFocus value={this.state.passphrase} onChange={this.changePassphrase}></input>
                                        <button className="btn btn-lg btn-primary" type="submit">go</button>
                                    </div>
                                </form>                                                                
                            </div>
                        </div>
                        <div className={`columns ${styles.smaller}`}>
                            <div className="column col-12">
                                <div className="popover popover-bottom">
                                    <button className="btn">new user?</button>
                                    <div className="popover-container">
                                        <div className="card">
                                            <div className="card-body">
                                                If this is your first time using MyBudget, you can choose to encrypt your data with a passphrase. If you do so, you must enter in your passphrase every time you use this app. You cannot change your passphrase once it's been set!
                                            </div>
                                            <div className="card-footer" style={{fontStyle: "italic"}}>
                                                If you don't choose a passphrase, your data will be saved unencrypted on your computer.
                                            </div>
                                        </div>
                                    </div>
                                </div>                                
                            </div>
                        </div>
                        <form style={{display: "none"}} onSubmit={() => this.fixBug()}>
                            <button ref={input => this.fixbuginput = input}  type="submit"></button>
                        </form>
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
        ...TransactionCollectionActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Entry);