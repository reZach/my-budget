import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as IncomeActions from "../../actions/income";
import * as ModifyActions from "../../actions/modify";
import * as IncomeRecordActions from "../../actions/incomeRecords";
import styles from "./Income.css";
import { dateMatches } from "../../utils/readableDate";
import IncomeRecord from "../IncomeRecord/IncomeRecord";

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
        
        this.getPercentSpent = this.getPercentSpent.bind(this);
        this.getRemainingDays = this.getRemainingDays.bind(this);
    }

    componentDidUpdate(previousProps){
        let data = this.props.income[0];
        if (typeof data === "undefined"){
            this.props.saveIncome(0);
        }
    }

    changeIncome(event){
        let updated = event.target.value;
        if (updated.match(/^$/) !== null ||
            updated.match(/^\d+\.?\d?\d?$/) !== null){
            this.setState({
                income: updated
            });
        }
    }

    changeDate(event){
        let split = event.target.value.split("-");
        this.setState({
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
    
    addNewIncomeRecord(event){
        this.props.addIncomeRecord(this.state.day, this.state.month, this.state.year, this.state.income, this.state.frequency, this.state.note);

        this.setState({

        });
    }

    getPercentSpent(data){
        if (data.amount === "0" ||
            data.amount === 0 || 
            data.amount === ""){
            return "0.00";
        }
        
        var runningTotal = 0;

        for(var i = 0; i < this.props.transactions.length; i++){
            runningTotal = runningTotal + parseFloat(this.props.transactions[i].amount);
        }
        
        return ((runningTotal / parseFloat(data.amount)) * 100).toFixed(0);
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

    toggleModal(event){
        let current = this.state.modalActive;
        this.setState({
            modalActive: !current
        });
    }

    renderRemainingDays(data){
        let spent = this.getPercentSpent(this.props.income[0]);

        if (dateMatches(this.props.date)){
            return (
                <div className="popover popover-bottom">
                    <span className="label label-success">${data.amount}</span>
                    <div className="popover-container">
                        <div className="card">
                            <div className="card-header">
                                <span>{this.getRemainingDays() > 0 ? this.getRemainingDays() + " days left to budget" : "last day of the month"}</span>
                            </div>
                            {spent !== "0.00" ?
                                <React.Fragment>
                                    <div className="card-body">
                                        {spent}% spent of total
                                    </div>
                                    <div className="card-footer">
                                        <div className="bar">
                                            <div className={`bar-item ${spent <= 33 ? styles["bar-good"] : spent <= 66 ? styles["bar-okay"] : styles["bar-bad"]}`} role="progressbar" style={{width: spent + "%"}} aria-valuenow={`${spent}`} aria-valuemin="0"></div>
                                        </div>
                                    </div>
                                </React.Fragment> : <React.Fragment></React.Fragment>    
                            }                            
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <span className="label label-success">${data.amount}</span>
            );
        }
    }

    frequencyDropDown(){
        let options = [
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

        let components = options.map((value, index, array) => 
            <option key={value.value} value={value.value}>{value.text}</option>
        );
        
        return components;
    }

    incomeTable(){
        return (
            <div className="content">
                {/* Header for the table */}
                <div className={`columns ${styles.dark} ${styles.category}`}>
                    <div className={`column col-xs-auto ${styles["category-header"]}`} onClick={this.toggleCollapse}>
                        {this.props.collapse ? <i className="fas fa-caret-right"></i> : <i className="fas fa-caret-down"></i>} {this.props.name}
                    </div>
                    <div className={`column col-xs-auto text-center`}>
                        <div className="columns">
                            <input className="column col-8" type="text" autoFocus value={this.state.newCategoryName} onChange={this.modifyNewCategoryName} onKeyUp={this.handleEnterForCategory} placeholder="new name"></input>
                            <i className={`column col-2 fas fa-check ${styles['icon']} ${styles['icon-fix']}`} onClick={() => this.renameCategory()}></i>
                            <i className={`column col-2 fas fa-ban ${styles['icon']} ${styles['icon-fix']}`} onClick={() => this.toggleRenameActive()}></i>
                        </div>
                    </div>
                </div>
                <div className={`${styles.hrest}`}>
                {this.props.incomeRecords
                    .sort(function(a, b){
                        var split1 = a.dateId.split('-');
                        var split2 = b.dateId.split('-');
                        var m1 = split1[0];
                        var d1 = a.day;
                        var y1 = split1[1];
                        var m2 = split2[0];
                        var d2 = b.day
                        var y2 = split2[1];
            
                        if (y1 > y2){
                            return 1;
                        } else if (y2 > y1) {
                            return -1;
                        } else if (m1 > m2) {
                            return 1;
                        } else if (m2 > m1) {
                            return -1;
                        } else if (d1 > d2) {
                            return 1;
                        } else if (d2 > d1) {
                            return -1;
                        }
                        return 0;
                    }).map((value, index, array) => {
                        return <IncomeRecord key={index} {...value} />
                    })}
                </div>
            </div>
        );
    }

    modal(){
        if (this.state.modalActive){
            return (
                <div className="modal active" id="modal-id">
                    <a href="javascript:void(0)" className="modal-overlay" aria-label="Close" onClick={this.toggleModal}></a>
                    <div className="modal-container">
                        <div className="modal-header">
                            <a href="javascript:void(0)" className="btn btn-clear float-right" aria-label="Close" onClick={this.toggleModal}></a>
                            <div className="modal-title h5">income</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                <div className="columns">
                                    <div className="column col-12">
                                        <div className="columns">
                                            <form className="form-horizontal" style={{width: "100%"}} onSubmit={this.addNewIncomeRecord}>
                                                <div className="form-group">
                                                    <div className="column col-3">
                                                        income
                                                    </div>
                                                    <div className="column col-9">
                                                        <input className="form-input" type="text" value={this.state.income} onSelect={this.selectIncomeInput} onChange={this.changeIncome} placeholder="income"></input>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="column col-3">
                                                        date
                                                    </div>
                                                    <div className="column col-9">
                                                        <input className="form-input" type="date" value={this.state.date} onChange={this.changeDate} placeholder="date"></input>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="column col-3">
                                                        frequency
                                                    </div>
                                                    <div className="column col-9">
                                                        <select className="form-input" value={this.state.frequency} onChange={this.changeFrequency}>
                                                            {this.frequencyDropDown()}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="column col-3">
                                                        note
                                                    </div>
                                                    <div className="column col-9">
                                                        <input className="form-input" type="text" value={this.state.note} onChange={this.changeNote} placeholder="note"></input>
                                                    </div>
                                                </div>
                                                <div className="float-right text-right">
                                                    <input className="btn btn-primary" type="submit" disabled={!this.addIncomeRecordIsValid()} value="add"></input>
                                                </div>
                                            </form>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {this.incomeTable()}
                        </div>
                    </div>
                </div>
            );
        }        
    }

    render(){ 
        return (
            <div className="columns">
                <button className="btn btn-primary" onClick={this.toggleModal}>abc</button>
                {this.modal()}
            </div>
        );    
        // let data = this.props.income[0];        
        // if (typeof data !== "undefined"){
        //     let spent = this.getPercentSpent(data);

        //     return (
        //         <div className="columns">
        //             <div className={`column col-4 text-center ${styles['label-padding']}`}>
        //                 {this.renderRemainingDays(data)}                      
        //             </div>
        //             <div className={`column col-8 ${styles['form-padding']}`}>
        //                 <form onSubmit={() => this.changeIncome()}>
        //                     <div className="input-group">
        //                         <input className="form-input" type="text" placeholder="income" value={this.state.amount} onChange={this.changeAmount}></input>
        //                         <button className="btn btn-primary" type="submit">set</button>
        //                     </div>                                
        //                 </form>
        //             </div>                    
        //         </div>
        //     );
        // } else {
        //     return (
        //         <div></div>
        //     );
        // }        
    }
}

function mapStateToProps(state){
    return {
        date: state.date,
        income: state.income.filter(i => i.dateId === state.date.id),
        transactions: state.transactions.filter(t => t.dateId === state.date.id),
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