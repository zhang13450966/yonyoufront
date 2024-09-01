/*
 * @Author: jiangfw 
 * @PageInfo: 对账单推采购发票
 * @Date: 2018-08-07 18:14:28 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-05-10 11:32:05
 */
import { ajax } from 'nc-lightapp-front';
import { COMMON, PAGECODE, URL, AREA, FIELD } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function() {
	// let idInfo = getDefData(COMMON.TransferFrom2507, COMMON.CompareBillIds);
	let idInfo = JSON.parse(this.props.getUrlParam('idInfo'));
	// let appcode2507 = this.props.getUrlParam('vsrcAppcode');
	// let url = this.props.getUrlParam('channelAddress');
	// 设置推出转单路径
	// this.backTo2507URL = '/' + url; //对账单返回页面

	if (idInfo) {
		ajax({
			method: 'POST',
			url: URL.transfer2507to25,
			data: idInfo,
			success: (res) => {
				if (res && res.data) {
					let invoices = res.data;

					this.props.transferTable.setTransferListValue(AREA.card_left, invoices);
					//拉单初始化数据时调用交易类型默认值设置方法
					transtypeUtils.setValue.call(this, AREA.card_head, FIELD.ctrantypeid, FIELD.vtrantypecode);

					// 设置单据来源类型以及缓存数据
					let listdata = new Array();
					for (let i = 0; i < invoices.length; i++) {
						let element = {};
						element.head = invoices[i].head;
						element.body = invoices[i].body;
						element.pageid = invoices[i].pageid;
						listdata.push(element);
					}
					this.listdata = listdata;
				}
			},
			error: (error) => {
				// clickBackBtn.call(this);
				showErrorInfo(getLangByResId(this, '4004PUINVOICE-000080'), error.message); /* 国际化处理： 注意*/
			}
		});
	} else {
		this.props.transferTable.setTransferListValue(AREA.card_left, []);
	}
}
