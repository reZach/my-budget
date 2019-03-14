import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as ItemCollectionActions from "../../actions/itemCollection";
import styles from "./Category.css";
import Item from "../Item/Item";

class Category extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            newItemName: ""
        }

        this.modifyNewItemName = this.modifyNewItemName.bind(this);
    }

    modifyNewItemName(event){
        this.setState({
            newItemName: event.target.value
        });
    }

    createNewItem(event){
        if (this.state.newItemName !== ""){

            // Don't create duplicate items
            if (typeof this.props.items.find(i => i.dateId === this.props.dateId && i.name === this.state.newItemName) === "undefined"){
                this.props.addItem(this.props.id, this.state.newItemName);

                this.setState({
                    newItemName: ""
                });
            }
        }
    }

    render () {
        return (
            <React.Fragment>
                <div>
                    <span>'{this.props.name}' category</span>
                    <button onClick={() => this.props.rename(this.props.id, "newname")}>Rename</button>
                    <button id={this.props.id} onClick={() => this.props.delete(this.props.id)}>Delete</button>
                </div>                

                <div>
                    <span>items</span>
                    <form onSubmit={() => this.createNewItem()}>
                        <input type="text" value={this.state.newItemName} onChange={this.modifyNewItemName}></input>
                        <button type="submit">new item</button>
                    </form>
                    {this.props.items.map((value, index, array) => {
                        return <div key={index}>
                            <Item></Item>
                        </div>;
                    })}
                </div>
                
            </React.Fragment>
        );
    }
}


function mapStateToProps(state, props){
    return {                
        items: state.items.filter(i => i.dateId === props.dateId && i.categoryId === props.id)
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(ItemCollectionActions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Category);

// ugh:
// https://blog.scottlogic.com/2016/05/19/redux-reducer-arrays.html