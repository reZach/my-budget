import React, { Component } from "react";
import styles from "./ImportBank.css";
import { dateToShort } from "../../utils/readableDate";

export default class ImportBank extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            
        }
    }    

    render () {
        return (
            <div className={`columns ${styles.importrow}`}>                    
                <div className="column col-2">
                    {`${this.props.dateId}`}
                </div>
                <div className="column col-2">
                    ${this.props.amount}
                </div>
                <div className={`column col-8 ${styles.note}`}>{this.props.note}</div>
            </div>
        );
    }
}