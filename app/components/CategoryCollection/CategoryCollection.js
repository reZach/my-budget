import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as CategoryActions from "../../actions/category";
import styles from "./CategoryCollection.css";

class CategoryCollection extends Component<Props> {
    props: Props;

    render() {
        return (
            <React.Fragment>
                <div>CategoryCollection</div>
                <button onClick={() => {this.props.addCategory("testing")}}>add new category</button>
                
                {this.props.categories.map((value, index, array) => 
                    <div key={index}>
                        <span>'{value.name}' category {index}</span>
                    </div>                    
                )}

                
                {/* <button onClick={this.props.increment} type="button">&gt;</button> */}
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
    return bindActionCreators(CategoryActions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryCollection);