/*
 * @PageInfo: 表格自动增行公共处理类 （使用此类，则不要设置平台提供的自动增行服务）
 * @Author: guozhq
 * @Date: 2019-07-01 11:21:56
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-07-22 10:30:49
 */
import { RownoUtils as CardTableRownoUtils } from './cardTableTools/RownoUtil';
import { RownoUtils as EditTableRownoUtils } from './editTableTools/RownoUtil';

/**
 * editTable自动增行功能(默认处理增加行号功能)
 * @param {*} props
 * @param {*} tableAreaCode 表格区域编码
 * @param {*} currentIndex 当前编辑的行
 * @param {*} config { isMuli, isAutoAddFunc, autoAddFunc, hasCrownoField = true, crownoField } 是否是多选、是否自动增行、自动增行自定义处理、是否存在行号字段、自定义行号字段
 */
function processEditTableAutoAddRow(props, tableAreaCode, currentIndex, config = {}) {
	let { isMuli, isAutoAddFunc, autoAddFunc, hasCrownoField = true, crownoField } = config;
	// 判断是否是多选
	if (isMuli) {
		return;
	}
	// 自定义是否增行逻辑
	if (isAutoAddFunc && isAutoAddFunc()) {
		return;
	}
	// 判断当前行是否是最后一行
	let length = props.editTable.getNumberOfRows(tableAreaCode, false);
	if (length == currentIndex + 1) {
		if (autoAddFunc) {
			autoAddFunc();
		} else {
			props.editTable.addRow(tableAreaCode, length);
			if (hasCrownoField) {
				EditTableRownoUtils.setRowNo(props, tableAreaCode, crownoField ? crownoField : 'crowno');
			}
		}
	}
}

/**
 * cardTable自动增行功能(默认处理增加行号功能)
 * @param {*} props
 * @param {*} tableAreaCode 表格区域编码
 * @param {*} currentIndex 当前编辑的行
 * @param {*} config { isMuli, isAutoAddFunc, autoAddFunc, hasCrownoField = true, crownoField } 是否是多选、是否自动增行、自动增行自定义处理、是否存在行号字段、自定义行号字段
 */
function processCardTableAutoAddRow(props, tableAreaCode, currentIndex, config = {}) {
	let { isMuli, isAutoAddFunc, autoAddFunc, hasCrownoField = true, crownoField, defaultValue } = config;
	// 判断是否是多选
	if (isMuli) {
		return;
	}
	// 自定义是否增行逻辑 如果返回是true 则可以自动增行，false则不自动增行
	if (isAutoAddFunc && !isAutoAddFunc()) {
		return;
	}
	// 判断当前行是否是最后一行
	let length = props.cardTable.getNumberOfRows(tableAreaCode, false);
	if (length == currentIndex + 1) {
		if (autoAddFunc) {
			autoAddFunc();
		} else {
			props.cardTable.addRow(tableAreaCode, length, defaultValue, false);
			if (hasCrownoField) {
				CardTableRownoUtils.setRowNo(props, tableAreaCode, crownoField ? crownoField : 'crowno');
			}
		}
	}
}
export { processEditTableAutoAddRow, processCardTableAutoAddRow };
