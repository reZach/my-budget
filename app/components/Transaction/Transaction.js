import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as TransactionActions from "../../actions/transaction";
import styles from "./Transaction.css";

class Transaction extends Component<Props> {
    props: Props;

    constructor(){
        super();        
    }

    render(){
        return (
            <React.Fragment>
                <form onSubmit={() => this.props.delete(this.props.categoryId, this.props.itemId, this.props.id)}>
                    <div>({this.props.id}) ${this.props.amount} - {this.props.note}</div>
                    <input type="submit" value="delete"></input>
                </form>
                
            </React.Fragment>
        );
    }
}

function mapStateToProps(state){
    return {

    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...TransactionActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Transaction);