/*
 * @Author: zhangshqb
 * @PageInfo: 查询
 * @Date: 2018-05-26 11:23:44
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-04-23 09:58:33
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, LIST_BUTTON } from '../../constance';
import {
	showSuccessInfo,
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo,
	showRefreshInfo,
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function searchBtnClick(props) {
	let data = this.searchdata;
	if (data) {
		ajax({
			url: '/nccloud/pu/est/query.do',
			data: data,
			success: res => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				let { success, data } = res;
				if (success) {
					if (data) {
						this.feeItems = data.bodyMap;
						if (data.bodyMap) {
							let keys = Object.keys(data.bodyMap);
							let key = keys[0];
							if (data.bodyMap[key]) {
								this.feeItem = JSON.parse(JSON.stringify(data.bodyMap[key]));
							}
						}
						if (this.bqueryandest) {
							this.setState({
								showCompleted: true,
								allNum: data.allNum,
								successNum: data.successNum,
								failNum: data.failNum,
							});
							if (data.headGrid) {
								this.errvos = data.headGrid.po_stockps;
							}
							this.message = data.message;
							this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
						} else {
							this.props.editTable.setTableData(PAGECODE.tableId, data.headGrid.po_stockps);
							if (this.bfee == '1') {
								this.props.editTable.setStatus(PAGECODE.tableId, 'browse');
							} else {
								this.props.editTable.setStatus(PAGECODE.tableId, 'edit');
							}
							this.props.editTable.focusRowByIndex(PAGECODE.tableId, 0);
							this.props.editTable.setTableData(
								PAGECODE.childTableId,
								this.feeItem && this.feeItem.po_stockps_fee ? this.feeItem.po_stockps_fee : null
							);
							this.props.editTable.setStatus(PAGECODE.childTableId, 'edit');
							if (data.message) {
								// showQueryResultInfoForNoPage(data.headGrid.po_stockps.rows.length); /* 国际化处理： 查询成功*/
								// showWarningInfo(null, data.message);
							} else {
								// showQueryResultInfoForNoPage(data.headGrid.po_stockps.rows.length); /* 国际化处理： 查询成功*/
							}
						}
					} else {
						this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
						// showNoQueryResultInfo();
					}
				}
				showRefreshInfo();
				this.props.button.setButtonDisabled([LIST_BUTTON.refreash], false);
				let butArray = [
					LIST_BUTTON.est,
					LIST_BUTTON.feeDistribute,
					LIST_BUTTON.hqhp,
					LIST_BUTTON.linkquery,
					LIST_BUTTON.print,
				];
				this.props.button.setButtonDisabled(butArray, true);
			},
		});
	}
}
