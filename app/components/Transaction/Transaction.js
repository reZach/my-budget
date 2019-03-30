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
                <div className="columns">                    
                    <div className="column col-10 text-left">
                        <div>${this.props.amount} {this.props.note !== "" ? 
                        <React.Fragment>
                            - {this.props.note}
                        </React.Fragment> : <React.Fragment></React.Fragment>}
                        </div>
                    </div>
                    <div className="column col-2 text-right">
                        <form onSubmit={() => this.props.delete(this.props.categoryId, this.props.itemId, this.props.id, this.props.amount)}>
                            <input className="btn btn-sm btn-error" type="submit" value="delete"></input>
                        </form>
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