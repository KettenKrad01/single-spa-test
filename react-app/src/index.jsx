import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

if (!window.singleSpaStarted) {
    ReactDOM.render(<App />, document.getElementById("root"));
}

export async function bootstrap(props) {
    console.log("react app bootstrap", props);
}

export async function mount(props) {
    console.log("react app mount", props);
    ReactDOM.render(<App />, document.getElementById("react-app"));
}

export async function unmount(props) {
    console.log("react app unmount", props);
    ReactDOM.unmountComponentAtNode(document.querySelector('#react-app'))
}

