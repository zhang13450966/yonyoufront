/*
 * @Author: jiangfw
 * @PageInfo: 返回
 * @Date: 2018-04-25 20:44:53
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-06-21 15:18:53
 */
import { URL, TRANSFER_TYPE, AREA, COMMON, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showBackWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil.js';

export default function clickBackBtn() {
	let type = this.props.getUrlParam('type');

	let allprocess = true;
	if (type) {
		allprocess = this.props.transferTable.getTransformFormStatus(AREA.card_left);
	}

	if (allprocess === false) {
		showBackWarningDialog({
			beSureBtnClick: back.bind(this)
		});
	} else {
		back.call(this);
	}
}

function back() {
	// let type = this.props.getUrlParam('type');
	// let appid = this.props.getUrlParam('appid');
	// 此处存在潜在风险，收票应用和委外收票应用同时打开时 busiInfoData 容易被覆盖，解决办法1. BusiInfoData 常量做两个常量 2.手动在URL中传参，不使用缓存
	let type;
	let appid;
	let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);
	if (busiInfoData) {
		type = busiInfoData.type;
		appid = busiInfoData.appid;
	}
	let url = '';
	let pagecode = '';
	if (type) {
		if (
			type == TRANSFER_TYPE.invoice ||
			type == TRANSFER_TYPE.transfer21 ||
			type == TRANSFER_TYPE.transfer45 ||
			type == TRANSFER_TYPE.transfer4T
		) {
			// 收票
			// url = URL.multitransfer;
			url = URL.invoice;
			pagecode = PAGECODE.refAll_list;
		} else if (
			type == TRANSFER_TYPE.transferSc ||
			type == TRANSFER_TYPE.transfer47 ||
			type == TRANSFER_TYPE.transfer61
		) {
			// 委外收票
			url = URL.scInvoice;
			pagecode = PAGECODE.invoiceScAll;
		} else if (type == TRANSFER_TYPE.transfer50) {
			// 消耗汇总
			url = URL.transfer50;
			pagecode = PAGECODE.ref50_list;
		} else if (type == TRANSFER_TYPE.transfer21Pto25) {
			// 里程碑采购
			url = URL.transfer21Pto25;
			pagecode = PAGECODE.ref25_list;
		} else if (type == TRANSFER_TYPE.transfer55E6to25) {
			// 工序委外
			url = URL.transfer55E6to25;
			pagecode = PAGECODE.ref55E6_list;
		}
	} else {
		//非转单界面返回到列表界面
		url = URL.list;
		pagecode = PAGECODE.invoiceList;
	}
	this.props.pushTo(url, { appid, appcode: appid, pagecode: pagecode });
}
