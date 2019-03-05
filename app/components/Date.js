import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DateActions from '../actions/date';
import styles from "./Date.css";

class Date extends Component<Props> {
    props: Props;

    render() {
        return (
            <div>
                <div>&lt;</div>
                <div className={styles.red}>{this.props.date.years}</div>
                <div>&gt;</div>
            </div>
        );
    }
}


// Don't know where this is supposed to go,
// so sticking it here instead
function mapStateToProps(state) {
    return {
        date: state.date
    };
}
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators(DateActions, dispatch);
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Date);