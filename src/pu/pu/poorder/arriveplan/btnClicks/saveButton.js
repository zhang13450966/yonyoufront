/*
 * @Author: CongKe 
 * @PageInfo: 采购订单付款计划保存
 * @Date: 2018-06-11 19:59:12 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-08 13:39:34
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, ARRIVEPLAN, FIELD, STATUS } from '../../constance';
import { buttonController } from '../viewController/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function saveButton(props) {
	let _this = this;
	// 单表也需要适配 在浏览态时勾选行去掉勾选
	props.editTable.selectAllRows(ARRIVEPLAN.TABLEID, false);
	let column = [ 'blargess', 'btransclosed', 'crownobb1' ];
	props.editTable.filterEmptyRows(ARRIVEPLAN.TABLEID, column);
	//创建保存的VO
	let allRows = props.editTable.getAllRows(ARRIVEPLAN.TABLEID, true);
	allRows.forEach((row, index) => {
		let sta = row.status;
		let pk_order_bb1 = row && row.values && row.values.pk_order_bb1 && row.values.pk_order_bb1.value;
		pk_order_bb1 = pk_order_bb1 == null ? '' : pk_order_bb1;
		if (sta == 3 && pk_order_bb1 == '') {
			// 新增时过滤掉删除的数据
			allRows.splice(index, 1);
		}
	});
	let isSave = props.editTable.checkRequired(ARRIVEPLAN.TABLEID, allRows);
	if (!isSave) {
		return;
	}
	let data = {};
	if (allRows && allRows.length > 0) {
		let model = {
			areacode: ARRIVEPLAN.TABLEID,
			areaType: 'table',
			rows: allRows
		};
		data = {
			pageid: ARRIVEPLAN.PAGECODE,
			model: model
		};
	} else {
		buttonController.togglePageShow.call(this, props, STATUS.browse);
		showSuccessInfo(getLangByResId(_this, '4004POORDER-000005')); /* 国际化处理： 保存成功！*/
		return;
	}
	delete data.attrcode;

	ajax({
		method: 'post',
		url: URL.arriveplansave,
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (success) {
				let rowsData = { rows: [] };
				if (data == undefined) {
					props.editTable.setTableData(ARRIVEPLAN.TABLEID, rowsData);
				} else {
					rowsData = data[ARRIVEPLAN.TABLEID];
					rowsData.rows.forEach((row) => {
						row.values.crownobb1.display = row.values.crownobb1.value;
					});
					props.editTable.setTableData(ARRIVEPLAN.TABLEID, rowsData);
				}
			}
			buttonController.togglePageShow.call(this, props, STATUS.browse);
			showSuccessInfo(getLangByResId(_this, '4004POORDER-000005')); /* 国际化处理： 保存成功！*/
		}
	});
}
