import {combineReducers} from 'redux';

import jobReducer from './job-reducer';
import FontConfigReducer from './font-config-reducer';

export default combineReducers({
    jobs:jobReducer,
    fontConfig: FontConfigReducer
});