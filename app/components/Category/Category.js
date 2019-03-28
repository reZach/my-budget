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
                <div className="columns">
                    <div className="column col-12 text-left">
                        <h4>{this.props.name}</h4>
                    </div>
                    <div className="column col-12 text-left">
                    
                    </div>
                </div>
                <div style={{"border": "1px solid red"}}>
                    <div>
                        
                        <button onClick={() => this.props.rename(this.props.id, "newname")}>Rename</button>
                        <button id={this.props.id} onClick={() => this.props.delete(this.props.id)}>Delete</button>
                    </div>                

                    <div>
                        {/* <span>items</span> */}
                        <form onSubmit={() => this.createNewItem()}>
                            <div className="input-group">
                                <input className="form-input" type="text"value={this.state.newItemName} onChange={this.modifyNewItemName}></input>
                                <button className="btn btn-primary input-group-btn" type="submit">new item</button>
                            </div>
                            
                        </form>
                        {this.props.items.sort((a, b) => a.name > b.name).map((value, index, array) => {
                            return <div key={index}>
                                <Item {...value} categoryId={this.props.id} dateId={this.props.dateId}></Item>
                            </div>;
                        })}
                    </div>
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