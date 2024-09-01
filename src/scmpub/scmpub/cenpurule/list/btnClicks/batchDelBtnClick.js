/*
 * @Author: lichao 
 * @PageInfo:批量删除   
 * @Date: 2019-03-12 16:07:49 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-18 10:52:18
 */
import { URL, AREACODE, FIELD, BUTTONS } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ajax, toast } from 'nc-lightapp-front';
import {
	showBatchOprMessage,
	showDeleteDialog,
	showErrorInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { deleteTableData } from 'scmpub/scmpub/components/VerticalEditTable';

export default function batchDelBtnClick(props) {
	let rows = props.cardTable.getCheckedRows(AREACODE.listHead);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4001CENPURULE-000000') /* 国际化处理： 请选择要删除的数据*/
		});
		return;
	}
	showDeleteDialog({
		beSureBtnClick: doDelete.bind(this, props, rows)
	});
}
function doDelete(props, rows) {
	let delRows = [];
	rows.map((item) => {
		let data = {
			id: item.data.values.pk_cenpurule.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});
	// 拼装json
	let data = {
		deleteInfo: delRows
	};
	ajax({
		url: URL.batchDelete,
		data: data,
		success: (res) => {
			if (res.success) {
				// 删除成功的index和主键
				let sucIndex = [];
				let pk_bills = [];
				//1.删除失败情况
				if (JSON.stringify(res.data.errorMessageMap || {}) != '{}') {
					rows.forEach((element, index) => {
						if (!res.data.errorMessageMap[index]) {
							sucIndex.push(element.index);
							pk_bills.push(element.data.values.pk_cenpurule.value);
						}
					});
					res.data.failedNum = rows.length - sucIndex.length;
				} else {
					rows.forEach((element, index) => {
						pk_bills.push(element.data.values.pk_cenpurule.value);
						sucIndex.push(element.index);
					});
					res.data.failedNum = 0;
				}
				deleteTableData.call(this, AREACODE.listHead, AREACODE.listBody, sucIndex, pk_bills);
				//删除后按钮控制
				let checkedrows = props.cardTable.getCheckedRows(AREACODE.listHead);
				if (!checkedrows || Object.keys(checkedrows).length == 0) {
					//没有选中
					props.button.setButtonDisabled([ BUTTONS.Print, BUTTONS.Delete, BUTTONS.Output ], true);
				} else {
					props.button.setButtonDisabled([ BUTTONS.Print, BUTTONS.Delete, BUTTONS.Output ], false);
				}
				showBatchOprMessage(null, res.data);
			}
		},
		error: (ress) => {
			showErrorInfo(undefined, ress.message);
		}
	});
}
