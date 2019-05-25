import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as TransactionActions from "../../actions/transaction";
import styles from "./Transaction.css";
// import { dateToShort } from "../../utils/readableDate";

class Transaction extends Component<Props> {
    props: Props;

    renderControls(){
        return (
            <div role="button" tabIndex={0} className={`column col-1 text-center ${styles.icon}`} onClick={() => this.props.delete(this.props.categoryId, this.props.itemId, this.props.id, this.props.amount)} onKeyUp={() => this.props.delete(this.props.categoryId, this.props.itemId, this.props.id, this.props.amount)}>
                <i className="fas fa-trash-alt" />
            </div>                                
        );
    }

    render(){
        return (
            <div className={`columns ${styles.transactionrow}`}>                    
                <div className="column col-2">
                    {`${this.props.dateId.split('-')[0]}/${this.props.day}`}
                </div>
                <div className="column col-2" style={{fontWeight: "bold"}}>
                    ${this.props.amount}
                </div>
                <div className={`column col-7 ${styles.note}`}>{this.props.note}</div>
                {this.renderControls()}
            </div>
        );
    }
}

function mapStateToProps(){
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