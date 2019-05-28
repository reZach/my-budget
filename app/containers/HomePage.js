// @flow
import React, { Component, Suspense } from 'react';
import Home from '../components/Home/Home';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <Suspense fallback="">
        <Home />
      </Suspense>
    );
  }
}
