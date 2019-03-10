import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as CategoryActions from "../../actions/category";
import styles from "./CategoryCollection.css";

class CategoryCollection extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            newCategoryName: ""
        };

        this.modifyNewCategoryName = this.modifyNewCategoryName.bind(this);
        this.createNewCategory = this.createNewCategory.bind(this);
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

    deleteCategory(event){
        this.props.removeCategory(event.target.id);
    }

    render() {
        return (
            <React.Fragment>
                
                <form onSubmit={() => this.createNewCategory()}>
                    <input type="text" value={this.state.newCategoryName} onChange={this.modifyNewCategoryName}></input>
                    <button type="submit">add new category</button>
                </form>
                
                
                {this.props.categories.map((value, index, array) => {
                    return value.dateId === this.props.date.id ?
                        <div key={this.props.date.id + "-" + value.id}>
                            <span>'{value.name}' category</span>
                            <button id={value.id} onClick={this.deleteCategory}>Delete</button>
                        </div>
                    :
                        <React.Fragment key={index}></React.Fragment>
                })}

                
                {/* <button onClick={this.props.increment} type="button">&gt;</button> */}
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
    return bindActionCreators(CategoryActions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryCollection);