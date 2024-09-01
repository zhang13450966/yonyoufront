import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { URL, PAGECODE, BUTTON, STATUS, FIELD, TRANSFER } from '../../constance';
import RelateCTDLG from '../../relateCT/list';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { processBatchCodeValue } from '../../../pub/utils/batchCodeUtil';
import { showErrorInfo, showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createExtBillHeadAfterEventData,
	processExtBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
let bodyids = [ PAGECODE.cardbody, PAGECODE.head_payment ];
let headCommonCloumn = [
	'ctrantypeid',
	'pk_supplier',
	'pk_supplier_v',
	'pk_payterm',
	'pk_invcsupllier',
	'pk_invcsupllier_v',
	'dbilldate',
	'corigcurrencyid',
	'pk_recvcustomer',
	'pk_recvcustomer_v',
	'fhtaxtypeflag',
	'nhtaxrate',
	'pk_dept_v',
	'cemployeeid'
];
let noNeedMaterialBodyColumn = [ FIELD.cemployeeid, FIELD.pk_dept_v ];
import { buttonController } from '../viewController/index';

export default function afterEvent(props, moduleId, key, value, changedrows, index) {
	let _this = this;
	let aggvo = null;
	//表头编辑后事件：
	if (key == FIELD.pk_org_v) {
		if (value.value == null || value == '' || value instanceof Array || Object.keys(value.value).length === 0) {
			showWarningDialog(
				getLangByResId(_this, '4004POORDER-000010'),
				getLangByResId(_this, '4004POORDER-000011'),
				{
					/* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息？*/
					beSureBtnClick: () => {
						// 1、采购组织为空时清空表单数据且表体不可编辑
						props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
						setTimeout(() => {
							props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] }); //付款
							props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
						}, 0);
						props.initMetaByPkorg(FIELD.pk_org_v);
						let disableArr = {
							[BUTTON.Material_AddLine]: true,
							[BUTTON.Pay_Addline]: true,
							[BUTTON.Resetno]: true
						};
						props.button.setDisabled(disableArr);
						// 默认付款协议收起
						buttonController.paymentShow.call(_this, props);
					},
					cancelBtnClick: () => {
						props.form.setFormItemsValue(PAGECODE.cardhead, {
							[FIELD.pk_org_v]: { value: changedrows.value, display: changedrows.display }
						});
					}
				}
			);
		} else {
			//2、不为空时释放页面编辑性同时判断和旧值不相等清空表体数据
			props.resMetaAfterPkorgEdit();
			props.cardTable.setColEditableByKey('card_material', 'pk_material', false);
			if (changedrows && value.value != changedrows.value && changedrows.value) {
				showWarningDialog(
					getLangByResId(_this, '4004POORDER-000010'),
					getLangByResId(_this, '4004POORDER-000011'),
					{
						/* 国际化处理： 确认修改,是否修改组织，这样会清空您录入的信息？*/
						beSureBtnClick: () => {
							props.form.EmptyAllFormValue(PAGECODE.cardhead); //订单
							props.form.setFormItemsValue(PAGECODE.cardhead, {
								[FIELD.pk_org_v]: { value: value.value, display: value.display }
							});
							props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
							props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] }); //付款
							addOneNowRow(props, PAGECODE.cardbody);
							aggvo = createExtBillHeadAfterEventData(
								props,
								PAGECODE.cardcode,
								PAGECODE.cardhead,
								bodyids,
								moduleId,
								key,
								value
							);
							//3、带出币种，取值：采购组织本位币调用后台
							getAfterData(_this, URL.cardHeadAfterEvent, aggvo, moduleId);
							setTimeout(() => {
								transtypeUtils.setValue.call(this, moduleId, FIELD.ctrantypeid, FIELD.vtrantypecode);
							}, 0);
						},
						cancelBtnClick: () => {
							props.form.setFormItemsValue(PAGECODE.cardhead, {
								[FIELD.pk_org_v]: { value: changedrows.value, display: changedrows.display }
							});
						}
					}
				);
			} else {
				props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }); //物料
				props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] }); //付款
				// 组织不为空新增一行
				addOneNowRow(props, PAGECODE.cardbody);
				//3、带出币种，取值：采购组织本位币调用后台
				aggvo = createExtBillHeadAfterEventData(
					props,
					PAGECODE.cardcode,
					PAGECODE.cardhead,
					bodyids,
					moduleId,
					key,
					value
				);
				getAfterData(_this, URL.cardHeadAfterEvent, aggvo, moduleId, key);
				setTimeout(() => {
					transtypeUtils.setValue.call(this, moduleId, FIELD.ctrantypeid, FIELD.vtrantypecode);
				}, 0);
			}
			let disableArr = { [BUTTON.Material_AddLine]: false, [BUTTON.Pay_Addline]: false, [BUTTON.Resetno]: false };
			props.button.setDisabled(disableArr);
		}
	} else if (headCommonCloumn.includes(key)) {
		// 订单类型、供应商、付款协议、开票供应商、订单日期、币种、收货客户、整单扣税类别、整单税率、采购部门、采购员
		// 订单类型编辑后事件,带出订单类型编码，订单类型编码不可编辑,如果交易类型存在到货计划则修改收货库组织为非必输项
		// 付款协议： 带出款协议详细内容到付款协议页签下
		if (value.value != changedrows.value) {
			aggvo = createExtBillHeadAfterEventData(
				props,
				PAGECODE.cardcode,
				PAGECODE.cardhead,
				bodyids,
				moduleId,
				key,
				value
			);
			if (noNeedMaterialBodyColumn.includes(key)) {
				// 不须要物料表体数据的字段
				aggvo.card.bodys[PAGECODE.cardbody].rows = new Array();
				aggvo.card.bodys[PAGECODE.head_payment].rows = new Array();
			}
			if (key != FIELD.pk_payterm && key != FIELD.pk_supplier_v && key != FIELD.pk_supplier) {
				// 非付款协议字段不需要付款协议
				aggvo.card.bodys[PAGECODE.head_payment].rows = new Array();
			}

			// NCC-211652，供应商采购信息设置默认付款计划，修改订单时，切换供应商，付款计划会有验证不等于100%的问题，需要先删除切换前的供应商带出来的付款协议  begin
			// 这个改到请求返回后吧
			// if (key == FIELD.pk_supplier || key == FIELD.pk_supplier_v) {
			// 	let rowCount = props.cardTable.getNumberOfRows(PAGECODE.head_payment);
			// 	if (rowCount > 0) {
			// 		for (let i = rowCount - 1; i >= 0; i--) {
			// 			props.cardTable.delRowsByIndex(PAGECODE.head_payment, i);
			// 		}
			// 	}
			// }
			// NCC-211652，供应商采购信息设置默认付款计划，修改订单时，切换供应商，付款计划会有验证不等于100%的问题，需要先删除切换前的供应商带出来的付款协议  end
			getAfterData(_this, URL.cardHeadAfterEvent, aggvo, moduleId);
		}
		if (key == 'ctrantypeid' && !value.value) {
			_this.props.form.setFormItemsValue(PAGECODE.cardhead, { bdirect: { value: null, display: null } });
		}
	} else if (key == 'brefwhenreturn' || key == 'breturn') {
		//1、退货、退货基于原订单补货 互斥,有一方被选中,另一个不能修改
		let disableColumn = key == 'brefwhenreturn' ? 'breturn' : 'brefwhenreturn';
		props.form.setFormItemsDisabled(PAGECODE.cardhead, { [disableColumn]: value.value == false ? false : true });
	}
}

/**
 * 编辑后事件请求
 * @param {*} props
 * @param {*} url
 * @param {*} aggvo
 */
function getAfterData(_this, url, aggvo, moduleId, key) {
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
			let transfer = _this.props.getUrlParam(TRANSFER.transfer);
			if (res.data.userObject.relateCTVO && transfer != 'MULTI') {
				if (res.data.userObject.relateCTVO.pk_ct_pu.rows.length > 0) {
					promptBox({
						color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
						title: getLangByResId(_this, '4004POORDER-000139'), // 弹框表头信息/* 国际化处理： 提示*/
						content: getLangByResId(_this, '4004POORDER-000140'), //弹框内容，可以是字符串或dom/* 国际化处理： 是否关联合同？*/
						leftBtnName: getLangByResId(_this, '4004POORDER-000015') /* 国际化处理： 是*/,
						rightBtnName: getLangByResId(_this, '4004POORDER-000016') /* 国际化处理： 否*/,
						beSureBtnClick: relateCTOKBtnClick.bind(
							_this,
							_this.props,
							res.data.userObject,
							url,
							aggvo,
							moduleId
						), //点击确定按钮事件
						cancelBtnClick: relateCTCancelBtnClick.bind(_this, _this.props, res.data.userObject) //点击确定按钮事件
					});
				}
			}
			// NCC-211652,判断一下，如果后台返回的付款协议有值，则使用后台返回的，如果没有，页面保持原状不进行更新  begin
			// 供应商采购信息设置默认付款计划，修改订单时，切换供应商，付款计划会有验证不等于100%的问题，需要先删除切换前的供应商带出来的付款协议
			if (
				res.data.extbillcard &&
				res.data.extbillcard.bodys &&
				res.data.extbillcard.bodys.card_payment &&
				res.data.extbillcard.bodys.card_payment.rows &&
				res.data.extbillcard.bodys.card_payment.rows.length > 0
			) {
				if (!res.data.extbillcard.bodys.card_payment.rows[0].rowid) {
					let rowCount = _this.props.cardTable.getNumberOfRows(PAGECODE.head_payment);
					if (rowCount > 0) {
						for (let i = rowCount - 1; i >= 0; i--) {
							_this.props.cardTable.delRowsByIndex(PAGECODE.head_payment, i);
						}
					}
				}
			}
			// NCC-211652,判断一下，如果后台返回的付款协议有值，则会用后台返回的，如果没有，页面保持原状不进行更新  end
			if (res.data && res.data.extbillcard) {
				processExtBillCardHeadEditResult(_this.props, PAGECODE.cardhead, bodyids, res.data);
			}
			buttonController.cachedata.call(_this);
		}
	});
}

function addOneNowRow(props, tableId) {
	props.cardTable.addRow(tableId, 0, { crowno: { display: '10', value: '10' } }, false);
}

/**
 * 是否关联合同确定处理
 * @param {*} props
 * @param {*} userObject
 */
function relateCTOKBtnClick(props, userObject, url, aggvo, moduleId) {
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
		//重新取一次数据
		let head = props.form.getAllFormValue(PAGECODE.cardhead);
		let material = props.cardTable.getVisibleRows(PAGECODE.cardbody);
		aggvo.card.head.card_head.rows = head.rows;
		aggvo.card.bodys.card_material.rows = material;
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
	let head = props.form.getAllFormValue(PAGECODE.cardhead);
	let material = props.cardTable.getVisibleRows(PAGECODE.cardbody);
	let pay = props.cardTable.getVisibleRows(PAGECODE.head_payment);
	aggvo.card.head.card_head.rows = head.rows;
	aggvo.card.bodys.card_material.rows = material;
	aggvo.card.bodys.card_payment.rows = pay;

	aggvo.userObject = aggvo['userobject'] || {};
	aggvo.userObject.relateCTVO = JSON.stringify(ctrows);
	aggvo.userObject.relateCTROWS = indexrows;
	getAfterData(this, url, aggvo, moduleId);
}

function relateCTCancelBtnClick(props, userObject) {}
