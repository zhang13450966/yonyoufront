/*
 * @Author: 刘奇 
 * @PageInfo: 费用冲抵
 * @Date: 2019-03-15 14:56:32 
 * @Last Modified by: zhaoqiangq
 * @Last Modified time: 2022-04-16 16:04:10
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { ARSUB_CONST } from '../const';

class CasharsubDetailDlg extends Component {
	constructor(props) {
		super(props);
		this.tableId = ARSUB_CONST.detailId;
		props.use.editTable(this.tableId);
		initTemplate.call(this, this.props);
	}

	componentDidMount() {
		this.initData();
	}
	//请求列表数据
	initData = () => {
		let showdata = null;
		if (this.props.billQueryPara == undefined || this.props.billQueryPara == null) {
			showdata = { rows: [] };
		} else {
			showdata = this.props.billQueryPara[this.tableId];
		}
		this.props.editTable.setTableData(this.tableId, showdata);
	};

	render() {
		let { editTable } = this.props;
		let { createEditTable } = editTable;

		return (
			<div className="nc-bill-list flex-container">
				{createEditTable(this.tableId, {
					showIndex: true,
					adaptionHeight: true
				})}
			</div>
		);
	}
}

CasharsubDetailDlg = createPage({})(CasharsubDetailDlg);

export default CasharsubDetailDlg;
