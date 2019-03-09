import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as CategoryCollectionActions from "../../actions/categoryCollection";
import styles from "./CategoryCollection.css";

class CategoryCollection extends Component<Props> {
    props: Props;

    render() {
        return (
            <React.Fragment>
                <div>CategoryCollection</div>
                {this.props.categories.map((value, index, array) => 
                    <span key={index}>category {index}</span>
                )}
            </React.Fragment>
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