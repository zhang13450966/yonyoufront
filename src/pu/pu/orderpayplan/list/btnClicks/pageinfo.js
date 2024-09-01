/*
 * @Author: CongKe 
 * @PageInfo: 采购订单付款计划页面查询功能 
 * @Date: 2018-04-17 19:06:54 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-03-30 11:19:47
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, BUTTON, STATUS } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';

export default function pageinfo(props, pk) {
	let _this = this;
	let queryInfo;
	if (pk) {
		queryInfo = props.search.getQueryInfo(PAGECODE.searchId, false);
		props.search.clearSearchArea(PAGECODE.searchId);
		let conditions = new Array();
		let condition = {
			display: null,
			field: 'pk_order',
			isIncludeSub: false,
			oprtype: '=',
			refurl: '',
			value: {
				firstvalue: pk,
				secondvalue: ''
			}
		};
		conditions.push(condition);
		queryInfo.querycondition.conditions = conditions;
	} else {
		queryInfo = props.search.getQueryInfo(PAGECODE.searchId, true);
	}
	if (queryInfo.querycondition) {
		let data = {
			queryInfo: queryInfo,
			pageCode: PAGECODE.listcode //页面编码
		};
		ajax({
			url: URL.getList,
			data: data,
			method: 'POST',
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						//参数一：返回的公式对象
						props.dealFormulamsg(res.formulamsg);
					}
					let rowsData = { rows: [] };
					if (data == undefined) {
						props.editTable.setTableData(PAGECODE.tableId, rowsData);
						props.button.setDisabled([ BUTTON.Edit ], true);
					} else {
						let result = data.result;
						if (result != undefined && result != null && result.result && result.result[PAGECODE.tableId]) {
							rowsData = result.result[PAGECODE.tableId];
						}
						props.editTable.setTableData(PAGECODE.tableId, rowsData);
						props.button.setDisabled([ BUTTON.Edit ], false);
					}
					buttonController.togglePageShow.call(this, props, STATUS.browse);
					toast({
						color: 'success',
						content: getLangByResId(this, '4004OPAYPLAN-000010') /* 国际化处理： 查询成功！*/
					});
					buttonController.pageinfoinit.call(this, props);
					buttonController.onSelectButton.call(this, props);
				}
			}
		});
	}
}
