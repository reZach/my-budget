import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as IncomeActions from "../../actions/income";
import * as ModifyActions from "../../actions/modify";
import * as IncomeRecordActions from "../../actions/incomeRecords";
import styles from "./Income.css";
import { dateMatches } from "../../utils/readableDate";
import IncomeRecord from "../IncomeRecord/IncomeRecord";

const {dialog} = require('electron').remote;

class Income extends Component<Props>{
    props: Props;

    constructor(){
        super();

        this.state = {
            modalActive: false,
            day: 0,
            month: 0,
            year: 0,
            date: "",
            income: 0,
            frequency: "0",
            note: ""
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.changeIncome = this.changeIncome.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.changeFrequency = this.changeFrequency.bind(this);
        this.changeNote = this.changeNote.bind(this);
        this.addNewIncomeRecord = this.addNewIncomeRecord.bind(this);
        this.addIncomeRecordIsValid = this.addIncomeRecordIsValid.bind(this);
        this.selectIncomeInput = this.selectIncomeInput.bind(this);
        this.deleteIncomeRecord = this.deleteIncomeRecord.bind(this);
        this.getCurrentCashFlow = this.getCurrentCashFlow.bind(this);
        
        this.getPercentSpent = this.getPercentSpent.bind(this);
        this.getRemainingDays = this.getRemainingDays.bind(this);
    }

    componentDidUpdate(){
        const data = this.props.income[0];
        if (typeof data === "undefined"){
            this.props.saveIncome(0);
        }
    }

    changeIncome(event){
        const updated = event.target.value;
        if (updated.match(/^$/) !== null ||
            updated.match(/^\d+\.?\d?\d?$/) !== null){
            this.setState({
                income: updated
            });
        }
    }

    changeDate(event){
        const split = event.target.value.split("-");
        this.setState({
            date: event.target.value,
            day: split[2],
            month: split[1],
            year: split[0]
        });      
    }

    changeFrequency(event){        
        this.setState({
            frequency: event.target.value
        });
    }

    changeNote(event){
        this.setState({
            note: event.target.value
        });
    }

    // changeIncome(event){
    //     if (this.state.amount.length > 0){
    //         this.props.saveIncome(this.state.amount);
    //         this.props.trueModify();
    //         this.setState({
    //             amount: ""
    //         });
    //     }        
    // }

    deleteIncomeRecord(id){
        dialog.showMessageBox({
            title: "delete income",
            type: "warning",
            buttons: ["Yes", "No"],
            message: "are you sure you want to delete this income record?"
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.removeIncomeRecord(id);
                this.props.trueModify();
            }
        });
        
    }
    
    addNewIncomeRecord(){
        this.props.addIncomeRecord(this.state.day, this.state.month, this.state.year, this.state.income, this.state.frequency, this.state.note);

        this.setState({
            day: 0,
            month: 0,
            year: 0,
            income: 0,
            date: "",
            frequency: "0",
            note: ""
        });
        this.props.trueModify();
    }

    getPercentSpent(data){
        if (data.amount === "0" ||
            data.amount === 0 || 
            data.amount === ""){
            return "0.00";
        }
        
        let runningTotal = 0;

        for(let i = 0; i < this.props.transactions.length; i++){
            runningTotal += parseFloat(this.props.transactions[i].amount);
        }
        
        return ((runningTotal / parseFloat(data.amount)) * 100).toFixed(0);
    }

    getRemainingDays(){
        // http://embed.plnkr.co/FFUXhl/preview
        const date = new Date();
        const time = new Date(date.getTime());
        time.setMonth(date.getMonth() + 1);
        time.setDate(0);
        const days = time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0;
        return days;
    }

    selectIncomeInput(event){
        if (this.state.income === 0){
            event.target.select();
        }
    }

    addIncomeRecordIsValid(){
        return (this.state.day !== 0 &&
                this.state.month !== 0 &&
                this.state.year !== 0 &&
                this.state.income !== 0);
    }

    toggleModal(){
        this.setState(state => (
            {modalActive: !state.modalActive}
        ));
    }

    getCurrentCashFlow(){

        // calculate transactions up to today
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const year = today.getFullYear();

        const validIncomeRecords = this.props.incomeRecords.filter((fr) => {
            const date = new Date(fr.startYear, fr.startMonth-1, fr.startDay);
            
            if (date <= today){
                return true;
            }
            return false;
        });


        let cash = 0;        
        // sum income records to the current month
        for (let i = 0; i < validIncomeRecords.length; i++){
            const startDate = new Date(parseInt(validIncomeRecords[i].startYear), parseInt(validIncomeRecords[i].startMonth)-1, parseInt(validIncomeRecords[i].startDay));
            
            switch(validIncomeRecords[i].frequency){
                case "0":

                    cash += parseFloat(validIncomeRecords[i].income);
                    break;
                case "1":
                    // every week                    
                    while(true){

                        if (startDate <= today){
                            cash += parseFloat(validIncomeRecords[i].income);

                            startDate.setDate(startDate.getDate() + 7);
                        } else {
                            break;
                        }
                    }
                    break;
                case "2":
                    // every 2 weeks                    
                    while (true){

                        if (startDate <= today){
                            cash += parseFloat(validIncomeRecords[i].income);

                            startDate.setDate(startDate.getDate() + 14);
                        } else {
                            break;
                        }                        
                    }
                    break;
                case "3":
                    // first business day of every month

                    break;
                default:
                    break;
            }
        }        

        // Get transactions for the current month
        const validTransactions = this.props.transactions.filter((t) => {
            if (t.day <= day){
                return true;
            }
            return false;
        });

        const outbound = validTransactions.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.amount), 0);
    

        const result = (cash - outbound).toFixed(2);
        
        if (result > 0){
            return (
                <span className={`label label-success ${styles["label-fix"]}`}>${result}</span>
            );
        } if (result < 0){
            return (
                <span className={`label label-error ${styles["label-fix"]}`}>${result}</span>
            );
        } 
            return (
                <span className={`label label-warning ${styles["label-fix"]}`}>${result}</span>
            );
        
    }

    renderRemainingDays(data){
        const spent = this.getPercentSpent(this.props.income[0]);

        if (dateMatches(this.props.date)){
            return (
                <div className="popover popover-bottom">
                    <span className="label label-success">${data.amount}</span>
                    <div className="popover-container">
                        <div className="card">
                            <div className="card-header">
                                <span>{this.getRemainingDays() > 0 ? `${this.getRemainingDays()  } days left to budget` : "last day of the month"}</span>
                            </div>
                            {spent !== "0.00" ?
                                <React.Fragment>
                                    <div className="card-body">
                                        {spent}% spent of total
                                    </div>
                                    <div className="card-footer">
                                        <div className="bar">
                                            <div className={`bar-item ${spent <= 33 ? styles["bar-good"] : spent <= 66 ? styles["bar-okay"] : styles["bar-bad"]}`} role="progressbar" style={{width: `${spent  }%`}} aria-valuenow="0" aria-valuemin="0" />
                                        </div>
                                    </div>
                                </React.Fragment> : <React.Fragment></React.Fragment>    
                            }                            
                        </div>
                    </div>
                </div>
            );
        } 
            return (
                <span className="label label-success">${data.amount}</span>
            );
        
    }

    frequencyDropDown(){
        const options = [
            {
                value: "0",
                text: "one time"
            },
            {
                value: "1",
                text: "every week"
            },
            {
                value: "2",
                text: "every 2 weeks"
            }
        ];

        const components = options.map((value) => 
            <option key={value.value} value={value.value}>{value.text}</option>
        );
        
        return components;
f    }

    incomeTable(){
        if (this.props.incomeRecords.length > 0){
            return (
                <div className="content">
                    <div className={`${styles.hrest}`}>
                    {this.props.incomeRecords
                        .sort((a, b) => {
                            if (a.startYear > b.startYear){
                                return 1;
                            } if (b.startYear > a.startYear) {
                                return -1;
                            } if (a.startMonth > b.startMonth) {
                                return 1;
                            } if (b.startMonth > b.startMonth) {
                                return -1;
                            } if (a.startDay > b.startDay) {
                                return 1;
                            } if (b.startDay > a.startDay) {
                                return -1;
                            }
                            return 0;
                        }).map((value, index, array) => <IncomeRecord key={index} {...value} delete={this.deleteIncomeRecord} />)}
                    </div>
                </div>
            );
        } 
            return (
                <div className="content">
                    Please enter in your income data.
                </div>
            );
                
    }

    modal(){
        if (this.state.modalActive){
            return (
                <div className="modal active" id="modal-id">
                    <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={this.toggleModal} />
                    <div className="modal-container">
                        <div className="modal-header">
                            <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={this.toggleModal} />
                            <div className="modal-title h4">Income</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                            <div className={`${styles.mb}`}>Enter in your sources of income.</div>
                                <div className="columns">
                                    <div className="column col-12">
                                        <div className="columns">
                                            <form className="form-horizontal" style={{width: "100%"}} onSubmit={this.addNewIncomeRecord}>
                                                <div className="form-group">
                                                    <div className="column col-3">
                                                        <label className="form-label">Income</label>
                                                    </div>
                                                    <div className="column col-9">
                                                        <input className="form-input" type="text" value={this.state.income} onSelect={this.selectIncomeInput} onChange={this.changeIncome} placeholder="income" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="column col-3">
                                                        <label className="form-label">Date</label>
                                                    </div>
                                                    <div className="column col-9">
                                                        <input className="form-input" type="date" value={this.state.date} onChange={this.changeDate} placeholder="date" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="column col-3">
                                                        <label className="form-label">Frequency</label>
                                                    </div>
                                                    <div className="column col-9">
                                                        <select className="form-input" value={this.state.frequency} onChange={this.changeFrequency}>
                                                            {this.frequencyDropDown()}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="column col-3">
                                                        <label className="form-label">Note</label>
                                                    </div>
                                                    <div className="column col-9">
                                                        <input className="form-input" type="text" value={this.state.note} onChange={this.changeNote} placeholder="note" />
                                                    </div>
                                                </div>
                                                <div className="float-right text-right">
                                                    <input className="btn btn-primary" type="submit" disabled={!this.addIncomeRecordIsValid()} value="Add" />
                                                </div>
                                            </form>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`modal-footer text-center ${styles["center-this-text"]}`}>
                            {this.incomeTable()}
                        </div>
                    </div>
                </div>
            );
        }        
    }

    render(){ 
        return (
            <div className={`columns ${styles["header-fix"]}`}>
                {this.getCurrentCashFlow()}
                <button type="button" className="btn btn-primary" onClick={this.toggleModal}>Income</button>
                {this.modal()}
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        date: state.date,
        income: state.income.filter(i => i.dateId === state.date.id),
        transactions: state.transactions,
        incomeRecords: state.incomeRecords
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...IncomeActions,
        ...ModifyActions,
        ...IncomeRecordActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Income);