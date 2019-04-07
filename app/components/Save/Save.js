import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const {dialog} = require('electron').remote;
import * as SaveActions from "../../actions/save";
import * as ModifyActions from "../../actions/modify";
import styles from "./Save.css";

class Save extends Component<Props>{
    props: Props;

    constructor(){
        super();

        this.multi = this.multi.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
    }

    multi(event){
        this.props.falseModify();
        this.props.save();        
    }

    deleteAll(event){
        
        dialog.showMessageBox({
            title: "delete data",
            type: "warning",
            buttons: ["Yes", "No"],
            message: "are you sure you want to delete everything? we can't recover it if you do."
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.deleteAll();                
            }
        });
    }

    render(){
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column col-12">
                        <h2>data</h2>
                        <input className={`btn btn-primary ${styles['some-mr']}`} type="button" value="save" disabled={!this.props.modified} onClick={() => this.multi()}></input>
                        <input className="btn btn-error" type="button" value="delete" onClick={() => this.deleteAll()}></input>
                    </div>
                </div>                
            </React.Fragment>
        );
    }
}



function mapStateToProps(state){    
    return {
        modified: state.modified
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...SaveActions,
        ...ModifyActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Save);