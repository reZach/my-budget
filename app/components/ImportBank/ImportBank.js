import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./ImportBank.css";
import { dateToShort } from "../../utils/readableDate";
import * as PendingImportActions from "../../actions/pendingImport";

class ImportBank extends Component<Props> {
    props: Props;

    constructor(){
        super();

        this.state = {
            selectedCategoryId: "",
            editPane: false,
            createCategory: false,
            createItem: false,
            createCategoryName: "",
            createItemName: "",
            optionNewCategory: "",
            optionNewItem: ""
        };
        
        this.createCategoryDropDown = this.createCategoryDropDown.bind(this);
        this.createItemDropDown = this.createItemDropDown.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.submitNewCategoryName = this.submitNewCategoryName.bind(this);
        this.submitNewItemName = this.submitNewItemName.bind(this);
        this.newCategoryNameKeyup = this.newCategoryNameKeyup.bind(this);
        this.newItemNameKeyup = this.newItemNameKeyup.bind(this);
        this.changeCreateCategoryName = this.changeCreateCategoryName.bind(this);
        this.changeCreateItemName = this.changeCreateItemName.bind(this);
        this.onItemChange = this.onItemChange.bind(this);
        this.trimNote = this.trimNote.bind(this);
        this.toggleEditPane = this.toggleEditPane.bind(this);
    }
    
    createCategoryDropDown(){
        let options = [];
        let index = 0;

        if (this.state.optionNewCategory !== ""){
            options.push((<option key={index} selected={true}>{this.state.optionNewCategory}</option>));
            index++;
        }

        if (this.props.categoryName !== ""){

            var matched = this.props.categories.filter(c => c.dateId === this.props.dateId && c.name === this.props.categoryName);
            if (matched.length > 0){
                options.push((<option key={index} value={matched[0].id}>{this.props.categoryName}</option>));
                index++;
            } else {
                options.push((<option key={index}>{this.props.categoryName}</option>));
                index++;
            }
            
        } else {

            // Pull categories of the current dateId
            var filtered = this.props.categories.filter(c => c.dateId === this.props.dateId);
            if (filtered.length > 0){
                for (var i = 0; i < filtered.length; i++){
                    options.push((<option key={index} value={filtered[i].id}>{filtered[i].name}</option>))
                    index++;
                }
            }
            
            options.push((<option key={index} value="---">bank (default)</option>));
            index++;
        }        
        options.push((<option key={index} value="">create new</option>));

        return options;
    }

    createItemDropDown(){
        let options = [];
        let index = 0;

        if (this.state.optionNewItem !== ""){
            options.push((<option selected={true} key={index}>{this.state.optionNewItem}</option>));
            index++;
        }

        if (this.props.itemName !== ""){

            var matched = this.props.items.filter(i => i.name === this.props.itemName && i.categoryId === this.props.categoryId && i.dateId === this.props.dateId);
            if (matched.length > 0){
                options.push((<option value={matched[0].id} key={index}>{this.props.itemName}</option>));
                index++;
            } else {
                options.push((<option key={index}>{this.props.itemName}</option>));
                index++;
            }            
        } else {

            // Pull related options if the category matches
            if (this.props.categoryId !== ""){
                let existingItems = this.props.items.filter(i => i.dateId === this.props.dateId);

                for (var i = 0; i < existingItems.length; i++){
                    if (existingItems[i].categoryId === this.props.categoryId){
                        options.push((<option key={index} value={existingItems[i].id}>{existingItems[i].name}</option>));
                        index++;
                    }
                }
            }

            options.push((<option key={index} value="---">bank (default)</option>));
            index++;
        }        
        options.push((<option key={index} value="">create new</option>));

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

    toggleEditPane(event){
        let state = this.state.editPane;

        this.setState({
            editPane: !state
        });
    }

    onCategoryChange(event){
        let value = event.target.value;

        // reset
        if (value === this.props.defaultCategory){
            this.props.setOverwriteCategoryName(this.props.tempId, "");
        }

        this.setState({
            createCategory: value === ""
        });
    }

    onItemChange(event){
        let value = event.target.value;

        // reset
        if (value === this.state.defaultItem){
            this.props.setOverwriteItemName(this.props.tempId, "");
        }
        
        this.setState({
            createItem: value === ""
        });
    }

    changeCreateCategoryName(event){
        this.setState({
            createCategoryName: event.target.value
        });        
    }

    changeCreateItemName(event){
        this.setState({
            createItemName: event.target.value
        });        
    }

    submitNewCategoryName(event){
        var result = this.state.createCategoryName;
        this.setState({
            createCategory: false,
            createCategoryName: "",
            optionNewCategory: result
        });
        this.props.setOverwriteCategoryName(this.props.tempId, result);
    }

    submitNewItemName(event){
        var result = this.state.createItemName;
        this.setState({
            createItem: false,
            createItemName: "",
            optionNewItem: result
        });
        this.props.setOverwriteItemName(this.props.tempId, result);
    }
    
    renderCreateNewCategory(){
        if (this.state.createCategory){
            return (
                <div className="form-horizontal">
                    <div className="form-group">
                        <div className="col-3">category name</div>
                        <div className="col-9">
                            <input className="form-input" type="text" value={this.state.createCategoryName} onKeyUp={this.newCategoryNameKeyup} onChange={this.changeCreateCategoryName} placeholder="category name" />
                        </div>
                    </div>
                    <div className="form-group float-right">
                        <input className="btn btn-primary" type="button" onClick={() => this.submitNewCategoryName()} value="create"></input>
                    </div>                    
                </div>  
            );
        }        
    }

    renderCreateNewItem(){
        if (this.state.createItem){
            return (
                <div className="form-horizontal">
                    <div className="form-group">
                        <div className="col-3">item name</div>
                        <div className="col-9">
                            <input className="form-input" type="text" value={this.state.createItemName} onKeyUp={this.newItemNameKeyup} onChange={this.changeCreateItemName} placeholder="item name" />
                        </div>
                    </div>
                    <div className="form-group float-right">
                        <input className="btn btn-primary" type="button" onClick={() => this.submitNewItemName()} value="create"></input>
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
                        <form className="form-horizontal">
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
                                    <input className="form-input" type="text" defaultValue={this.props.defaultNote} placeholder="note" />
                                </div>
                            </div>
                            {/* {this.renderCreateNewItem()} */}
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
        if (this.props.overwriteCategoryName !== ""){
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
        if (this.props.overwriteItemName !== ""){
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
        if (this.props.overwriteNote !== ""){
            return (
                <span>
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