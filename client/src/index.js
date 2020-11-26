// Polyfill is a piece of code used to provide modern functionality on older browsers that do not natively support it
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
// Polyfill for ECMAScript up to 2019
import 'core-js';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";

import Reducer from './_reducers';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

ReactDOM.render(
  <Provider 
    store={createStoreWithMiddleware(
      Reducer, 
      window.__REDUX_DEVTOOLS_EXTENSION__ && 
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )}
  >
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById('root')
  
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
