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
            amount: ""
        };

        this.changeAmount = this.changeAmount.bind(this);
        this.changeIncome = this.changeIncome.bind(this);
    }

    componentDidUpdate(previousProps){
        let data = this.props.income[0];
        if (typeof data === "undefined"){
            this.props.saveIncome(0);
        }
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
        if (typeof data !== "undefined"){
            return (
                <React.Fragment>
                    <div className="columns">
                        <div className="column col-12 text-left">
                            <h2>income</h2>
                            <span className="label label-success">${data.amount}</span>
                        </div>
                        <div className="column col-12 text-left">
                            <form onSubmit={() => this.changeIncome()}>
                                <input type="text" placeholder="income" value={this.state.amount} onChange={this.changeAmount}></input>
                                <input type="submit"></input>
                            </form>
                        </div>
                    </div>                    
                </React.Fragment>
            );
        } else {
            return (
                <div></div>
            );
        }        
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