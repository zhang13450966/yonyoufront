/*
 * @Author: zhangshqb 
 * @PageInfo: 刷新
 * @Date: 2018-06-26 11:36:25 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:20:49
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, LIST_BUTTON } from '../../constance';
import {
	showSuccessInfo,
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function searchBtnClick(props, searchVal) {
	let data = this.searchdata;
	ajax({
		url: '/nccloud/pu/vmiest/query.do',
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			let { success, data } = res;
			if (success) {
				if (data) {
					this.props.editTable.setTableData(PAGECODE.tableId, data.headGrid.po_vmi);
					this.feeItems = data.bodyMap;
					if (data.bodyMap) {
						let keys = Object.keys(data.bodyMap);
						let key = keys[0];
						if (key) {
							if (data.bodyMap[key]) {
								this.feeItem = JSON.parse(JSON.stringify(data.bodyMap[key]));
							}
						} else {
							this.feeItem = { po_vmi_fee: { rows: [] } };
						}
					}
					if (this.bfee == '1') {
						this.props.editTable.setStatus(PAGECODE.tableId, 'browse');
					} else {
						this.props.editTable.setStatus(PAGECODE.tableId, 'edit');
					}
					this.props.editTable.focusRowByIndex(PAGECODE.tableId, 0);
					this.props.editTable.setTableData(
						PAGECODE.childTableId,
						JSON.parse(JSON.stringify(this.feeItem.po_vmi_fee))
					);
					this.props.editTable.setStatus(PAGECODE.childTableId, 'edit');
					// if (data.message) {
					// 	showWarningInfo(null, data.message);
					// } else {
					// 	showQueryResultInfoForNoPage(data.headGrid.po_vmi.rows.length); /* 国际化处理： 查询成功*/
					// }
				} else {
					this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
					this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
					// showNoQueryResultInfo();
				}
				showRefreshInfo();
				let butArray = [
					LIST_BUTTON.est,
					LIST_BUTTON.feeDistribute,
					LIST_BUTTON.linkQuery,
					LIST_BUTTON.print,
					LIST_BUTTON.refreash
				];
				this.props.button.setButtonDisabled(butArray, true);
				this.props.button.setButtonDisabled([ LIST_BUTTON.refreash ], false);
			}
		}
	});
}
