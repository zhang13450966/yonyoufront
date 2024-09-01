/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-12-13 17:06:24
 * @Last Modified by: zhr
 * @Last Modified time: 2021-08-30 18:14:33
 */
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { URL, PAGECODE, BUTTON, STATUS, FIELD } from '../../constance';
import { processBatchCodeValue } from '../../../pub/utils/batchCodeUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createExtBodyAfterEventData,
	processExtBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

let bodyids = [ PAGECODE.cardbody ];
let tableCommonCloumn = [
	'castunitid',
	'nqtorigtaxprice',
	'ntaxrate',
	'pk_arrvstoorg_v',
	'pk_arrliabcenter_v',
	'cqtunitid',
	'pk_receiveaddress',
	'crececountryid',
	'pk_recvstordoc',
	'pk_reqstoorg_v',
	'csendcountryid',
	'pk_psfinanceorg_v',
	'vvenddevaddr',
	'ctaxcodeid',
	'ctaxcountryid',
	'ncalcostmny',
	'ncaltaxmny',
	'nexchangerate',
	'nglobalmny',
	'nglobaltaxmny',
	'nitemdiscountrate',
	'nmaxprice',
	'nmny',
	'nnetprice',
	'nnopayorgmny',
	'nnosubtax',
	'nnosubtaxrate',
	'nnum',
	'norigmny',
	'norignetprice',
	'norigprice',
	'norigtaxmny',
	'norigtaxnetprice',
	'norigtaxprice',
	'nprice',
	'nqtnetprice',
	'nqtorignetprice',
	'nqtorigprice',
	'nqtorigtaxnetprc',
	'nqtorigtaxprice',
	'nqtprice',
	'nqttaxnetprice',
	'nqttaxprice',
	'nqtunitnum',
	'ntax',
	'ntaxmny',
	'ntaxnetprice',
	'ntaxprice',
	'vchangerate',
	'vqtunitrate',
	'pk_apfinanceorg_v',
	'cproductorid',
	'cqualitylevelid',
	'cdevareaid',
	'ccontractid',
	'cratetype'
];
let headCommonCloumn = [
	'ctrantypeid',
	'pk_supplier',
	'pk_payterm',
	'pk_invcsupllier',
	'dbilldate',
	'corigcurrencyid',
	'pk_recvcustomer',
	'fhtaxtypeflag',
	'nhtaxrate',
	'pk_dept_v',
	'cemployeeid'
];

export default function afterEvent(props, moduleId, key, value, changedrows, index) {
	let _this = this;
	if (key == FIELD.pk_material) {
		//物料多选增行
		if (value[0] && value[0].refpk) {
			let aggvos = createExtBodyAfterEventData(
				props,
				PAGECODE.cardcode,
				PAGECODE.cardhead,
				bodyids,
				moduleId,
				key,
				changedrows,
				index,
				null
			);
			aggvos.index = index; //序号
			aggvos.changedrows = changedrows;
			getAfterData(_this, URL.cardBodyAfterEvent, aggvos, moduleId);
		} else {
			// 清空当前行 单位、换算率、主单位、物料名称、规格、型号、物料版本
			let clearBodyItems = [
				'castunitid',
				'vchangerate',
				'cunitid',
				'pk_material.name',
				'pk_material.version',
				'pk_material.materialspec',
				'pk_material.materialtype'
			];
			let emptyData = { value: null, display: null, scale: '-1' };
			for (let bodyItem of clearBodyItems) {
				this.props.cardTable.setValByKeyAndIndex(PAGECODE.cardbody, index, bodyItem, emptyData);
			}
		}
	} else if (tableCommonCloumn.includes(key)) {
		// 计量单位、数量、含税单价、价税合计、税率 联动算法、收货库存组织、收货利润中心、报价单位、收货地址、收货国家/地区、
		// 收货仓库、需求库存组织、发货国/地区、结算财务组织、供应商发货地址、税码、报税国/地区、应付组织、生产厂商、质量等级、
		// 收货地区、合同信息
		if (changedrows && changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			let aggvos = createExtBodyAfterEventData(
				props,
				PAGECODE.cardcode,
				PAGECODE.cardhead,
				bodyids,
				moduleId,
				key,
				changedrows,
				index,
				null
			);
			aggvos.index = index;
			aggvos.changedrows = changedrows;
			getAfterData(_this, URL.cardBodyAfterEvent, aggvos, moduleId);
		}
	} else if (key == FIELD.nastnum) {
		if (changedrows && changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			let nbreturn = props.form.getFormItemsValue(PAGECODE.cardhead, 'breturn');
			nbreturn = nbreturn && nbreturn.value;
			let bcompare = props.cardTable.getValByKeyAndIndex(moduleId, index, 'bcompare');
			bcompare = bcompare != null ? bcompare.value : null;

			if (nbreturn && value > 0) {
				showErrorInfo(null, getLangByResId(_this, '4004ORDERREVISE-000026')); /* 国际化处理： 提示,退货订单，数量不允许为正*/
				//旧值设置回去
				let noldvalue = changedrows[0].oldvalue.value;
				props.cardTable.setValByKeyAndIndex(moduleId, index, 'nastnum', { value: noldvalue });
			} else if (bcompare == true) {
				showErrorInfo(null, getLangByResId(_this, '4004ORDERREVISE-000027')); /* 国际化处理： 提示,已生成业务对账，数量不允许改小*/
				//旧值设置回去
				let noldvalue = changedrows[0].oldvalue.value;
				props.cardTable.setValByKeyAndIndex(moduleId, index, 'nastnum', { value: noldvalue });
			} else {
				let aggvos = createExtBodyAfterEventData(
					props,
					PAGECODE.cardcode,
					PAGECODE.cardhead,
					bodyids,
					moduleId,
					key,
					changedrows,
					index,
					null
				);
				aggvos.index = index;
				aggvos.changedrows = changedrows;
				getAfterData(_this, URL.cardBodyAfterEvent, aggvos, moduleId);
			}
		}
	} else if (key === 'vbatchcode') {
		//批次号
		let userobject = {};
		let CLEARFIELDS = [
			'crowno', //行号
			'nnum'
			//'vchangerate', //换算率
			//'vqtunitrate' //报价换算率
		];
		userobject = processBatchCodeValue(props, moduleId, value, CLEARFIELDS);
		if (!userobject) {
			props.cardTable.setValByKeyAndIndex(moduleId, index, 'vbatchcode', {
				value: null,
				display: null
			});
			props.cardTable.setValByKeyAndIndex(moduleId, index, 'pk_batchcode', {
				value: null,
				display: null
			});
			return;
		}
		let aggvos = createExtBodyAfterEventData(
			props,
			PAGECODE.cardcode,
			PAGECODE.cardhead,
			bodyids,
			moduleId,
			key,
			changedrows,
			index,
			userobject
		);
		aggvos.index = index;
		aggvos.changedrows = changedrows;
		getAfterData(_this, URL.cardBodyAfterEvent, aggvos, moduleId);
	} else if (key == 'ftaxtypeflag') {
		//扣税类别
		if (changedrows && changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			props.cardTable.setValByKeyAndIndex(moduleId, index, 'ftaxtypeflag', {
				value: changedrows.value,
				display: changedrows.display
			});
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
function getAfterData(_this, url, aggvo, moduleId, key) {
	rowIndex = aggvo.index;
	aggvo.index = 0;
	ajax({
		url: url,
		data: aggvo,
		method: 'POST',
		async: false, //同步
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				_this.props.dealFormulamsg(
					res.formulamsg, //参数一：返回的公式对象
					{
						//参数二：界面使用的表格类型
						[PAGECODE.head_payment]: 'cardTable',
						[PAGECODE.cardbody]: 'cardTable'
					}
				);
			}
			if (res.data && res.data.extbillcard) {
				processExtBillCardBodyEditResult(_this.props, moduleId, res.data);
			}
			if (res.data.userObject.relateCTVO) {
			}
		}
	});
}
