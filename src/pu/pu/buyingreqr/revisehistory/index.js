/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-08-24 16:14:26 
 * 请购单修订历史展示
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-10 16:24:27
 */

import React, { Component } from 'react';
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { BUYINGREQ_LIST, ATTRCODE, BUYINGREQ_CARD } from '../siconst';
import { setTableBodyData } from './events';
import { showErrorInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
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
				{/* <div className="header">
					<h2 className="title">请购单修订历史</h2>
				</div> */}
				<div className="table-area">
					{createInsertTable({
						headTableId: BUYINGREQ_CARD.formId,
						bodyTableId: BUYINGREQ_CARD.tableId,
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
		console.log(this.props.pk_praybill, 345);
		ajax({
			url: BUYINGREQ_CARD.queryHistory,
			data: {
				keyword: this.props.pk_praybill,
				pageid: BUYINGREQ_CARD.historypageid
			},
			success: (res) => {
				let { success, data } = res;
				if (success && data != undefined) {
					//this.props.insertTable.setInsertTableValue(BUYINGREQ_CARD.formId, data);
					this.props.insertTable.setInsertTableValue(
						BUYINGREQ_CARD.formId,
						data[BUYINGREQ_CARD.formId],
						ATTRCODE.pk_praybill
					);
				} else {
					this.props.insertTable.setInsertTableValue(BUYINGREQ_CARD.formId, { rows: [] });
				}
			},
			error: (res) => {
				showErrorInfo(res.message);
				this.props.props.modal.close('MessageDlg');
			}
		});
	};
}

ReviseHistory = createPage({
	initTemplate: initTemplate
})(ReviseHistory);

export default ReviseHistory;
