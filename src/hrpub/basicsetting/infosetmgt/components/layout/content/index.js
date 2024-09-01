/**
 * 布局-右侧内容
 * @constructor
 * @author neo   
*/
import React, { Component } from 'react';
export default class Content extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { children, className } = this.props;
		let _class_ = 'col-content';
		if (className) {
			_class_ += ' ' + className;
		}
		return (
			<section className={_class_}>
				{React.Children.map(children, (child) => {
					return <child.type {...child.props}>{child.props.children}</child.type>;
				})}
			</section>
		);
	}
}
