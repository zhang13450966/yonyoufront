/*
 * @Author: zhangshqb 
 * @PageInfo: 查询
 * @Date: 2018-06-07 10:14:51 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-06-01 15:17:32
 */
import { ajax, toast } from 'nc-lightapp-front';
import { PAGECODE, URL, LIST_BUTTON } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	showSuccessInfo,
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function searchBtnClick(props, searchVal) {
	let data = this.searchdata;
	if (data) {
		ajax({
			url: '/nccloud/pu/cancelest/query.do',
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
						this.props.editTable.setTableData(PAGECODE.tableId, data.headGrid.po_stockps);
						this.props.editTable.focusRowByIndex(PAGECODE.tableId, 0);
						this.feeItems = data.bodyMap;
						this.props.editTable.setStatus(PAGECODE.childTableId, 'browse');
						this.props.editTable.setStatus(PAGECODE.tableId, 'browse');
						if (this.feeItems) {
							let alldata = this.props.editTable.getAllRows(PAGECODE.tableId);
							if (alldata) {
								let bodydata = this.feeItems[alldata[0].values.pk_stockps_b.value];
								if (bodydata) {
									this.props.editTable.setTableData(
										PAGECODE.childTableId,
										JSON.parse(JSON.stringify(bodydata.po_stockps_fee))
									);
								}
							}
						}
						// showQueryResultInfoForNoPage(data.headGrid.po_stockps.rows.length); /* 国际化处理： 查询成功*/
					} else {
						this.props.editTable.setTableData(PAGECODE.tableId, { rows: [] });
						// showNoQueryResultInfo();
					}
					showRefreshInfo();
					this.props.editTable.setTableData(PAGECODE.childTableId, { rows: [] });
					let buttonArry = [ LIST_BUTTON.print, LIST_BUTTON.linkQuery, LIST_BUTTON.cancelest ];
					this.props.button.setButtonDisabled(buttonArry, true);
				}
			}
		});
	}
}
