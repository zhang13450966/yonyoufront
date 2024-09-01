/**
 * 布局-左侧树结构
 * @constructor
 * @author neo   
*/
import React, { Component } from 'react';
export default class Left extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { children, className } = this.props;
		let _class_ = 'col-left';
		if (className) {
			_class_ += ' ' + className;
		}
		return (
			<aside className={_class_}>
				{React.Children.map(children, (child) => {
					return <child.type {...child.props}>{child.props.children}</child.type>;
				})}
			</aside>
		);
	}
}
