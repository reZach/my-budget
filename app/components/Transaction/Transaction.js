import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

export default class Transaction extends Component<Props> {
    props: Props;

    constructor(){
        super();
    }

    render(){
        return (
            <React.Fragment>
                <div>({this.props.id}) ${this.props.amount} - {this.props.note}</div>
            </React.Fragment>
        );
    }
}