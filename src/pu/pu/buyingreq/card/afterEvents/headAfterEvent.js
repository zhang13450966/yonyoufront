/*
 * @Author: zhangchangqing 
 * @PageInfo: 表头编辑后事件  
 * @Date: 2018-05-03 14:54:12 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-01-18 09:48:50
 */

import { ajax, base } from 'nc-lightapp-front';
import { BUYINGREQ_CARD, ATTRCODE, ATTRCODES } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import {
	createHeadAfterEventData,
	processBillCardHeadEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
const { NCMessage } = base;
//let first = true;
let formId = BUYINGREQ_CARD.formId;
let tableId = BUYINGREQ_CARD.tableId;
export default function afterEvent(props, moduleId, key, value, changedrows, index) {
	//获取表体行数量
	let rows = props.cardTable.getNumberOfRows(tableId);
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
	} else if (key == ATTRCODE.bsctype) {
		//委外勾选清空表体订单类型值
		let bsctype = props.form.getFormItemsValue(formId, ATTRCODE.bsctype).value;
		if (bsctype) {
			 //在这修改表体会导致表体rowid值改变你说神不神奇，
			// let rows = props.cardTable.getAllRows(tableId);
			// for (let i = 0; i < rows.length; i++) {
			// 	props.cardTable.setValByKeyAndIndex(tableId, i, ATTRCODES.cordertrantypecode, {
			// 		value: null
			// 	});
			// }
		}
		//cachedata.call(this, moduleId);
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
	//直运的编辑后事件  //委外编辑后事件  //项目的编辑后事件  计划部门    /计划员
	if (
		key == ATTRCODE.bdirecttransit ||
		key == ATTRCODE.bsctype ||
		key == ATTRCODE.ctrantypeid ||
		key == ATTRCODE.pk_plandept_v ||
		key == ATTRCODE.pk_planpsn
	) {
		if (changedrows && value && value.value == changedrows.value) {
			return;
		}
		if (ATTRCODE.pk_planpsn == key && null == value.value) {
			return;
		}
		if (ATTRCODE.ctrantypeid == key && null == value.value) {
			return;
		}
		//data.card.body[tableId].rows = [];
		ajax({
			url: BUYINGREQ_CARD.headAfterEditURL,
			data: data,
			//mode: 'normal',
			async: false,
			success: (res) => {
				
				processBillCardHeadEditResult(props, formId, tableId, res.data);
				//cachedata.call(this, moduleId);
			}
		});
	}
	//cachedata.call(this, moduleId);
}
function cachedata(moduleId) {
	// 转单标识
	let transfer = this.props.getUrlParam(BUYINGREQ_CARD.type);
	if (transfer) {
		let { currentindex, listdata } = this.state;
		let curindex = this.curindex;
		const { transferTable, form } = this.props;
		const { setTransferListValueByIndex } = transferTable;
		if (moduleId == formId && listdata != '') {
			// 转单表头数据做缓存
			let headVals = form.getAllFormValue(moduleId);
			listdata[curindex].head[formId].rows = headVals.rows;
			setTransferListValueByIndex('leftarea', listdata[curindex], curindex);
		} else if (moduleId == tableId && listdata != '') {
			// 表格数据
			let headVals = form.getAllFormValue(formId);
			listdata[curindex].head[formId].rows = headVals.rows;
			let bodyVals = this.props.cardTable.getAllData(moduleId);
			listdata[curindex].body[tableId].rows = bodyVals.rows;
			setTransferListValueByIndex('leftarea', listdata[curindex], curindex);
		}
	}
}
export { cachedata };
