/*
 * @Author: xiahui 
 * @PageInfo: 进项发票查询 
 * @Date: 2019-06-22 11:19:05 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-07-05 10:54:46
 */
import { ajax } from 'nc-lightapp-front';
import { AREA, URL, FIELDS } from '../../constance';
import matchedSearch from './matchedSearch';

/**
 * 
 * @param {*} props 
 * @param {*} jump 如果没有数据，是否跳转到‘已匹配’页签
 */
export default function invoiceSearch(props, jump = false) {
	ajax({
		url: URL.invoiceQuery,
		data: this.invoicePks,
		success: (res) => {
			if (res.success) {
				if (res.data) {
					props.editTable.setTableData(AREA.invoiceId, res.data[AREA.invoiceId], false);
					// 光标聚焦第一行
					props.editTable.focusRowByIndex(AREA.invoiceId, 0);
				} else {
					if (jump) {
						this.setState({ tab: 2 });
						matchedSearch.call(this, props);
					} else {
						props.editTable.setTableData(AREA.invoiceId, { rows: [] });
					}
				}

				// 设置查询默认值
				setQueryDefaultOrgs.call(this, props, res.data);
			}
		}
	});
}

/**
 * 设置入库单查询默认财务组织
 * @param {*} props 
 * @param {*} data 
 */
function setQueryDefaultOrgs(props, data) {
	let defaultData = { value: '', display: '' };
	let supplierDefaultData = { value: '', display: '' };

	if (data) {
		// 默认财务组织（可多选）数据
		let valueSet = new Set();
		let displaySet = new Set();

		// 供应商，如果所选数据供应商相同，把供应商设置为查询条件，否则不设置
		let supplierValueSet = new Set();
		let supplierDisplaySet = new Set();

		data[AREA.invoiceId].rows.map((row) => {
			valueSet.add(row.values[FIELDS.pk_org].value);
			displaySet.add(row.values[FIELDS.pk_org].display);

			if (row.values.pk_supplier.value) {
				supplierValueSet.add(row.values.pk_supplier.value);
				supplierDisplaySet.add(row.values.pk_supplier.display);
			}
		});

		valueSet.forEach((value) => {
			defaultData.value = defaultData.value + ',' + value;
		});
		displaySet.forEach((display) => {
			defaultData.display = defaultData.display + ',' + display;
		});

		defaultData.value = defaultData.value.slice(1);
		defaultData.display = defaultData.display.slice(1);

		// 供应商唯一，查询区供应商字段赋值
		if (supplierValueSet && supplierValueSet.size == 1) {
			supplierValueSet.forEach((value) => {
				supplierDefaultData.value = value;
			});
			supplierDisplaySet.forEach((display) => {
				supplierDefaultData.display = display;
			});
		}
	}

	// 若值为空，则不赋值
	if (defaultData.value != '') {
		this.pk_org = defaultData;
		// 主组织赋值
		props.search.setSearchValByField(AREA.searchId, FIELDS.pk_financeorg, defaultData);
	}

	// 若值为空，且已匹配有值，则覆盖
	if (this.pk_org.value != '' && defaultData.value == '') {
		defaultData = this.pk_org;
		// 主组织赋值
		props.search.setSearchValByField(AREA.searchId, FIELDS.pk_financeorg, defaultData);
	}
	// 供应商赋值
	props.search.setSearchValByField(AREA.searchId, FIELDS.pk_supplier, supplierDefaultData);
}
