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
                        <h2>calendar</h2>
                        {/* <img src="../images/calendar.png"></img> */}
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="white" d="M0 0h24v24H0V0z"/><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V10h16v11zm0-13H4V5h16v3z"/></svg> */}
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