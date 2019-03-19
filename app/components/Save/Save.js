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
            <div>
                <input type="button" value="save" onClick={() => this.props.save()}></input>
            </div>
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