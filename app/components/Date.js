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
                <button onClick={this.props.decrement} type="button">&lt;</button>
                <div className={styles.red}>month {this.props.date.months}. years {this.props.date.years}</div>
                <button onClick={this.props.increment} type="button">&gt;</button>
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