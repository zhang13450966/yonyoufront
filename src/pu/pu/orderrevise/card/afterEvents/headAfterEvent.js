import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { URL, PAGECODE, BUTTON, STATUS, FIELD } from '../../constance';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	createExtBillHeadAfterEventData,
	processExtBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
let bodyids = [ PAGECODE.cardbody ];
let headCommonCloumn = [
	'ctrantypeid',
	'pk_supplier_v',
	'pk_payterm',
	'pk_invcsupllier_V',
	'dbilldate',
	'corigcurrencyid',
	'pk_recvcustomer_V',
	'fhtaxtypeflag',
	'nhtaxrate',
	'pk_dept_v',
	'cemployeeid'
];

export default function afterEvent(props, moduleId, key, value, changedrows, index) {
	let _this = this;
	let aggvo = null;
	//表头编辑后事件：
	if (key == FIELD.pk_org_v) {
		if (value.value == null || value == '' || value instanceof Array || Object.keys(value.value).length === 0) {
			showWarningDialog(
				getLangByResId(_this, '4004ORDERREVISE-000001'),
				getLangByResId(_this, '4004ORDERREVISE-000002'),
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
						let disableArr = { [BUTTON.Material_AddLine]: true, [BUTTON.Resetno]: true };
						props.button.setDisabled(disableArr);
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
							props.cardTable.setTableData(PAGECODE.head_payment, { rows: [] }); //付款
							props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] }, () => {
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
								addOneNowRow(props, PAGECODE.cardbody);
							});
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
			let disableArr = { [BUTTON.Material_AddLine]: false, [BUTTON.Resetno]: false };
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
			getAfterData(_this, URL.cardHeadAfterEvent, aggvo, moduleId);
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
			if (res.data && res.data.extbillcard) {
				processExtBillCardHeadEditResult(_this.props, PAGECODE.cardhead, bodyids, res.data);
			}
		}
	});
}

function addOneNowRow(props, tableId) {
	props.cardTable.addRow(tableId, 0, { crowno: { display: '10', value: '10' } }, false);
}
