import React, { Component } from 'react';

class StyleButton extends Component {
	constructor(props) {
		super(props);
	}
	onToggle = (e) => {
		e.preventDefault();
		this.props.onToggle(this.props.style);
	};

	render() {
		let className = 'hrEditor-styleButton',
			disabled = this.props.disabled || false;
		if (this.props.active) {
			className += ' hrEditor-activeButton';
		}
		if (this.props.iconClassName) {
			className += ' ' + this.props.iconClassName;
		}
		return (
			<button className={className} onMouseDown={this.onToggle} disabled={disabled}>
				{this.props.label || this.props.children}
			</button>
		);
	}
}
export default StyleButton;
