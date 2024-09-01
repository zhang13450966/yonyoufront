/*
 * @Author: huangkwf 
 * @Date: 2018-05-28 15:23:30 
 * @Last Modified by:   huangkwf 
 * @Last Modified time: 2018-05-28 15:23:30 
 */

import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
const { NCButton } = base;

export default class Operation extends Component {
	constructor(props) {
		super(props);
	}
	moveTo = (direction) => {
		this.props.moveTo(direction);
	};
	handleDisabled = () => {
		let { sourceSelectedKeys, targetSelectedKeys } = this.props;
		let resDisabled = { left: true, right: true };
		sourceSelectedKeys.length > 0 && (resDisabled.right = false);
		targetSelectedKeys.length > 0 && (resDisabled.left = false);
		return resDisabled;
	};
	render() {
		let { className,content } = this.props;
		let { left, right } = this.handleDisabled();
		return (
			<div className={className}>
				{/* <NCButton
					className="left-move-btn move-btn"
					colors="info"
					disabled={left}
					size="sm"
					onClick={this.moveTo.bind(this, 'left')}
				>
					<Icon className="uf-arrow-left" />
				</NCButton> */}
				<NCButton
					className="right-move-btn move-btn"
					fieldid="toRight"
					colors="info"
					disabled={right}
					size="sm"
					onClick={this.moveTo.bind(this, 'right')}
				>
					{/* <Icon className="uf-arrow-right" /> */}

					{content}
					<span className="iconfont icon icon-jiantouyou"></span>
				</NCButton>
			</div>
		);
	}
}
