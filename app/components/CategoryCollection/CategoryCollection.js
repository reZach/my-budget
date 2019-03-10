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
                
                {this.props.categories.map((value, index, array) => {
                    return value.dateId === this.props.date.id ?
                        <div key={index}>
                            <span>'{value.name}' category</span>
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