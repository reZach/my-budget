// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import styles from './Home.css';
import Date from "../Date/Date";
import Save from "../Save/Save";
import CategoryCollection from "../CategoryCollection/CategoryCollection";
import TransactionCollection from '../TransactionCollection/TransactionCollection';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <Date />
        <div style={{"marginBottom": "50px"}}></div>
        <div>
          <div style={{"width": "50%", "float": "left"}}>
            <CategoryCollection />
          </div>
          <div style={{"width": "50%", "float": "left"}}>
            <TransactionCollection />
          </div>
        </div>
        
        <Save/>
        {/* <Link to={routes.COUNTER}>to Counter</Link> */}
      </div>
    );
  }
}
