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
            editActive: false,
            addActive: false
        }

        this.newSubcategoryInput;

        this.toggleRenameActive = this.toggleRenameActive.bind(this);
        this.toggleEditActive = this.toggleEditActive.bind(this);
        this.toggleAddActive = this.toggleAddActive.bind(this);
        this.renameCategory = this.renameCategory.bind(this);
        this.renameItem = this.renameItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.modifyNewItemName = this.modifyNewItemName.bind(this);
        this.modifyNewCategoryName = this.modifyNewCategoryName.bind(this);
        this.handleEnterForCategory = this.handleEnterForCategory.bind(this);
        this.handleEnterForSubcategory = this.handleEnterForSubcategory.bind(this);
    }

    componentDidUpdate(previousProps, previousState){
        if (typeof this.newSubcategoryInput !== "undefined" && this.newSubcategoryInput !== null){
            this.newSubcategoryInput.focus();
        }        
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

    toggleAddActive(event){
        let newState = !this.state.addActive;

        this.setState({
            addActive: newState
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
                    newItemName: "",
                    addActive: false
                });
            }
        }
    }

    handleEnterForCategory(event){
        let code = event.keyCode || event.which;
        if (code === 13){
            this.renameCategory();
        } else if (code === 27){
            this.toggleRenameActive();
            event.target.blur();
        }
    }

    handleEnterForSubcategory(event){
        let code = event.keyCode || event.which;
        if (code === 13){
            this.createNewItem();
        } else if (code === 27){
            this.toggleAddActive();
            event.target.blur();
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

    renderControls(){
        if (this.state.renameActive){
            return (
                <div className={`column col-xs-auto text-center`}>
                    <div className="columns">
                        <input className="column col-8" type="text" autoFocus value={this.state.newCategoryName} onChange={this.modifyNewCategoryName} onKeyUp={this.handleEnterForCategory} placeholder="new name"></input>
                        <i className={`column col-2 fas fa-check ${styles['icon']} ${styles['icon-fix']}`} onClick={() => this.renameCategory()}></i>
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
                    <div className={`column col-1 text-center ${styles['icon']}`} onClick={() => this.props.delete(this.props.id, this.props.name)}>
                        <i className={`fas fa-trash-alt ${styles.icon}`}></i>
                    </div>
                </React.Fragment>                                
            );            
        }
    }

    renderNewSubcategory(){
        if (!this.state.addActive){
            return (
                <div className={`column col-xs-auto text-left ${styles.h30} ${styles.icon}`} onClick={() => this.toggleAddActive()}>
                    sub-category <i className={`fas fa-plus-square`}></i>
                </div>
            );
        } else {
            return (
                <div className={`column col-xs-auto text-center ${styles.h30}`}>
                    <div className="columns">
                        <input ref={me => (this.newSubcategoryInput = me)} className="column col-10" type="text" placeholder="sub-category" value={this.state.newItemName} onChange={this.modifyNewItemName} onKeyUp={this.handleEnterForSubcategory}></input>
                        <i className={`column col-1 fas fa-check ${styles['icon']} ${styles['icon-fix']}`} onClick={() => this.createNewItem()}></i>
                        <i className={`column col-1 fas fa-ban ${styles['icon']} ${styles['icon-fix']}`} onClick={() => this.toggleAddActive()}></i>                                
                    </div>
                </div>
            );
        }
    }

    render () {
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column col-12">
                        {/* HACK TABLE */}
                        <div className={`columns ${styles.category}`}>
                            <div className="column col-xs-auto" style={{fontWeight: "bold"}}>
                                {this.props.name}
                            </div>
                            {this.renderControls()}                            
                        </div>
                        {this.props.items.sort(function(a, b){
                            var a1 = a.name.toLowerCase();
                            var b1 = b.name.toLowerCase();
                            if (a1 > b1) return 1;
                            if (a1 < b1) return -1;
                            return 0;
                        }).map((value, index, array) => {
                            return <div key={index}>
                                <Item {...value} categoryId={this.props.id} dateId={this.props.dateId} rename={this.renameItem} delete={this.deleteItem}></Item>
                            </div>;
                        })}
                        <div className="columns">
                            {this.renderNewSubcategory()}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state, props){
    return {                
        items: state.items.filter(i => i.dateId === props.dateId && i.categoryId === props.id),
        transactions: state.transactions.filter(t => t.dateId === props.dateId && t.categoryId === props.id)
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