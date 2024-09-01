/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-12-13 17:06:24
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-05-11 16:31:15
 */
import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';
import {
	createBodyAfterEventData,
	processBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

let bodyids = [ PAGECODE.body ];
// let bodyid=[PAGECODE.cardbody,PAGECODE.head_payment];
let tableCommonCloumn = [
	'norderorigmny',
	'nordermny',
	'nconfirmorimny',
	'nconfirmmny',
	'ntaxrate',
	'crececountryid',
	'csendcountryid',
	'ctaxcodeid',
	'ctaxcountryid',
	'ncaltaxmny',
	'nglobalmny',
	'nglobaltaxmny',
	'nnosubtax',
	'nnosubtaxrate',
	'nnum',
	'norigprice',
	'norigtaxprice',
	'nprice',
	'ntax',
	'ntaxmny',
	'ntaxprice',
	'cproductorid',
	'cratetype',
	'pk_supplier_v',
	'pk_supplier',
	'casscustid',
	'casscustvid'
];

export default function afterEvent(props, moduleId, key, value, changedrows, index) {
	let userobject = {};
	let empty = {
		value: null,
		display: null,
		scale: '-1'
	};
	if (tableCommonCloumn.includes(key)) {
		// 计量单位、数量、含税单价、价税合计、税率 联动算法、收货库存组织、收货利润中心、报价单位、收货地址、收货国家/地区、
		// 收货仓库、需求库存组织、发货国/地区、结算财务组织、供应商发货地址、税码、报税国/地区、应付组织、生产厂商、质量等级、
		// 收货地区、合同信息、组织汇率类型
		if (key == 'nnum' && changedrows && changedrows[0].newvalue.value && changedrows[0].newvalue.value <= 0) {
			showErrorInfo(getLangByResId(this, '4004planconfirm-000042')); /* 国际化处理： 进度确认单不允许确认主数量为负！*/
			props.cardTable.setValByKeyAndIndex(PAGECODE.body, index, 'nnum', empty);
			return;
		}

		if (changedrows && changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			let aggvos = createBodyAfterEventData(
				props,
				PAGECODE.card,
				PAGECODE.head,
				PAGECODE.body,
				moduleId,
				key,
				changedrows,
				index,
				userobject
			);
			aggvos.index = index;
			aggvos.changedrows = changedrows;
			getAfterData(props, URL.cardBodyAfterEvent, aggvos, moduleId);
		}
	} else if (key == 'ftaxtypeflag') {
		//扣税类别
		if (changedrows && changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			// props.cardTable.setValByKeyAndIndex(moduleId, index, 'ftaxtypeflag', {
			// 	value: changedrows.value,
			// 	display: changedrows.display
			// });

			let aggvos = createBodyAfterEventData(
				props,
				PAGECODE.card,
				PAGECODE.cardhead,
				PAGECODE.body,
				moduleId,
				key,
				changedrows,
				index,
				userobject
			);
			aggvos.index = index;
			aggvos.changedrows = changedrows;
			getAfterData(props, URL.cardBodyAfterEvent, aggvos, moduleId, key);
		}
	}
}

let rowIndex = null;
/**
 * 编辑后事件请求
 * @param {*} props
 * @param {*} url
 * @param {*} aggvo
 */
function getAfterData(props, url, aggvo, moduleId, key) {
	rowIndex = aggvo.index;
	aggvo.index = 0;
	ajax({
		url: url,
		data: aggvo,
		method: 'POST',
		async: false, //同步
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				//参数一：返回的公式对象 参数二：界面使用的表格类型
				props.dealFormulamsg(res.formulamsg, {
					[PAGECODE.cardbody]: 'cardTable'
				});
			}
			processBillCardBodyEditResult(props, moduleId, res.data, rowIndex);
		}
	});
}
