import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST } from '../../const';
import {
	createBodyAfterEventData4Batch,
	processBillCardBodyEditResult4Batch
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

let singleConditionRefFilterFields = [];
let noRefFilterFields = [];
/**
 * huoyzh
 * @param {*} obj 
 */
export default async function batchEvent(obj) {
	initFields.call(this, obj);
	processBatchEdit.call(this, obj);
}

/**
 * 处理批量编辑字段
 * @param {object} obj 平台传过来的参数
 * 
 * 所有字段：物料编码、数量、主数量、无税单价、含税单价、税率、备注、表体自定义项1-20
 */
async function processBatchEdit(obj) {
	let areaCode = obj.areaCode; //区域编码
	let column = obj.column; //列信息
	let newValue = obj.newValue; //变更的行信息
	let queryValue = [];
	let changedrows = obj.changedrows; //变更的信息，仅包含newValue和OldValue
	let currentIndex = obj.currentIndex; //当前行
	let indexs = [];
	let rows = [];
	let attrcode = column.attrcode; //列code
	let queryCondition; //统一过滤的过滤条件
	let isManyCondition = false; //是否多个过滤条件
	let pasteData = obj.pasteData; //粘贴的值

	if (singleConditionRefFilterFields.includes(attrcode) || attrcode.startsWith('vbdef')) {
		// 单条件过滤参照
		for (let i = 0; i < newValue.length; i++) {
			if (!await checkEditableByAttrcode.call(this, attrcode, newValue[i], currentIndex)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
			processQueryCondition.call(this, attrcode, queryCondition, newValue[i]);
		}

		isManyCondition = false;
	} else if (noRefFilterFields.includes(attrcode)) {
		// 剩余字段不需要过滤的字段
		for (let i = 0; i < newValue.length; i++) {
			// 编辑性过滤
			if (!await checkEditableByAttrcode.call(this, attrcode, newValue[i], currentIndex, areaCode)) {
				continue;
			}
			queryValue.push(newValue[i]);
			indexs[i] = currentIndex + i;
			rows[i] = [ i ];
		}
	} else {
		return;
	}

	this.props.cardTable
		.updateAfterBatchChange({
			areaCode,
			column,
			indexs,
			queryValue,
			changedrows,
			pasteData,
			queryCondition,
			isManyCondition
		})
		.then((res) => {
			let props = res.props;
			changedrows = res.changedrows;
			indexs = res.indexs;
			let data = createBodyAfterEventData4Batch(
				props,
				ARSUB_CONST.cardPageId,
				ARSUB_CONST.formId,
				ARSUB_CONST.tableId,
				areaCode,
				attrcode,
				changedrows,
				indexs
			);
			ajax({
				url: ARSUB_CONST.bodyafter,
				async: false,
				data: data,
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

					processBillCardBodyEditResult4Batch(props, areaCode, res.data, indexs);
					this.forceUpdate();
				}
			});
		});
}
function processQueryCondition(attrcode, queryCondition, record) {
	// 暂时只有一种情况，按照主组织过滤
	processfilterByOrgQueryValue.call(this, queryCondition, record);
}
/**
 * 处理按照主组织过滤的参照
 * @param {*} queryCondition 
 * @param {*} record 
 */
function processfilterByOrgQueryValue(queryCondition, record) {
	if (record.values && record.values.cpayorgid) {
		let pk_org = record.values.cpayorgid.value;
		queryCondition = { pk_org: pk_org };
	}
}
/**
 * 收支项目
 * @param {*} key 
 */
function cincomeprejectidEditable(key, record) {
	if (record.value && record.value.cpayorgid) {
		if (!record.values.cpayorgid.value) {
			return false;
		} else {
			return true;
		}
	} else {
		return true;
	}
}
/**
 * 检查指定字段的编辑性
 * @param {*} attrcode 
 * @param {*} record 
 */
async function checkEditableByAttrcode(attrcode, record, index, areacode) {
	//自由辅助属性
	if (attrcode.startsWith('vbdef')) {
		return checkEditablebyKey.call(this, attrcode, record);
		//收支项目
	} else if ('cincomeprejectid' == attrcode) {
		return cincomeprejectidEditable.call(this, attrcode, record);
	} else {
		return true;
	}
}

/**
 *自定义编辑性
 * @param {*} key 
 */
function checkEditablebyKey(key) {
	return true;
}

/**
 * 前处理
 * @param {*} obj 
 */
function initFields(obj) {
	singleConditionRefFilterFields = [ 'cincomeprejectid', 'cpaydeptid', 'cprodlineid', 'cbrandid' ];
	noRefFilterFields = [ 'ndeclaremny', 'norigarsubmny', 'frownote' ];
}
