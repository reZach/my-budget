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
      <div className="container">
        <div className="columns text-center">
          <div className="column col-8 col-mx-auto">
            <Date />
          </div>
          <div className="column col-4">
            <Income />
          </div>
        </div>
        <div className="columns">
          <div className="column col-8">
            <CategoryCollection />
          </div>
          <div className="column col-4">
            <TransactionCollection />
          </div>                    
          <Save/>
        </div>
        {/* <Link to={routes.COUNTER}>to Counter</Link> */}
      </div>
    );
  }
}
