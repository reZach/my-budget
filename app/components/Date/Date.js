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
                <div className="columns">
                    <div className="column col-12 col-mx-auto">
                        <img src="../images/calendar.png"></img>
                    </div>
                </div>
                <div className="columns">
                    <div className="column col-6 col-mx-auto">
                        <div className="columns">
                            <div className="column col-4">
                                <button className="btn btn-primary btn-lg" onClick={this.props.decrement} type="button">&lt;</button>
                            </div>
                            <div className="column col-4">
                                <h5>{this.props.date.month} / {this.props.date.year}</h5>
                            </div>
                            <div className="column col-4">
                                <button className="btn btn-primary btn-lg" onClick={this.props.increment} type="button">&gt;</button>
                            </div>
                        </div>                                                                        
                    </div>
                </div>
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