import React, { Component } from "react";
import styles from "./ImportBank.css";
import { dateToShort } from "../../utils/readableDate";

export default class ImportBank extends Component<Props> {
    props: Props;

    constructor(){
        super();
        
        this.trimNote = this.trimNote.bind(this);
    }    

    trimNote(note){
        if (note.length > 9){
            return note.substring(0, 8) + "...";
        } else {
            return note;
        }
    }

    render () {
        return (
            <div className={`columns ${styles.importrow}`}>
                <div className="column col-1">
                    <input type="checkbox" value="import" defaultChecked={this.props.import} onClick={() => this.props.toggleImport(this.props.tempId)}></input>                    
                </div>                    
                <div className="column col-2">
                    {`${this.props.dateId}`}
                </div>
                <div className="column col-2">
                    ${this.props.amount}
                </div>
                <div className="column col-2">
                    {this.props.categoryName}
                </div>
                <div className="column col-2">
                    {this.props.itemName}
                </div>
                <div className={`column col-3 ${styles.note}`}>{this.trimNote(this.props.note)}</div>
            </div>
        );
    }
}