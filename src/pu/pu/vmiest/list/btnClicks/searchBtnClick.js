/*
 * @Author: zhangshqb
 * @PageInfo: 取消暂估查询
 * @Date: 2018-06-26 11:36:25
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-27 14:59:47
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, URL, LIST_BUTTON } from '../../constance';
import {
	showWarningInfo,
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function searchBtnClick(props, searchVal) {
	if (searchVal && searchVal.conditions) {
		searchVal.conditions.map((item) => {
			if (item.field == 'festtype') {
				this.bfee = item.value.firstvalue;
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
			url: '/nccloud/pu/vmiest/query.do',
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					//参数一：返回的公式对象
					props.dealFormulamsg(res.formulamsg);
				}
				let { success, data } = res;
				if (success) {
					if (data) {
						this.props.editTable.setTableData(PAGECODE.tableId, data.headGrid.po_vmi);
						this.feeItems = data.bodyMap;
						let bodyitem = null;
						if (data.bodyMap) {
							// let keys = Object.keys(data.bodyMap);
							// let key = keys[0];
							let key = null;
							if (data.headGrid.po_vmi.rows && data.headGrid.po_vmi.rows[0].values.pk_stockps_b) {
								key = data.headGrid.po_vmi.rows[0].values.pk_stockps_b.value;
							}
							if (key) {
								if (data.bodyMap[key]) {
									this.feeItem = JSON.parse(JSON.stringify(data.bodyMap[key]));
									bodyitem = data.bodyMap[key];
								} else {
									this.feeItem = { po_vmi_fee: { rows: [] } };
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
						if (this.feeItem && this.feeItem.po_vmi_fee && bodyitem && bodyitem.po_vmi_fee) {
							this.props.editTable.setTableData(
								PAGECODE.childTableId,
								JSON.parse(JSON.stringify(bodyitem.po_vmi_fee)),
								false
							);
						} else {
							this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
						}
						this.props.editTable.setStatus(PAGECODE.childTableId, 'edit');
						if (data.message) {
							showWarningInfo(null, data.message);
						} else {
							showQueryResultInfoForNoPage(data.headGrid.po_vmi.rows.length); /* 国际化处理： 查询成功*/
						}
					} else {
						this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
						this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
						showNoQueryResultInfo();
					}

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
}
