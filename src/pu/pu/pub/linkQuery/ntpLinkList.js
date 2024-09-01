/*
 * @Author: raoczh 
 * @PageInfo: 单据联查采购计划联查到本单据的数据加载
 * @Date: 2020-03-09 14:31:35 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-03-11 14:36:38
 */
import { ajax } from 'nc-lightapp-front';
export default function ntpLinkList(props, config, callback) {
	let pk_ntbparadimvo = props.getUrlParam('pk_ntbparadimvo');
	let { cardUrl, listFormId } = config;
	ajax({
		url: '/nccloud/pu/buyingreq/ntpLinkList.do',
		data: pk_ntbparadimvo,
		success: (res) => {
			let { success, data } = res;
			if (!success) {
				return;
			}
			if (typeof data == 'string') {
				// 联查出来一条，跳到卡片
				props.pushTo(cardUrl, {
					status: 'browse',
					id: data
				});
			} else {
				// 联查出来多条，列表加载
				let rowsData = { rows: [] };
				if (res.data && res.data.currentGrid && res.data.currentGrid[listFormId]) {
					rowsData = res.data.currentGrid[listFormId];
				}
				this.props.table.setAllTableData(listFormId, rowsData);
				if (typeof callback == 'function') {
					callback.call(this, props);
				}
			}
		}
	});
}
