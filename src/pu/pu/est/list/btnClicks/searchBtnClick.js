/*
 * @Author: zhangshqb
 * @PageInfo: 查询
 * @Date: 2018-05-26 11:23:44
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-09-14 17:24:37
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, LIST_BUTTON } from '../../constance';
import {
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo,
	showWarningInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function searchBtnClick(props, searchVal) {
	if (searchVal && searchVal.conditions) {
		searchVal.conditions.map((item) => {
			if (item.field === 'festtype') {
				this.bfee = item.value.firstvalue;
			}
			if (item.field === 'queryandest') {
				this.bqueryandest = item.value.firstvalue;
			}
		});
		let queryInfo = this.props.search.getQueryInfo(PAGECODE.searchId);
		let data = {
			querycondition: searchVal ? searchVal : null,
			pagecode: PAGECODE.pagecode,
			queryAreaCode: PAGECODE.searchId,
			oid: queryInfo.oid,
			querytype: queryInfo.querytype
		}; //查询区编码 //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
		this.searchdata = data;

		ajax({
			url: URL.querylist,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					//参数一：返回的公式对象
					props.dealFormulamsg(res.formulamsg);
				}
				let { success, data } = res;

				if (success) {
					if (data) {
						this.feeItems = data.bodyMap;
						let bodyitem = null;
						if (data.bodyMap) {
							let key = null;
							if (data.headGrid.po_stockps.rows && data.headGrid.po_stockps.rows[0].values.pk_stockps_b) {
								key = data.headGrid.po_stockps.rows[0].values.pk_stockps_b.value;
							}
							let keys = Object.keys(data.bodyMap);
							if (keys.length > 0) {
								// let key = keys[0];
								if (data.bodyMap[key]) {
									this.feeItem = JSON.parse(JSON.stringify(data.bodyMap[key]));
									bodyitem = data.bodyMap[key];
								}
							} else {
								this.feeItem = null;
							}
						} else {
							this.feeItem = null;
						}
						if (this.bqueryandest) {
							this.setState({
								showCompleted: true,
								allNum: data.allNum,
								successNum: data.successNum,
								failNum: data.failNum
							});
							if (data.headGrid) {
								this.errvos = data.headGrid.po_stockps;
							}
							this.message = data.message;
							this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
						} else {
							this.props.editTable.setTableData(PAGECODE.tableId, data.headGrid.po_stockps, false);
							if (this.bfee == '1') {
								this.props.editTable.setStatus(PAGECODE.tableId, 'browse');
							} else {
								this.props.editTable.setStatus(PAGECODE.tableId, 'edit');
							}
							this.props.editTable.focusRowByIndex(PAGECODE.tableId, 0);
							if (this.feeItem && this.feeItem.po_stockps_fee && bodyitem && bodyitem.po_stockps_fee) {
								this.props.editTable.setTableData(
									PAGECODE.childTableId,
									JSON.parse(JSON.stringify(bodyitem.po_stockps_fee)),
									false
								);
							} else {
								this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
							}

							this.props.editTable.setStatus(PAGECODE.childTableId, 'edit');
							if (data.message) {
								showWarningInfo(null, data.message);
							} else {
								/* 国际化处理： 查询成功*/
								showQueryResultInfoForNoPage(data.headGrid.po_stockps.rows.length);
							}
						}
					} else {
						this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
						this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
						showNoQueryResultInfo();
					}
				}
				this.props.button.setButtonDisabled([ LIST_BUTTON.refreash ], false);
				let butArray = [
					LIST_BUTTON.est,
					LIST_BUTTON.feeDistribute,
					LIST_BUTTON.hqhp,
					LIST_BUTTON.linkquery,
					LIST_BUTTON.print
				];
				this.props.button.setButtonDisabled(butArray, true);
			}
		});
	}
}
