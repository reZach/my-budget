import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import * as ItemCollectionActions from "../../actions/itemCollection";
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import * as ModifyActions from "../../actions/modify";
import styles from "./Category.css";
import Item from "../Item/Item";

const {dialog} = require('electron').remote;

class Category extends Component<Props> {
    props: Props;

    constructor(props){
        super(props);

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
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.renameCategory = this.renameCategory.bind(this);
        this.renameItem = this.renameItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.modifyNewItemName = this.modifyNewItemName.bind(this);
        this.getPercentageSpent = this.getPercentageSpent.bind(this);
        this.modifyNewCategoryName = this.modifyNewCategoryName.bind(this);
        this.handleEnterForCategory = this.handleEnterForCategory.bind(this);
        this.handleEnterForSubcategory = this.handleEnterForSubcategory.bind(this);
    }

    componentDidUpdate(){
        if (typeof this.newSubcategoryInput !== "undefined" && this.newSubcategoryInput !== null){
            this.newSubcategoryInput.focus();
        }
    }

    toggleRenameActive(){
        const newState = !this.state.renameActive;

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

    toggleCollapse(){
        const state = this.props.collapse;
        this.props.setCollapseCategory(this.props.id, !state);
    }

    toggleEditActive(){
        this.setState(state => (
            {editActive: !state.editActive}
        ));
    }

    toggleAddActive(){
        this.setState(state => (
            {addActive: !state.addActive}
        ));
    }

    renameCategory(){

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
        const {items} = this.props;

        if (typeof items.find(i => i.name === newName) === "undefined"){
            this.props.renameItem(categoryId, id, newName);
            this.props.trueModify();
        }        
    }

    deleteItem(categoryId: string, id: string, name: string){
        const { t } = this.props;        

        dialog.showMessageBox({
            title: t("deleteSubHypenCategory"),
            type: "warning",
            buttons: [t("Yes"), t("No")],
            message: `${t("areYouSureYouWantToDelete")} '${name}'?`
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

    getPercentageSpent(){
        let total = 0;

        for (let i = 0; i < this.props.transactions.length; i++){
            total += parseFloat(this.props.transactions[i].amount);
        }

        if (typeof this.props.spent === "undefined"){
            this.props.recalculateCategorySpent(this.props.dateId, this.props.id);
            return;
        }

        if (total === 0){
            return (
                <span className="label label-success">{this.props.spent} %</span>
            );
        } 
        const calculated = this.props.spent;

        if (calculated < 10){
            return (
                <span className="label label-success">{calculated} %</span>
            );
        } if (calculated < 30){
            return (
                <span className="label label-warning">{calculated} %</span>
            );
        } 
        return (
            <span className="label label-error">{calculated} %</span>
        );
    }

    createNewItem(){
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
        const code = event.keyCode || event.which;
        if (code === 13){
            this.renameCategory();
        } else if (code === 27){
            this.toggleRenameActive();
            event.target.blur();
        }
    }

    handleEnterForSubcategory(event){
        const code = event.keyCode || event.which;
        if (code === 13){
            this.createNewItem();
        } else if (code === 27){
            this.toggleAddActive();
            event.target.blur();
        }
    }

    renderCompound(){
        const { t } = this.props;

        if (this.state.renameActive && this.state.editActive){
            return (
                <form onSubmit={() => this.renameCategory()}>
                    <div className="input-group">
                        <input className="form-input input-sm" type="text" value={this.state.newCategoryName} onChange={this.modifyNewCategoryName} />
                        <button className="btn btn-sm btn-primary input-group-btn" type="submit">{t("update")}</button>
                        <button type="button" className="btn btn-sm input-group-btn" onClick={() => this.toggleRenameActive()} onKeyUp={() => this.toggleRenameActive()}>{t("cancel")}</button>
                    </div>
                </form>
            );
        } if (this.state.editActive) {
            return (
                <div className="input-group float-right">                    
                    <button type="button" className="btn btn-sm btn-error input-group-btn" id={this.props.id} onClick={() => this.props.delete(this.props.id, this.props.name)} onKeyUp={() => this.props.delete(this.props.id, this.props.name)}>{t("delete")}</button>
                    <button type="button" className="btn btn-sm btn-primary input-group-btn" onClick={this.toggleRenameActive} onKeyUp={this.toggleRenameActive}>{t("rename")}</button>                    
                    <button type="button" className="btn btn-sm input-group-btn" onClick={this.toggleEditActive} onKeyUp={this.toggleEditActive}>{t("cancel")}</button>
                </div>
            );            
        }
    }

    renderControls(){
        const { t } = this.props;

        if (this.state.renameActive){
            return (
                <div className="column col-xs-auto text-center">
                    <div className="columns">
                        <input className="column col-8" type="text" value={this.state.newCategoryName} onChange={this.modifyNewCategoryName} onKeyUp={this.handleEnterForCategory} placeholder={t("newNameLowercase")} />
                        <i role="button" tabIndex={0} className={`column col-2 fas fa-check ${styles.icon} ${styles['icon-fix']}`} onClick={() => this.renameCategory()} onKeyUp={() => this.renameCategory()} />
                        <i role="button" tabIndex={0} className={`column col-2 fas fa-ban ${styles.icon} ${styles['icon-fix']}`} onClick={() => this.toggleRenameActive()} onKeyUp={() => this.toggleRenameActive()} />
                    </div>
                </div>                
            );
        } 

        return (
            <React.Fragment>
                <div role="button" tabIndex={0} className={`column col-1 text-center ${styles.icon}`} onClick={this.toggleRenameActive} onKeyUp={this.toggleRenameActive}>
                    <i className="fas fa-edit" />
                </div>
                <div role="button" tabIndex={0} className={`column col-1 text-center ${styles.icon}`} onClick={() => this.props.delete(this.props.id, this.props.name)} onKeyUp={() => this.props.delete(this.props.id, this.props.name)}>
                    <i className={`fas fa-trash-alt ${styles.icon}`} />
                </div>
            </React.Fragment>                                
        );
    }

    renderNewSubcategory(){
        const { t } = this.props;

        if (!this.state.addActive){
            return (
                <div role="button" tabIndex={0} className={`column col-xs-auto text-left ${styles.h30} ${styles.icon}`} onClick={() => this.toggleAddActive()} onKeyUp={() => this.toggleAddActive()}>
                    {t("subHypenCategory")} <i className="fas fa-plus-square" />
                </div>
            );
        } 

        return (
            <div className={`column col-xs-auto text-center ${styles.h30}`}>
                <div className="columns">
                    <input ref={me => (this.newSubcategoryInput = me)} className="column col-10" type="text" placeholder={t("subHypenCategory")} value={this.state.newItemName} onChange={this.modifyNewItemName} onKeyUp={this.handleEnterForSubcategory} />
                    <i role="button" tabIndex={0} className={`column col-1 fas fa-check ${styles.icon} ${styles['icon-fix']}`} onClick={() => this.createNewItem()} onKeyUp={() => this.createNewItem()} />
                    <i role="button" tabIndex={0} className={`column col-1 fas fa-ban ${styles.icon} ${styles['icon-fix']}`} onClick={() => this.toggleAddActive()} onKeyUp={() => this.toggleAddActive()} />                                
                </div>
            </div>
        );
    }

    render () {
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column col-12">
                        {/* HACK TABLE */}
                        <div className={`columns ${styles.dark} ${styles.category}`}>
                            <div role="button" tabIndex={0} className={`column col-xs-auto ${styles["category-header"]}`} onClick={this.toggleCollapse} onKeyUp={this.toggleCollapse}>
                                {this.props.collapse ? <i className="fas fa-caret-right" /> : <i className="fas fa-caret-down" />} {this.props.name} {this.getPercentageSpent()}
                            </div>
                            {this.renderControls()}                            
                        </div>
                        {this.props.collapse ? <React.Fragment></React.Fragment> :
                        <React.Fragment>
                            {this.props.items.sort((a, b) => {
                                const a1 = a.name.toLowerCase();
                                const b1 = b.name.toLowerCase();
                                if (a1 > b1) return 1;
                                if (a1 < b1) return -1;
                                return 0;
                            }).map((value) => <div key={`${value.dateId}-${value.id}-${value.categoryId}`}>
                                    <Item {...value} categoryId={this.props.id} dateId={this.props.dateId} rename={this.renameItem} delete={this.deleteItem} />
                                </div>)}
                            <div className="columns">
                                {this.renderNewSubcategory()}
                            </div>
                        </React.Fragment>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state, props){
    return {                
        items: state.items.filter(i => i.dateId === props.dateId && i.categoryId === props.id),
        transactions: state.transactions.filter(t => t.dateId === props.dateId),
        categories: state.categories.filter(c => c.dateId === props.dateId)
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(
        {...ItemCollectionActions,
        ...ModifyActions,
        ...CategoryCollectionActions}, dispatch);
}

const translatedComponent = withTranslation()(Category);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translatedComponent);

// ugh:
// https://blog.scottlogic.com/2016/05/19/redux-reducer-arrays.html