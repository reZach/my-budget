import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as SaveActions from "../../actions/save";
import styles from "./Save.css";

export class Save extends Component<Props>{
    props: Props;

    constructor(){
        super();
    }

    render(){
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column col-12">
                        <h2>data</h2>
                        <input className="btn btn-primary" type="button" value="save" onClick={() => this.props.save()}></input>
                    </div>
                </div>                
            </React.Fragment>
        );
    }
}



function mapStateToProps(state){
    return {
        no: {},
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...SaveActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Save);