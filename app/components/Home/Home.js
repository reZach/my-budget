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
        <div className={`columns text-center ${styles['column-mb']}`}>
          <div className="column col-7">
            <div className="columns">
              <div className="column col-12">
                <div className="card" style={{flexDirection: "row", flex: "1"}}>
                  <div className="column col-4">
                    <Save/>
                  </div>
                  <div className="column col-8">
                    <Date />
                  </div>
                </div>
              </div>
              <div className="column col-12">
                <div className="card">
                  <div className="column col-12" style={{overflowY: "auto"}}>
                    <CategoryCollection />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column col-5">
            <div className="columns">
              <div className="column col-12">
                <Income />
              </div>              
            </div>
            <div className="columns">
              <div className="column col-12">
                <TransactionCollection />
              </div>              
            </div>
          </div>
        </div>
        {/* <Link to={routes.COUNTER}>to Counter</Link> */}
      </div>
    );
  }
}
