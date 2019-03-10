// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import styles from './Home.css';
import Date from "../Date/Date";
import CategoryCollection from "../CategoryCollection/CategoryCollection";

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <Date />
        <div style={{"marginBottom": "50px"}}></div>
        <CategoryCollection />
        {/* <Link to={routes.COUNTER}>to Counter</Link> */}
      </div>
    );
  }
}
