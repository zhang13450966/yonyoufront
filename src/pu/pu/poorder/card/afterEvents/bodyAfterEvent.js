/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-12-13 17:06:24
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-06-24 16:37:54
 */
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { URL, PAGECODE, BUTTON, STATUS, FIELD, TRANSFER } from '../../constance';
import RelateCTDLG from '../../relateCT/list';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { processBatchCodeValue } from '../../../pub/utils/batchCodeUtil';
import { showErrorInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createExtBodyAfterEventData,
	processExtBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { buttonController } from '../viewController/index';
import * as ABC from '../viewController/index';
import { processCardTableAutoAddRow } from '../../../../../scmpub/scmpub/pub/tool/autoAddRowUtil';

let bodyids = [ PAGECODE.cardbody ];
// let bodyid=[PAGECODE.cardbody,PAGECODE.head_payment];
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
	'ngroupexchgrate',
	'nglobalexchgrate',
	'blargess',
	'cratetype',
	'pk_supplier_v',
	'pk_supplier',
	'casscustid',
	'casscustvid'
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
		if (JSON.stringify(value || {}) != '{}' && value.length != 0) {
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
				'pk_material.materialtype',
				'pk_srcmaterial'
			];
			let emptyData = { value: null, display: null, scale: '-1' };
			for (let bodyItem of clearBodyItems) {
				this.props.cardTable.setValByKeyAndIndex(PAGECODE.cardbody, index, bodyItem, emptyData);
			}
		}
		// js端提示 "关联合同出错" "第{0}行合同累计订单数量大于合同数量,订单数量置为0,请手工修改数量."
		// 	* 如果不为空，且不为0，则返回null。即数量为空或者为0，才去修改主数量 主数量 累计订单主数量
	} else if (tableCommonCloumn.includes(key)) {
		// 计量单位、数量、含税单价、价税合计、税率 联动算法、收货库存组织、收货利润中心、报价单位、收货地址、收货国家/地区、
		// 收货仓库、需求库存组织、发货国/地区、结算财务组织、供应商发货地址、税码、报税国/地区、应付组织、生产厂商、质量等级、
		// 收货地区、合同信息、组织汇率类型
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
			if (nbreturn && value > 0) {
				showErrorInfo(null, getLangByResId(_this, '4004POORDER-000013')); /* 国际化处理： 提示,退货订单，数量不允许为正*/
				let noldvalue = changedrows[0].oldvalue.value;
				//旧值设置回去
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
		//暂时先写成这个，具体要根据nc改一下
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
		getAfterData(_this, URL.cardBodyAfterEvent, aggvos, moduleId, key);
	} else if (key == 'ftaxtypeflag') {
		//扣税类别
		if (changedrows && changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			// props.cardTable.setValByKeyAndIndex(moduleId, index, 'ftaxtypeflag', {
			// 	value: changedrows.value,
			// 	display: changedrows.display
			// });

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
			getAfterData(_this, URL.cardBodyAfterEvent, aggvos, moduleId, key);
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
				//参数一：返回的公式对象 参数二：界面使用的表格类型
				_this.props.dealFormulamsg(res.formulamsg, {
					[PAGECODE.head_payment]: 'cardTable',
					[PAGECODE.cardbody]: 'cardTable'
				});
			}
			if (res.data.extbillcard) {
				_this.props.beforeUpdatePage();
				let data = res.data.extbillcard;
				if (data.head) {
					_this.props.form.setAllFormValue({ [PAGECODE.cardhead]: data.head[PAGECODE.cardhead] });
				}
				if (key == FIELD.vbatchcode) {
					res.data.extbillcard.bodys[moduleId].rows[0].values.vbatchcode.isEdit = false;
				}
				processExtBillCardBodyEditResult(_this.props, moduleId, res.data);
				_this.props.updatePage(PAGECODE.cardhead, PAGECODE.bodyIds);
				// 自动增行处理
				processCardTableAutoAddRow(_this.props, PAGECODE.cardbody, rowIndex, {
					isMuli: aggvo.changedrows.length > 1 ? true : false
				});
			}
			let transfer = _this.props.getUrlParam(TRANSFER.transfer);
			if (res.data.userObject.relateCTVO && transfer != 'MULTI') {
				if (res.data.userObject.relateCTVO.pk_ct_pu.rows.length > 0) {
					let returndata = res && res.data && res.data.extbillcard;
					promptBox({
						color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: getLangByResId(_this, '4004POORDER-000139'), // 弹框表头信息/* 国际化处理： 关联合同*/
						content: getLangByResId(_this, '4004POORDER-000140'), //弹框内容，可以是字符串或dom/* 国际化处理： 确定要关联合同吗？*/
						leftBtnName: getLangByResId(_this, '4004POORDER-000018') /* 国际化处理： 确定*/,
						rightBtnName: getLangByResId(_this, '4004POORDER-000019') /* 国际化处理： 取消*/,
						beSureBtnClick: relateCTOKBtnClick.bind(
							_this,
							_this.props,
							returndata,
							res.data.userObject,
							url,
							aggvo,
							moduleId
						), //点击确定按钮事件
						cancelBtnClick: relateCTCancelBtnClick.bind(_this, _this.props, res.data.userObject) //点击确定按钮事件
					});
				}
			}
		}
	});
}

/**
 * 是否关联合同确定处理
 * @param {*} props
 * @param {*} userObject
 */
function relateCTOKBtnClick(props, returndata, userObject, url, aggvo, moduleId) {
	let head = returndata.head[PAGECODE.cardhead];
	let material = props.cardTable.getVisibleRows(PAGECODE.cardbody);
	aggvo.card.head.card_head.rows = head.rows;
	aggvo.card.bodys.card_material.rows = material;
	let ctsalevos = userObject.relateCTVO;
	if (ctsalevos.pk_ct_pu.rows.length > 1) {
		let getSelectRows = (data) => {
			this.selCTViews = data;
		};
		this.props.modal.show('MessageDlg', {
			zIndex: 250,
			title: getLangByResId(this, '4004POORDER-000017'), // 弹框表头信息/* 国际化处理： 采购订单关联合同*/
			content: <RelateCTDLG billQueryPara={userObject} props={this.props} getSelectRows={getSelectRows} />, //弹框内容，可以是字符串或dom
			leftBtnName: getLangByResId(this, '4004POORDER-000018') /* 国际化处理： 确定*/,
			rightBtnName: getLangByResId(this, '4004POORDER-000019') /* 国际化处理： 取消*/,
			beSureBtnClick: selectCTOKBtnClick.bind(this, this.props, userObject, url, aggvo, moduleId), //点击确定按钮事件
			cancelBtnClick: relateCTCancelBtnClick.bind(this, this.props, userObject)
		});
	} else if ((ctsalevos.pk_ct_pu.rows.length = 1)) {
		aggvo['userObject'] = {
			relateCTVO: JSON.stringify(ctsalevos),
			relateCTROWS: [ 0 + '' ] //[ userObject.relateCTVO.pk_ct_pu.rows[0].values.crowno.value ]
		};
		getAfterData(this, url, aggvo, moduleId);
	}
}

function selectCTOKBtnClick(props, userObject, url, aggvo, moduleId) {
	let indexrows = new Array();
	let rows = [];
	this.selCTViews.forEach((row, index) => {
		rows.push(row.data);
		indexrows.push(index + '');
	});
	let table = {
		areaType: 'table',
		pageinfo: null,
		rows: rows
	};
	let ctrows = {
		pageid: '400400800_ct', //pk_ct_pu
		table: table
	};
	//重新取一次数据

	aggvo.userObject = aggvo['userobject'] || {};
	aggvo.userObject.relateCTVO = JSON.stringify(ctrows);
	aggvo.userObject.relateCTROWS = indexrows;
	getAfterData(this, url, aggvo, moduleId);
}

function relateCTCancelBtnClick(props, userObject) {}
