/*
 * @Author: qishy 
 * @PageInfo:业务对账单列表删除
 * @Date: 2019-04-29 09:14:18 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-06-01 16:15:26
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	showBatchOperateInfo,
	showSuccessInfo,
	showDeleteDialog,
	showWarningInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { onSelected } from '../viewControl/rowSelectControl';

export default function(props, record, index) {
	let checkArr = [];
	let data = [];
	// 操作列删除处理
	if (index >= 0 && record) {
		data.push({
			id: record[FIELDS.pk_comparebill].value,
			ts: record[FIELDS.ts].value
		});
	} else {
		//批量删除处理
		checkArr = props.table.getCheckedRows(AREA.listTableId);
		if (!checkArr || checkArr.length < 1) {
			showWarningInfo(null, getLangByResId(this, '4004comarebill-000018')); /* 国际化处理： 请选择数据*/
			return;
		}
		checkArr.map((row) => {
			data.push({
				id: row.data.values[FIELDS.pk_comparebill].value,
				ts: row.data.values[FIELDS.ts].value
			});
		});
	}

	let requestData = { infos: data };

	let doDelete = () => {
		ajax({
			url: REQUESTURL.delete,
			data: requestData,
			success: (res) => {
				if (res.data) {
					if (res.data.errMsg && res.data.errMsg.length > 0) {
						showBatchOperateInfo(null, res.data.message, res.data.errMsg);
					} else {
						showSuccessInfo(
							getLangByResId(this, '4004comarebill-000020'),
							res.data.message
						); /* 国际化处理： 删除成功*/
					}
					if (res.data.successIds) {
						let successIds = res.data.successIds;
						let indexs = [];
						if (index >= 0 && record) {
							indexs.push(index);
						} else {
							successIds.forEach((id) => {
								checkArr.forEach((checkRow) => {
									if (checkRow.data.values[FIELDS.pk_comparebill].value == id) {
										indexs.push(checkRow.index);
									}
								});
							});
						}
						//update缓存
						// deleteCacheDataForList(props, AREA.listTableId, successIds);
						props.table.deleteTableRowsByIndex(AREA.listTableId, indexs);
					}
				}
				onSelected.call(this, props);
			}
		});
	};

	if (index >= 0 && record) {
		doDelete();
	} else {
		showDeleteDialog({
			beSureBtnClick: () => {
				doDelete();
			}
		});
	}
}
