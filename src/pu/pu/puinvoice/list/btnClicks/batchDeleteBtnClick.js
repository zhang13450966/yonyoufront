/*
 * @Author: jiangfw 
 * @PageInfo:列表下 删除(包括表头删除和行操作删除) 按钮处理
 * @Date: 2018-04-24 20:02:32 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-03-17 19:41:43
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance';
import getSelectedDatas from './getSelectedDatas';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import {
	showWarningDialog,
	showBatchOprMessage,
	showWarningInfo,
	showErrorInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

import { btnController } from '../viewControl';
let tableId = AREA.list_head;

export default function clickBatchDeleteBtn(props, record, index) {
	let seldatas = getSelectedDatas(props, record, index);
	if (seldatas == null || seldatas.index == undefined) {
		showWarningInfo(null, getLangByResId(this, '4004PUINVOICE-000042') /* 国际化处理： 请注意,请选择要删除的发票！*/);
		return;
	}

	if (!record) {
		// 表头批删
		showWarningDialog(
			getLangByResId(this, '4004PUINVOICE-000072') /* 国际化处理： 删除*/,
			getLangByResId(this, '4004PUINVOICE-000012') /* 国际化处理： 确认要删除吗？*/,
			{
				beSureBtnClick: beSureBtnClick.bind(this, props, seldatas) //点击确定按钮事件
			}
		);
	} else {
		// 行删
		beSureBtnClick.call(this, props, seldatas); //点击确定按钮事件
	}
}

function beSureBtnClick(props, seldatas) {
	deleteBills.call(this, props, seldatas.bills, seldatas.index);
}

// 批量删除采购发票
function deleteBills(props, bills, selIndex) {
	let deleteInfos = {
		dataInfo: bills
	};
	ajax({
		url: URL.batchDelete,
		data: deleteInfos,
		success: (res) => {
			if (res.success) {
				showBatchOprMessage(null, res.data, {}, getLangByResId(this, '4004PUINVOICE-000072' /*删除 */));
				// 有失败的数据
				if (JSON.stringify(res.data.errorMessageMap || {}) != '{}') {
					// 成功的index
					let sucIndex = [];
					selIndex.forEach((element, index) => {
						if (!res.data.errorMessageMap[index]) {
							sucIndex.push(element);
						}
						deleteCacheDataForList(props, tableId, bills[index].id);
					});
					props.table.deleteTableRowsByIndex(tableId, sucIndex);
				} else {
					bills.forEach((element) => {
						deleteCacheDataForList(props, tableId, element.id);
					});
					props.table.deleteTableRowsByIndex(tableId, selIndex);
				}
				btnController.call(this, props);
			}
		},
		error: (res) => {
			showErrorInfo(res.message);
		}
	});
}
