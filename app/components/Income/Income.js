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
        this.getPercentSpent = this.getPercentSpent.bind(this);
        this.getRemainingDays = this.getRemainingDays.bind(this);
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

    getPercentSpent(data){
        if (data.amount === 0){
            return "0.00";
        }
        
        var runningTotal = 0;

        for(var i = 0; i < this.props.transactions.length; i++){
            runningTotal = runningTotal + parseFloat(this.props.transactions[i].amount);
        }
        
        return ((runningTotal / parseFloat(data.amount)) * 100).toFixed(2);
    }

    getRemainingDays(){
        // http://embed.plnkr.co/FFUXhl/preview
        var date = new Date();
        var time = new Date(date.getTime());
        time.setMonth(date.getMonth() + 1);
        time.setDate(0);
        var days = time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;
        return days;
    }

    render(){        
        let data = this.props.income[0];        
        if (typeof data !== "undefined"){
            let spent = this.getPercentSpent(data);

            return (
                <React.Fragment>
                    <div className="columns">
                        <div className={`column col-12 text-left ${styles['some-mb']}`}>
                            <h2>income</h2>
                            <span className="label label-success">${data.amount}</span>
                            <span>&nbsp; {spent !== "0.00" ?
                                <React.Fragment>{spent}% spent</React.Fragment> :
                                <React.Fragment></React.Fragment>
                            }</span>
                            &nbsp;
                            <span className="label label-secondary">{this.getRemainingDays() > 0 ? this.getRemainingDays() + " days left!" : "last day of the month!"}</span>
                        </div>
                        <div className={`column col-12 ${styles['some-mb']}`}>
                            {spent !== "0.00" ? 
                            <div className="bar">
                                <div className={`bar-item ${spent <= 33 ? styles["bar-good"] : spent <= 66 ? styles["bar-okay"] : styles["bar-bad"]}`} role="progressbar" style={{width: spent + "%"}} aria-valuenow={`${spent}`} aria-valuemin="0"></div>
                            </div> : <div>enter in transaction data!</div>
                            }
                        </div>
                        <div className="column col-12 text-left">
                            <form onSubmit={() => this.changeIncome()}>
                                <div className="input-group">
                                    <input className="form-input" type="text" placeholder="income" value={this.state.amount} onChange={this.changeAmount}></input>
                                    <button className="btn btn-primary" type="submit">set</button>
                                </div>                                
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
        income: state.income.filter(i => i.dateId === state.date.id),
        transactions: state.transactions.filter(t => t.dateId === state.date.id)
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