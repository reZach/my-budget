import React from 'react';
import {
    render
} from 'react-dom';
import {
    AppContainer
} from 'react-hot-loader';
import { I18nextProvider } from "react-i18next";
import Root from './containers/Root';
import i18n from "./utils/i18n/i18n.config";
import initialStore from "./store/initialStore";
import {
    configureStore,
    history
} from './store/configureStore';
import './app.global.css';

require("electron"); // Needed so we can call require("electron") in render processes

const store = configureStore(initialStore);


render( 
  <AppContainer>
    <I18nextProvider i18n={i18n}>
      <Root store = {store} history = {history}/>
    </I18nextProvider>    
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
    module.hot.accept('./containers/Root', () => {
        // eslint-disable-next-line global-require
        const NextRoot = require('./containers/Root').default;
        render( 
          <AppContainer>
            <NextRoot store = {store} history = {history}/> 
          </AppContainer>,
          document.getElementById('root')
        );
    });
}