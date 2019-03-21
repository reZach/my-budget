import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as IncomeActions from "../../actions/income";
import styles from "./Income.css";

class Income extends Component<Props>{
    props: Props;

    constructor(){
        super();

        this.state = {
            amount: 0
        };

        this.changeAmount = this.changeAmount.bind(this);
        this.changeIncome = this.changeIncome.bind(this);
    }

    changeAmount(event){
        let updated = event.target.value;
        if (updated.match(/^$/) !== null ||
            updated.match(/^\d+\.?\d?\d?$/) !== null){
            this.setState({
                amount: updated
            });
        }
    }

    changeIncome(event){
        this.props.saveIncome(this.state.amount);
        this.setState({
            amount: ""
        });
    }

    render(){
        let data = this.props.income[0];
        return (
            <div>
                income ${data.amount}
                <form onSubmit={() => this.changeIncome()}>
                    <input type="text" placeholder="income" value={this.state.amount} onChange={this.changeAmount}></input>
                    <input type="submit"></input>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        income: state.income.filter(i => i.dateId === state.date.id)
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...IncomeActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Income);