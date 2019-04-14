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

    export(event){
        dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
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
                        <button className={`btn btn-primary tooltip tooltip-bottom ${styles['some-mr']}`} type="button" data-tooltip="saves pending changes" disabled={!this.props.modified} onClick={() => this.multi()}>save</button>
                        {/* <button className="btn" type="button" value="export" onClick={() => return true;}></button> */}
                        <button className="btn btn-error tooltip tooltip-bottom" type="button" data-tooltip="deletes all data" onClick={() => this.deleteAll()}>delete</button>
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