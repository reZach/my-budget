import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import * as ItemCollectionActions from "../../actions/itemCollection";
import styles from "./CategoryCollection.css";
import Category from "../Category/Category";

class CategoryCollection extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            newCategoryName: ""
        };

        this.modifyNewCategoryName = this.modifyNewCategoryName.bind(this);
        this.createNewCategory = this.createNewCategory.bind(this);
        this.renameCategory = this.renameCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
    }
    
    modifyNewCategoryName(event){
        this.setState({
            newCategoryName: event.target.value
        });
    }

    createNewCategory(event) {
        if (this.state.newCategoryName !== "") {

            // Don't create duplicate categories
            if (typeof this.props.categories.find(c => c.dateId === this.props.date.id &&
                    c.name === this.state.newCategoryName) === "undefined") {
                this.props.addCategory(this.state.newCategoryName);

                this.setState({
                    newCategoryName: ""
                });
            }

        }
    }

    renameCategory(id, newName){
        this.props.renameCategory(id, newName);
    }

    deleteCategory(id){
        this.props.removeCategory(id);

        let items = this.props.items.filter(i => i.categoryId === id && i.dateId === this.props.date.id);

        // delete items
        if (items.length > 0){
            for (var i = 0; i < items.length; i++){
                this.props.removeItem(id, items[i].id);
            }
        }        
    }

    render() {
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column col-12 text-left">
                        <h2>categories</h2>                        
                    </div>                    
                    <div className={`column col-8 text-left ${styles['category-input']}`}>      
                        <form onSubmit={() => this.createNewCategory()}>                            
                            <div className="input-group">
                                <input className="form-input input-lg" type="text" placeholder="category" value={this.state.newCategoryName} onChange={this.modifyNewCategoryName}></input>
                                <button className="btn btn-primary btn-lg input-group-btn" type="submit">add new category</button>
                            </div>                                                        
                        </form>
                    </div>                    
                </div>
                <div className="columns">
                {this.props.categories.sort((a, b) => a.name > b.name).map((value, index, array) => {
                    return value.dateId === this.props.date.id ?
                        <div className={`column col-8 text-left ${styles.category}`} key={this.props.date.id + "-" + value.id}>
                            <Category {...value} dateId={this.props.date.id} rename={this.renameCategory} delete={this.deleteCategory}></Category>
                        </div>
                    :
                        <React.Fragment key={index}></React.Fragment>
                })}    
                </div>                                                                
            </React.Fragment>
        );
    }
}



function mapStateToProps(state){
    return {
        date: state.date,
        categories: state.categories,
        items: state.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...CategoryCollectionActions, ...ItemCollectionActions}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryCollection);