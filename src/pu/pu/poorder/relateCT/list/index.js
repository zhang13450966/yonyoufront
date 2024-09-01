/*
 * @Author: CongKe
 * @PageInfo: 关联合同
 * @Date: 2018-09-11 14:26:48
 * @Last Modified by: zhr
 * @Last Modified time: 2021-11-03 16:53:50
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage } from 'nc-lightapp-front';
import { initTemplate } from './init';
const TABLE_ID = 'pk_ct_pu';
let selectOrderRows = {};
class RelateCTDLG extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(TABLE_ID);
		this.state = {};
		initTemplate.call(this);
	}

	componentDidMount() {
		this.initData();
	}
	//请求列表数据
	initData = () => {
		let showdata = null;
		if (
			this.props.billQueryPara.relateCTVO[TABLE_ID] == undefined ||
			this.props.billQueryPara.relateCTVO[TABLE_ID] == null
		) {
			showdata = { rows: [] };
		} else {
			showdata = this.props.billQueryPara.relateCTVO[TABLE_ID];
		}
		this.props.editTable.setTableData(TABLE_ID, showdata);
		selectOrderRows = {};
	};

	// 复选框全选
	onSelectedAll = (props, moduleId, status, length) => {
		if (status) {
			let rows = [];
			let selectAllOrderRows = JSON.parse(JSON.stringify(selectOrderRows));
			let selectFalg = 'false'; //判断是否新增选择数据
			for (let index = 0; index < length; index++) {
				let orderrowno = props.editTable.getValByKeyAndIndex(moduleId, index, 'crowno').value;
				if (selectOrderRows[orderrowno] != undefined || selectOrderRows[orderrowno] != null) {
					if (selectOrderRows[orderrowno] === index) {
						continue;
					}
					rows.push(index);
				} else {
					selectOrderRows[orderrowno] = index;
					selectFalg = 'true';
				}
			}
			props.editTable.selectTableRows(moduleId, rows, false);
			// 若一个物料有多个合同,点击多选时，若已选数据，则清空
			if (JSON.stringify(selectAllOrderRows) == JSON.stringify(selectOrderRows) && selectFalg == 'false') {
				selectOrderRows = {};
				this.props.editTable.selectAllRows(TABLE_ID, false);
			}
		} else {
			selectOrderRows = {};
		}
		setTimeout(() => {
			let selrows = this.props.editTable.getCheckedRows(TABLE_ID);
			this.props.getSelectRows(selrows);
		}, 0);
	};
	// 复选框单选
	// 一行订单只能关联一个合同行
	onSelected = (props, moduleId, record, index, status, isRowClick) => {
		// 如果是选中
		let orderrowno = record.values.crowno.value;
		if (status) {
			// 如
			if (selectOrderRows[orderrowno] != undefined || selectOrderRows[orderrowno] != null) {
				props.editTable.selectTableRows(moduleId, index, false);
			} else {
				selectOrderRows[orderrowno] = index;
			}
		} else {
			delete selectOrderRows[orderrowno];
		}
		if (isRowClick) {
			// 如果是行点击进来的就把之前的都恢复
			if (selectOrderRows[orderrowno] != undefined || selectOrderRows[orderrowno] != null) {
				Object.keys(selectOrderRows).forEach((key) => {
					props.editTable.selectTableRows(moduleId, selectOrderRows[key], true);
				});
			}
		}
		let selrows = this.props.editTable.getCheckedRows(TABLE_ID);
		this.props.getSelectRows(selrows);
	};

	render() {
		let { editTable } = this.props;
		let { createEditTable } = editTable;
		return (
			<div className="table-area">
				{createEditTable(TABLE_ID, {
					onSelectedAll: this.onSelectedAll,
					onSelected: this.onSelected,
					showCheck: true,
					adaptionHeight: false,
					inModal: true,
					cancelCustomRightMenu: true //动态列禁用保存列宽
				})}
			</div>
		);
	}
}

RelateCTDLG = createPage({})(RelateCTDLG);

export default RelateCTDLG;
