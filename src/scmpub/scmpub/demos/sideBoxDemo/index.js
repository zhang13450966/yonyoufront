/*
 * @Author: hufei 
 * @PageInfo: 侧拉框使用示例
 * @Date: 2018-05-03 15:07:27 
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 13:54:19
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SideBox from '../../components/SideBox/index';
import { base } from 'nc-lightapp-front';

const { NCButton: Button } = base;
export default class SideBoxDemo extends Component {
	constructor() {
		super();
		this.state = {
			flag: true
		};
	}
	render() {
		let headerInnerHTML = (
			<div className="btn-group">
				<Button>修改</Button>
				<Button>单据追溯</Button>
				<Button>其它</Button>
			</div>
		);
		let bodyInnerHTML = <div>主体内容</div>;
		let footerInnerHTML = <div>底部内容</div>;
		return (
			<div>
				<h3>1. 侧拉框使用示例</h3>
				<Button onClick={() => this.setState({ flag: true })}>点击显示</Button>
				<SideBox
					flag={this.state.flag}
					title="联查明细"
					className="test"
					headerInnerHTML={headerInnerHTML}
					bodyInnerHTML={bodyInnerHTML}
					onChange={(flag) => {
						this.setState({ flag });
					}}
				/>
			</div>
		);
	}
}
ReactDOM.render(<SideBoxDemo />, document.getElementById('app'));
