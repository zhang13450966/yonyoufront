/*
 * @Author: hufei 
 * @PageInfo: 图表对比左边信息  
 * @Date: 2019-01-23 14:53:52 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-08-22 11:12:33
 */
import React, { Component } from 'react';

export default class Info extends Component {
	render() {
		let { data } = this.props;
		return (
			<ul className="bar-info">
				{Object.keys(data).map((item, index) => {
					if (data[item] && data[item].display) {
						return (
							<li key={index} fieldid={item}>
								<span>{data[item].display}：</span>
								<span>{data[item].value ? data[item].value : ''}</span>
							</li>
						);
					}
				})}
			</ul>
		);
	}
}
