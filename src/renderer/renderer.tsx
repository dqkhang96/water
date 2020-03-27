/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './Main'
import {configureStore} from '@/redux'
import { Provider } from 'react-redux'

// Import the styles here to process them with webpack
import '@public/style.css';

const store = configureStore()


ReactDOM.render(
  <Provider store={store}>
    <Main/>
  </Provider>,
  document.getElementById('app')
);
