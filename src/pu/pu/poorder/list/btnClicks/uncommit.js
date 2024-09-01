/*
 * @Author: CongKe 
 * @PageInfo: 采购订单收回 
 * @Date: 2018-06-20 18:23:03 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-01-03 15:34:13
 */
import { URL, FIELD, PAGECODE } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewController/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function commit() {
	let _this = this;
	let indexs = [];
	let rows = _this.props.table.getCheckedRows(PAGECODE.tableId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000072') /* 国际化处理： 请选择需要收回的数据！*/
		});
		return;
	}
	// for (let j = 0; j < rows.length; j++) {
	// 	let forderstatus = rows[j].data.values.forderstatus.value;
	// 	if (forderstatus == FIELD.approve || forderstatus == FIELD.commit) {
	// 	} else {
	// 		toast({
	// 			color: 'warning',
	// 			content: '请选择审批中或是已提交的数据！'
	// 		});
	// 		return;
	// 	}
	// }

	let delRows = [];
	rows.map((item) => {
		let info = {
			pks: item.data.values.pk_order.value,
			ts: item.data.values.ts.value
		};
		delRows.push(info);
		// indexs.push(item.index);
	});
	// 拼装json
	let data = {
		closedto: delRows,
		pagecode: PAGECODE.listcode,
		extstr: ''
	};
	// 发送请求
	ajax({
		url: URL.griduncommit,
		data: data,
		success: (res) => {
			if (res.success) {
				let title = getLangByResId(_this, '4004POORDER-000052');
				let btnName = getLangByResId(_this, '4004POORDER-000102');
				showBatchOprMessage(title, res.data, {}, btnName);
				updateCacheDataForList(_this.props, PAGECODE.tableId, FIELD.pk_order, res.data, null);
				buttonController.initButtons.call(this, _this.props);
			}
		}
	});
}
