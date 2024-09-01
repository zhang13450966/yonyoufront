/*
 * @Author: 刘奇 
 * @PageInfo: 删除按钮实现
 * @Date: 2018-05-16 14:17:49 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-02-13 13:32:28
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, STATUS, URL } from '../constance';
import { showSuccessInfo, showDeleteDialog, showWarningInfo } from '../../../pub/tool/messageUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { buttonControl } from '../viewController/buttonController';
export default function delete_BtnClick(props, index) {
	let status = props.editTable.getStatus(AREA.tableArea);
	//编辑态删行
	if (status === STATUS.edit) {
		let selectRow = props.editTable.getCheckedRows(AREA.tableArea);
		let index = [];
		for (let row of selectRow) {
			index.push(row.index);
		}
		props.editTable.deleteTableRowsByIndex(AREA.tableArea, index);
	} else {
		//浏览态调后台删除
		let selectedData = props.editTable.getCheckedRows(AREA.tableArea);
		if (selectedData.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4001BATCHCODE-000002')); /* 国际化处理： 提示,请选择要删除的行！*/
			return;
		}
		showDeleteDialog({
			beSureBtnClick: beSure_BtnClick.bind(this, this.props)
		});
	}
}

function beSure_BtnClick(props) {
	let this_ = this;
	//浏览态调后台删除
	let selectedData = props.editTable.getCheckedRows(this.tableId);

	let indexArr = [];
	let dataArr = [];

	selectedData.forEach((val) => {
		let delObj = {
			rowid: val.data.rowid,
			status: '3',
			values: {
				ts: {
					value: val.data.values.ts.value
				},
				pk_batchcode: {
					value: val.data.values.pk_batchcode.value
				},
				version: {
					value: val.data.values.version.value
				}
			}
		};
		dataArr.push(delObj);
		indexArr.push(val.index);
	});
	let data = {
		pageid: this.pageId,
		table: {
			areaType: 'table',
			pageinfo: {
				pageIndex: -1
			},
			rows: dataArr
		}
	};
	ajax({
		url: URL.save,
		data: data,
		success: function(res) {
			let { success } = res;
			if (success) {
				props.editTable.deleteTableRowsByIndex(AREA.tableArea, indexArr, true);
				buttonControl.call(this_);
				showSuccessInfo(null, getLangByResId(this_, '4001BATCHCODE-000000')); /* 国际化处理： 删除成功*/
			}
		}
	});
}
