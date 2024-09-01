/*
 * @Author: raoczh 
 * @PageInfo: 单据联查采购计划联查到本单据的数据加载
 * @Date: 2020-03-09 14:31:35 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 17:36:34
 */
import { ajax } from 'nc-lightapp-front';
import { BUYINGREQ_LIST } from '../../siconst';
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
			if (data && data[0].currentGrid && data[0].currentGrid[listFormId]) {
				let rowsdata = data[0].currentGrid[listFormId];
				if (rowsdata && rowsdata.rows && rowsdata.rows.length == 1) {
					props.pushTo(cardUrl, {
						status: 'browse',
						id: rowsdata.allpks[0],
						pagecode: BUYINGREQ_LIST.cardpageid
					});
				} else {
					this.props.table.setAllTableData(listFormId, rowsdata || { rows: [] });
					if (typeof callback == 'function') {
						callback.call(this, props);
					}
				}
			}
			//处理采购订单跳转，采购订单和请购单列表表格区域编码一样，用同一个
			if (data && data[1].currentGrid && data[1].currentGrid[listFormId]) {
				let rowsdata = data[1].currentGrid[listFormId];
				if (rowsdata && rowsdata.rows && rowsdata.rows.length == 1) {
					props.openTo(null, {
						billtype: '21',
						pagecode: '400400800_card',
						status: 'browse',
						id: rowsdata.allpks[0]
					});
				} else {
					props.openTo(null, {
						billtype: '21',
						pagecode: '400400800_list',
						ntpLinkIds: rowsdata.allpks
					});
				}
			}
			// if (typeof data == 'string') {
			// 	// 联查出来一条，跳到卡片
			// 	props.pushTo(cardUrl, {
			// 		status: 'browse',
			// 		id: data
			// 	});
			// } else {
			// 	// 联查出来多条，列表加载
			// 	let rowsData = { rows: [] };
			// 	if (res.data && res.data.currentGrid && res.data.currentGrid[listFormId]) {
			// 		rowsData = res.data.currentGrid[listFormId];
			// 	}
			// 	this.props.table.setAllTableData(listFormId, rowsData);
			// 	if (typeof callback == 'function') {
			// 		callback.call(this, props);
			// 	}
			// }
		}
	});
}
