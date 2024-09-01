/*
 * @Author: chaiwx 
 * @PageInfo: 删除 
 * @Date: 2018-05-29 14:39:58 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-03-19 09:24:52
 */
import { ajax } from 'nc-lightapp-front';
import { REQUESTURL, AREA, FIELDS } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	showBatchOperateInfo,
	showSuccessInfo,
	showDeleteDialog,
	showWarningInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { onSelected } from '../viewControl/rowSelectControl';

export default function deleteBtnClick(props, record, index) {
	let checkArr = [];
	let data = [];
	if (index >= 0 && record) {
		// 操作列提交
		data.push({
			id: record[FIELDS.pk_taxinvoice].value,
			ts: record[FIELDS.ts].value
		});
	} else {
		checkArr = props.table.getCheckedRows(AREA.listTableId);
		if (!checkArr || checkArr.length < 1) {
			showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000009')); /* 国际化处理： 请选择数据*/
			return;
		}
		checkArr.map((row) => {
			data.push({
				id: row.data.values[FIELDS.pk_taxinvoice].value,
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
					if (res.data.errMsg) {
						showBatchOperateInfo(null, res.data.message, res.data.errMsg);
					} else {
						// showSuccessInfo(getLangByResId(this, '4004Taxinvoice-000011'), res.data.message); /* 国际化处理： 删除成功*/
						showSuccessInfo(res.data.message);
					}
					if (res.data.successIds) {
						let successIds = res.data.successIds;
						let indexs = [];
						if (index >= 0 && record) {
							indexs.push(index);
						} else {
							successIds.forEach((id) => {
								checkArr.forEach((checkRow) => {
									if (checkRow.data.values[FIELDS.pk_taxinvoice].value == id) {
										indexs.push(checkRow.index);
									}
								});
							});
						}
						//update缓存
						deleteCacheDataForList(props, AREA.listTableId, successIds);
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
