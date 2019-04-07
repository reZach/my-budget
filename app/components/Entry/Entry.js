import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./Entry.css";
import { Redirect } from "react-router";
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import * as ItemCollectionActions from "../../actions/itemCollection";
import * as TransactionCollectionActions from "../../actions/transactionCollection";
import * as PassphraseActions from "../../actions/passphrase";
import * as ModifyActions from "../../actions/modify";
import * as IncomeActions from "../../actions/income";
const fs = require("fs");
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
        try
        {
            this.props.setPassphrase(this.state.passphrase);

            fileContents = fs.readFileSync("./file.json", "utf-8");

            if (fileContents !== ""){
                if (crypto.cryptoAvailable() && this.state.passphrase !== ""){
                    var decrypted = crypto.decrypt(fileContents);
    
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
        }
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
                                <div className="input-group">
                                    <input className="form-input input-lg" type="text" placeholder="passphrase" autoFocus value={this.state.passphrase} onChange={this.changePassphrase}></input>
                                    <button className="btn btn-lg btn-primary" onClick={() => this.go()}>go</button>
                                </div>                                
                            </div>
                        </div>
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