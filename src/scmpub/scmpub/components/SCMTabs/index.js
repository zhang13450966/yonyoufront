/*
 * @Author: hufei 
 * @PageInfo: 平台tabControl组件不支持页签禁用, 这里在平台基础上做一个扩展
 * @Date: 2018-10-17 11:14:16 
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 09:56:05
 */
import React, { Component } from 'react';
import './index.less';

export default class SCMTabs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentIndex: this.props.defaultKey
		};
	}

	componentWillReceiveProps(newProps) {
		if (newProps.defaultKey != this.props.defaultKey) {
			this.setState({
				currentIndex: newProps.defaultKey
			});
		}
	}

	render() {
		return (
			<div className="lightapp-component-TabLi">
				{this.props.children.map((element, index) => {
					if (element.props.disabled) {
						return (
							<div className={'tab_title disabled'}>
								<p>{element.props.children}</p>
								<p />
							</div>
						);
					} else {
						return (
							<div
								onClick={() => {
									this.setState({ currentIndex: index }, element.props.clickFun);
								}}
								className={index === this.state.currentIndex ? 'tab_title active' : 'tab_title'}
							>
								<p>{element.props.children}</p>
								<p />
							</div>
						);
					}
				})}
			</div>
		);
	}
}
