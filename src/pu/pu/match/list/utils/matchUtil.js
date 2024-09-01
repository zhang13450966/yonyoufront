/*
 * @Author: xiahui 
 * @PageInfo: 三单匹配-工具类 
 * @Date: 2019-06-25 16:33:55 
 * @Last Modified by: guozhq
 * @Last Modified time: 2022-04-19 20:21:00
 */
import { FIELDS, AREA } from '../../constance';

/**
 * 获取整单选择的匹配结果Pk,不是整单匹配返回{}
 * @param {*} props 
 */
function getEntireCheckedMatchedData(props) {
	let allRows = props.editTable.getAllRows(AREA.matchedId); // 匹配结果列表所有行数据
	let checkedRows = props.editTable.getCheckedRows(AREA.matchedId); //获取选中的行

	let checkpks = checkedRows.map((row) => {
		return row.data.values[FIELDS.pk_taxmatch].value;
	});

	let selectedPks = new Set(); // 勾选行进项发票主键
	let unselectPks = new Set(); // 未勾选进项发票主键
	let matchedData = {
		matchedPks: [],
		matchedIndex: []
	}; // 勾选匹配结果数据

	let flag = allRows.some((row, index) => {
		let pk_taxinvoice = row.values[FIELDS.pk_taxinvoice].value; // 进项发票主键
		let pk_taxmatch = row.values[FIELDS.pk_taxmatch].value; // 匹配结果发票主键
		// row中无法获取到selected属性，调整成目前逻辑
		if (checkpks.includes(pk_taxmatch)) {
			if (unselectPks.has(pk_taxinvoice)) return true;

			selectedPks.add(pk_taxinvoice);
			matchedData.matchedPks.push(pk_taxmatch);
			matchedData.matchedIndex.push(index);
		} else {
			if (selectedPks.has(pk_taxinvoice)) return true;

			unselectPks.add(pk_taxinvoice);
		}
	});

	return flag ? {} : matchedData;
}

/**
 * 获取进项发票列表中点击行
 * @param {*} props 
 */
function getIVMInvoiceClickRow(props) {
	let invoiceData = props.editTable.getClickRowIndex(AREA.invoiceId);
	let invoiceIndex = [];
	if (!invoiceData) {
		// 未点击行，默认取第一行
		invoiceData = props.editTable.getAllRows(AREA.invoiceId, false)[0];
		invoiceIndex.push(0);
	} else {
		// 调整格式
		invoiceIndex.push(invoiceData.index);
		invoiceData = invoiceData.record;
	}
	return { invoiceData: invoiceData, invoiceIndex: invoiceIndex };
}

export { getEntireCheckedMatchedData, getIVMInvoiceClickRow };
