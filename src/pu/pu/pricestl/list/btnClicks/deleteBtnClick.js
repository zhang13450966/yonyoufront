import { URL, PAGECODE, FIELD, LIST_BUTTON } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import {
	showBatchOprMessage,
	showWarningDialog,
	showErrorInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { initButtons } from '../afterEvents';
import { buttonController } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function deleteBtnClick(props) {
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004PRICESTL-000023') /* 国际化处理： 请选择要删除的数据*/ /* 国际化处理： 请选择需要删除的数据！*/
		});
		return;
	}
	showWarningDialog(getLangByResId(this, '4004PRICESTL-000007'), getLangByResId(this, '4004PRICESTL-000036'), {
		/* 国际化处理： 删除,确定要删除所选数据吗？*/
		beSureBtnClick: doDelete.bind(this, props, rows)
	});
}
function doDelete(props, rows) {
	// 获取待删除表格行的行号
	let pkarr = new Array();
	let indexs = [];
	rows.map((item) => {
		indexs.push(item.index);
	});
	// 执行删除操作
	let delRows = [];
	rows.map((item) => {
		let data = {
			pks: item.data.values.pk_pricesettle.value,
			ts: item.data.values.ts.value
		};
		pkarr.push(data.pks);
		delRows.push(data);
	});
	// 拼装json
	let data = {
		deleteInfo: delRows
	};
	ajax({
		url: URL.griddelete,
		data: data,
		success: (res) => {
			if (res.success) {
				if (JSON.stringify(res.data.errorMessageMap || {}) != '{}') {
					// 成功的index
					let sucIndex = [];
					rows.forEach((element, index) => {
						if (!res.data.errorMessageMap[index]) {
							sucIndex.push(element.index);
						}
						deleteCacheDataForList(props, PAGECODE.tableId, element.data.values.pk_pricesettle.value);
					});
					props.table.deleteTableRowsByIndex(PAGECODE.tableId, sucIndex);
				} else {
					let succIndex = [];
					rows.forEach((element, index) => {
						deleteCacheDataForList(props, PAGECODE.tableId, element.data.values.pk_pricesettle.value);
						succIndex.push(element.index);
					});
					props.table.deleteTableRowsByIndex(PAGECODE.tableId, succIndex);
				}
				showBatchOprMessage(null, res.data);
				// data.deleteInfo.forEach((pk, ts) => {
				// 	deleteCacheDataForList(props, PAGECODE.tableId, pk);
				// });
				// props.table.deleteTableRowsByIndex(PAGECODE.tableId, indexs);
				// let failedNum = res.data && res.data.failedNum;
				// res.data.failedNum = failedNum == null ? 0 : failedNum;
				// showBatchOprMessage(null, res.data);
				// initButtons.bind(this, this.props);
				buttonController.initButtons.bind(this, this.props);
			}
		},
		error: (ress) => {
			toast({
				color: 'danger',
				content: ress.message
			});
		}
	});
}
