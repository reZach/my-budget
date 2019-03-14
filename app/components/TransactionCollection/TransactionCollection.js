import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as TransactionActions from "../../actions/transactionCollection";
import styles from "./TransactionActions.css";
import Transaction from "../Transaction/Transaction";

class TransactionCollection extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            newTransaction
        }
    }

    

    createNewTransaction(event){

    }

    render() {
        return (
            <React.Fragment>

                <form onSubmit={() => this.createNewTransaction()}>

                </form>


                {this.props.transactions.map((value, index, array) => {
                    return <div>a</div>
                })}
            </React.Fragment>
        );
    }
}




function mapStateToProps(state){
    return {
        transactions: state.transactions
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(TransactionActions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionCollection);