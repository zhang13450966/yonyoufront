/*
 * @Author: zhangchangqing 
 * @PageInfo: 表头编辑后事件  
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-09 10:45:48
 */

import { ajax, base, toast } from 'nc-lightapp-front';
//import { AREA, UISTATE, FIELD, URL } from '../../constance';
import { BUYINGREQ_CARD, ATTRCODE, ATTRCODES } from '../../siconst';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
const { NCMessage } = base;
//let first = true;
let formId = BUYINGREQ_CARD.formId;
let tableId = BUYINGREQ_CARD.tableId;
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	
	//获取表体行数量
	//let rows = props.cardTable.getNumberOfRows(tableId);
	let userobject = {};
	let data = createHeadAfterEventData(
		props,
		BUYINGREQ_CARD.cardpageid,
		formId,
		tableId,
		moduleId,
		key,
		value,
		userobject,
		BUYINGREQ_CARD.bodyFileds
	);
	//请购日期编辑后事件
	if (key == ATTRCODE.dbilldate) {
		if (changedrows && value && value.value == changedrows.value) {
			return;
		}
		this.props.beforeUpdatePage();
		let dbilldate = props.form.getFormItemsValue(formId, ATTRCODE.dbilldate);
		let rows = props.cardTable.getAllRows(tableId);
		for (let i = 0; i < rows.length; i++) {
			props.cardTable.setValByKeyAndIndex(tableId, i, ATTRCODES.dbilldate, dbilldate);
		}
		this.props.updatePage(formId, tableId);
		return;
	} else if (key == ATTRCODE.chprojectid) {
		//项目
		this.props.beforeUpdatePage();
		let chprojectid = props.form.getFormItemsValue(formId, ATTRCODE.chprojectid);
		let rows = props.cardTable.getAllRows(tableId);
		for (let i = 0; i < rows.length; i++) {
			props.cardTable.setValByKeyAndIndex(tableId, i, ATTRCODES.cprojectid, chprojectid);
		}
		this.props.updatePage(formId, tableId);
		return;
	}
	//直运的编辑后事件  //委外编辑后事件  //项目的编辑后事件 计划部门  计划员
	if (
		key == ATTRCODE.bdirecttransit ||
		key == ATTRCODE.bsctype ||
		key == ATTRCODE.pk_plandept_v ||
		key == ATTRCODE.pk_planpsn
	) {
		if (changedrows && value && value.value == changedrows.value) {
			return;
		}
		if (ATTRCODE.pk_planpsn == key && null == value.value) {
			return;
		}
		//data.card.body[tableId].rows = [];
		ajax({
			url: BUYINGREQ_CARD.headAfterEditURL,
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
				processBillCardHeadEditResult(props, formId, tableId, res.data);
			}
		});
	}
}
