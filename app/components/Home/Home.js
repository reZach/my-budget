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
        <h2>Home</h2>
        <CategoryCollection />
        {/* <Link to={routes.COUNTER}>to Counter</Link> */}
      </div>
    );
  }
}
