/*
 * @Author: qishy 
 * @PageInfo: 查询、刷新公共处理方法
 * @Date: 2019-05-05 13:30:50 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-04-13 13:18:21
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, REQUESTURL, BUTTONID, CACHDATASOURCE, CACHKEY } from '../../constance';
import {
	showHasQueryResultInfo,
	showNoQueryResultInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(queryInfo, isRefresh) {
	queryInfo.userdefObj = { transType: this.transType, pk_busitype: this.pk_busitype };

	let data = {
		queryInfo: queryInfo,
		pageCode: '400400800_21to2507', //页面编码
		appcode: PAGECODE.appcode21, //应用编码
		templetid: this.props.meta.getMeta().pageid
	};

	// 刷新按钮可用
	this.props.button.setDisabled({ [BUTTONID.Refresh]: false });

	//得到数据渲染到页面
	ajax({
		url: REQUESTURL.ref21Query,
		data: data,
		success: (res) => {
			if (res.data) {
				calcNcaninvoicemny(res.data);

				this.props.transferTable.setTransferTableValue(
					AREA.cardFormId,
					AREA.cardTableId,
					res.data,
					'pk_order',
					'pk_order_b'
				);
				isRefresh == true ? showRefreshInfo() : showHasQueryResultInfo(res.data.length);
			} else {
				this.props.transferTable.setTransferTableValue(
					AREA.cardFormId,
					AREA.cardTableId,
					[],
					'pk_order',
					'pk_order_b'
				);
				isRefresh == true ? showRefreshInfo() : showNoQueryResultInfo();
			}
			this.setState({
				ntotalnum: 0
			});
			// 将查询条件缓存
			setDefData(CACHDATASOURCE.dataSourceTransfer, CACHKEY.transferSearchCach, queryInfo);
		}
	});
}

/**
 * 计算可收票金额
 * @param {行数据} bills 
 */
function calcNcaninvoicemny(bills) {
	bills.forEach((bill) => {
		let bodys = bill.body.body.rows;
		bodys.forEach((body) => {
			// 可收票金额 = 总价税合计 - 含税单价*累计开票数量
			let naccuminvoicenum = (body.values.naccuminvoicenum && body.values.naccuminvoicenum.value) || 0;

			let scale = body.values.norigtaxmny.scale;
			let ncaninvoicemny = body.values.norigtaxmny.value - body.values.norigtaxprice.value * naccuminvoicenum;
			ncaninvoicemny = ncaninvoicemny.toFixed(2);
			body.values.ncaninvoicemny = { value: ncaninvoicemny, scale: scale };
		});
	});
}
