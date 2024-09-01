/*
 * @Author: jiangfw
 * @PageInfo: 采购发票编辑后事件-表体
 * @Date: 2018-04-10 12:23:33 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-09-08 17:22:25
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, PAGECODE, AREA, FREEFIELD } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { marAsstUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { checkRowNumber } from '../../../pub/utils/checkRowNumber';
import { processBatchCodeValue } from '../../../pub/utils/batchCodeUtil';
import { cacheData } from '../utils/cacheData';
import {
	createBodyAfterEventData,
	processBillCardBodyEditResult
} from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { processCardTableAutoAddRow } from '../../../../../scmpub/scmpub/pub/tool/autoAddRowUtil';
export default function afterEvent(moduleId, key, value, changedrows, index, record, areaIds) {
	let bodyArea = areaIds.bodyArea;
	let headArea = areaIds.headArea;
	let pageId = PAGECODE.invoiceCard;
	let props = this.props;

	if (changedrows.length == 1 && key != FIELD.vbatchcode) {
		if (changedrows && changedrows[0].newvalue.value == changedrows[0].oldvalue.value) {
			return;
		}
	}

	// 初始化自定义参数
	let userobject = {};
	// let indexs = new Array();
	// for (var i = 0; i < changedrows.length; i++) {
	// 	indexs.push(index + i);
	// }
	// if (FIELD.pk_material === key) {
	// 	// 设置默认值
	// 	indexs.forEach((index) => {
	// 		let pk_group = this.props.form.getFormItemsValue(headArea, FIELD.pk_group).value;
	// 		this.props.cardTable.setValByKeyAndIndex(bodyArea, index, FIELD.pk_group, { value: pk_group }); //所属集团
	// 		let pk_org = this.props.form.getFormItemsValue(headArea, FIELD.pk_org).value;
	// 		this.props.cardTable.setValByKeyAndIndex(bodyArea, index, FIELD.pk_org, { value: pk_org }); //财务组织(OID)
	// 		this.props.cardTable.setValByKeyAndIndex(bodyArea, index, FIELD.pk_apfinanceorg, { value: pk_org }); //应付财务组织(OID)
	// 		let pk_org_v = this.props.form.getFormItemsValue(headArea, FIELD.pk_org_v).value;
	// 		this.props.cardTable.setValByKeyAndIndex(bodyArea, index, FIELD.pk_org_v, { value: pk_org_v }); //财务组织(VID)
	// 		this.props.cardTable.setValByKeyAndIndex(bodyArea, index, FIELD.pk_apfinanceorg_v, { value: pk_org_v }); //应付财务组织(VID)
	// 		let dbilldate = this.props.form.getFormItemsValue(headArea, FIELD.dbilldate).value;
	// 		this.props.cardTable.setValByKeyAndIndex(bodyArea, index, FIELD.dbilldate, { value: dbilldate }); //发票日期
	// 		this.props.cardTable.setValByKeyAndIndex(bodyArea, index, FIELD.ntaxrate, { value: 17 }); //税率
	// 	});
	// }
	if (key == FIELD.crowno) {
		// 行号编辑后
		checkRowNumber.bind(this, this.props, moduleId, key, value, changedrows, index, FIELD.crowno)();
		cacheData.call(this, AREA.card_body);
	}

	if (key == FIELD.vbatchcode) {
		//批次号
		let clearFields = [
			'castunitid', //行号
			'cunitid'
		];
		userobject = processBatchCodeValue(props, moduleId, value, clearFields);
		if (!userobject) {
			props.cardTable.setValByKeyAndIndex(moduleId, index, FIELD.vbatchcode, {
				value: null,
				display: null
			});
			props.cardTable.setValByKeyAndIndex(moduleId, index, FIELD.pk_batchcode, {
				value: null,
				display: null
			});
			return;
		}
		cacheData.call(this, AREA.card_body);
	}

	if (key == FIELD.pk_material && value.length == 0) {
		let clearItems = [
			'pk_srcmaterial', //物料(OID)
			'pk_material.name', //物料名称
			'pk_material.materialspec', //规格
			'pk_material.materialtype', //型号
			'cunitid', //主单位
			'castunitid', //单位
			'ctaxcodeid', //税码
			'vbatchcode', //批次号
			'pk_batchcode', //批次档案
			'vchangerate' //换算率
		];
		for (let item = 0; item < clearItems.length; item++) {
			props.cardTable.setValByKeyAndIndex(moduleId, index, clearItems[item], {
				value: null,
				display: null,
				scale: '-1'
			});
		}
		cacheData.call(this, AREA.card_body);
		return;
	}

	//扣税类别
	// if (key == FIELD.ftaxtypeflag) {
	// 	props.cardTable.setValByKeyAndIndex(moduleId, index, 'ftaxtypeflag', {
	// 		value: changedrows.value,
	// 		display: changedrows.display
	// 	});
	// }

	/**begain效率优化 */
	// let data = props.createBodyAfterEventData(pageId, headArea, bodyArea, moduleId, key, changedrows);
	let data = createBodyAfterEventData(
		props,
		pageId,
		headArea,
		bodyArea,
		moduleId,
		key,
		changedrows,
		index,
		userobject
	);
	// data.index = index;
	/**end效率优化 */
	data.card.templetid = this.state.templetid_25;
	// if (value !== null && value.value !== undefined && value.value !== '') {
	// if (value !== null && value.length > 0) {
	if (value !== null) {
		ajax({
			url: URL.afterEditBody,
			data: data,
			mode: 'normal',
			// async: true,
			async: false,
			success: (res) => {
				let data = res;
				if (
					data &&
					data.data &&
					data.data.billCard &&
					data.data.billCard.body &&
					data.data.billCard.body[bodyArea] &&
					data.data.billCard.body[bodyArea].rows
				) {
					/**begain效率优化 */
					// let bodyrows = data.data.billCard.body[bodyArea].rows;
					// props.cardTable.setTableData(bodyArea, { rows: bodyrows });
					processBillCardBodyEditResult(props, moduleId, data.data, index);
					/**end效率优化 */
					RownoUtils.setRowNo(props, bodyArea, FIELD.crowno);
					cacheData.call(this, AREA.card_body);
				}
			}
		});
	}

	processCardTableAutoAddRow(props, bodyArea, index, { isMuli: changedrows.length > 1 ? true : false });
	// 物料自由辅助属性和固定辅助属性
	let fixAssts = [ 'casscustvid', 'casscustid', 'cproductorid', 'cprojectid', 'pk_supplier_v', 'pk_supplier' ];
	if (key.indexOf('vfree') == 0 || fixAssts.includes(key)) {
		marAsstUtils.afterEdit.call(
			this,
			props,
			null,
			pageId,
			moduleId,
			key,
			FIELD.pk_material,
			record,
			index,
			FREEFIELD
		);
		cacheData.call(this, AREA.card_body);
	}
}
