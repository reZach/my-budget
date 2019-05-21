import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as ModifyActions from "../../actions/modify";
import styles from "./Item.css";

class Item extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            newItemName: "",
            renameActive: false,
            editActive: false
        }

        this.renameItem = this.renameItem.bind(this);
        this.newItemName = this.newItemName.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.toggleRenameActive = this.toggleRenameActive.bind(this);
        this.toggleEditActive = this.toggleEditActive.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    renameItem(event){
        this.props.rename(this.props.categoryId, this.props.id, this.state.newItemName);
        this.props.trueModify();
        this.setState({
            renameActive: false,
            editActive: false,
            newItemName: ""
        });
    }
    
    newItemName(event){
        this.setState({
            newItemName: event.target.value
        });
    }

    deleteItem(event){
        this.props.delete(this.props.categoryId, this.props.id, this.props.name);
        this.props.trueModify();
    }

    toggleRenameActive(event){
        let newState = !this.state.renameActive;

        if (newState){
            this.setState({
                renameActive: newState
            });
        } else {
            this.setState({
                renameActive: newState,
                newItemName: ""
            });
        }
    }

    toggleEditActive(event){
        let newState = !this.state.editActive;

        this.setState({
            editActive: newState
        });
    }

    handleEnter(event){
        let code = event.keyCode || event.which;
        if (code === 13){
            this.renameItem();
        } else if (code === 27){
            event.target.blur();
            this.toggleRenameActive();
        }
    }

    renderControls(){
        if (this.state.renameActive){
            return (
                <div className={`column col-xs-auto text-center`}>
                    <div className="columns">
                        <input className="column col-8" type="text" autoFocus value={this.state.newItemName} onChange={this.newItemName} onKeyUp={this.handleEnter} placeholder="new name"></input>
                        <i className={`column col-2 fas fa-check ${styles['icon']} ${styles['icon-fix']}`} onClick={() => this.renameItem()}></i>
                        <i className={`column col-2 fas fa-ban ${styles['icon']} ${styles['icon-fix']}`} onClick={() => this.toggleRenameActive()}></i>
                    </div>
                </div>                
            );
        } else {
            return (
                <React.Fragment>
                    <div className={`column col-1 text-center ${styles['icon']}`} onClick={this.toggleRenameActive}>
                        <i className="fas fa-edit"></i>
                    </div>
                    <div className={`column col-1 text-center ${styles['icon']}`} id={this.props.id} onClick={() => this.deleteItem()}>
                        <i className={`fas fa-trash-alt ${styles.icon}`}></i>
                    </div>
                </React.Fragment>                                
            );            
        }
    }

    render(){
        return (
            <React.Fragment>
                <div className={`columns ${styles.item}`}>
                    <div className="column col-xs-auto">
                        {this.props.name}
                    </div>
                    {this.renderControls()}
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state){
    return {
        nope: false
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        ...ModifyActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Item);