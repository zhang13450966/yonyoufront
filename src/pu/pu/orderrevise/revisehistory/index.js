/*
 * @Author: mikey.zhangchqf
 * @Date: 2018-08-24 16:14:26
 * 采购订单修订历史展示
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-03-28 09:03:29
 */

import React, { Component } from 'react';
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { URL, PAGECODE, FIELD, LIST_BUTTON, STATUS, OrderReviseCache } from '../constance';
import { setTableBodyData } from './events';
const { NCMessage } = base;

class ReviseHistory extends Component {
	componentDidMount() {
		this.getData();
	}

	render() {
		const { button, insertTable } = this.props;
		const { createInsertTable } = insertTable;
		return (
			<div className="scm-wrap">
				<div className="table-area">
					{createInsertTable({
						headTableId: PAGECODE.cardhead,
						bodyTableId: PAGECODE.cardbody,
						cancelCustomRightMenu: true, //动态列禁用保存列宽
						comType: 'normal', //嵌套表格类型。'normal':普通，不带复选框。hasCheckBox:只有外层表格带复选框。hasCheckBox_child:内外表格都带复选框
						setTableBodyData: setTableBodyData.bind(this),
						// adaptionHeight: true,
						inModal: true
					})}
				</div>
			</div>
		);
	}

	getData = () => {
		let pks = [];
		pks.push(this.props.pk_order);
		ajax({
			url: URL.queryHistoryHead,
			data: {
				pks: pks,
				pageid: PAGECODE.historycode
			},
			success: (res) => {
				let { success, data } = res;
				if (success && data != undefined) {
					this.props.insertTable.setInsertTableValue(
						PAGECODE.cardhead,
						data[PAGECODE.cardhead],
						FIELD.pk_order
					);
				} else {
					this.props.insertTable.setInsertTableValue(PAGECODE.cardhead, { rows: [] });
				}
			}
		});
	};
}

ReviseHistory = createPage({
	initTemplate: initTemplate
})(ReviseHistory);

export default ReviseHistory;
