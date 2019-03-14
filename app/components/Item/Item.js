import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

export default class Item extends Component<Props> {
    props: Props;

    constructor(){
        super();
    }

    render(){
        return (
            <React.Fragment>
                <div>in item</div>
            </React.Fragment>
        );
    }
}