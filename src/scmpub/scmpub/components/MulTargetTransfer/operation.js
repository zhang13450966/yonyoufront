/*
 * @Author: huangkwf
 * @Date: 2018-05-28 15:23:30
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-07-23 15:17:23
 */

import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
const { NCIcon: Icon, NCButton: Button } = base;

export default class Operation extends Component {
	constructor(props) {
		super(props);
	}
	moveTo = direction => {
		this.props.moveTo(direction);
	};
	handleDisabled = () => {
		let { sourceSelectedKeys, tTargetSelectedKeys, bTargetSelectedKeys } = this.props;
		let resDisabled = { left: true, right: true };
		sourceSelectedKeys.length > 0 ? (resDisabled.right = false) : '';
		tTargetSelectedKeys.length > 0 ? (resDisabled.left = false) : '';
		bTargetSelectedKeys.length > 0 ? (resDisabled.left = false) : '';
		return resDisabled;
	};
	render() {
		let { className } = this.props;
		let { left, right } = this.handleDisabled();
		return (
			<div className={className}>
				<Button fieldid="right-move_btn"
					className="right-move-btn move-btn nc-theme-btn-secondary"
					disabled={right}
					onClick={this.props.moveToRTop.bind(this, 'right')}
				>
					<Icon className="uf-arrow-right" />
				</Button>
				<Button fieldid="left-move_btn"
					className="left-move-btn move-btn nc-theme-btn-secondary"
					disabled={left}
					onClick={this.props.moveToSource.bind(this, 'left')}
				>
					<Icon className="uf-arrow-left" />
				</Button>
				<Button fieldid="right_btn"
					className="right-move-btn move-btn nc-theme-btn-secondary"
					disabled={right}
					onClick={this.props.moveToRBottom.bind(this, 'right')}
				>
					<Icon className="uf-arrow-right" />
				</Button>
			</div>
		);
	}
}
