/**
 * 布局结构
 * @constructor
 * @author neo   
*/
import React, { Component } from 'react';
import Header from './header';
import Main from './main';
import './index.less';
class Layout extends Component {
	constructor(props) {
		super(props);
	}
	getPageHeight = () => {
		let height = 'auto';
		this.page && (height = parseInt(getComputedStyle(this.page)['height']) - 54 + 'px');

		return height;
	};
	render() {
		const { className, children } = this.props;
		let _className_ = className || '';
		return (
			<div className={`container ${_className_}`}>
				{React.Children.map(children, (child) => {
					return (
						<child.type {...child.props} layoutHeight={this.getPageHeight()}>
							{child.props.children}
						</child.type>
					);
				})}
			</div>
		);
	}
}

Layout.Header = Header;
Layout.Main = Main;
export default Layout;
