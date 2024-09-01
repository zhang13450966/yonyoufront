/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-02 15:53:07
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-07-26 13:04:32
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, LIST_BUTTON } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';
import { showBatchOprMessage, showDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { deleteLine } from './index';
let _this;

export default function deleteBtnClick(props, record) {
	_this = this;
	if (record && record.pk_order) {
		deleteLine.call(this, props, record);
	} else {
		let rows = props.table.getCheckedRows(PAGECODE.tableId);
		// 如果没有选中行，则提示并返回，不进行任何操作
		if (rows.length <= 0) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004POORDER-000068') /* 国际化处理： 请选择需要删除的数据！*/,
			});
			return;
		}
		showDeleteDialog({
			/* 国际化处理： 删除,确定要删除吗？*/
			beSureBtnClick: doDelete.bind(this, props, rows),
		});
	}
}

function doDelete(props, rows) {
	// 获取待删除表格行的行号
	let pkarr = new Array();
	let indexs = [];
	rows.map(item => {
		indexs.push(item.index);
	});
	// 执行删除操作
	let delRows = [];
	rows.map(item => {
		let data = {
			pks: item.data.values.pk_order.value,
			ts: item.data.values.ts.value,
		};
		pkarr.push(data.pks);
		delRows.push(data);
	}); // 拼装json
	let data = {
		deleteInfo: delRows,
		pagecode: PAGECODE.listcode,
	};
	ajax({
		url: URL.griddelete,
		data: data,
		success: res => {
			if (JSON.stringify(res.data.errorMessageMap || {}) != '{}') {
				// 成功的index
				let sucIndex = [];
				rows.forEach((element, index) => {
					if (!res.data.errorMessageMap[index]) {
						sucIndex.push(element.index);
					}
					deleteCacheDataForList(props, PAGECODE.tableId, element.data.values.pk_order.value);
				});
				props.table.deleteTableRowsByIndex(PAGECODE.tableId, sucIndex);
			} else {
				let succIndex = [];
				rows.forEach((element, index) => {
					deleteCacheDataForList(props, PAGECODE.tableId, element.data.values.pk_order.value);
					succIndex.push(element.index);
				});
				props.table.deleteTableRowsByIndex(PAGECODE.tableId, succIndex);
			}
			showBatchOprMessage(null, res.data, {}, getLangByResId(_this, '4004POORDER-000041'));
			buttonController.initButtons.call(_this, _this.props);
		},
		error: ress => {
			toast({
				color: 'danger',
				content: ress.message,
			});
		},
	});
}
