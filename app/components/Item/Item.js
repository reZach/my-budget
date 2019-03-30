import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

export default class Item extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            newItemName: "",
            renameActive: false
        }

        this.renameItem = this.renameItem.bind(this);
        this.newItemName = this.newItemName.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.toggleRenameActive = this.toggleRenameActive.bind(this);
    }

    renameItem(event){
        this.props.rename(this.props.categoryId, this.props.id, this.state.newItemName);
        this.setState({
            renameActive: false,
            newItemName: ""
        });
    }
    
    newItemName(event){
        this.setState({
            newItemName: event.target.value
        });
    }

    deleteItem(event){
        this.props.delete(this.props.categoryId, this.props.id, this.props.name);
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
                newItemName: ""
            });
        }
    }

    render(){
        return (
            <React.Fragment>
                <div className="columns">
                    <div className="column col-7 text-left">
                        {this.props.name}
                    </div>
                    <div className="column col-5">
                        {this.state.renameActive ? 
                        <form onSubmit={() => this.renameItem()}>
                            <div className="input-group">
                                <input className="form-input input-sm" type="text" autoFocus value={this.state.newItemName} onChange={this.newItemName}></input>
                                <button type="button" className="btn btn-sm input-group-btn" onClick={() => this.toggleRenameActive()}>cancel</button>
                                <button className="btn btn-sm btn-primary input-group-btn" type="submit">update</button>
                            </div>                            
                        </form>
                         : 
                         <div className="input-group float-right">
                            <button className="btn btn-sm input-group-btn" onClick={this.toggleRenameActive}>rename</button>
                            <button className="btn btn-sm btn-error input-group-btn" id={this.props.id} onClick={() => this.deleteItem()}>delete</button>
                         </div>                        
                        }
                    </div>
                </div>                
            </React.Fragment>
        );
    }
}