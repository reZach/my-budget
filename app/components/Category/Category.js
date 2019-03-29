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
            newItemName: "",
            newCategoryName: "",
            renameActive: false
        }

        this.toggleRenameActive = this.toggleRenameActive.bind(this);
        this.renameCategory = this.renameCategory.bind(this);
        this.modifyNewItemName = this.modifyNewItemName.bind(this);
        this.modifyNewCategoryName = this.modifyNewCategoryName.bind(this);        
    }

    toggleRenameActive(event){
        let newState = !this.state.renameActive;

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

    renameCategory(event){
        this.props.rename(this.props.id, this.state.newCategoryName);
        this.setState({
            renameActive: false,
            newCategoryName: ""
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
                    <div className="column col-7 text-left">
                        <h3>{this.props.name}</h3>                        
                    </div>
                    <div className="column col-5 text-right">
                        {this.state.renameActive ? 
                        <form onSubmit={() => this.renameCategory()}>
                            <div className="input-group">
                                <input className="form-input input-sm" type="text" autoFocus value={this.state.newCategoryName} onChange={this.modifyNewCategoryName}></input>
                                <button type="button" className="btn btn-sm input-group-btn" onClick={() => this.toggleRenameActive()}>cancel</button>
                                <button className="btn btn-sm btn-primary input-group-btn" type="submit">update</button>
                            </div>                            
                        </form>
                         : 
                         <div className="input-group float-right">
                            <button className="btn btn-sm input-group-btn" onClick={this.toggleRenameActive}>rename</button>
                            <button className="btn btn-sm btn-error input-group-btn" id={this.props.id} onClick={() => this.props.delete(this.props.id, this.props.name)}>delete</button>
                         </div>                        
                        }
                    </div>
                </div>                
                <div className="columns">
                    <div className="column col-12 text-left">
                        {/* <span>items</span> */}
                        <form onSubmit={() => this.createNewItem()}>
                            <div className="input-group">
                                <input className="form-input" type="text" placeholder="sub-category" value={this.state.newItemName} onChange={this.modifyNewItemName}></input>
                                <button className="btn btn-primary input-group-btn" type="submit">add new</button>
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