// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import styles from './Home.css';
import Date from "../Date/Date";
import Income from "../Income/Income";
import Save from "../Save/Save";
import CategoryCollection from "../CategoryCollection/CategoryCollection";
import TransactionCollection from '../TransactionCollection/TransactionCollection';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={`container ${styles['app-container']}`}>
        <div className={`columns ${styles.header} ${styles.h50}`}>
          <div className={`column col-3`}>
            <Save/>
          </div>
          <div className={`column col-4`}>
            <Date />
          </div>
          <div className={`column col-5`}>
            <Income />
          </div>
        </div>
        <div className={`columns ${styles.h100}`}>
          <div className={`column col-7 ${styles.h100}`}>
            <CategoryCollection />
          </div>
          <div className={`column col-5 ${styles.h100}`}>
            <TransactionCollection />
          </div>
        </div>
        {/* 
        <TransactionCollection />         */}
        {/* <Link to={routes.COUNTER}>to Counter</Link> */}
      </div>
    );
  }
}
