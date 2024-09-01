/*
 * @Author: lichao 
 * @PageInfo:批量删除   
 * @Date: 2019-03-12 16:02:48 
 * @Last Modified by: lichao
 * @Last Modified time: 2019-07-08 14:43:34
 */
import { URL, AREACODE, FIELD, BUTTONS, STATUS } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import {
	showBatchOprMessage,
	showDeleteDialog,
	showErrorInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function batchDelBtnClick(props) {
	let rows = props.editTable.getCheckedRows(AREACODE);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4001DEALFASHION-000000')/* 国际化处理： 请选择要删除的数据*/
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
			id: item.data.values.pk_dealfashion.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});

	ajax({
		url: URL.batchDelete,
		data: delRows,
		success: (res) => {
			if (res.success) {
				if (JSON.stringify(res.data.errorMessageMap || {}) != '{}') {
					// 成功的index
					let sucIndex = [];
					rows.forEach((element, index) => {
						if (!res.data.errorMessageMap[index]) {
							sucIndex.push(element.index);
						}
					});
					props.editTable.deleteTableRowsByIndex(AREACODE, sucIndex, true);
					res.data.failedNum = rows.length - sucIndex.length;
				} else {
					let succIndex = [];
					rows.forEach((element) => {
						succIndex.push(element.index);
					});
					props.editTable.deleteTableRowsByIndex(AREACODE, succIndex, true);
					res.data.failedNum = 0;
				}
				//删除后按钮控制
				buttonController.call(this, props, STATUS.browse);
				showBatchOprMessage(null, res.data);
			}
		},
		error: (ress) => {
			showErrorInfo(undefined, ress.message);
		}
	});
}
