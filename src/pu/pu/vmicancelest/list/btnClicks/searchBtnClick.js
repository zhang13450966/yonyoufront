/*
 * @Author: zhangshqb
 * @PageInfo: 查询
 * @Date: 2018-06-07 10:14:51
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-09-14 17:36:33
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
				this.bfee = item.value;
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
			url: '/nccloud/pu/cancelvmiest/query.do',
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
						this.props.editTable.setStatus(PAGECODE.tableId, 'browse');
						this.props.editTable.focusRowByIndex(PAGECODE.tableId, 0);
						if (data.message) {
							showWarningInfo(null, data.message);
						} else {
							showQueryResultInfoForNoPage(data.headGrid.po_vmi.rows.length); /* 国际化处理： 查询成功*/
						}
						if (this.feeItems) {
							let alldata = this.props.editTable.getAllRows(PAGECODE.tableId);
							if (alldata) {
								let bodydata = this.feeItems[alldata[0].values.pk_stockps_b.value];
								if (bodydata) {
									this.props.editTable.setTableData(
										PAGECODE.childTableId,
										JSON.parse(JSON.stringify(bodydata.po_vmi_fee))
									);
								}
							}
						}
					} else {
						this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
						this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
						showNoQueryResultInfo();
					}
					let butArray = [ LIST_BUTTON.cancelest, LIST_BUTTON.linkQuery, LIST_BUTTON.print ];
					this.props.button.setButtonDisabled(butArray, true);
					this.props.button.setButtonDisabled([ LIST_BUTTON.refreash ], false);
				}
			}
		});
	}
}
