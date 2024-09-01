/**
 * 布局-内容区
 * @constructor
 * @author neo   
*/
import React, { Component } from 'react';
import Left from '../left';
import Content from '../content';
class Main extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { children, className } = this.props;
		let _class_ = 'row-main';
		if (className) {
			_class_ += ' ' + className;
		}
		return (
			<div className={_class_}>
				{React.Children.map(children, (child) => {
					return <child.type {...child.props}>{child.props.children}</child.type>;
				})}
			</div>
		);
	}
}
Main.Left = Left;
Main.Content = Content;
export default Main;
