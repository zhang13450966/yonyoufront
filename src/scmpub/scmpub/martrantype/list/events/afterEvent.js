/*
 * @Author: yechd5 
 * @PageInfo: 物料订单类型编辑事件
 * @Date: 2018-05-04 14:34:47 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-10-29 16:58:41
 */
import { MARTRANTYPE_CONST } from '../const';

export default function(props, moduleId, key, value, changedrows, index, data) {
	if (key === 'pk_marbasclass' || key === 'pk_marpuclass' || key == 'pk_srcmaterial') {
		if (value.refpk != null) {
			autoAddLine.call(this, props, index, moduleId);
			props.editTable.setValByKeyAndIndex(moduleId, index, key + '.name', {
				value: value.refpk,
				display: value.refname
			});
			props.editTable.setValByKeyAndIndex(moduleId, index, key, {
				value: value.refpk,
				display: value.refcode
			});
		} else if (value.refpk == null || value.refpk == undefined) {
			// 清空物料编码/物料基本分类/物料采购分类时，清空物料名称/物料基本分类/物料采购分类
			props.editTable.setValByKeyAndIndex(moduleId, index, key + '.name', {
				value: null,
				display: null
			});
		}
	}

	// 订单类型编辑事件
	if (key === 'ctrantypeid') {
		if (value.refpk != null) {
			autoAddLine.call(this, props, index, moduleId);
			props.editTable.setValByKeyAndIndex(moduleId, index, 'vtrantypecode', {
				value: value.refcode,
				display: value.refcode
			});
			props.editTable.setValByKeyAndIndex(moduleId, index, key, {
				value: value.refpk,
				display: value.refname
			});
		} else if (value.refpk == null || value.refpk == undefined) {
			// 清空物料订单类型
			props.editTable.setValByKeyAndIndex(moduleId, index, 'vtrantypecode', {
				value: null,
				display: null
			});
			props.editTable.setValByKeyAndIndex(moduleId, index, key, {
				value: null,
				display: null
			});
		}
	}

	let empty = {
		value: '',
		display: ''
	};
	if (key === 'pk_srcmaterial') {
		if (value.refpk != null) {
			props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass', empty);
			props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass.name', empty);
			props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marbasclass', empty);
			props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marbasclass.name', empty);
			// 编辑物料给其他隐藏字段赋值
			props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_material', {
				value: value.refpk,
				display: value.refcode
			});
		}
	}

	if (key === 'pk_marpuclass' || key === 'pk_marbasclass') {
		if (value.refpk != null) {
			props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial', empty);
			props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial.name', empty);
			props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_material', empty);
		}
	}
}

/**
 * 编辑最后一行时，自动增行
 * @param {} props 
 * @param {*} index 当前编辑的行
 */
function autoAddLine(props, index, moduleId) {
	let allRows = props.editTable.getAllRows(MARTRANTYPE_CONST.TABLEID, true);
	let visiablerows = [];
	for (let i = 0; i < allRows.length; i++) {
		if (allRows[i].status == '3') {
			continue;
		}
		visiablerows.push(allRows[i]);
	}
	let len = visiablerows.length;

	if (index == len - 1) {
		props.editTable.addRow(moduleId);
		// 设置采购组织
		props.editTable.setValByKeyAndIndex(moduleId, len, 'pk_org', {
			value: this.state.pk_org.value,
			display: this.state.pk_org.display
		});
	}
}
