import React from 'react';


import StartingPoint from "./navigation/StartingPoint";
import {applyMiddleware, combineReducers, createStore} from "redux";
import housesReducer from "./store/reducers/houses";
import ReduxThunk from 'redux-thunk';
import {Provider} from "react-redux";
import {enableScreens} from "react-native-screens";
import uiReducer from "./store/reducers/ui";


const rootReducer = combineReducers({
    houses: housesReducer,
    uiReducer: uiReducer
})

enableScreens();

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

export default function App() {
    return (
        <Provider store={store}>
            <StartingPoint/>
        </Provider>
    );
}
