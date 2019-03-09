import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./Category.css";

class Category extends Component<Props> {
    props: Props;

    render () {
        return (
            <div>
                Category
            </div>
        );
    }
}

// ugh:
// https://blog.scottlogic.com/2016/05/19/redux-reducer-arrays.html
function mapStateToProps(state) {
    return {

    }
}