import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as CategoryCollectionActions from "../../actions/categoryCollection";
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
    }

    render() {
        return (
            <React.Fragment>
                
                <form onSubmit={() => this.createNewCategory()}>
                    <input type="text" placeholder="category" value={this.state.newCategoryName} onChange={this.modifyNewCategoryName}></input>
                    <button type="submit">add new category</button>
                </form>
                
                
                {this.props.categories.sort((a, b) => a.name > b.name).map((value, index, array) => {
                    return value.dateId === this.props.date.id ?
                        <div key={this.props.date.id + "-" + value.id}>
                            <Category {...value} dateId={this.props.date.id} rename={this.renameCategory} delete={this.deleteCategory}></Category>
                        </div>
                    :
                        <React.Fragment key={index}></React.Fragment>
                })}
            </React.Fragment>
        );
    }
}



function mapStateToProps(state){
    return {
        date: state.date,
        categories: state.categories
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(CategoryCollectionActions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryCollection);