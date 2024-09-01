import ReactDOM from 'react-dom';
import React from 'react';
import ToastModal from './ToastModal';

if(!window.toastModal){
	window.toastModal = [];
}
if(!window.toastModalLt){
	window.toastModalLt = [];
}
export default (props) => {
	props = props || {};
	let app = document.getElementById('app');
	let container ;
	if(props.container && props.container.body){
		container = props.container.body;
	}else if(app){
		container = app;
	}else{
		container = document.body;
	} 
	let section = document.createElement('section');
	section.classList.add('toast-zijinyun-project');
	props.mark && section.setAttribute('data-mark',props.mark);
	container.appendChild(section);
	const toasts = ReactDOM.render(<ToastModal {...props} />, section);
	return toasts;
};
