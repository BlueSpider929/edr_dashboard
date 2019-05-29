import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import rootReducer from './data/reducers';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleWare from 'redux-thunk';

import {fetchJobData} from './data/actions/job-action'
import { loadFonts } from './data/actions/font-loader-action';
const store = createStore(rootReducer,applyMiddleware(thunkMiddleWare));
store.dispatch(fetchJobData());
store.dispatch(loadFonts());
ReactDOM.render(
<Provider store={store} >
    <App />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
