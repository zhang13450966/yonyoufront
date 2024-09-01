/*
 * @Author: mikey.zhangchqf  存量查拣选择后处理
 * @Date: 2018-06-27 10:11:59 
 * @Last Modified by: mikey.zhangchqf
 * @Last Modified time: 2018-10-08 19:59:38
 */
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool';
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
export function onHandBtnSelected(constance, data) {
	
	let { AREA, FIELD } = constance;
	let cwarehouseid = this.props.form.getFormItemsValue(AREA.formArea, 'cwarehouseid');
	//获取表体所有可见行
	let allRows = this.props.cardTable.getVisibleRows(AREA.body);
	if (!allRows || !data) {
		return;
	}
	let newRows = [];
	for (let i = 0; i < allRows.length; i++) {
		if (!data[i]) {
			newRows.push(allRows[i]);
		} else {
			//现存量、可用量、批次至少有一个值
			let returnRows = data[i]
				? data[i].preStore ? data[i].preStore : data[i].usable ? data[i].usable : data[i].batch
				: [];
			let newRow = process(this.props, allRows[i], returnRows, cwarehouseid);
			if (newRow) {
				newRow.forEach((item) => {
					newRows.push(item);
				});
			}
		}
	}

	this.props.cardTable.setTableData(AREA.body, { rows: newRows });
}
/**
 * 批次参展选择后处理
 * @param {常量结构} constance 
 * @param {当前行数据} record 
 * @param {当前行索引} index 
 * @param {返回结果} rows 
 */
export function onHandReferSelected(constance, record, index, rows) {
	
	if (!record && !rows) {
		return;
	}
	let { AREA, FIELD } = constance;
	let cwarehouseid = this.props.form.getFormItemsValue(AREA.formArea, 'cwarehouseid');
	let returnRows = rows[0]
		? rows[0].preStore ? rows[0].preStore : rows[0].usable ? rows[0].usable : rows[0].batch
		: [];
	let newRow = process(this.props, record, returnRows, cwarehouseid);
	if (newRow) {
		//第一个元素更新，剩余的元素插入
		this.props.cardTable.updateDataByIndexs(AREA.body, newRow[0]);
		if (newRow.length > 0) {
			//从第二个元素开始循环，构建数组用来新增
			let insertRows = [];
			for (let i = 1; i < newRow.length; i++) {
				let insertRow = { index: index + i, data: newRow[i] };
				insertRows.push(insertRow);
			}
			this.props.cardTable.insertDataByIndexs(AREA.body, insertRows);
		}
	}
}

/**
 * 单表体行的处理方法
 * @param {props} props 
 * @param {表体行} oldRow 
 * @param {存量查拣后查出的存量行} newRows 
 * @param {表头仓库} cwarehouseid 
 */
function process(props, oldRow, newRows, cwarehouseid) {
	if (!oldRow || !newRows || !newRows[0]) {
		return oldRow;
	}
	let realRows = [];
	if (newRows.length == 1) {
		realRows.push(processCurRow(oldRow, newRows[0], cwarehouseid));
	} else {
		realRows.push(processCurRow(oldRow, newRows[0], cwarehouseid));
		for (let i = 1; i < newRows.length; i++) {
			let tempRow = deepClone(oldRow);
			tempRow.status = 2;
			realRows.push(processCurRow(tempRow, newRows[i], cwarehouseid));
		}
	}
	return realRows;
}

/**
 * 将存量查拣后的一行数据射到一行表体行上，要求二者都不为空  clocationid
 * @param {表体行} oldRow 
 * @param {存量查拣后的一行} newRow 
 * @param {表头仓库} cwarehouseid 
 */
function processCurRow(oldRow, newRow, cwarehouseid) {
	if (!oldRow || !newRow) {
		return [ oldRow ];
	}
	oldRow.values.nnum = newRow.values.nnum;
	oldRow.values.nassistnum = newRow.values.nassistnum;
	oldRow.values.ngrossnum = newRow.values.ngrossnum;
	oldRow.values.pk_batchcode = newRow.values.pk_batchcode;
	//单据上批次号是参照类型，参照框中是字符串类型，参照类型不许要有display才能显示
	oldRow.values.vbatchcode = newRow.values.vbatchcode
		? { value: newRow.values.vbatchcode.value, display: newRow.values.vbatchcode.value }
		: null;
	//如果表头本身的仓库和选择的存量行的仓库相同，则带入货位，否则货位清空
	if (
		cwarehouseid &&
		cwarehouseid.value &&
		newRow.values.cwarehouseid &&
		cwarehouseid.value == newRow.values.cwarehouseid.value
	) {
		oldRow.values.clocationid = newRow.values.clocationid;
	} else {
		oldRow.values.clocationid = {};
	}
	return oldRow;
}
