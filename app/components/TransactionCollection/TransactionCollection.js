import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as TransactionActions from "../../actions/transaction";
import styles from "./TransactionActions.css";

class TransactionCollection extends Component<Props> {
    props: Props;

    constructor(){
        super();
    }

    render() {
        return (
            <React.Fragment>

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