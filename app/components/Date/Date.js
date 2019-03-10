import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as DateActions from "../../actions/date";
import styles from "./Date.css";

class Date extends Component<Props> {
    props: Props;

    render() {
        return (
            <React.Fragment>
                {/* <span>debug: {this.props.date.id}</span> */}
                <button onClick={this.props.decrement} type="button">&lt;</button>
                <span className={styles.red}>month {this.props.date.month}. years {this.props.date.year}</span>
                <button onClick={this.props.increment} type="button">&gt;</button>
            </React.Fragment>
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