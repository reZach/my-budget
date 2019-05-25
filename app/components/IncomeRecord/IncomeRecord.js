import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./IncomeRecord.css";
import { dateToMMDDYYYY } from "../../utils/readableDate";

class IncomeRecord extends Component<Props> {
    props: Props;

    constructor(props){
        super(props);

        this.state = {
            renameActive: false,
            editActive: false
        };

        this.toggleRenameActive = this.toggleRenameActive.bind(this);
        this.toggleEditActive = this.toggleEditActive.bind(this);
    }

    toggleRenameActive(){
        const newState = !this.state.renameActive;

        if (newState){
            this.setState({
                renameActive: newState
            });
        } else {
            this.setState({
                renameActive: newState,
                newCategoryName: ""
            });
        }
    }

    toggleEditActive(){
        this.setState(state => ({
            editActive: !state.editActive
        }));
    }

    renderCompound(){
        if (this.state.renameActive && this.state.editActive){
            return (
                <form onSubmit={() => this.renameCategory()}>
                    <div className="input-group">
                        <input className="form-input input-sm" type="text" value={this.state.newCategoryName} onChange={this.modifyNewCategoryName} />
                        <button className="btn btn-sm btn-primary input-group-btn" type="submit">update</button>
                        <button type="button" className="btn btn-sm input-group-btn" onClick={() => this.toggleRenameActive()}>cancel</button>
                    </div>
                </form>
            );
        } if (this.state.editActive) {
            return (
                <div className="input-group float-right">                    
                    <button type="button" className="btn btn-sm btn-error input-group-btn" id={this.props.id} onClick={() => this.props.delete(this.props.id, this.props.name)}>delete</button>
                    <button type="button" className="btn btn-sm btn-primary input-group-btn" onClick={this.toggleRenameActive}>rename</button>                    
                    <button type="button" className="btn btn-sm input-group-btn" onClick={this.toggleEditActive}>cancel</button>
                </div>
            );            
        }
    }

    renderControls(){
        if (this.state.renameActive){
            return (
                <div className="column col-xs-auto text-center">
                    <div className="columns">
                        <input className="column col-8" type="text" value={this.state.newCategoryName} onChange={this.modifyNewCategoryName} onKeyUp={this.handleEnterForCategory} placeholder="new name" />
                        <i role="button" tabIndex={0} className={`column col-2 fas fa-check ${styles.icon} ${styles['icon-fix']}`} onClick={() => this.renameCategory()} onKeyUp={() => this.renameCategory()} />
                        <i role="button" tabIndex={0} className={`column col-2 fas fa-ban ${styles.icon} ${styles['icon-fix']}`} onClick={() => this.toggleRenameActive()} onKeyUp={() => this.toggleRenameActive()} />
                    </div>
                </div>    
            );
        } 
            return (
                <React.Fragment>
                    <div role="button" tabIndex={0} className={`column col-1 text-center ${styles.icon}`} onClick={() => this.props.delete(this.props.id)} onKeyUp={() => this.props.delete(this.props.id)}>
                        <i className={`fas fa-trash-alt ${styles.icon}`} />
                    </div>
                </React.Fragment>                                
            );            
        
    }

    render () {
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column col-12">
                        {/* HACK TABLE */}
                        <div className={`columns ${styles.dark} ${styles.category}`}>
                            <div className="column col-2">
                                {dateToMMDDYYYY(this.props.startMonth, this.props.startDay, this.props.startYear)}
                            </div>
                            <div className="column col-3">
                                {this.props.frequencyName}
                            </div>
                            <div className="column col-xs-auto">
                                {this.props.note}
                            </div>
                            <div className="column col-2">
                                {this.props.income}
                            </div>                            
                            {this.renderControls()}                            
                        </div>                        
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state){    
    return {
        incomeRecords: state.incomeRecords
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({        
        
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IncomeRecord);