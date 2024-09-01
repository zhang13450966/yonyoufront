/*
 * @Author: zhangchangqing 
 * @PageInfo: 表头编辑后事件  
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-09 10:08:44
 */

import { ajax, base, toast } from 'nc-lightapp-front';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { STOREREQ_CARD, ATTRCODE, ATTRCODES } from '../../siconst';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
const { NCMessage } = base;
//let first = true;
let formId = STOREREQ_CARD.formId;
let tableId = STOREREQ_CARD.tableId;
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	
	//获取表体行数量
	//let rows = props.cardTable.getNumberOfRows(tableId);
	let userobject = {};
	let data = createHeadAfterEventData(
		props,
		STOREREQ_CARD.cardpageid,
		formId,
		tableId,
		moduleId,
		key,
		value,
		userobject,
		STOREREQ_CARD.bodyFileds
	);
	//需求类型的编辑后事件
	if (key == ATTRCODE.freqtypeflag) {
		if (changedrows && value && value.value == changedrows.value) {
			return;
		}
		ajax({
			url: STOREREQ_CARD.headAfterEditURL,
			data: data,
			//mode: 'normal',
			async: false,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg, //参数一：返回的公式对象
						{
							//参数二：界面使用的表格类型
							card_body: 'cardTable'
						}
					);
				}
				processBillCardHeadEditResult(props, STOREREQ_CARD.formId, STOREREQ_CARD.tableId, res.data);
			}
		});
	}
	//申请日期编辑后事件
	if (key == ATTRCODE.dbilldate) {
		if (changedrows && value && value.value == changedrows.value) {
			return;
		}
		ajax({
			url: STOREREQ_CARD.headAfterEditURL,
			data: data,
			async: false,
			//mode: 'normal',
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg, //参数一：返回的公式对象
						{
							//参数二：界面使用的表格类型
							card_body: 'cardTable'
						}
					);
				}
				processBillCardHeadEditResult(props, STOREREQ_CARD.formId, STOREREQ_CARD.tableId, res.data);
			},
			error: (error) => {
				props.form.setFormItemsValue(formId, {
					[ATTRCODE.dbilldate]: { value: changedrows.value, display: changedrows.display }
				});
				toast({
					color: 'danger',
					content: error.message
				});
			}
		});
	}
	//项目
	if (key == ATTRCODE.pk_project) {
		this.props.beforeUpdatePage();
		let pk_project = props.form.getFormItemsValue(formId, ATTRCODE.pk_project);
		let rows = props.cardTable.getAllRows(tableId);
		for (let i = 0; i < rows.length; i++) {
			props.cardTable.setValByKeyAndIndex(tableId, i, ATTRCODES.cprojectid, pk_project);
		}
		this.props.updatePage(formId, tableId);
		return;
	}
	//申请部门的编辑后事件  //申请人的编辑后事件  //项目的编辑后事件 申请类型
	if (key == ATTRCODE.pk_appdepth_v || key == ATTRCODE.pk_apppsnh || key == ATTRCODE.ctrantypeid) {
		let rows = props.cardTable.getAllRows(tableId);
		if (changedrows && value && value.value == changedrows.value) {
			return;
		}
		if (ATTRCODE.ctrantypeid == key && null == value.value) {
			return;
		}
		if (ATTRCODE.pk_apppsnh == key && null == value.value) {
			this.props.beforeUpdatePage();
			for (let i = 0; i < rows.length; i++) {
				props.cardTable.setValByKeyAndIndex(tableId, i, ATTRCODES.pk_apppsn, {
					value: null,
					display: null,
					scale: '-1'
				});
			}
			this.props.updatePage(formId, tableId);
			return;
		}
		//data.card.body[tableId].rows = [];
		ajax({
			url: STOREREQ_CARD.headAfterEditURL,
			data: data,
			async: false,
			//mode: 'normal',
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg, //参数一：返回的公式对象
						{
							//参数二：界面使用的表格类型
							card_body: 'cardTable'
						}
					);
				}
				
				this.props.beforeUpdatePage();
				if (key == ATTRCODE.ctrantypeid) {
					transtypeUtils.setValue.call(this, moduleId, ATTRCODE.ctrantypeid, ATTRCODE.vtrantypecode);
				}
				processBillCardHeadEditResult(props, formId, tableId, res.data);
				if (key == ATTRCODE.pk_appdepth_v || key == ATTRCODE.pk_apppsnh) {
					//申请人、申请部门 取表头字段设置表体字段值
					let pk_apppsnh = props.form.getFormItemsValue(formId, ATTRCODE.pk_apppsnh);
					let pk_appdepth_v = props.form.getFormItemsValue(formId, ATTRCODE.pk_appdepth_v);
					let pk_appdepth = props.form.getFormItemsValue(formId, ATTRCODE.pk_appdepth);

					for (let i = 0; i < rows.length; i++) {
						if (key == ATTRCODE.pk_apppsnh) {
							props.cardTable.setValByKeyAndIndex(tableId, i, ATTRCODES.pk_apppsn, pk_apppsnh);
						}
						props.cardTable.setValByKeyAndIndex(tableId, i, ATTRCODES.pk_appdept_v, pk_appdepth_v);
						props.cardTable.setValByKeyAndIndex(tableId, i, ATTRCODES.pk_appdept, pk_appdepth);
					}
				}
				this.props.updatePage(formId, tableId);
			}
		});
	}
}
