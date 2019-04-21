import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./ImportBank.css";
import { dateToShort } from "../../utils/readableDate";
import * as PendingImportActions from "../../actions/pendingImport";

class ImportBank extends Component<Props> {
    props: Props;

    constructor(props){
        super(props);

        this.state = {
            editPane: false,
            savedCategory: props.categoryName,
            savedItem: props.itemName === "" ? "default" : props.itemName,
            savedNote: props.note,
            editCategory: false,
            editItem: false,
            pendingCategory: props.categoryName,
            pendingItem: props.itemName,
            pendingNote: "",
            newCategory: "",
            newItem: "",
            createCategory: false,
            createItem: false,


            createCategoryName: "",
            createItemName: "",
            createNote: props.defaultNote,
            optionNewCategory: "",
            optionNewItem: "",
            selectedCategoryDropDown: props.categoryName,
            selectedItemDropDown: props.itemName
        };
        
        this.undoPendingChanges = this.undoPendingChanges.bind(this);
        this.saveAllPendingChanges = this.saveAllPendingChanges.bind(this);
        this.createCategoryDropDown = this.createCategoryDropDown.bind(this);
        this.createItemDropDown = this.createItemDropDown.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onItemChange = this.onItemChange.bind(this);
        this.changeNewCategory = this.changeNewCategory.bind(this);
        this.changeNewItem = this.changeNewItem.bind(this);
        this.submitNewCategoryName = this.submitNewCategoryName.bind(this);
        this.submitNewItemName = this.submitNewItemName.bind(this);
        this.trimNote = this.trimNote.bind(this);
        this.toggleEditPane = this.toggleEditPane.bind(this);


        this.newCategoryNameKeyup = this.newCategoryNameKeyup.bind(this);
        this.newItemNameKeyup = this.newItemNameKeyup.bind(this);
        this.newNoteKeyup = this.newNoteKeyup.bind(this);
        this.newItemNameKeyup = this.newItemNameKeyup.bind(this);        
        this.changeCreateNote = this.changeCreateNote.bind(this);
    }

    undoPendingChanges(event){
        
        this.setState({
            createCategory: false,
            createItem: false,
            createCategoryName: "",
            optionNewCategory: "",
            createItem: false,
            createItemName: "",
            optionNewItem: "",
            createNote: this.props.defaultNote
        });
    }

    saveAllPendingChanges(event){
        if (this.state.pendingCategory !== this.state.savedCategory && this.state.newCategory !== ""){
            this.props.setOverwriteCategoryName(this.props.tempId, this.state.newCategory);
            this.submitNewCategoryName();            
        }
        
        if (this.state.pendingItem !== this.state.savedItem && this.state.newItem !== ""){
            this.props.setOverwriteItemName(this.props.tempId, this.state.newItem);
            this.submitNewItemName();
        }
                
        
        if (this.state.createNote !== this.props.defaultNote){
            this.submitNewNote();
        }        
    }
    
    createCategoryDropDown(){
        let options = [];
        let index = 0;

        if (this.props.defaultCategory !== ""){
            options.push((<option key={index} value={this.props.defaultCategory}>{this.props.defaultCategory}</option>));
        } else {
            options.push((<option key={index} selected={this.state.savedCategory === ""} value="default">default</option>));
        }
        index++;

        if (this.state.savedCategory !== "" && this.state.savedCategory !== this.props.defaultCategory){
            options.push((<option key={index} selected={this.state.savedCategory !== ""} value={this.state.savedCategory}>{this.state.savedCategory} (edit)</option>))
        } else {
            options.push((<option key={index} value="">create new</option>));
        }

        return options;
    }

    createItemDropDown(){
        let options = [];
        let index = 0;

        if (this.props.defaultItem !== ""){
            options.push((<option key={index} value={this.props.defaultItem}>{this.props.defaultItem}</option>));
        } else {
            options.push((<option key={index} selected={this.state.savedItem === ""} value="default">default</option>));
        }        
        index++;

        if (this.state.savedItem !== "" && this.state.savedItem !== this.props.defaultItem){
            options.push((<option key={index} selected={this.state.savedItem !== ""} value={this.state.savedItem}>{this.state.savedItem} (edit)</option>))
        } else {
            options.push((<option key={index} value="">create new</option>));
        }

        return options;
    }

    newCategoryNameKeyup(event){
        let code = event.keyCode || event.which;
        if (code === 13){
            this.submitNewCategoryName();
        } else if (code === 27){
            this.setState({
                createCategory: false,
                createCategoryName: ""
            });
            event.target.blur();
        }
    }

    newItemNameKeyup(event){
        let code = event.keyCode || event.which;
        if (code === 13){
            this.submitNewItemName();
        } else if (code === 27){
            this.setState({
                createItem: false,
                createItemName: ""
            });
            event.target.blur();
        }
    }

    newNoteKeyup(event){
        let code = event.keyCode || event.which;
        if (code === 27){
            this.setState({
                createNote: this.props.defaultNote
            });
            event.target.blur();
        }
    }

    toggleEditPane(event){
        let state = this.state.editPane;

        this.setState({
            editPane: !state,
            pendingCategory: this.state.savedCategory,
            pendingItem: this.state.savedItem,
            editCategory: false,
            editItem: false
        });
    }

    changeNewCategory(event){
        this.setState({
            newCategory: event.target.value,
            pendingCategory: event.target.value
        });
    }

    changeNewItem(event){
        this.setState({
            newItem: event.target.value,
            pendingItem: event.target.value
        });
    }

    onCategoryChange(event){
        let value = event.target.value;

        this.setState({
            editCategory: value === "" || value !== this.props.defaultCategory,
            pendingCategory: value,
            newCategory: value
        });
    }

    onItemChange(event){
        let value = event.target.value;

        this.setState({
            editItem: value === "" || value !== "default",
            pendingItem: value,
            newItem: value
        });
    }

    changeCreateNote(event){
        this.setState({
            createNote: event.target.value
        });
    }

    submitNewCategoryName(event){
        var newCategory = this.state.newCategory;
        this.setState({
            savedCategory: newCategory,
            editCategory: false,
            newCategory: ""
        });
    }

    submitNewItemName(event){
        var newItem = this.state.newItem;
        this.setState({
            savedItem: newItem,
            editItem: false,
            newItem: ""
        });
    }

    submitNewNote(event){
        var result = this.state.createNote;
        this.props.setOverwriteNote(this.props.tempId, result);
    }
    
    renderCreateNewCategory(){
        if (this.state.editCategory){
            return (
                <div className="form-horizontal">
                    <div className="form-group">
                        <div className="col-3">new category name</div>
                        <div className="col-6">
                            <input className="form-input" type="text" value={this.state.newCategory} onKeyUp={this.newCategoryNameKeyup} onChange={this.changeNewCategory} placeholder="new category name" />
                        </div>
                    </div>
                </div>  
            );
        }        
    }

    renderCreateNewItem(){
        if (this.state.editItem){
            return (
                <div className="form-horizontal">
                    <div className="form-group">
                        <div className="col-3">new item name</div>
                        <div className="col-6">
                            <input className="form-input" type="text" value={this.state.newItem} onKeyUp={this.newItemNameKeyup} onChange={this.changeNewItem} placeholder="new item name" />
                        </div>
                    </div>
                </div>  
            );
        }        
    }

    renderEditPane(){
        if (this.state.editPane){
            return (
                <div className="columns">
                    <div className={`column col-12 ${styles["edit-window"]}`}>
                        <form className="form-horizontal" onSubmit={() => this.saveAllPendingChanges()}>
                            <div className="form-group">                                
                                <div className="col-3">category</div>
                                <div className="col-6">
                                    <select className="form-select" onChange={this.onCategoryChange}>
                                        {this.createCategoryDropDown()}
                                    </select>
                                </div>
                            </div>
                            {this.renderCreateNewCategory()}
                            <div className="form-group">                                
                                <div className="col-3">sub-category</div>
                                <div className="col-6">
                                    <select className="form-select" onChange={this.onItemChange}>
                                        {this.createItemDropDown()}
                                    </select>
                                </div>
                            </div>
                            {this.renderCreateNewItem()}
                            <div className="form-group">
                                <div className="col-3">note</div>
                                <div className="col-6">
                                    <input className="form-input" type="text" value={this.state.createNote} onChange={this.changeCreateNote} onKeyUp={this.newNoteKeyup} placeholder="note" />
                                </div>
                            </div>
                            <div className="column col-12">
                                <div className="form-group float-left">
                                    <input className="btn btn-error" type="button" value="undo all" disabled={this.state.createCategoryName === this.props.defaultCategory && this.state.createItemName === this.props.defaultItem && this.state.createNote === this.props.defaultNote} onClick={() => this.undoPendingChanges()}></input>
                                </div>
                                <div className="form-group float-right">
                                    <input className="btn btn-primary" type="submit" disabled={!((this.props.overwriteCategoryName === "" ? (this.state.pendingCategory !== this.state.savedCategory && this.state.newCategory !== "") : (this.state.newCategory !== "" ? this.props.overwriteCategoryName !== this.state.newCategory : this.state.pendingCategory !== this.props.overwriteCategoryName)) 
                                    ||
                                    (this.props.overwriteItemName === "" ? (this.state.pendingItem !== this.state.savedItem && this.state.newItem !== "") : (this.state.newItem !== "" ? this.props.overwriteItemName !== this.state.newItem : this.state.pendingItem !== this.props.overwriteItemName)))} value="update"></input>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    }

    trimNote(note){
        if (note.length > 25){
            return note.substring(0, 24) + "...";
        } else {
            return note;
        }
    }

    overwriteCategory(){
        if (this.props.overwriteCategoryName !== "" && this.props.overwriteCategoryName !== this.props.defaultCategory){
            return (
                <span style={{fontWeight: "bold"}}>
                    {this.props.overwriteCategoryName}
                </span>
            );
        } else {
            return (
                <span>
                    {this.props.categoryName}
                </span>
            );
        }
    }

    overwriteItem(){
        if (this.props.overwriteItemName !== "" && this.props.overwriteItemName !== this.props.defaultItem && this.props.overwriteItemName !== "default"){
            return (
                <span style={{fontWeight: "bold"}}>
                    {this.props.overwriteItemName}
                </span>
            );
        } else {
            return (
                <span>
                    {this.props.itemName}
                </span>
            );
        }
    }

    overwriteNote(){
        if (this.props.overwriteNote !== "" && this.props.overwriteNote !== this.props.defaultNote){
            return (
                <span style={{fontWeight: "bold"}}>
                    {this.trimNote(this.props.overwriteNote)}
                </span>
            );
        } else {
            return (
                <span>
                    {this.trimNote(this.props.note)}
                </span>
            );
        }
    }

    render () {
        return (
            <React.Fragment>
                <div className={`columns ${styles.importrow}`} onClick={() => this.toggleEditPane()}>
                    <div className="column col-1">
                        <input type="checkbox" value="import" defaultChecked={this.props.toImport} onClick={() => this.props.modifyImportCheckbox(this.props.tempId, !this.props.toImport)}></input>
                    </div>                    
                    <div className="column col-1">
                        {`${this.props.dateId}`}
                    </div>
                    <div className="column col-1">
                        ${this.props.amount}
                    </div>
                    <div className="column col-2">
                        {this.overwriteCategory()}
                    </div>
                    <div className="column col-2">
                        {this.overwriteItem()}
                    </div>
                    <div className={`column col-5 ${styles.note}`}>
                        {this.overwriteNote()}
                    </div>
                </div>
                {this.renderEditPane()}
            </React.Fragment>            
        );
    }
}

function mapStateToProps(state){    
    return {
        categories: state.categories,
        items: state.items,
        pendingImport: state.pendingImport
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({        
        ...PendingImportActions
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImportBank);