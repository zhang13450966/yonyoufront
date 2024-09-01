import ReactDOM from 'react-dom';
import ConfigModal from './component/ConfigModal';
import React from "react";

export default (props) => {
    props = props || {};
    let app = document.getElementById('app');
    let container;
    if (props.container) {
        if (props.container.body) {
            container = props.container.body;
        }
    } else if (app) {
        container = app;
    } else {
        container = document.body;
    }
    let div = document.createElement('section');
    container && container.appendChild(div);
    return ReactDOM.render(<ConfigModal onSure={props.beSureBtnClick} {...props} container={div}/>, div);
};
