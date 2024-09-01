/**
 * 布局-Header
 * @constructor
 * @author neo   
*/
import React, { Component } from 'react';
export default class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { children, className } = this.props;
		let _class_ = 'row-header';
		if (className) {
			_class_ += ' ' + className;
		}
		return (
			<header className={_class_}>
				{React.Children.map(children, (child) => {
					return <child.type {...child.props}>{child.props.children}</child.type>;
				})}
			</header>
		);
	}
}
