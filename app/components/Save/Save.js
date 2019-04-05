import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as SaveActions from "../../actions/save";
import * as ModifyActions from "../../actions/modify";
import styles from "./Save.css";

class Save extends Component<Props>{
    props: Props;

    constructor(){
        super();

        this.multi = this.multi.bind(this);
    }

    multi(event){
        this.props.save();
        this.props.falseModify();
    }

    render(){
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column col-12">
                        <h2>data</h2>
                        <input className="btn btn-primary" type="button" value="save" disabled={!this.props.modified} onClick={() => this.multi()}></input>
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