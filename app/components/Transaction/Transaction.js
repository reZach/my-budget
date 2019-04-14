import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as TransactionActions from "../../actions/transaction";
import styles from "./Transaction.css";
import { dateToShort } from "../../utils/readableDate";

class Transaction extends Component<Props> {
    props: Props;

    constructor(){
        super();        
    }

    renderControls(){
        return (
            <div className={`column col-1 text-left ${styles.icon}`} onClick={() => this.props.delete(this.props.categoryId, this.props.itemId, this.props.id, this.props.amount)}>
                <i className={`fas fa-trash-alt`}></i>
            </div>                                
        );
    }

    render(){
        return (
            <React.Fragment>
                {/* <div className="columns">
                    <div className="column col-12">
                        <div className={`columns ${styles.category}`}>
                            <div className="column col-xs-auto" style={{fontWeight: "bold"}}>
                                {this.props.name}
                            </div>
                            {this.renderControls()}                            
                        </div>
                        {this.props.items.sort(function(a, b){
                            var a1 = a.name.toLowerCase();
                            var b1 = b.name.toLowerCase();
                            if (a1 > b1) return 1;
                            if (a1 < b1) return -1;
                            return 0;
                        }).map((value, index, array) => {
                            return <div key={index}>
                                <Item {...value} categoryId={this.props.id} dateId={this.props.dateId} rename={this.renameItem} delete={this.deleteItem}></Item>
                            </div>;
                        })}
                        <div className="columns">
                            {this.renderNewSubcategory()}
                        </div>
                    </div>
                </div> */}

                <div className={`columns ${styles.transactionrow}`}>                    
                    <div className="column col-12">
                        {/*HACK TABLE*/}
                        <div className="columns">
                            <div className="column col-1">
                                {`${this.props.dateId.split('-')[0]}/${this.props.day}`}
                            </div>
                            <div className="column col-3" style={{fontWeight: "bold"}}>
                                ${this.props.amount}
                            </div>
                            <div className={`column col-7 ${styles.note}`}>{this.props.note}</div>
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