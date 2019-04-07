import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
const {dialog} = require('electron').remote;
import * as ItemCollectionActions from "../../actions/itemCollection";
import * as ModifyActions from "../../actions/modify";
import styles from "./Category.css";
import Item from "../Item/Item";

class Category extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            newItemName: "",
            newCategoryName: "",
            renameActive: false,
            editActive: false
        }

        this.toggleRenameActive = this.toggleRenameActive.bind(this);
        this.toggleEditActive = this.toggleEditActive.bind(this);
        this.renameCategory = this.renameCategory.bind(this);
        this.renameItem = this.renameItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.modifyNewItemName = this.modifyNewItemName.bind(this);
        this.modifyNewCategoryName = this.modifyNewCategoryName.bind(this);        
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
                newCategoryName: ""
            });
        }
    }

    toggleEditActive(event){
        let newState = !this.state.editActive;

        this.setState({
            editActive: newState
        });
    }

    renameCategory(event){

        if (this.state.newCategoryName !== ""){
            this.props.rename(this.props.id, this.state.newCategoryName);
            this.props.trueModify();
            this.setState({
                renameActive: false,
                editActive: false,
                newCategoryName: ""
            });
        }     
    }

    renameItem(categoryId: string, id: string, newName: string){
        let items = this.props.items;

        if (typeof items.find(i => i.name === newName) === "undefined"){
            this.props.renameItem(categoryId, id, newName);
            this.props.trueModify();
        }        
    }

    deleteItem(categoryId: string, id: string, name: string){
                
        dialog.showMessageBox({
            title: "delete sub-category",
            type: "warning",
            buttons: ["Yes", "No"],
            message: `are you sure you want to delete '${name}'?`
        }, (i) => {

            // Yes
            if (i === 0){
                this.props.removeItem(categoryId, id);
                this.props.trueModify();
            }
        });        
    }

    modifyNewItemName(event){
        this.setState({
            newItemName: event.target.value
        });
    }

    modifyNewCategoryName(event){
        this.setState({
            newCategoryName: event.target.value
        });
    }

    createNewItem(event){
        if (this.state.newItemName !== ""){

            // Don't create duplicate items
            if (typeof this.props.items.find(i => i.name === this.state.newItemName) === "undefined"){
                this.props.addItem(this.props.id, this.state.newItemName);
                this.props.trueModify();

                this.setState({
                    newItemName: ""
                });
            }
        }
    }

    renderCompound(){
        if (this.state.renameActive && this.state.editActive){
            return (
                <form onSubmit={() => this.renameCategory()}>
                    <div className="input-group">
                        <input className="form-input input-sm" type="text" autoFocus value={this.state.newCategoryName} onChange={this.modifyNewCategoryName}></input>
                        <button className="btn btn-sm btn-primary input-group-btn" type="submit">update</button>
                        <button type="button" className="btn btn-sm input-group-btn" onClick={() => this.toggleRenameActive()}>cancel</button>
                    </div>
                </form>
            );
        } else if (this.state.editActive) {
            return (
                <div className="input-group float-right">                    
                    <button className="btn btn-sm btn-error input-group-btn" id={this.props.id} onClick={() => this.props.delete(this.props.id, this.props.name)}>delete</button>
                    <button className="btn btn-sm btn-primary input-group-btn" onClick={this.toggleRenameActive}>rename</button>                    
                    <button className="btn btn-sm input-group-btn" onClick={this.toggleEditActive}>cancel</button>
                </div>
            );            
        }
    }

    render () {
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column col-7 text-left">
                        <h3>{this.props.name}</h3>                        
                    </div>
                    <div className="column col-5">
                        {!this.state.editActive &&
                        <div className="input-group float-right">
                            <button type="button" className="btn btn-sm input-group-btn" onClick={() => this.toggleEditActive()}>edit</button>
                        </div>
                        }
                        {this.renderCompound()}
                    </div>
                </div>                
                <div className="columns">
                    <div className="column col-12 text-left">
                        {/* <span>items</span> */}
                        <form onSubmit={() => this.createNewItem()}>
                            <div className="input-group">
                                <input className="form-input" type="text" placeholder="sub-category" value={this.state.newItemName} onChange={this.modifyNewItemName}></input>
                                <button className="btn btn-primary input-group-btn" type="submit">add new</button>
                            </div>
                            
                        </form>
                        {this.props.items.sort((a, b) => a.name > b.name).map((value, index, array) => {
                            return <div key={index}>
                                <Item {...value} categoryId={this.props.id} dateId={this.props.dateId} rename={this.renameItem} delete={this.deleteItem}></Item>
                            </div>;
                        })}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state, props){
    return {                
        items: state.items.filter(i => i.dateId === props.dateId && i.categoryId === props.id)
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {...ItemCollectionActions,
        ...ModifyActions}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Category);

// ugh:
// https://blog.scottlogic.com/2016/05/19/redux-reducer-arrays.html