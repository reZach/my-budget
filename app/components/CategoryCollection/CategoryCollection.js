import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import styles from "./CategoryCollection.css";

class CategoryCollection extends Component<Props> {
    props: Props;

    render() {
        return (
            <div>CategoryCollection</div>
            {props.categories.map((value, index, array) => 
                <span>category {index}</span>
            )}
        );
    }
}



function mapStateToProps(state){
    return {
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