/*
 * @Author: xiahui 
 * @PageInfo: 自动匹配
 * @Date: 2019-05-16 09:25:40 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-07-01 20:42:56
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, AREA, URL, FIELDS } from '../../constance';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import matchedSearch from './matchedSearch';

export default function(props) {
	// 开票数据
	let invoiceDatas = props.editTable.getAllRows(AREA.invoiceId);

	let invoiceGrid = {
		pageid: PAGECODE.listPagecode,
		model: {
			areaType: 'table',
			areacode: AREA.invoiceId,
			PageInfo: {},
			rows: invoiceDatas
		}
	};

	ajax({
		url: URL.auto,
		data: invoiceGrid,
		success: (res) => {
			if (res.success && res.data) {
				showSuccessInfo(res.data.autoMsg);

				if (res.data.successIds) {
					if (res.data.successIds.length == invoiceDatas.length) {
						// 界面数据已被全部匹配，跳转到‘已匹配’界面
						props.editTable.setTableData(AREA.stockinId, { rows: [] });
						this.setState({ tab: 2 });
						matchedSearch.call(this, props);
					} else {
						// 匹配成功对应的列表Index
						let successIndex = [];
						res.data.successIds.map((successId) => {
							invoiceDatas.map((data, index) => {
								if (data.values[FIELDS.pk_invoicedetail].value == successId) {
									successIndex.push(index);
								}
							});
						});
						props.editTable.deleteTableRowsByIndex(AREA.invoiceId, successIndex);
						props.editTable.setTableData(AREA.stockinId, { rows: [] });
					}
				}
			}
		}
	});
}
