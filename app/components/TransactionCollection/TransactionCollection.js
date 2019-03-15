import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as TransactionActions from "../../actions/transactionCollection";
import styles from "./TransactionCollection.css";
import Transaction from "../Transaction/Transaction";

class TransactionCollection extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            name: "",
            amount: 0
        }

        this.modifyName = this.modifyName.bind(this);
        this.modifyAmount = this.modifyAmount.bind(this);
        this.createNewTransaction = this.createNewTransaction.bind(this);
    }

    modifyName(event){
        this.setState({
            name: event.target.value
        });
    }

    modifyAmount(event){
        this.setState({
            amount: event.target.value
        });
    }

    createNewTransaction(event){

    }

    createCategoriesDropDown(){
        let categories = this.props.categories;
        return categories.sort((a, b) => a.name > b.name).map((category) =>
            <option key={`${category.dateId}.${category.id}.${category.name}`}>{category.name}</option>
        )
    }

    render() {
        return (
            <React.Fragment>

                <form onSubmit={() => this.createNewTransaction()}>
                    <select>
                        {this.createCategoriesDropDown()}
                    </select><br />                   
                    <input type="number" placeholder="amount" value={this.state.amount} onChange={this.modifyAmount}></input><br />
                    <input type="text" placeholder="note" value={this.state.name} onChange={this.modifyName}></input>
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
        categories: state.categories,
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