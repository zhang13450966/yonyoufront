import { deepClone } from '../../../../scmpub/scmpub/pub/tool';
import { debug } from 'util';
import { RownoUtils } from '../../../../scmpub/scmpub/pub/tool/cardTableTools';
/*
 * @Author: hujieh 
 * @PageInfo: 存量查拣选择后处理
 * @Date: 2018-06-02 14:55:37 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-28 15:16:08
 */
export function onHandBtnSelected(constance, data) {
	let { AREA, FIELD } = constance;
	let cwarehouseid = this.props.form.getFormItemsValue(AREA.formArea, FIELD.cwarehouseid);
	//获取表体所有可见行
	let allRows = this.props.cardTable.getVisibleRows(AREA.body);
	if (!allRows || !data) {
		return;
	}
	let newRows = [];
	let changedrows = [];
	for (let i = 0; i < allRows.length; i++) {
		let row = allRows[i];
		let flag = true;
		for (let j = 0; j < data.length; j++) {
			let newrow = data[j];
			if (row.values.cmaterialvid.value == newrow.values.cmaterialvid.value) {
				//现存量、可用量、批次至少有一个值
				let returnRows = [ data[i] ];
				let newRow = process(this.props, allRows[i], returnRows, cwarehouseid);
				if (newRow) {
					newRow.forEach((item) => {
						newRows.push(item);
					});
				}
				if (newRow[0].values.pk_batchcode) {
					changedrows.push({
						newvalue: { value: newRow[0].values.pk_batchcode.value },
						oldvalue: { value: null },
						rowid: newRow[0].rowid
					});
				}
				flag = false;
			}
		}
		if (flag) {
			newRows.push(allRows[i]);
		}
	}

	this.props.cardTable.setTableData(AREA.body, { rows: newRows });
	if (changedrows) {
		this.props.handleRelationItems({
			type: 'table', //编辑的是表单值为'form', 编辑的是表格值为'table'
			areaCode: AREA.body, //编辑区域的编码
			key: 'pk_batchcode', //编辑字段英文名称
			value: changedrows[0].newvalue.value, //编辑字段的新值
			changedrows: changedrows, // 若编辑的是表格，需要传该参数(编辑字段的旧值)，表单不传
			index: 0, //当前是第几行 ： 从 0 开始，编辑表格时，需要传该参数，表单不传
			callback: () => {} //请求成功的回调（业务组自己的编辑后事件）
		});
	}
}
/**
 * 批次参展选择后处理
 * @param {常量结构} constance
 * @param {当前行数据} record
 * @param {当前行索引} index
 * @param {返回结果} rows
 */
export function onHandReferSelected(constance, record, index, rows, changedrows, afterEvent) {
	if (!record && !rows) {
		return;
	}
	let { AREA, FIELD } = constance;
	let cwarehouseid = this.props.form.getFormItemsValue(AREA.formArea, FIELD.cwarehouseid);
	let returnRows = rows;
	let newRow = process(this.props, record, returnRows, cwarehouseid);
	if (newRow) {
		let value =
			newRow[0].values && newRow[0].values.pk_batchcode && newRow[0].values.pk_batchcode.value
				? newRow[0].values.pk_batchcode.value
				: '-1';
		//第一个元素更新，剩余的元素插入
		setTimeout(() => {
			this.props.cardTable.updateDataByIndexs(AREA.body, newRow[0]);
			if (newRow.length > 0) {
				//从第二个元素开始循环，构建数组用来新增
				let insertRows = [];
				for (let i = 1; i < newRow.length; i++) {
					newRow[i].values.crowno = {};
					let insertRow = { index: index + i, data: newRow[i] };
					insertRows.push(insertRow);
				}
				this.props.cardTable.insertDataByIndexs(AREA.body, insertRows);
				RownoUtils.setRowNo(this.props, AREA.body, 'crowno');
			}
			if (changedrows) {
				this.props.handleRelationItems({
					type: 'table', //编辑的是表单值为'form', 编辑的是表格值为'table'
					areaCode: AREA.body, //编辑区域的编码
					key: 'pk_batchcode', //编辑字段英文名称
					value: value, //编辑字段的新值
					changedrows: changedrows, // 若编辑的是表格，需要传该参数(编辑字段的旧值)，表单不传
					index: index, //当前是第几行 ： 从 0 开始，编辑表格时，需要传该参数，表单不传
					callback: afterEvent ? afterEvent : () => {} //请求成功的回调（业务组自己的编辑后事件）
				});
			}
		}, 0);
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
	let realRows = [];
	if (!oldRow || !newRows || !newRows[0] || typeof newRows == 'string') {
		oldRow.values.pk_batchcode.value = null;
		realRows.push(oldRow);
		return realRows;
	}
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
		return oldRow;
	}
	if (newRow.values) {
		if (!newRow.refpk) {
			let hasNum = newRow.values.nnum && newRow.values.nnum.value ? true : false;
			if (hasNum) {
				oldRow.values.nnum = newRow.values.nnum ? newRow.values.nnum : { value: null, display: null };
				oldRow.values.nassistnum = newRow.values.nassistnum
					? newRow.values.nassistnum
					: { value: null, display: null };
				oldRow.values.ngrossnum = newRow.values.ngrossnum
					? newRow.values.ngrossnum
					: { value: null, display: null };
			}
		}
		oldRow.values.pk_batchcode = newRow.values.pk_batchcode;
		//单据上批次号是参照类型，参照框中是字符串类型，参照类型不许要有display才能显示
		oldRow.values.vbatchcode = newRow.values.vbatchcode
			? { value: newRow.values.vbatchcode.value, display: newRow.values.vbatchcode.value }
			: null;
	}
	return oldRow;
}
