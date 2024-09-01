/*
 * @Author: wangceb
 * @PageInfo: 供应链适配财务共享影像扫描和影像查看
 * @Date: 2019-04-17 14:00:33
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-07 14:57:50
 */
import { imageView, imageScan } from 'sscrp/rppub/components/image';
import { ajax, getMultiLang } from 'nc-lightapp-front';
import { showErrorInfo } from '../../pub/tool/messageUtil.js';

class SSCImageContainer {
	constructor() {
		this.lang = null;
		this.inlt = null;
		// 初始化提示多语信息
		getMultiLang({
			moduleId: '4001pubmessage',
			domainName: 'scmpub',
			callback: this.init.bind(this),
			needInlt: true
		});
	}

	init(lang, status, inlt) {
		if (status) {
			this.lang = lang;
			this.inlt = inlt;
		}
	}

	getLangByResId(resid, param) {
		let str = resid;
		if (param) {
			str = this.inlt.get(resid, param);
			return str ? str : resid;
		} else {
			// 如果还没有加载回来，则返回空，避免页面显示多语字符串
			if (this.lang) {
				str = this.lang[resid];
				return str ? str : resid;
			} else {
				return resid;
			}
		}
	}
}

/**
 * 实例化多语容器
 */
const lang = new SSCImageContainer();

export function SCMImageView(props, data) {
	if (!isImageModuleEnable.call(this)) {
		return;
	}
	let { billId, billType, tranTypeId, pk_org } = data;
	let billInfoMap = {};
	//基础字段 单据pk,单据类型，交易类型，单据的组织
	billInfoMap.pk_billid = billId;
	billInfoMap.pk_billtype = billType;
	billInfoMap.pk_tradetype = tranTypeId;
	billInfoMap.pk_org = pk_org;
	imageView(billInfoMap, 'iweb');
}

export function SCMImageScan(props, data) {
	if (!isImageModuleEnable.call(this)) {
		return;
	}
	let { billId, billType, tranTypeId, pk_org, pk_org_name, billDate, pk_billtype, vbillcode, cash } = data;
	let billInfoMap = {};
	//基础字段 单据pk,单据类型，交易类型，单据的组织
	billInfoMap.pk_billid = billId;
	billInfoMap.pk_billtype = billType;
	billInfoMap.pk_tradetype = tranTypeId;
	billInfoMap.pk_org = pk_org;

	//影像所需 FieldMap
	billInfoMap.BillType = billType;
	billInfoMap.BillDate = billDate;
	billInfoMap.Busi_Serial_No = billId;
	billInfoMap.pk_billtype = pk_billtype;
	billInfoMap.OrgNo = pk_org;
	billInfoMap.BillCode = vbillcode;
	billInfoMap.OrgName = pk_org_name;
	billInfoMap.Cash = cash;

	imageScan(billInfoMap, 'iweb');
}

function isImageModuleEnable() {
	let result = false;
	ajax({
		url: '/nccloud/scmpub/pub/sysinitgroup.do',
		data: [ '1054' ], // 影像管理的模块编码
		async: false,
		success: (res) => {
			if (res.success) {
				if (!res.data['1054']) {
					showErrorInfo(null, lang.getLangByResId('4001PUBMESSAGE-000029')); /*  国际化：影像模块未启用！*/
					result = false;
				} else {
					result = true;
				}
			}
		}
	});
	return result;
}
